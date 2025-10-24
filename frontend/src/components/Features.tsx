import React from "react";
import { Meteors } from "@/components/ui/meteors";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
}) => (
  <div className="relative w-full max-w-xs mx-auto group">
    <div className="absolute inset-0 h-full w-full scale-[0.80] transform rounded-full bg-gradient-to-r from-[#1E3DFF] via-[#7A1EFF] to-[#FF1E99] blur-3xl group-hover:scale-[0.85] transition-transform duration-300" />
    <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-gray-700 bg-black/80 backdrop-blur px-4 py-8 shadow-xl hover:border-purple-500 transition-colors duration-300">
      <span className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </span>
      <h3 className="relative z-50 mb-3 text-lg font-bold text-white">
        {title}
      </h3>
      <p className="relative z-50 text-sm font-normal text-gray-300 text-center leading-relaxed">
        {description}
      </p>
      <Meteors number={8} />
    </div>
  </div>
);

const Features = ({ features }: { features: FeatureCardProps[] }) => (
  <section className="w-full max-w-6xl mx-auto mb-24">
    <h2 className="text-3xl font-bold text-white text-center mb-10">
      Powerful Features
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
      {features.map((feature, idx) => (
        <FeatureCard key={idx} {...feature} />
      ))}
    </div>
  </section>
);

export default Features;
