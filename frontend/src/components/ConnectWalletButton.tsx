import React from "react";
import { motion } from "framer-motion";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { supportedChains } from "@/config";

interface ConnectBtnProps {
  networks?: boolean;
}

const ConnectBtn: React.FC<ConnectBtnProps> = ({ networks = false }) => {
  const { login, logout, authenticated, ready, user } = usePrivy();
  const { wallets } = useWallets();

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };

  const buttonClasses =
    "bg-gradient-to-r from-[#1E3DFF] via-[#7A1EFF] to-[#FF1E99] hover:from-[#7A1EFF] hover:to-[#1E3DFF] text-white py-2.5 px-6 rounded-xl transition-all duration-300 ease-in-out text-sm font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border-2 border-white";

  const handleConnect = async () => {
    try {
      await login();
    } catch (error) {
      console.error("Connection error:", error);
    }
  };

  const handleDisconnect = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Disconnection error:", error);
    }
  };

  const handleSwitchNetwork = async (chainId: number) => {
    try {
      const wallet = wallets[0];
      if (wallet) {
        await wallet.switchChain(chainId);
      }
    } catch (error) {
      console.error("Network switch error:", error);
    }
  };

  const address = user?.wallet?.address;
  const currentChainId = wallets[0]?.chainId;
  const isConnected = ready && authenticated && address;
  const isWrongNetwork =
    currentChainId &&
    !supportedChains.some((c) => c.id === Number(currentChainId));

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (!ready) {
    return (
      <div className="flex items-center">
        <div className="w-6 h-6 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <motion.button
        className={buttonClasses}
        onClick={handleConnect}
        type="button"
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
      >
        Connect Wallet
      </motion.button>
    );
  }

  if (isWrongNetwork && networks) {
    return (
      <motion.button
        className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-2.5 px-6 rounded-xl transition-all duration-300 ease-in-out text-sm font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        onClick={() => handleSwitchNetwork(supportedChains[0].id)}
        type="button"
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
      >
        Wrong Network
      </motion.button>
    );
  }

  const currentChain = supportedChains.find(
    (c) => c.id === Number(currentChainId)
  );

  return (
    <div style={{ display: "flex", gap: 12 }}>
      {networks && currentChain && (
        <motion.button
          onClick={() => {
            const nextChain =
              supportedChains.find((c) => c.id !== Number(currentChainId)) ||
              supportedChains[0];
            handleSwitchNetwork(nextChain.id);
          }}
          style={{ display: "flex", alignItems: "center" }}
          className={buttonClasses}
          type="button"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: isWrongNetwork ? "#ef4444" : "#22c55e",
              marginRight: 8,
            }}
          />
          {currentChain.name}
        </motion.button>
      )}

      <motion.button
        className={buttonClasses}
        onClick={handleDisconnect}
        type="button"
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
      >
        {address ? formatAddress(address) : "Connected"}
      </motion.button>
    </div>
  );
};

export default ConnectBtn;
