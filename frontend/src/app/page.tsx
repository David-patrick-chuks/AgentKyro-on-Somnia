"use client";
import ConnectWalletButton from "@/components/ConnectWalletButton";
import FloatingParticles from "@/components/FloatingParticles";
import { useAuthNavigation } from "@/hooks/useAuthNavigation";
import { usePrivy } from "@privy-io/react-auth";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaBolt, FaChartLine, FaClock, FaMobileAlt, FaQrcode, FaRobot, FaSearch, FaShieldAlt, FaUsers } from "react-icons/fa";

export default function Home() {
  const { authenticated } = usePrivy();
  const { navigateToDashboard } = useAuthNavigation();
  const [showConnectMsg, setShowConnectMsg] = useState(false);

  return (
    <>
      {showConnectMsg && (
        <div className="fixed top-0 left-0 w-full z-50 bg-red-500/90 backdrop-blur-xl text-white text-center py-3 font-semibold shadow-lg border-b border-red-400/20">
          Please connect your wallet first to start using AgentKyro.
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
            <div>
              <h1 className="font-bold text-xl bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                AgentKyro
              </h1>
              <p className="text-slate-400 text-xs">AI-Powered DeFi Assistant</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <ConnectWalletButton />
            {authenticated && (
              <button
                onClick={navigateToDashboard}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Dashboard
              </button>
            )}
          </div>
        </header>

        <main className="relative z-10">
          {/* Hero Section */}
          <section className="px-4 md:px-8 py-20 md:py-32">
            <div className="max-w-7xl mx-auto text-center">
              <div className="mb-8">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
                  <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                    The Future of
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                    DeFi Management
                  </span>
                </h1>
                <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                  Experience the power of AI-driven cryptocurrency management with AgentKyro. 
                  Seamlessly manage your digital assets, execute smart transactions, and navigate 
                  the DeFi ecosystem with intelligent automation.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                <button
                  onClick={() => {
                    if (!authenticated) {
                      setShowConnectMsg(true);
                      setTimeout(() => setShowConnectMsg(false), 3000);
                    } else {
                      navigateToDashboard();
                    }
                  }}
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-lg"
                >
                  Get Started
                </button>
                <Link
                  href="#features"
                  className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 text-white font-semibold rounded-2xl transition-all duration-300 backdrop-blur-xl text-lg"
                >
                  Learn More
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/30 transition-all duration-300">
                  <div className="text-3xl font-bold text-white mb-2">10K+</div>
                  <div className="text-slate-400">Active Users</div>
                </div>
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/30 transition-all duration-300">
                  <div className="text-3xl font-bold text-white mb-2">$50M+</div>
                  <div className="text-slate-400">Assets Managed</div>
                </div>
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/30 transition-all duration-300">
                  <div className="text-3xl font-bold text-white mb-2">99.9%</div>
                  <div className="text-slate-400">Uptime</div>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section id="features" className="px-4 md:px-8 py-20">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                    Powerful Features
                  </span>
                </h2>
                <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                  Everything you need to manage your DeFi portfolio with AI-powered intelligence
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* AI Chat Assistant */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-white/30 transition-all duration-300 group">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <FaRobot className="text-white text-2xl" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">AI Chat Assistant</h3>
                  <p className="text-slate-400 leading-relaxed">
                    Interact with your DeFi portfolio using natural language. Execute transactions, 
                    check balances, and get insights through conversational AI.
                  </p>
                </div>

                {/* Advanced Analytics */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-white/30 transition-all duration-300 group">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <FaChartLine className="text-white text-2xl" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">Advanced Analytics</h3>
                  <p className="text-slate-400 leading-relaxed">
                    Get comprehensive insights into your portfolio performance, spending patterns, 
                    and market trends with real-time analytics.
                  </p>
                </div>

                {/* Smart Transactions */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-white/30 transition-all duration-300 group">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <FaBolt className="text-white text-2xl" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">Smart Transactions</h3>
                  <p className="text-slate-400 leading-relaxed">
                    Schedule payments, set up conditional transactions, and automate your DeFi 
                    operations with intelligent transaction management.
                  </p>
                </div>

                {/* Team Collaboration */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-white/30 transition-all duration-300 group">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <FaUsers className="text-white text-2xl" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">Team Collaboration</h3>
                  <p className="text-slate-400 leading-relaxed">
                    Create teams, manage shared wallets, and collaborate on DeFi strategies 
                    with multi-signature support and approval workflows.
                  </p>
                </div>

                {/* Security & Risk Management */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-white/30 transition-all duration-300 group">
                  <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <FaShieldAlt className="text-white text-2xl" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">Security & Risk Management</h3>
                  <p className="text-slate-400 leading-relaxed">
                    Advanced security features including risk assessment, scam detection, 
                    and transaction validation to protect your assets.
                  </p>
                </div>

                {/* Mobile Optimized */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-white/30 transition-all duration-300 group">
                  <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <FaMobileAlt className="text-white text-2xl" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">Mobile Optimized</h3>
                  <p className="text-slate-400 leading-relaxed">
                    Access your DeFi portfolio anywhere with our fully responsive design 
                    and mobile-optimized interface.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="px-4 md:px-8 py-20">
            <div className="max-w-4xl mx-auto text-center">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                    Ready to Transform Your DeFi Experience?
                  </span>
                </h2>
                <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
                  Join thousands of users who are already managing their DeFi portfolios 
                  with AI-powered intelligence and automation.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => {
                      if (!authenticated) {
                        setShowConnectMsg(true);
                        setTimeout(() => setShowConnectMsg(false), 3000);
                      } else {
                        navigateToDashboard();
                      }
                    }}
                    className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-lg"
                  >
                    Start Your Journey
                  </button>
                  <Link
                    href="#features"
                    className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 text-white font-semibold rounded-2xl transition-all duration-300 backdrop-blur-xl text-lg"
                  >
                    Explore Features
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t border-white/10 bg-black/20 backdrop-blur-2xl">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <Image
                    src="/logo.jpg"
                    alt="AgentKyro Logo"
                    width={40}
                    height={40}
                    className="rounded-xl border border-white/20"
                  />
                  <div>
                    <h3 className="font-bold text-lg bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                      AgentKyro
                    </h3>
                    <p className="text-slate-400 text-sm">AI-Powered DeFi Assistant</p>
                  </div>
                </div>
                <p className="text-slate-400 max-w-md">
                  Empowering users with intelligent DeFi management through AI-driven automation 
                  and advanced analytics.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-white mb-4">Product</h4>
                <ul className="space-y-2 text-slate-400">
                  <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
                  <li><Link href="#" className="hover:text-white transition-colors">Analytics</Link></li>
                  <li><Link href="#" className="hover:text-white transition-colors">Security</Link></li>
                  <li><Link href="#" className="hover:text-white transition-colors">API</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-white mb-4">Support</h4>
                <ul className="space-y-2 text-slate-400">
                  <li><Link href="#" className="hover:text-white transition-colors">Documentation</Link></li>
                  <li><Link href="#" className="hover:text-white transition-colors">Help Center</Link></li>
                  <li><Link href="#" className="hover:text-white transition-colors">Community</Link></li>
                  <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-white/10 mt-8 pt-8 text-center text-slate-400">
              <p>&copy; 2024 AgentKyro. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}