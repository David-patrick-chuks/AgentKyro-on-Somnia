import { NextRequest, NextResponse } from "next/server";
import { BlockchainClient } from "@/lib/blockchain/client";
import { TOKEN_ADDRESSES } from "@/lib/blockchain/config";

export async function POST(req: NextRequest) {
  try {
    const { address, token } = await req.json();

    if (!address) {
      return NextResponse.json(
        { error: "Address is required" },
        { status: 400 }
      );
    }

    const blockchain = new BlockchainClient();
    if (token && token !== "ETH" && token !== "STT") {
      return NextResponse.json(
        { error: "Only ETH and STT tokens are supported" },
        { status: 400 }
      );
    }
    
    
    
    const tokenAddress = token === "ETH" ? TOKEN_ADDRESSES.ETH : undefined;
    const balance = await blockchain.getBalance(address, tokenAddress);

    return NextResponse.json({
      success: true,
      balance,
      token: token || "STT",
    });
  } catch (error) {
    console.error("Error getting balance:", error);
    return NextResponse.json(
      { error: "Failed to get balance" },
      { status: 500 }
    );
  }
}