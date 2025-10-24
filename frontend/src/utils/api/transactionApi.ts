import { BaseApiClient } from './base';
import { Transaction, ApiResponse } from '@/types/api';

export class TransactionApiClient extends BaseApiClient {
  static async getScheduledTransactions(walletAddress: string): Promise<ApiResponse<Transaction[]>> {
    return this.get<Transaction[]>('/transactions/scheduled', walletAddress);
  }

  static async createScheduledTransaction(
    walletAddress: string, 
    data: { 
      amount: string; 
      token: string; 
      recipient: string; 
      scheduledFor: string; 
      recurring?: { frequency: string; endDate?: string } 
    }
  ): Promise<ApiResponse<Transaction>> {
    return this.post<Transaction>('/transactions/scheduled', walletAddress, data);
  }

  static async updateScheduledTransaction(
    walletAddress: string, 
    transactionId: string, 
    data: { 
      scheduledFor?: string; 
      recurring?: { frequency: string; endDate?: string } 
    }
  ): Promise<ApiResponse<Transaction>> {
    return this.put<Transaction>(`/transactions/scheduled/${transactionId}`, walletAddress, data);
  }

  static async deleteScheduledTransaction(
    walletAddress: string, 
    transactionId: string
  ): Promise<ApiResponse<void>> {
    return this.delete<void>(`/transactions/scheduled/${transactionId}`, walletAddress);
  }
}
