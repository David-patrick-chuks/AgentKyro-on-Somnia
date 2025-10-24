"use client";
import AnimatedWordType from "@/components/AnimatedWordType";
import ConnectWalletButton from "@/components/ConnectWalletButton";
import FloatingParticles from "@/components/FloatingParticles";
import { useAuthNavigation } from "@/hooks/useAuthNavigation";
import { usePrivy } from "@privy-io/react-auth";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaBolt, FaChartLine, FaClock, FaLanguage, FaMobileAlt, FaQrcode, FaRobot, FaSearch, FaShieldAlt, FaUsers } from "react-icons/fa";

export default function Home() {
  const { authenticated } = usePrivy();
  const { navigateToDashboard } = useAuthNavigation();
  const [showConnectMsg, setShowConnectMsg] = useState(false);

  return (
    <>
      {showConnectMsg && (
        <div className="fixed top-0 left-0 w-full z-50 bg-red-500/90 backdrop-blur-xl text-white text-center py-3 font-semibold shadow-lg border-b border-red-400/20">
          Please connect your wallet first to start swapping.
        </div>
      )}
      
      <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black font-sans relative overflow-x-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-slate-400/5 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-white/3 to-slate-400/3 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        {/* Floating Particles */}
        <FloatingParticles />
        
        <header
          className={`w-full flex justify-between items-center px-4 md:px-8 py-6 border-b border-white/10 bg-black/20 backdrop-blur-2xl sticky top-0 z-50 ${
            showConnectMsg ? "mt-12" : ""
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <Image
                src="/logo.jpg"
                alt="AgentKyro Logo"
                width={45}
                height={45}
                className="rounded-xl border border-white/20"
              />
              <div className="absolute -inset-1 bg-gradient-to-r from-white/20 to-slate-400/20 rounded-xl blur-sm -z-10"></div>
            </div>
            <h1 className="text-white text-xl font-bold tracking-wide bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              AgentKyro
            </h1>
          </div>
          <div className="flex items-center">
            <ConnectWalletButton />
          </div>
        </header>

        <main className="relative z-10">
          {/* Hero Section */}
          <section className="pt-20 pb-32 px-4">
            <div className="max-w-7xl mx-auto text-center">
              {/* Main Headline */}
              <div className="mb-8">
                <h1 className="text-5xl md:text-8xl font-black mb-6 leading-tight">
                  <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                    AI-POWERED
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-slate-300 via-white to-slate-200 bg-clip-text text-transparent">
                    CRYPTO SWAPS
                  </span>
                </h1>
                <div className="text-2xl md:text-4xl font-bold mb-4">
                  <AnimatedWordType />
                </div>
              </div>

              {/* Subtitle */}
              <p className="text-slate-300 text-lg md:text-2xl max-w-4xl mx-auto mb-12 leading-relaxed">
                Experience the future of cryptocurrency transactions with{" "}
                <span className="text-white font-semibold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  AgentKyro
                </span>
                . Send tokens on Somnia testnet using natural language commands. 
                No complex interfaces, no multiple clicks - just pure conversational crypto.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 items-center justify-center mb-16">
                <button
                  className="group relative px-10 py-5 text-xl font-bold rounded-2xl cursor-pointer border border-white/20 bg-white/10 backdrop-blur-xl text-white shadow-2xl hover:scale-105 hover:bg-white/20 transition-all duration-500 hover:shadow-white/20 overflow-hidden"
                  onClick={() => {
                    if (authenticated) {
                      window.location.href = "/chat";
                    } else {
                      setShowConnectMsg(true);
                    }
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-slate-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <span className="relative z-10 flex items-center gap-3">
                    <FaRobot className="text-xl" />
                    START SWAPPING
                  </span>
                </button>

                {authenticated && (
                  <button 
                    onClick={navigateToDashboard}
                    className="group px-10 py-5 text-xl font-bold rounded-2xl cursor-pointer border border-white/20 bg-white/10 backdrop-blur-xl text-white shadow-2xl hover:scale-105 hover:bg-white/20 transition-all duration-500 hover:shadow-white/20 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-slate-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <span className="relative z-10 flex items-center gap-3">
                      <FaChartLine className="text-xl" />
                      DASHBOARD
                    </span>
                  </button>
                )}

                <Link href="#features">
                  <button className="group px-10 py-5 text-xl font-bold rounded-2xl cursor-pointer border border-slate-400/30 bg-slate-800/20 backdrop-blur-xl text-slate-200 shadow-lg hover:scale-105 hover:bg-slate-700/40 hover:border-slate-300/50 transition-all duration-500 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-600/20 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <span className="relative z-10 flex items-center gap-3">
                      <FaSearch className="text-xl" />
                      EXPLORE FEATURES
                    </span>
                  </button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center justify-center gap-4 mb-20">
                {[
                  { icon: <FaBolt className="text-yellow-400" />, text: "Somnia Testnet", subtext: "Lightning Fast" },
                  { icon: <FaRobot className="text-blue-400" />, text: "AI Powered", subtext: "Smart Parsing" },
                  { icon: <FaShieldAlt className="text-green-400" />, text: "Secure", subtext: "Multi-layer Security" },
                  { icon: <FaUsers className="text-purple-400" />, text: "Open Source", subtext: "Community Driven" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3 bg-white/5 backdrop-blur-xl rounded-2xl px-6 py-4 border border-white/10 hover:border-white/30 transition-all duration-300 group">
                    <div className="text-2xl group-hover:scale-110 transition-transform duration-300">
                      {item.icon}
                    </div>
                    <div className="text-left">
                      <div className="text-white font-semibold text-sm">{item.text}</div>
                      <div className="text-slate-400 text-xs">{item.subtext}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Features Showcase */}
          <section id="features" className="py-32 px-4">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-20">
                <h2 className="text-4xl md:text-6xl font-black mb-6 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  POWERFUL FEATURES
                </h2>
                <p className="text-slate-400 text-xl max-w-3xl mx-auto">
                  Everything you need for seamless cryptocurrency transactions, powered by cutting-edge AI technology
                </p>
              </div>

              {/* Feature Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                {[
                  {
                    icon: <FaRobot className="text-4xl" />,
                    title: "AI Prompt Parsing",
                    description: "Advanced natural language processing understands your swap intentions perfectly",
                    color: "from-blue-500/20 to-cyan-500/20"
                  },
                  {
                    icon: <FaBolt className="text-4xl" />,
                    title: "Lightning Fast",
                    description: "Execute transfers on Somnia testnet with minimal gas fees and instant confirmations",
                    color: "from-yellow-500/20 to-orange-500/20"
                  },
                  {
                    icon: <FaShieldAlt className="text-4xl" />,
                    title: "Secure & Safe",
                    description: "Multiple confirmation layers and safety checks before every transaction",
                    color: "from-green-500/20 to-emerald-500/20"
                  },
                  {
                    icon: <FaChartLine className="text-4xl" />,
                    title: "Analytics Dashboard",
                    description: "Track spending patterns, portfolio performance, and transaction insights",
                    color: "from-purple-500/20 to-pink-500/20"
                  },
                  {
                    icon: <FaUsers className="text-4xl" />,
                    title: "Team Management",
                    description: "Create teams, manage approvals, and execute group transactions",
                    color: "from-indigo-500/20 to-blue-500/20"
                  },
                  {
                    icon: <FaClock className="text-4xl" />,
                    title: "Scheduled Payments",
                    description: "Set up conditional and time-locked transactions for automated payments",
                    color: "from-red-500/20 to-rose-500/20"
                  }
                ].map((feature, index) => (
                  <div key={index} className="group relative">
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                    <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-white/30 hover:bg-white/10 transition-all duration-500 h-full">
                      <div className="text-white mb-4 group-hover:scale-110 transition-transform duration-300">
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                        {feature.title}
                      </h3>
                      <p className="text-slate-300 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Demo Commands Section */}
          <section className="py-32 px-4 bg-gradient-to-r from-black/50 to-slate-900/50">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-6xl font-black mb-6 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  TRY THESE COMMANDS
                </h2>
                <p className="text-slate-400 text-xl">
                  See how easy it is to send crypto with natural language
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  {
                    input: "Send 50 STT to Alice",
                    parsed: "Amount: 50, Token: STT, Recipient: Alice",
                    type: "Basic Transfer"
                  },
                  {
                    input: "Transfer 100 tokens to 0x123...",
                    parsed: "Amount: 100, Token: STT, Recipient: 0x123...",
                    type: "Address Transfer"
                  },
                  {
                    input: "Pay Bob 25 STT",
                    parsed: "Amount: 25, Token: STT, Recipient: Bob",
                    type: "Quick Payment"
                  },
                  {
                    input: "Send 10 STT to all Family contacts",
                    parsed: "Amount: 10, Token: STT, Recipient: Family Group",
                    type: "Group Transfer"
                  },
                  {
                    input: "Schedule 100 STT to Alice in 24 hours",
                    parsed: "Amount: 100, Token: STT, Recipient: Alice, Time: 24h",
                    type: "Scheduled Payment"
                  },
                  {
                    input: "Show my transaction analytics",
                    parsed: "Display: Spending patterns, Portfolio, History",
                    type: "Analytics Query"
                  }
                ].map((command, index) => (
                  <div key={index} className="group relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-slate-400/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/30 hover:bg-white/10 transition-all duration-500">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{command.type}</span>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <div className="text-slate-300 text-sm mb-2 font-medium">→ Input:</div>
                          <div className="text-white font-medium bg-slate-800/30 rounded-lg p-3 border border-slate-700/50">
                            {command.input}
                          </div>
                        </div>
                        <div>
                          <div className="text-slate-300 text-sm mb-2 font-medium">← Parsed:</div>
                          <div className="text-slate-200 text-sm bg-slate-900/30 rounded-lg p-3 border border-slate-600/50">
                            {command.parsed}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Advanced Features */}
          <section className="py-32 px-4">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-20">
                <h2 className="text-4xl md:text-6xl font-black mb-6 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  ADVANCED CAPABILITIES
                </h2>
                <p className="text-slate-400 text-xl max-w-3xl mx-auto">
                  Beyond basic transfers - experience the full power of AI-driven crypto management
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-8">
                  {[
                    {
                      icon: <FaChartLine className="text-2xl" />,
                      title: "Analytics & Insights",
                      description: "Track spending patterns, portfolio performance, and get transaction predictions"
                    },
                    {
                      icon: <FaUsers className="text-2xl" />,
                      title: "Contact Management",
                      description: "Save frequent recipients, create contact groups, and verify addresses"
                    },
                    {
                      icon: <FaShieldAlt className="text-2xl" />,
                      title: "Security & Risk",
                      description: "Address reputation checks, scam detection, and transaction validation"
                    },
                    {
                      icon: <FaQrcode className="text-2xl" />,
                      title: "Sharing & Integration",
                      description: "Generate QR codes, receipts, and share transactions via social media"
                    }
                  ].map((feature, index) => (
                    <div key={index} className="flex items-start gap-4 p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:border-white/30 hover:bg-white/10 transition-all duration-500 group">
                      <div className="text-white group-hover:scale-110 transition-transform duration-300">
                        {feature.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                          {feature.title}
                        </h3>
                        <p className="text-slate-300 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-slate-400/10 rounded-3xl blur-2xl"></div>
                  <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold text-white mb-4 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                        Multi-Language Support
                      </h3>
                      <p className="text-slate-300">
                        AgentKyro supports 10+ languages for global accessibility
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {["English", "Spanish", "French", "German", "Chinese", "Japanese", "Korean", "Portuguese"].map((lang, index) => (
                        <div key={index} className="flex items-center gap-2 p-3 bg-slate-800/30 rounded-lg border border-slate-700/50 hover:border-slate-600/50 transition-colors duration-300">
                          <FaLanguage className="text-slate-400" />
                          <span className="text-slate-200 text-sm">{lang}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Final CTA */}
          <section className="py-32 px-4 bg-gradient-to-r from-black/50 to-slate-900/50">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-6xl font-black mb-8 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                READY TO EXPERIENCE THE FUTURE?
              </h2>
              <p className="text-slate-300 text-xl mb-12 max-w-2xl mx-auto">
                Join the revolution of AI-powered cryptocurrency transactions. 
                Connect your wallet and start swapping with just words.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 items-center justify-center">
                <button
                  className="group relative px-12 py-6 text-2xl font-bold rounded-2xl cursor-pointer border border-white/20 bg-white/10 backdrop-blur-xl text-white shadow-2xl hover:scale-105 hover:bg-white/20 transition-all duration-500 hover:shadow-white/20 overflow-hidden"
                  onClick={() => {
                    if (authenticated) {
                      window.location.href = "/chat";
                    } else {
                      setShowConnectMsg(true);
                    }
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-slate-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <span className="relative z-10 flex items-center gap-3">
                    <FaRobot className="text-2xl" />
                    START SWAPPING NOW
                  </span>
                </button>
                <Link
                  href="https://www.loom.com/share/aabf4d44adc94fcfb8c1ebf3d33d5044?sid=2294e122-09e7-437d-8c05-d95cc3b590a9"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button className="group px-12 py-6 text-2xl font-bold rounded-2xl cursor-pointer border border-slate-400/30 bg-slate-800/20 backdrop-blur-xl text-slate-200 shadow-lg hover:scale-105 hover:bg-slate-700/40 hover:border-slate-300/50 transition-all duration-500 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-600/20 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <span className="relative z-10 flex items-center gap-3">
                      <FaMobileAlt className="text-2xl" />
                      WATCH DEMO
                    </span>
                  </button>
                </Link>
              </div>
            </div>
          </section>
        </main>

        <footer className="w-full border-t border-white/10 bg-black/20 backdrop-blur-2xl relative z-10">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Image
                    src="/logo.jpg"
                    alt="AgentKyro Logo"
                    width={40}
                    height={40}
                    className="rounded-xl border border-white/20"
                  />
                  <h3 className="text-xl font-bold text-white bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                    AgentKyro
                  </h3>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Powering the future of AI-driven crypto transactions. 
                  Making cryptocurrency transfers as easy as sending a text message.
                </p>
              </div>
              
              <div>
                <h4 className="text-white font-semibold mb-4">Built For</h4>
                <div className="space-y-2">
                  <div className="text-slate-400">Somnia AI Hackathon 2025</div>
                  <div className="text-slate-400">Open Source Community</div>
                  <div className="text-slate-400">Global Accessibility</div>
                </div>
              </div>
              
              <div>
                <h4 className="text-white font-semibold mb-4">Connect</h4>
                <div className="flex gap-4">
                  <Link
                    href="https://github.com/David-patrick-chuks/AgentKyro-on-Somnia"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-white transition-colors duration-300 bg-white/5 backdrop-blur-xl rounded-full px-4 py-2 border border-white/10 hover:border-white/30"
                  >
                    GitHub
                  </Link>
                  <Link
                    href="https://www.loom.com/share/aabf4d44adc94fcfb8c1ebf3d33d5044?sid=2294e122-09e7-437d-8c05-d95cc3b590a9"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-white transition-colors duration-300 bg-white/5 backdrop-blur-xl rounded-full px-4 py-2 border border-white/10 hover:border-white/30"
                  >
                    Demo Video
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="border-t border-white/10 pt-8 text-center">
              <p className="text-slate-400">
                © 2025 AgentKyro. Built for the Somnia AI Hackathon. MIT License.
              </p>
            </div>
          </div>
        </footer>

        <style jsx>{`
          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes float {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-20px);
            }
          }

          @keyframes gradient {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }

          .animate-fade-in {
            animation: fade-in 1s ease-out;
          }

          .animate-float {
            animation: float 3s ease-in-out infinite;
          }

          .animate-gradient {
            background-size: 200% 200%;
            animation: gradient 3s ease infinite;
          }
        `}</style>
      </div>
    </>
  );
}
