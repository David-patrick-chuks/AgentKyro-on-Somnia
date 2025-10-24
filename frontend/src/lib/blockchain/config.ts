export const SOMNIA_CONFIG = {
  chainId: 50312,
  chainName: "Somnia Testnet",
  rpcUrl:
    process.env.NEXT_PUBLIC_SOMNIA_RPC_URL ||
    "https://dream-rpc.somnia.network",
  blockExplorer: "https://shannon-explorer.somnia.network/",
  nativeCurrency: {
    name: "STT",
    symbol: "STT",
    decimals: 18,
  },

};

export const TOKEN_ADDRESSES = {
  ETH: "0x0000000000000000000000000000000000000000" // Placeholder for ETH
  // STT is the native token on Somnia testnet, not an ERC20 token
};
export type SupportedToken = keyof typeof TOKEN_ADDRESSES;
// ERC20 ABI for token transfers
export const ERC20_ABI = [
  "function transfer(address to, uint256 amount) returns (bool)",
  "function balanceOf(address account) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
];
