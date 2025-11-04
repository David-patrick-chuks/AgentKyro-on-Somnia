"use client";
import { useLogout } from "@privy-io/react-auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaBell, FaChartLine, FaHistory, FaQrcode, FaRobot, FaShieldAlt, FaSignOutAlt, FaUsers, FaWallet } from "react-icons/fa";

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

interface MenuCategory {
  title: string;
  items: {
    id: DashboardSection;
    label: string;
    icon: React.ReactNode;
  }[];
}

export default function DashboardSidebar({ activeSection, setActiveSection }: DashboardSidebarProps) {
  const router = useRouter();
  const { logout } = useLogout({
    onSuccess: () => {
      console.log('User successfully logged out');
      router.push("/");
    }
  });

  const menuCategories: MenuCategory[] = [
    {
      title: "Overview",
      items: [
        {
          id: "analytics" as DashboardSection,
          label: "Analytics",
          icon: <FaChartLine className="text-lg" />
        },
        {
          id: "chat" as DashboardSection,
          label: "AI Chat",
          icon: <FaRobot className="text-lg" />
        }
      ]
    },
    {
      title: "Transactions",
      items: [
        {
          id: "transactions" as DashboardSection,
          label: "Send",
          icon: <FaWallet className="text-lg" />
        },
        {
          id: "transaction-history" as DashboardSection,
          label: "History",
          icon: <FaHistory className="text-lg" />
        }
      ]
    },
    {
      title: "Contacts & Teams",
      items: [
        {
          id: "contacts" as DashboardSection,
          label: "Contacts",
          icon: <FaUsers className="text-lg" />
        },
        {
          id: "teams" as DashboardSection,
          label: "Teams",
          icon: <FaUsers className="text-lg" />
        }
      ]
    },
    {
      title: "Tools",
      items: [
        {
          id: "security" as DashboardSection,
          label: "Security",
          icon: <FaShieldAlt className="text-lg" />
        },
        {
          id: "sharing" as DashboardSection,
          label: "Sharing",
          icon: <FaQrcode className="text-lg" />
        },
        {
          id: "notifications" as DashboardSection,
          label: "Notifications",
          icon: <FaBell className="text-lg" />
        }
      ]
    }
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-black/20 backdrop-blur-2xl border-r border-white/10 z-50 hidden md:flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-white/10 flex-shrink-0">
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

      {/* Navigation - Scrollable */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-6">
        {menuCategories.map((category, categoryIndex) => (
          <div key={categoryIndex}>
            {/* Category Title */}
            <div className="px-3 mb-3">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {category.title}
              </h3>
            </div>
            
            {/* Category Items */}
            <div className="space-y-1">
              {category.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                    activeSection === item.id
                      ? "bg-white/10 text-white"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <div className={`transition-colors duration-200 ${
                    activeSection === item.id ? "text-white" : "text-slate-400 group-hover:text-white"
                  }`}>
                    {item.icon}
                  </div>
                  <span className={`font-medium text-sm ${
                    activeSection === item.id ? "text-white" : "text-slate-400 group-hover:text-white"
                  }`}>
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </nav>
      
      {/* Logout Button - Fixed at bottom */}
      <div className="p-4 border-t border-white/10 flex-shrink-0">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-200 group"
        >
          <FaSignOutAlt className="text-lg" />
          <span className="font-medium text-sm text-slate-400 group-hover:text-white">
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
}
