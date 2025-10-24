import { type Chain } from "viem";

// Custom chains for Somnia
export const somniaTestnet: Chain = {
  id: 50312,
  name: "Somnia Testnet",
  nativeCurrency: {
    name: "Somnia Test Token",
    symbol: "STT",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://dream-rpc.somnia.network/"],
    },
  },
  blockExplorers: {
    default: {
      name: "Somnia Explorer",
      url: "https://shannon-explorer.somnia.network/",
    },
  },
  testnet: true,
};

export const anvil: Chain = {
  id: 31337,
  name: "Anvil Local",
  nativeCurrency: {
    name: "ETH",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["http://127.0.0.1:8545"],
    },
  },
  blockExplorers: {
    default: { name: "Anvil Explorer", url: "" },
  },
  testnet: true,
};

export const supportedChains = [somniaTestnet, anvil];

// Privy App ID
export const privyAppId = "cmgupofhs02iel10bh531fkvq";
