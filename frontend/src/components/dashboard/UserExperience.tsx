"use client";
import { FaRobot } from "react-icons/fa";

export default function UserExperience() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            User Experience
          </h2>
          <p className="text-slate-400 mt-1">Customize your AgentKyro experience</p>
        </div>
      </div>

      <div className="text-center py-12">
        <FaRobot className="text-6xl text-slate-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">UX Features Coming Soon</h3>
        <p className="text-slate-400">Multi-language support, offline mode, PWA features, and smart suggestions.</p>
      </div>
    </div>
  );
}
