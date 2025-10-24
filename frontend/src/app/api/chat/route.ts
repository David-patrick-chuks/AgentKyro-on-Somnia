import { NextRequest, NextResponse } from "next/server";
import { GeminiParser } from "@/lib/ai/gemini";
import { BlockchainClient } from "@/lib/blockchain/client";
import { TOKEN_ADDRESSES } from "@/lib/blockchain/config";

// Define ActionResult type for all possible shapes
type ActionResult =
  | { needsAddress: true; amount: string; token: string; recipientName: string }
  | { recipient: string; gasEstimate: string; amount: string; token: string }
  | { balance: string; token: string }
  | { error: string }
  | null;

export async function POST(req: NextRequest) {
  try {
    const { message, context, senderAddress } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    if (!senderAddress) {
      return NextResponse.json(
        { error: "Please provide a sender address" },
        { status: 400 }
      );
    }

    // ✅ Format conversation context into readable form for AI
    const formattedContext = Array.isArray(context)
      ? context
          .map(
            (msg) => `${msg.sender === "user" ? "User" : "Agent"}: ${msg.text}`
          )
          .join("\n")
      : "General conversation";

    const parser = new GeminiParser();
    const blockchain = new BlockchainClient();

    // ✅ 1️⃣ Try to find previous intent in context (e.g., last transfer)
    let previousIntent = null;
    if (Array.isArray(context)) {
      const lastAgentMessage = [...context]
        .reverse()
        .find(
          (msg) =>
            msg.sender === "agent" &&
            /sending|transfer|prepare|estimated gas/i.test(msg.text)
        );

      if (lastAgentMessage) {
        try {
          previousIntent = await parser.parseIntent(lastAgentMessage.text);
        } catch (err) {
          console.warn("Could not parse previous intent:", err);
        }
      }
    }

    // ✅ 2️⃣ Parse the current user message
    let intent = await parser.parseIntent(message);

    // ✅ If user confirms but no new intent, reuse previous one
    if (
      !intent &&
      previousIntent &&
      /\b(yes|confirm|proceed|ok|okay|sure|go ahead|do it)\b/i.test(message)
    ) {
      intent = previousIntent;
    }

    // ✅ If still no intent — fallback to Gemini text reply
    if (!intent) {
      const fallbackResponse = await parser.generateResponse(
        formattedContext,
        message,
        senderAddress
      );
      return NextResponse.json({
        success: true,
        message: "AI Response (no intent)",
        response: fallbackResponse,
        intent: null,
      });
    }

    // ✅ 3️⃣ Act on the parsed intent
    let actionResult: ActionResult = null;
    let aiResponse: string = "";

    switch (intent.action?.toLowerCase()) {
      case "transfer":
      case "send":
      case "pay": {
        // Resolve recipient
        const resolved = await blockchain.resolveAddress(intent.recipient);

        // If we can't resolve the address (e.g., it's a name like "Alice")
        if (!resolved) {
          aiResponse = `I understand you want to send ${intent.amount} ${intent.token} to "${intent.recipient}", but I need the actual wallet address to proceed. Could you please provide the recipient's wallet address?`;
          actionResult = {
            needsAddress: true,
            amount: intent.amount,
            token: intent.token,
            recipientName: intent.recipient,
          };
          break;
        }

        const recipient = resolved;
        // For STT (native token), we don't need a token address
        // Validate token is either ETH or STT
        if (intent.token !== "ETH" && intent.token !== "STT") {
          aiResponse = `Sorry, we only support ETH and STT tokens at this time.`;
          actionResult = { error: "Unsupported token" };
          break;
        }

        const tokenAddress: string | null = intent.token === "STT" ? null : TOKEN_ADDRESSES.ETH;

        // Estimate gas
        const gasEstimate = await blockchain.estimateGas(
          senderAddress,
          recipient,
          intent.amount,
          tokenAddress ?? ""
        );

        aiResponse = `You're sending ${intent.amount} ${intent.token} to ${recipient}.
Estimated gas: ${gasEstimate} STT.
Would you like me to prepare the transaction?`;

        actionResult = {
          recipient,
          gasEstimate,
          amount: intent.amount,
          token: intent.token,
        };
        break;
      }

      case "balance":
      case "check":
      case "balance_check": {
        // Validate token is either ETH or STT
        if (intent.token !== "ETH" && intent.token !== "STT") {
          aiResponse = `Sorry, we only support ETH and STT tokens at this time.`;
          actionResult = { error: "Unsupported token" };
          break;
        }

        const tokenAddress: string | null = intent.token === "STT" ? null : TOKEN_ADDRESSES.ETH;
        const balance = await blockchain.getBalance(
          senderAddress,
          tokenAddress ?? ""
        );

        aiResponse = `Your current ${
          intent.token || "STT"
        } balance is ${balance}.`;
        actionResult = { balance, token: intent.token || "STT" };
        break;
      }

      default: {
        aiResponse = await parser.generateResponse(
          formattedContext,
          message,
          senderAddress
        );
        break;
      }
    }

    // ✅ 4️⃣ Return combined response
    return NextResponse.json({
      success: true,
      message: "AI Response",
      response: aiResponse,
      intent,
      actionResult,
    });
  } catch (error) {
    console.error("Error in chat:", error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}
