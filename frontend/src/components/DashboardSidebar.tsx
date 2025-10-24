"use client";
import { FaChartLine, FaUsers, FaShieldAlt, FaQrcode, FaCog, FaRobot, FaClock, FaHome } from "react-icons/fa";
import Link from "next/link";

type DashboardSection = 
  | "analytics"
  | "contacts" 
  | "teams"
  | "transactions"
  | "security"
  | "sharing"
  | "experience"
  | "settings";

interface DashboardSidebarProps {
  activeSection: DashboardSection;
  setActiveSection: (section: DashboardSection) => void;
}

export default function DashboardSidebar({ activeSection, setActiveSection }: DashboardSidebarProps) {
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
      id: "experience" as DashboardSection,
      label: "Experience",
      icon: <FaRobot className="text-xl" />,
      description: "Customization"
    },
    {
      id: "settings" as DashboardSection,
      label: "Settings",
      icon: <FaCog className="text-xl" />,
      description: "Preferences"
    }
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-black/20 backdrop-blur-2xl border-r border-white/10 z-50">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
            <FaRobot className="text-white text-lg" />
          </div>
          <div>
            <h2 className="text-white font-bold text-lg bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
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

      {/* Quick Actions */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
          <h3 className="text-white font-semibold text-sm mb-3">Quick Actions</h3>
          <div className="space-y-2">
            <Link href="/chat">
              <button className="w-full flex items-center gap-2 p-2 bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/30 rounded-lg transition-all duration-300 text-white text-sm">
                <FaRobot className="text-sm" />
                Start Chat
              </button>
            </Link>
            <Link href="/">
              <button className="w-full flex items-center gap-2 p-2 bg-slate-800/20 hover:bg-slate-700/40 border border-slate-600/30 hover:border-slate-500/50 rounded-lg transition-all duration-300 text-slate-300 hover:text-white text-sm">
                <FaHome className="text-sm" />
                Home
              </button>
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
