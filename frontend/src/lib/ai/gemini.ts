import { GoogleGenerativeAI } from "@google/generative-ai";
import { ParsedIntent } from "../types";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
const hasApiKey = !!apiKey;
const genAI = new GoogleGenerativeAI(apiKey || "dummy");

export class GeminiParser {
  private model: ReturnType<typeof genAI.getGenerativeModel> | null = null;

  constructor() {
    if (!hasApiKey) {
      console.warn('No Gemini API key found in environment variables');
      return;
    }
    try {
      this.model = genAI.getGenerativeModel({
        model: "gemini-robotics-er-1.5-preview",
      });
      console.info('Gemini AI model initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Gemini AI model:', error);
    }
  }

  private regexFallback(userMessage: string): ParsedIntent | null {
    const text = userMessage.trim();
    // Patterns: "send 50 STT to 0xabc" | "transfer 10 to Alice" | "pay Bob 5 STT"
      const patterns: RegExp[] = [
      /\b(send|transfer)\s+(\d+(?:\.\d+)?)\s*(ETH|STT)?\s*to\s+(.+)/i,
      /\bpay\s+(.+?)\s+(\d+(?:\.\d+)?)\s*(ETH|STT)?/i,
      /\b(?:check|show|what(?:'|)s|what is)\s+(?:my\s+)?balance\b(?:\s+of\s+(ETH|STT))?/i,
    ];    for (const pattern of patterns) {
      const m = text.match(pattern);
      if (!m) continue;
      if (/pay/i.test(pattern.source)) {
        const recipient = m[1];
        const amount = m[2];
        const token = (m[3] || "STT").toUpperCase();
        if (token !== "ETH" && token !== "STT") return null;
        return { action: "pay", amount, token, recipient, confidence: 0.9 };
      }
      if (/send\|transfer/.test(pattern.source)) {
        const action = (
          m[1] || "transfer"
        ).toLowerCase() as ParsedIntent["action"];
        const amount = m[2];
        const token = (m[3] || "STT").toUpperCase();
        if (token !== "ETH" && token !== "STT") return null;
        const recipient = m[4];
        return { action, amount, token, recipient, confidence: 0.9 };
      }
      if (/balance/.test(pattern.source)) {
        const token = ((m[1] as string) || "STT").toUpperCase();
        if (token !== "ETH" && token !== "STT") return null;
        // Use balance action; amount/recipient not needed
        return {
          action: "balance",
          amount: "0",
          token,
          recipient: "",
          confidence: 0.9,
        };
      }
    }
    return null;
  }

  async parseIntent(userMessage: string): Promise<ParsedIntent | null> {
    if (!hasApiKey || !this.model) {
      return this.regexFallback(userMessage);
    }
    try {
      const prompt = `
  You are a transaction intent parser. Parse the following message and extract transaction details.
  
  User message: "${userMessage}"
  
  Extract the following information:
  1. Action type (transfer/send/pay)
  2. Amount (numeric value)
  3. Token symbol (default to STT if not specified)
  4. Recipient (wallet address or name)
  
  Return ONLY a JSON object in this exact format:
  {
    "action": "transfer",
    "amount": "50",
    "token": "STT",
    "recipient": "Alice",
    "confidence": 0.95
  }
  
  If you cannot parse the intent with confidence above 0.7, return:
  {
    "action": null,
    "amount": null,
    "token": null,
    "recipient": null,
    "confidence": 0.0
  }
  
  Rules:
  - Amount must be a positive number
  - Token must be either "ETH" or "STT" only (default to "STT" if not specified)
  - Recipient can be a name or wallet address
  - Confidence should be 0.0 to 1.0
  - Return ONLY the JSON, no markdown formatting
  - Set confidence to 0.0 if token is not ETH or STT
  `;

      const result = await this.model.generateContent(prompt);
      const text = (await result.response).text();
      const cleaned = text
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      const parsed = JSON.parse(cleaned);
      if (
        parsed.confidence < 0.7 ||
        !parsed.action ||
        !parsed.amount ||
        !parsed.recipient
      ) {
        return null;
      }
      return parsed;
    } catch (error) {
      console.error("Error parsing intent with Gemini, using fallback:", error);
      return this.regexFallback(userMessage);
    }
  }

  async generateResponse(
    context: string,
    userMessage: string,
    senderAddress: string
  ): Promise<string> {
    if (!hasApiKey || !this.model) {
      console.warn('Gemini AI not initialized:', { hasApiKey, hasModel: !!this.model });
      // Simple fallback text
      return `You said: "${userMessage}". I can help send tokens or check balances. (Note: AI features are currently limited)`;
    }
    try {
      const prompt = `You are IntentSwap AI agent, a friendly blockchain transaction assistant. 

Context: ${context}
User message: "${userMessage}"
The current user's wallet address is: ${senderAddress ?? "Unknown"}.

Generate a helpful, concise response. Do not lie. If you can't do it just be staright forward with your answers. Keep it conversational and friendly. 
If there's an error, explain it clearly and suggest how to fix it.`;

      const result = await this.model.generateContent(prompt);
      const response = result.response;
      return response.text();
    } catch (error) {
      console.error("Error generating response:", error);
      return "I'm having trouble processing that. Please try again.";
    }
  }
}
