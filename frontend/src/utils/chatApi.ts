interface ChatMessage {
  sender: "user" | "agent";
  text: string;
}

interface TransactionIntent {
  amount: string;
  token: string;
  recipient: string;
  confidence: number;
  gasEstimate: string;
}

interface ChatResponse {
  success: boolean;
  response?: {
    type: "transaction_intent" | "clarification" | "text";
    data?: TransactionIntent;
    message?: string;
  };
  rawText?: string;
  error?: string;
  details?: string;
}

interface ParseIntentResponse {
  success: boolean;
  intent?: TransactionIntent;
  error?: string;
  details?: string;
}

export class ChatApiClient {
  private static baseUrl = "/api";

  static async sendMessage(
    message: string,
    history?: ChatMessage[]
  ): Promise<ChatResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          history: history || [],
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to send message");
      }

      return await response.json();
    } catch (error: unknown) {
      let errorMessage = "Failed to communicate with chat API";
      if (error && typeof error === "object" && "message" in error) {
        errorMessage =
          String((error as { message?: string }).message) || errorMessage;
      }
      console.error("Chat API Error:", error);
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  static async parseIntent(message: string): Promise<ParseIntentResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/parse-intent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to parse intent");
      }

      return await response.json();
    } catch (error: unknown) {
      let errorMessage = "Failed to parse transaction intent";
      if (error && typeof error === "object" && "message" in error) {
        errorMessage =
          String((error as { message?: string }).message) || errorMessage;
      }
      console.error("Parse Intent Error:", error);
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Validate if a message contains a transaction intent
   */
  static async hasTransactionIntent(message: string): Promise<boolean> {
    const result = await this.parseIntent(message);
    return result.success && !!result.intent;
  }

  /**
   * Format error messages for display
   */
  static formatError(error: string): string {
    if (error.includes("API key")) {
      return "AI service is not configured. Please contact support.";
    }
    if (error.includes("network") || error.includes("fetch")) {
      return "Network error. Please check your connection and try again.";
    }
    return error;
  }
}

export type {
  ChatMessage,
  TransactionIntent,
  ChatResponse,
  ParseIntentResponse,
};
