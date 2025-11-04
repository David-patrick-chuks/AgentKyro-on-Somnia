"use client";

import { SOMNIA_CONFIG, TOKEN_ADDRESSES } from "@/lib/blockchain/config";
import { AgentKyroApiClient } from "@/utils/api";
import { usePrivy } from "@privy-io/react-auth";
import { ethers } from "ethers";
import {
  AlertCircle,
  CheckCircle,
  Copy,
  ExternalLink,
  Loader2,
  MessageSquare,
  Plus,
  Send,
  Trash2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { FaMicrophone } from "react-icons/fa6";
import ReactMarkdown from "react-markdown";

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface Message {
  id: string;
  sender: "user" | "agent";
  text: string;
  timestamp: Date;
  type?: "normal" | "transaction" | "confirmation" | "error";
  transactionData?: {
    amount: string;
    token: string;
    recipient: string;
    txReciept?: string;
    status?: "pending" | "confirmed" | "failed";
  };
}

interface TransactionConfirmation {
  amount: string;
  token: string;
  recipient: string;
  gasEstimate: string;
}

interface ChatSession {
  id: string;
  title: string;
  timestamp: Date;
  messages: Message[];
}

interface ISpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: () => void;
  onresult: (event: any) => void;
  onend: () => void;
  onerror: (event: any) => void;
  start: () => void;
  stop: () => void;
}

export default function ChatInterface() {
  const Defaulttoken = "STT";
  const { authenticated, user } = usePrivy();
  const address = user?.wallet?.address;
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pendingConfirmation, setPendingConfirmation] =
    useState<TransactionConfirmation | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  // Voice recognition
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<ISpeechRecognition | null>(
    null
  );
  const [speechSupported, setSpeechSupported] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [unsupportedBrowser, setUnsupportedBrowser] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // === UTILS ===
  const generateChatTitle = (firstMessage: string): string => {
    const words = firstMessage.trim().split(" ").slice(0, 4);
    return words.join(" ") + (firstMessage.split(" ").length > 4 ? "..." : "");
  };

  const saveChatSessions = (sessions: ChatSession[]) => {
    try {
      localStorage.setItem("agentkyro_chat_sessions", JSON.stringify(sessions));
    } catch (error) {
      console.error("Failed to save chat sessions:", error);
    }
  };

  const loadChatSessions = (): ChatSession[] => {
    try {
      const stored = localStorage.getItem("agentkyro_chat_sessions");
      if (!stored) return [];
      const sessions = JSON.parse(stored);
      return sessions.map((s: any) => ({
        ...s,
        timestamp: new Date(s.timestamp),
        messages: s.messages.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp),
        })),
      }));
    } catch (error) {
      console.error("Failed to load chat sessions:", error);
      return [];
    }
  };

  const createNewChat = () => {
    const newChatId = Date.now().toString();
    const welcome: Message = {
      id: "welcome",
      sender: "agent",
      text: `Welcome to AgentKyro! I can help you transfer tokens on Somnia testnet using simple commands. Try saying:\n\n• "Send 50 STT to Alice"\n• "Add John as contact with address 0x..."\n• "Create team Marketing"`,
      timestamp: new Date(),
      type: "normal",
    };

    setMessages([welcome]);
    setCurrentChatId(newChatId);
    setPendingConfirmation(null);
  };

  const switchToChat = (chatId: string) => {
    const session = chatHistory.find((c) => c.id === chatId);
    if (session) {
      setMessages(session.messages);
      setCurrentChatId(chatId);
      setPendingConfirmation(null);
    }
  };

  const deleteChat = (chatId: string) => {
    const updated = chatHistory.filter((c) => c.id !== chatId);
    setChatHistory(updated);
    saveChatSessions(updated);
    if (chatId === currentChatId) createNewChat();
  };

  const addMessage = (msg: Omit<Message, "id" | "timestamp">) => {
    const newMsg: Message = {
      ...msg,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMsg]);
  };

  const simulateTyping = () => setIsTyping(true);

  // === EFFECTS ===
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const loaded = loadChatSessions();
    setChatHistory(loaded);
    if (!currentChatId) createNewChat();
  }, []);

  useEffect(() => {
    if (messages.length > 1 && currentChatId) {
      const userMsgs = messages.filter((m) => m.sender === "user");
      if (userMsgs.length === 0) return;

      const title = generateChatTitle(userMsgs[0].text);
      setChatHistory((prev) => {
        const updated = [...prev];
        const idx = updated.findIndex((c) => c.id === currentChatId);
        const session: ChatSession = {
          id: currentChatId,
          title,
          timestamp: new Date(),
          messages,
        };

        if (idx >= 0) updated[idx] = session;
        else updated.unshift(session);

        saveChatSessions(updated);
        return updated;
      });
    }
  }, [messages, currentChatId]);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // === VOICE RECOGNITION ===
  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
      setUnsupportedBrowser(true);
      return;
    }

    const rec = new SpeechRecognition() as unknown as ISpeechRecognition;
    rec.continuous = false;
    rec.interimResults = true;
    rec.lang = "en-US";

    rec.onstart = () => setIsListening(true);

    rec.onresult = (event: any) => {
      let final = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript;
        }
      }
      if (final) {
        setInput((prev) => prev + " " + final.trim());
        rec.stop();
      }
    };

    rec.onend = () => setIsListening(false);

    rec.onerror = (event: any) => {
      console.error("Speech error:", event.error);
      setIsListening(false);
      setSpeechError(
        event.error === "network" || event.error === "not-allowed"
          ? "Voice input blocked. Check permissions."
          : `Voice error: ${event.error}`
      );
    };

    setRecognition(rec);
    setSpeechSupported(true);
    setUnsupportedBrowser(false);
  }, []);

  const toggleListening = () => {
    if (!recognition || !speechSupported) return;
    if (isListening) recognition.stop();
    else {
      setInput("");
      recognition.start();
    }
  };

  // === API CALLS ===
  const fetchIntentResponse = async (message: string, context: Message[]) => {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, context, senderAddress: address }),
    });
    return await res.json();
  };

  const fetchBalance = async (addr: string, token: string) => {
    const res = await fetch("/api/balance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address: addr, token }),
    });
    return await res.json();
  };

  const fetchTransaction = async (txHash: string) => {
    const res = await fetch("/api/transaction-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ txHash }),
    });
    return await res.json();
  };

  const sendRealTransaction = async ({
    recipient,
    amount,
    token,
  }: TransactionConfirmation) => {
    if (!window.ethereum) throw new Error("Wallet not connected.");

    const provider = new ethers.BrowserProvider(window.ethereum as any);
    const network = await provider.getNetwork();
    if (Number(network.chainId) !== SOMNIA_CONFIG.chainId) {
      const hex = "0x" + SOMNIA_CONFIG.chainId.toString(16);
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: hex }],
        });
      } catch (err: any) {
        if (err.code === 4902) {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [SOMNIA_CONFIG],
          });
        } else throw err;
      }
    }

    const signer = await provider.getSigner();
    let to = recipient;
    if (!ethers.isAddress(to)) {
      const res = await fetch("/api/resolve-address", {
        method: "POST",
        body: JSON.stringify({ nameOrAddress: to }),
      });
      const data = await res.json();
      if (!data?.address || !ethers.isAddress(data.address))
        throw new Error("Invalid recipient");
      to = data.address;
    }

    if (token === "STT") {
      const tx = await signer.sendTransaction({
        to,
        value: ethers.parseEther(amount),
      });
      return tx.hash;
    }

    const tokenAddr = TOKEN_ADDRESSES[token as keyof typeof TOKEN_ADDRESSES];
    if (!tokenAddr) throw new Error("Token not supported");

    const abi = [
      "function transfer(address to, uint256 amount) returns (bool)",
      "function decimals() view returns (uint8)",
    ];
    const contract = new ethers.Contract(tokenAddr, abi, signer);
    const decimals = await contract.decimals();
    const tx = await contract.transfer(to, ethers.parseUnits(amount, decimals));
    return tx.hash;
  };

  // === SEND MESSAGE ===
  const sendMessage = async () => {
    if (!input.trim() || !address || isProcessing || isTyping) return;
    if (!currentChatId) createNewChat();

    const userInput = input.trim();
    addMessage({ sender: "user", text: userInput });
    setInput("");
    setIsProcessing(true);
    simulateTyping();

    try {
      await AgentKyroApiClient.chat.logActivity(address, {
        action: "message_sent",
        sessionId: currentChatId || "unknown",
        message: userInput,
      });
    } catch (err) {
      console.error("Log failed:", err);
    }

    try {
      const response = await fetchIntentResponse(userInput, [...messages]);
      setIsTyping(false);
      setIsProcessing(false);

      if (!response?.success) {
        addMessage({
          sender: "agent",
          text: "Something went wrong.",
          type: "error",
        });
        return;
      }

      const { intent, actionResult, response: aiText } = response;

      // AUTO-SAVED CONTACT
      if (actionResult?.contact) {
        addMessage({
          sender: "agent",
          text: aiText || `Contact "${actionResult.contact.name}" saved!`,
          type: "normal",
        });
        return;
      }

      // AUTO-CREATED TEAM
      if (actionResult?.team) {
        addMessage({
          sender: "agent",
          text: aiText || `Team "${actionResult.team.name}" created!`,
          type: "normal",
        });
        return;
      }

      // TRANSACTION CONFIRMATION
      if (intent?.action === "transfer" && actionResult?.recipient) {
        const data: TransactionConfirmation = {
          amount: intent.amount,
          token: intent.token || Defaulttoken,
          recipient: actionResult.recipient,
          gasEstimate: actionResult.gasEstimate || "~",
        };

        const bal = await fetchBalance(address, data.token);
        const balText = bal?.success
          ? `Balance: ${bal.balance} ${data.token}`
          : "Balance unavailable.";

        addMessage({
          sender: "agent",
          text: `Send ${data.amount} ${data.token} to ${data.recipient}?\n${balText}`,
          type: "confirmation",
        });
        setPendingConfirmation(data);
        return;
      }

      // FALLBACK RESPONSE
      addMessage({
        sender: "agent",
        text: aiText || "I didn't understand.",
        type: aiText ? "normal" : "error",
      });
    } catch (error: any) {
      setIsProcessing(false);
      addMessage({
        sender: "agent",
        text: "Network error. Try again.",
        type: "error",
      });
    }
  };

  // === CONFIRM TRANSACTION ===
  const confirmTransaction = async () => {
    if (!pendingConfirmation || !address) return;
    setIsProcessing(true);

    try {
      const txHash = await sendRealTransaction(pendingConfirmation);

      await AgentKyroApiClient.chat.recordTransaction(address, {
        from: address,
        to: pendingConfirmation.recipient,
        amount: pendingConfirmation.amount,
        token: pendingConfirmation.token,
        txHash,
        gasUsed: pendingConfirmation.gasEstimate,
        status: "pending",
      });

      addMessage({
        sender: "agent",
        text: "Transaction sent! Waiting for confirmation...",
        type: "transaction",
        transactionData: {
          ...pendingConfirmation,
          txReciept: txHash,
          status: "pending",
        },
      });

      setPendingConfirmation(null);

      const poll = setInterval(async () => {
        const receipt = await fetchTransaction(txHash);
        if (receipt.status === "confirmed" || receipt.status === "failed") {
          clearInterval(poll);
          const status = receipt.status;
          const text =
            status === "confirmed"
              ? `Confirmed! ${pendingConfirmation.amount} ${pendingConfirmation.token} sent.`
              : "Transaction failed.";

          setMessages((prev) =>
            prev.map((m) =>
              m.transactionData?.txReciept === txHash
                ? {
                    ...m,
                    text,
                    transactionData: { ...m.transactionData!, status },
                  }
                : m
            )
          );

          try {
            await AgentKyroApiClient.chat.recordTransaction(address, {
              from: address,
              to: pendingConfirmation.recipient,
              amount: pendingConfirmation.amount,
              token: pendingConfirmation.token,
              txHash,
              status,
            });
          } catch {}
        }
      }, 3000);

      setTimeout(() => clearInterval(poll), 60000);
    } catch (error: any) {
      addMessage({
        sender: "agent",
        text: `Failed: ${error.message}`,
        type: "error",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const cancelTransaction = () => {
    setPendingConfirmation(null);
    addMessage({ sender: "agent", text: "Transaction cancelled." });
  };

  const copyToClipboard = (text: string) => navigator.clipboard.writeText(text);
  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            AI Chat Assistant
          </h2>
          <p className="text-slate-400 mt-1 text-sm md:text-base">
            Chat with AgentKyro
          </p>
        </div>
        <button
          onClick={createNewChat}
          className="flex items-center gap-2 px-4 py-2 bg-[#0B1A35]/60 hover:bg-[#10294F]/70 border border-white/10 hover:border-white/20 rounded-xl text-white transition-all duration-300 w-full sm:w-auto backdrop-blur-xl"
        >
          <Plus className="text-sm" />
          New Chat
        </button>
      </div>
  
      {/* Chat History */}
      {chatHistory.length > 0 && (
        <div className="bg-[#0B1A35]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
          <h3 className="text-white font-semibold mb-3">Recent Chats</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {chatHistory.slice(0, 6).map((chat) => (
              <div
                key={chat.id}
                className="group relative flex items-center p-3 bg-[#0B1A35]/60 hover:bg-[#142A55]/70 border border-white/10 hover:border-white/20 rounded-lg transition-all duration-300"
              >
                <div
                  className="flex items-center flex-1 min-w-0 cursor-pointer"
                  onClick={() => switchToChat(chat.id)}
                >
                  <MessageSquare className="h-4 w-4 mr-3 text-slate-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{chat.title}</p>
                    <p className="text-xs text-slate-400">
                      {chat.timestamp.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteChat(chat.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 ml-2 p-1 text-slate-400 hover:text-white hover:bg-white/10 rounded transition-all duration-200"
                  title="Delete chat"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
  
      {/* Chat Container */}
      <div className="bg-[#0B1A35]/60 backdrop-blur-2xl border border-white/10 rounded-2xl p-6">
        <div className="h-64 md:h-96 overflow-y-auto space-y-4 mb-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] ${
                  msg.sender === "user" ? "order-2" : ""
                }`}
              >
                <div
                  className={`px-4 py-3 rounded-2xl relative text-sm border border-white/10 backdrop-blur-lg ${
                    msg.sender === "user"
                      ? "bg-gradient-to-r from-[#0D1B33] via-[#10294F] to-[#1A3F7A] text-white"
                      : "bg-[#0B1A35]/50 text-white"
                  }`}
                >
                  <p className="whitespace-pre-line leading-relaxed">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </p>
  
                  {msg.transactionData && (
                    <div className="mt-3 p-3 bg-[#0D1B33]/60 rounded-lg border border-white/10">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-slate-400">Amount:</span>
                          <span className="ml-2 font-semibold">
                            {msg.transactionData.amount}{" "}
                            {msg.transactionData.token}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400">To:</span>
                          <span className="ml-2 font-mono text-xs break-all">
                            {msg.transactionData.recipient}
                          </span>
                        </div>
                      </div>
  
                      {msg.transactionData.txReciept && (
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-slate-400 text-xs">TX:</span>
                          <button
                            onClick={() =>
                              copyToClipboard(msg.transactionData!.txReciept!)
                            }
                            className="text-slate-300 hover:text-white text-xs font-mono flex items-center gap-1"
                          >
                            {msg.transactionData.txReciept.slice(0, 10)}...
                            <Copy className="w-3 h-3" />
                          </button>
                          <a
                            href={`${SOMNIA_CONFIG.blockExplorer}/tx/${msg.transactionData.txReciept}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-400 hover:text-white"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
  
                <p
                  className={`text-xs text-slate-500 mt-1 ${
                    msg.sender === "user" ? "text-right" : "text-left ml-4"
                  }`}
                >
                  {formatTime(msg.timestamp)}
                </p>
              </div>
            </div>
          ))}
  
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-[#0B1A35]/50 text-white px-4 py-3 rounded-2xl border border-white/10">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
  
          <div ref={messagesEndRef} />
        </div>
  
        {/* Confirmation Panel */}
        {pendingConfirmation && (
          <div className="mb-4 p-4 bg-[#0B1A35]/60 border border-white/10 rounded-xl">
            <h3 className="text-white font-semibold mb-3">
              Confirm Transaction
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
              <div className="bg-[#0D1B33]/70 p-3 rounded-lg">
                <p className="text-slate-400 text-sm">Amount</p>
                <p className="text-white font-semibold">
                  {pendingConfirmation.amount} {pendingConfirmation.token}
                </p>
              </div>
              <div className="bg-[#0D1B33]/70 p-3 rounded-lg">
                <p className="text-slate-400 text-sm">Recipient</p>
                <p className="text-white font-semibold text-sm break-all">
                  {pendingConfirmation.recipient}
                </p>
              </div>
              <div className="bg-[#0D1B33]/70 p-3 rounded-lg">
                <p className="text-slate-400 text-sm">Gas Fee</p>
                <p className="text-white font-semibold">
                  {pendingConfirmation.gasEstimate}
                </p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-3">
              <button
                onClick={confirmTransaction}
                disabled={isProcessing}
                className="flex-1 bg-gradient-to-r from-[#10294F] to-[#1A3F7A] text-white py-2 px-4 rounded-lg font-semibold hover:from-[#1A3F7A] hover:to-[#265B9C] transition-all disabled:opacity-50"
              >
                {isProcessing ? "Sending..." : "Confirm & Send"}
              </button>
              <button
                onClick={cancelTransaction}
                className="flex-1 bg-[#0D1B33] text-white py-2 px-4 rounded-lg font-semibold hover:bg-[#142A55] transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
  
        {/* Input Area */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch">
          <div className="flex-1 relative">
            {isListening && (
              <div className="absolute -top-2 left-4 bg-[#1A3F7A] text-white text-xs px-2 py-1 rounded-full animate-pulse z-10">
                Listening...
              </div>
            )}
            <input
              type="text"
              className={`w-full px-4 py-3 pr-12 rounded-xl border border-white/10 bg-[#0B1A35]/60 focus:ring-2 focus:ring-white/30 text-white placeholder-slate-400 focus:outline-none backdrop-blur-xl`}
              placeholder={
                isProcessing
                  ? "Processing..."
                  : isOffline
                  ? "You are offline"
                  : unsupportedBrowser
                  ? "Browser not supported"
                  : isListening
                  ? "Speak now..."
                  : "Type a command..."
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && !e.shiftKey && sendMessage()
              }
              disabled={
                isTyping ||
                isProcessing ||
                !!pendingConfirmation ||
                isOffline ||
                unsupportedBrowser
              }
            />
            <button
              className={`absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-all duration-300`}
              type="button"
              title={isListening ? "Stop" : "Voice input"}
              onClick={toggleListening}
              disabled={!speechSupported || isOffline || unsupportedBrowser}
            >
              <FaMicrophone
                className={`w-4 h-4 ${isListening ? "drop-shadow-lg" : ""}`}
              />
            </button>
          </div>
  
          <button
            onClick={sendMessage}
            disabled={
              !input.trim() ||
              isTyping ||
              isProcessing ||
              !!pendingConfirmation ||
              isOffline ||
              unsupportedBrowser
            }
            className="px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-[#0D1B33] to-[#1A3F7A] text-white shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all flex items-center justify-center gap-2 border border-white/10 hover:from-[#1A3F7A] hover:to-[#265B9C]"
          >
            {isProcessing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span>{isProcessing ? "Sending..." : "Send"}</span>
          </button>
        </div>
  
        {/* Quick Suggestions */}
        <div className="flex flex-wrap gap-2 justify-center mt-4">
          {[
            "Send 50 STT to Alice",
            "Add John as contact with address 0x123...",
            "Create team Marketing",
            "Check balance",
       
          ].map((s, i) => (
            <button
              key={i}
              onClick={() => !isProcessing && setInput(s)}
              disabled={isProcessing || isListening}
              className="text-sm px-3 py-1.5 bg-[#0B1A35]/50 backdrop-blur-xl text-slate-300 rounded-full hover:bg-[#142A55]/60 hover:text-white transition-all border border-white/10 hover:border-white/20"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
  
}
