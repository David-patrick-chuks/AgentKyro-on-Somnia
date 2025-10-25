"use client";
import DashboardSidebar from "@/components/DashboardSidebar";
import AdvancedTransactions from "@/components/dashboard/AdvancedTransactions";
import AnalyticsDashboard from "@/components/dashboard/AnalyticsDashboard";
import ChatInterface from "@/components/dashboard/ChatInterface";
import ContactManagement from "@/components/dashboard/ContactManagement";
import NotificationManagement from "@/components/dashboard/NotificationManagement";
import SecurityRisk from "@/components/dashboard/SecurityRisk";
import SharingIntegration from "@/components/dashboard/SharingIntegration";
import TeamWorkspace from "@/components/dashboard/TeamWorkspace";
import TransactionHistory from "@/components/dashboard/TransactionHistory";
import { usePrivy } from "@privy-io/react-auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaBars, FaBell, FaChartLine, FaClock, FaHistory, FaQrcode, FaRobot, FaShieldAlt, FaTimes, FaUsers } from "react-icons/fa";

type DashboardSection = 
  | "analytics"
  | "contacts" 
  | "teams"
  | "transactions"
  | "transaction-history"
  | "security"
  | "sharing"
  | "chat"
  | "notifications";

export default function Dashboard() {
  const { authenticated, user } = usePrivy();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<DashboardSection>("analytics");
  const [isLoading, setIsLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!authenticated) {
      router.push("/");
      return;
    }
    setIsLoading(false);
  }, [authenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  const renderActiveSection = () => {
    switch (activeSection) {
      case "analytics":
        return <AnalyticsDashboard />;
      case "contacts":
        return <ContactManagement />;
      case "teams":
        return <TeamWorkspace />;
      case "transactions":
        return <AdvancedTransactions />;
      case "transaction-history":
        return <TransactionHistory />;
      case "security":
        return <SecurityRisk />;
      case "sharing":
        return <SharingIntegration />;
      case "chat":
        return <ChatInterface />;
      case "notifications":
        return <NotificationManagement />;
      default:
        return <AnalyticsDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-slate-400/5 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden" onClick={() => setMobileMenuOpen(false)}>
          <div className="fixed left-0 top-0 h-full w-64 bg-black/20 backdrop-blur-2xl border-r border-white/10 z-50" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <FaRobot className="text-white text-lg" />
                  </div>
                  <div>
                    <h2 className="font-bold text-lg bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                      AgentKyro
                    </h2>
                    <p className="text-slate-400 text-xs">Dashboard</p>
                  </div>
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
                  title="Close menu"
                >
                  <FaTimes className="h-4 w-4" />
                </button>
              </div>
            </div>
            <nav className="p-4 space-y-2">
              {[
                { id: "analytics", label: "Analytics", icon: <FaChartLine className="text-xl" />, description: "Dashboard & Insights" },
                { id: "contacts", label: "Contacts", icon: <FaUsers className="text-xl" />, description: "Address Book" },
                { id: "teams", label: "Teams", icon: <FaUsers className="text-xl" />, description: "Workspace" },
                { id: "transactions", label: "Transactions", icon: <FaClock className="text-xl" />, description: "Advanced" },
                { id: "transaction-history", label: "Transaction History", icon: <FaHistory className="text-xl" />, description: "View & Search" },
                { id: "security", label: "Security", icon: <FaShieldAlt className="text-xl" />, description: "Risk & Safety" },
                { id: "sharing", label: "Sharing", icon: <FaQrcode className="text-xl" />, description: "Integration" },
                { id: "chat", label: "Chat", icon: <FaRobot className="text-xl" />, description: "AI Assistant" },
                { id: "notifications", label: "Notifications", icon: <FaBell className="text-xl" />, description: "Alerts & Subscriptions" }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id as DashboardSection);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300 group ${
                    activeSection === item.id
                      ? "bg-white/10 border border-white/20 text-white"
                      : "text-slate-400 hover:text-white hover:bg-white/5 hover:border-white/10 border border-transparent"
                  }`}
                >
                  <div className={`transition-colors duration-300 ${
                    activeSection === item.id ? "text-white" : "text-slate-400 group-hover:text-white"
                  }`}>
                    {item.icon}
                  </div>
                  <div className="text-left flex-1">
                    <div className={`font-medium text-sm ${
                      activeSection === item.id ? "text-white" : "text-slate-400 group-hover:text-white"
                    }`}>
                      {item.label}
                    </div>
                    <div className={`text-xs ${
                      activeSection === item.id ? "text-slate-300" : "text-slate-500 group-hover:text-slate-300"
                    }`}>
                      {item.description}
                    </div>
                  </div>
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      <div className="relative z-10 flex">
        {/* Desktop Sidebar */}
        <DashboardSidebar 
          activeSection={activeSection} 
          setActiveSection={setActiveSection}
        />

        {/* Main Content */}
        <main className="flex-1 md:ml-64">
          {/* Header */}
          <header className="bg-black/20 backdrop-blur-2xl border-b border-white/10 px-4 md:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Mobile Menu Button */}
                <button
                  onClick={() => setMobileMenuOpen(true)}
                  className="md:hidden p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
                  title="Open menu"
                >
                  <FaBars className="h-5 w-5" />
                </button>
                <div>
                  <h1 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                    {activeSection === "analytics" && "Analytics Dashboard"}
                    {activeSection === "contacts" && "Contact Management"}
                    {activeSection === "teams" && "Team & Workspace"}
                    {activeSection === "transactions" && "Advanced Transactions"}
                    {activeSection === "transaction-history" && "Transaction History"}
                    {activeSection === "security" && "Security & Risk"}
                    {activeSection === "sharing" && "Sharing & Integration"}
                    {activeSection === "chat" && "AI Chat Assistant"}
                    {activeSection === "notifications" && "Notifications"}
                  </h1>
                  <p className="text-slate-400 text-xs md:text-sm mt-1 hidden md:block">
                    {activeSection === "analytics" && "Track your spending patterns and portfolio performance"}
                    {activeSection === "contacts" && "Manage your address book and contact groups"}
                    {activeSection === "teams" && "Create teams and manage group transactions"}
                    {activeSection === "transactions" && "Schedule payments and create conditional transactions"}
                    {activeSection === "transaction-history" && "View and search your transaction history"}
                    {activeSection === "security" && "Assess risks and validate transactions"}
                    {activeSection === "sharing" && "Share transactions and generate receipts"}
                    {activeSection === "chat" && "Chat with AgentKyro to manage your transactions"}
                    {activeSection === "notifications" && "Manage your notifications and subscriptions"}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Notifications */}
                <button 
                  onClick={() => setActiveSection("notifications")}
                  className="relative p-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl hover:border-white/30 transition-all duration-300"
                  title="Notifications"
                >
                  <FaBell className="text-white text-lg" />
                  {/* Notification count badge */}
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                    0
                  </span>
                </button>

                {/* User Info */}
                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {user?.wallet?.address?.slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div className="text-left">
                    <div className="text-white text-sm font-medium">
                      {user?.wallet?.address?.slice(0, 6)}...{user?.wallet?.address?.slice(-4)}
                    </div>
                    <div className="text-slate-400 text-xs">Connected</div>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Dashboard Content */}
          <div className="p-4 md:p-6">
            {renderActiveSection()}
          </div>
        </main>
      </div>
    </div>
  );
}
