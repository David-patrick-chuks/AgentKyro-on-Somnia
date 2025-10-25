"use client";
import { useLogout } from "@privy-io/react-auth";
import Link from "next/link";
import { FaBell, FaChartLine, FaClock, FaHistory, FaQrcode, FaRobot, FaShieldAlt, FaSignOutAlt, FaUsers } from "react-icons/fa";
import { useRouter } from "next/navigation";

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

interface DashboardSidebarProps {
  activeSection: DashboardSection;
  setActiveSection: (section: DashboardSection) => void;
}

export default function DashboardSidebar({ activeSection, setActiveSection }: DashboardSidebarProps) {
  const router = useRouter();
  const { logout } = useLogout({
    onSuccess: () => {
      console.log('User successfully logged out');
      router.push("/");
    }
  });
  const menuItems = [
    {
      id: "analytics" as DashboardSection,
      label: "Analytics",
      icon: <FaChartLine className="text-xl" />,
      description: "Dashboard & Insights"
    },
    {
      id: "contacts" as DashboardSection,
      label: "Contacts",
      icon: <FaUsers className="text-xl" />,
      description: "Address Book"
    },
    {
      id: "teams" as DashboardSection,
      label: "Teams",
      icon: <FaUsers className="text-xl" />,
      description: "Workspace"
    },
    {
      id: "transactions" as DashboardSection,
      label: "Transactions",
      icon: <FaClock className="text-xl" />,
      description: "Advanced"
    },
    {
      id: "transaction-history" as DashboardSection,
      label: "Transaction History",
      icon: <FaHistory className="text-xl" />,
      description: "View & Search"
    },
    {
      id: "security" as DashboardSection,
      label: "Security",
      icon: <FaShieldAlt className="text-xl" />,
      description: "Risk & Safety"
    },
    {
      id: "sharing" as DashboardSection,
      label: "Sharing",
      icon: <FaQrcode className="text-xl" />,
      description: "Integration"
    },
    {
      id: "chat" as DashboardSection,
      label: "Chat",
      icon: <FaRobot className="text-xl" />,
      description: "AI Assistant"
    },
    {
      id: "notifications" as DashboardSection,
      label: "Notifications",
      icon: <FaBell className="text-xl" />,
      description: "Alerts & Subscriptions"
    }
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-black/20 backdrop-blur-2xl border-r border-white/10 z-50 hidden md:block">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
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
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
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
      
      {/* Logout Button */}
      <div className="absolute bottom-6 left-6 right-6">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 p-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 hover:border-white/10 border border-transparent transition-all duration-300 group"
        >
          <FaSignOutAlt className="text-xl" />
          <div className="text-left flex-1">
            <div className="font-medium text-sm text-slate-400 group-hover:text-white">
              Logout
            </div>
          </div>
        </button>
      </div>
    </aside>
  );
}
