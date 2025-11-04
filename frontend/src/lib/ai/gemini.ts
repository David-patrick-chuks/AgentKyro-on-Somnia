// lib/ai/gemini.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ParsedIntent } from "../types";

// ──────────────────────────────────────────────────────────────
// CONFIG
// ──────────────────────────────────────────────────────────────
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 5000;
const REQUEST_TIMEOUT_MS = 30_000;

// ──────────────────────────────────────────────────────────────
// Load keys (public env vars)
// ──────────────────────────────────────────────────────────────
function getGeminiApiKeys(): string[] {
  const keys: string[] = [];
  if (process.env.NEXT_PUBLIC_GEMINI_API_KEY) keys.push(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
  for (let i = 1; i <= 10; i++) {
    const k = process.env[`NEXT_PUBLIC_GEMINI_API_KEY_${i}`];
    if (k) keys.push(k);
  }
  console.log(`Loaded ${keys.length} Gemini API key(s)`);
  return keys;
}

// ──────────────────────────────────────────────────────────────
// GeminiParser
// ──────────────────────────────────────────────────────────────
export class GeminiParser {
  private apiKeys: string[];
  private currentKeyIndex = 0;
  private model: ReturnType<GoogleGenerativeAI["getGenerativeModel"]> | null = null;

  constructor() {
    this.apiKeys = getGeminiApiKeys();
    if (this.apiKeys.length === 0) {
      console.warn("No Gemini keys – regex fallback only");
      return;
    }
    this.rotateModel();
    console.info("Gemini model initialized");
  }

  // ───── rotate key on rate-limit / error ─────
  private rotateModel() {
    this.currentKeyIndex = (this.currentKeyIndex + 1) % this.apiKeys.length;
    const key = this.apiKeys[this.currentKeyIndex];
    console.log(`Switched to Gemini API key #${this.currentKeyIndex + 1}`);

    const genAI = new GoogleGenerativeAI(key);
    this.model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    });
  }

  // ───── timeout wrapper ─────
  private withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
    return Promise.race([
      p,
      new Promise<T>((_, reject) => setTimeout(() => reject(new Error("timeout")), ms)),
    ]);
  }

  // ───── retry wrapper ─────
  private async withRetry<T>(op: () => Promise<T>, attempt = 0): Promise<T> {
    try {
      return await this.withTimeout(op(), REQUEST_TIMEOUT_MS);
    } catch (e: any) {
      const retryable = attempt < MAX_RETRIES &&
        ["429", "503", "timeout", "network", "ECONNRESET", "ETIMEDOUT"].some(c =>
          e.message?.includes(c)
        );

      if (retryable) {
        console.warn(`Retry ${attempt + 1}: ${e.message}`);
        this.rotateModel();
        await new Promise(r => setTimeout(r, RETRY_DELAY_MS));
        return this.withRetry(op, attempt + 1);
      }
      throw e;
    }
  }

  // ───── REGEX FALLBACK (used when Gemini fails or confidence < 0.7) ─────
  private regexFallback(msg: string): ParsedIntent | null {
    const txt = msg.trim();
    const patterns: [RegExp, (m: RegExpMatchArray) => ParsedIntent | null][] = [
      [/\b(send|transfer)\s+(\d+(?:\.\d+)?)\s*(ETH|STT)?\s*to\s+(.+)/i, m => ({
        action: "transfer",
        amount: m[2],
        token: (m[3] || "STT").toUpperCase(),
        recipient: m[4],
        confidence: 0.9,
      })],
      [/\bpay\s+(.+?)\s+(\d+(?:\.\d+)?)\s*(ETH|STT)?/i, m => ({
        action: "transfer",
        amount: m[2],
        token: (m[3] || "STT").toUpperCase(),
        recipient: m[1],
        confidence: 0.9,
      })],
      [/\b(?:check|show|what(?:'|)s|what is)\s+(?:my\s+)?balance\b(?:\s+of\s+(ETH|STT))?/i, m => ({
        action: "balance",
        amount: "0",
        token: (m[1] || "STT").toUpperCase(),
        recipient: "",
        confidence: 0.9,
      })],
      [/\b(?:add|create|save)\s+(.+?)\s+(?:as\s+)?(?:contact|address)\s+(?:with\s+)?(?:address\s+)?(0x[a-fA-F0-9]{40})/i, m => ({
        action: "add_contact",
        amount: "0",
        token: "STT",
        recipient: m[2],
        name: m[1].trim(),
        confidence: 0.9,
      })],
      [/\b(?:create|make|add)\s+(?:a\s+)?(?:team\s+)?(?:called|named)\s+(.+)/i, m => ({
        action: "create_team",
        amount: "0",
        token: "STT",
        recipient: "",
        teamName: m[1].trim(),
        confidence: 0.9,
      })],
    ];

    for (const [re, fn] of patterns) {
      const match = txt.match(re);
      if (match) {
        const intent = fn(match);
        if (intent && ["STT", "ETH"].includes(intent.token)) return intent;
      }
    }
    return null;
  }

  // ───── PARSE INTENT (JSON ONLY, SAFE + ROBUST) ─────
async parseIntent(userMessage: string): Promise<ParsedIntent | null> {
  console.log("Parsing intent:", userMessage);

  if (!this.model) return this.regexFallback(userMessage);

  const operation = async () => {
    const prompt = `
    You are AgentKyro's intent parser.
    Your ONLY job is to interpret the user's message and return a VALID JSON object that matches one of the known actions below.
    DO NOT include markdown, explanations, comments, or any text outside the JSON.
    ALWAYS use the exact field names and formats described below.
    ⚠️ If you are unsure, still return your BEST GUESS as JSON but with a low confidence (e.g., 0.4).
    NEVER return null, text, or markdown — only JSON.

    ---
    🧠 USER MESSAGE:
    "${userMessage}"
    ---

    🎯 POSSIBLE ACTIONS:

    1. "transfer"
       - Description: When the user wants to send tokens or money to another wallet address.
       - Required fields:
         {
           "action": "transfer",
           "amount": "<numeric value without symbols, e.g. 2 or 10.5>",
           "token": "<token symbol like STT or ETH>",
           "recipient": "<valid 0x wallet address>",
           "confidence": <float between 0 and 1>
         }

    2. "balance"
       - Description: When the user wants to check their wallet or token balance.
       - Required fields:
         {
           "action": "balance",
           "token": "<optional token symbol, if specified>",
           "confidence": <float>
         }

    3. "add_contact"
       - Description: When the user wants to add or save a contact with a name and wallet address.
       - Required fields:
         {
           "action": "add_contact",
           "name": "<contact name>",
           "recipient": "<valid 0x wallet address>",
           "confidence": <float>
         }

    4. "create_team"
       - Description: When the user wants to create or register a team, group, or organization.
       - Required fields:
         {
           "action": "create_team",
           "teamName": "<team name>",
           "confidence": <float>
         }
       - ⚠️ IMPORTANT:
         If the user message uses keys such as "name", "team", or "team_name",
         you MUST still return them normalized as "teamName" in the final JSON.

    5. "show_analytics"
       - Description: When the user wants to view insights, stats, or reports about wallet or usage.
       - Required fields:
         {
           "action": "show_analytics",
           "confidence": <float>
         }

    ---
    Always return ONE object.
    Confidence reflects how certain you are.
    `;

    const result = await this.model!.generateContent(prompt);
    const txt = (await result.response).text();
    console.log("Gemini JSON response:", txt);

    let json: any;
    try {
      json = JSON.parse(txt);
    } catch {
      console.warn("⚠️ Invalid JSON from Gemini → regex fallback");
      return this.regexFallback(userMessage);
    }

    // ✅ Null guard and safety
    if (!json || typeof json !== "object") {
      console.warn("⚠️ Gemini returned null or non-object → regex fallback");
      return this.regexFallback(userMessage);
    }

    // ✅ Normalize alternate key names
    if (json.team_name && !json.teamName) json.teamName = json.team_name;
    if (json.team && !json.teamName) json.teamName = json.team;
    if (json.name && json.action === "create_team" && !json.teamName) json.teamName = json.name;

    // ✅ Normalize and fill defaults
    json.amount ??= "0";
    json.token ??= "STT";
    json.recipient ??= "";
    json.confidence ??= 0.5;

    if (!json.action || json.confidence < 0.7) {
      console.log("Low confidence → regex fallback");
      return this.regexFallback(userMessage);
    }

    return json as ParsedIntent;
  };

  try {
    return await this.withRetry(operation);
  } catch (e: any) {
    console.error("Gemini failed:", e);
    return this.regexFallback(userMessage);
  }
}


  // ───── TEXT RESPONSE (fallback when no intent) ─────
  async generateResponse(context: string, userMessage: string, address: string): Promise<string> {
    if (!this.model) return `You said: "${userMessage}". AI limited.`;
    try {
      const op = async () => {
        const p = `You are AgentKyro, a concise blockchain assistant.
Context: ${context}
User: ${userMessage}
Wallet: ${address}
Reply naturally, max 2 sentences.`;
        const r = await this.model!.generateContent(p);
        return (await r.response).text();
      };
      return await this.withRetry(op);
    } catch {
      return "I'm having trouble. Try again.";
    }
  }
}