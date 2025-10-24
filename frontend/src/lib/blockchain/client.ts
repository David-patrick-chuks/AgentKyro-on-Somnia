import { ethers } from "ethers";
import { SOMNIA_CONFIG, ERC20_ABI, TOKEN_ADDRESSES } from "./config";

export class BlockchainClient {
  private provider: ethers.JsonRpcProvider;

  constructor() {
    this.provider = new ethers.JsonRpcProvider(SOMNIA_CONFIG.rpcUrl);
  }

  async getProvider() {
    return this.provider;
  }

  async getTokenContract(tokenAddress: string) {
    return new ethers.Contract(tokenAddress, ERC20_ABI, this.provider);
  }

  async getBalance(address: string, tokenAddress?: string): Promise<string> {
    try {
      if (!tokenAddress || tokenAddress === TOKEN_ADDRESSES.ETH) {
        // Get native balance (STT is the native token on Somnia testnet)
        const balance = await this.provider.getBalance(address);
        return ethers.formatEther(balance);
      }
      // ETH and STT are the only supported tokens
      throw new Error("Unsupported token");
    } catch (error) {
      console.error("Error getting balance:", error);
      throw error;
    }
  }

  async estimateGas(
    from: string,
    to: string,
    amount: string,
    tokenAddress?: string
  ): Promise<string> {
    try {
      if (!tokenAddress || tokenAddress === TOKEN_ADDRESSES.ETH) {
        // Native token transfer (STT or ETH)
        const amountWei = ethers.parseEther(amount);
        const gasEstimate = await this.provider.estimateGas({
          from,
          to,
          value: amountWei,
        });

        const feeData = await this.provider.getFeeData();
        const pricePerGas =
          feeData.gasPrice ?? feeData.maxFeePerGas ?? BigInt(0);

        const totalCostWei = gasEstimate * pricePerGas;
        return ethers.formatEther(totalCostWei);
      } else {
        // Only STT and ETH are supported
        throw new Error("Unsupported token");
      }
    } catch (error) {
      console.error("Error estimating gas:", error);
      return "0.001"; // Default estimate
    }
  }

  async getTransactionStatus(txHash: string): Promise<{
    status: "pending" | "confirmed" | "failed";
    confirmations: number;
  }> {
    try {
      const receipt = await this.provider.getTransactionReceipt(txHash);

      if (!receipt) {
        return { status: "pending", confirmations: 0 };
      }

      const currentBlock = await this.provider.getBlockNumber();
      const confirmations = currentBlock - receipt.blockNumber;

      return {
        status: receipt.status === 1 ? "confirmed" : "failed",
        confirmations,
      };
    } catch (error) {
      console.error("Error getting transaction status:", error);
      return { status: "pending", confirmations: 0 };
    }
  }

  async resolveAddress(nameOrAddress: string): Promise<string | null> {
    try {
      // Check if it's already an address
      if (ethers.isAddress(nameOrAddress)) {
        return nameOrAddress;
      }

      // For names (like "Alice", "Bob"), we cannot resolve them automatically
      // The AI should ask the user for the actual address
      // This will trigger the error handling in the frontend to ask for clarification
      return null;
    } catch (error) {
      console.error("Error resolving address:", error);
      return null;
    }
  }
}
