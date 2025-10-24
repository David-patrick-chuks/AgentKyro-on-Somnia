"use client";
import { FaBell, FaCog, FaShieldAlt, FaUser } from "react-icons/fa";

export default function Settings() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            Settings
          </h2>
          <p className="text-slate-400 mt-1">Configure your preferences and settings</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <FaUser className="text-blue-400 text-xl" />
            <h3 className="text-lg font-semibold text-white">Profile Settings</h3>
          </div>
          <p className="text-slate-400 text-sm">Manage your profile information and preferences.</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <FaBell className="text-green-400 text-xl" />
            <h3 className="text-lg font-semibold text-white">Notifications</h3>
          </div>
          <p className="text-slate-400 text-sm">Configure notification preferences and alerts.</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <FaShieldAlt className="text-red-400 text-xl" />
            <h3 className="text-lg font-semibold text-white">Security</h3>
          </div>
          <p className="text-slate-400 text-sm">Manage security settings and privacy options.</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <FaCog className="text-purple-400 text-xl" />
            <h3 className="text-lg font-semibold text-white">Advanced</h3>
          </div>
          <p className="text-slate-400 text-sm">Advanced configuration and developer options.</p>
        </div>
      </div>
    </div>
  );
}
