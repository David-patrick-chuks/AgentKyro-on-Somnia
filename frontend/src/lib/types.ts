export interface ParsedIntent {
  action: "transfer" | "send" | "pay" | "balance" | "check" | "balance_check";
  amount: string;
  token: string;
  recipient: string;
  confidence: number;
}
  
  export interface TransactionRequest {
    from: string;
    to: string;
    amount: string;
    tokenAddress: string;
  }
  
  export interface TransactionResult {
    success: boolean;
    txHash?: string;
    error?: string;
    gasUsed?: string;
  }
  
  export interface ENSResolution {
    address: string | null;
    name: string;
}
  