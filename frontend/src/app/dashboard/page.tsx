"use client";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaChartLine, FaUsers, FaShieldAlt, FaQrcode, FaCog, FaRobot, FaClock, FaBell } from "react-icons/fa";
import DashboardSidebar from "@/components/DashboardSidebar";
import AnalyticsDashboard from "@/components/dashboard/AnalyticsDashboard";
import ContactManagement from "@/components/dashboard/ContactManagement";
import TeamWorkspace from "@/components/dashboard/TeamWorkspace";
import AdvancedTransactions from "@/components/dashboard/AdvancedTransactions";
import SecurityRisk from "@/components/dashboard/SecurityRisk";
import SharingIntegration from "@/components/dashboard/SharingIntegration";
import UserExperience from "@/components/dashboard/UserExperience";
import Settings from "@/components/dashboard/Settings";

type DashboardSection = 
  | "analytics"
  | "contacts" 
  | "teams"
  | "transactions"
  | "security"
  | "sharing"
  | "experience"
  | "settings";

export default function Dashboard() {
  const { authenticated, user } = usePrivy();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<DashboardSection>("analytics");
  const [isLoading, setIsLoading] = useState(true);

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
      case "security":
        return <SecurityRisk />;
      case "sharing":
        return <SharingIntegration />;
      case "experience":
        return <UserExperience />;
      case "settings":
        return <Settings />;
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

      <div className="relative z-10 flex">
        {/* Sidebar */}
        <DashboardSidebar 
          activeSection={activeSection} 
          setActiveSection={setActiveSection}
        />

        {/* Main Content */}
        <main className="flex-1 ml-64">
          {/* Header */}
          <header className="bg-black/20 backdrop-blur-2xl border-b border-white/10 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  {activeSection === "analytics" && "Analytics Dashboard"}
                  {activeSection === "contacts" && "Contact Management"}
                  {activeSection === "teams" && "Team & Workspace"}
                  {activeSection === "transactions" && "Advanced Transactions"}
                  {activeSection === "security" && "Security & Risk"}
                  {activeSection === "sharing" && "Sharing & Integration"}
                  {activeSection === "experience" && "User Experience"}
                  {activeSection === "settings" && "Settings"}
                </h1>
                <p className="text-slate-400 text-sm mt-1">
                  {activeSection === "analytics" && "Track your spending patterns and portfolio performance"}
                  {activeSection === "contacts" && "Manage your address book and contact groups"}
                  {activeSection === "teams" && "Create teams and manage group transactions"}
                  {activeSection === "transactions" && "Schedule payments and create conditional transactions"}
                  {activeSection === "security" && "Assess risks and validate transactions"}
                  {activeSection === "sharing" && "Share transactions and generate receipts"}
                  {activeSection === "experience" && "Customize your AgentKyro experience"}
                  {activeSection === "settings" && "Configure your preferences and settings"}
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Notifications */}
                <button className="relative p-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl hover:border-white/30 transition-all duration-300">
                  <FaBell className="text-white text-lg" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
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
          <div className="p-6">
            {renderActiveSection()}
          </div>
        </main>
      </div>
    </div>
  );
}
