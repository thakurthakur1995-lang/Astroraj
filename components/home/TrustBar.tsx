import React from "react";
import { Award, Users, Globe, HeartHandshake, ShieldCheck } from "lucide-react";

export function TrustBar() {
  const credentials = [
    {
      icon: Award,
      value: "12+",
      label: "Years Vedic Experience",
      subtext: "Shri Vidya & Parashari Jyotish",
    },
    {
      icon: Users,
      value: "10,000+",
      label: "Consultations Completed",
      subtext: "India & 35+ Countries Worldwide",
    },
    {
      icon: Globe,
      value: "200,000+",
      label: "Kundlis Analyzed",
      subtext: "Deep Dasha & Chart Scrutiny",
    },
    {
      icon: HeartHandshake,
      value: "100%",
      label: "Personalized Guidance",
      subtext: "Audio & HD Video Sessions",
    },
  ];

  return (
    <section className="bg-white py-8 border-b border-border/70 shadow-xs relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-border/60">
          {credentials.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className={`flex flex-col items-center text-center p-3 sm:p-4 ${
                  index > 0 ? "pt-6 sm:pt-4" : ""
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-saffron-50 text-saffron-600 flex items-center justify-center mb-3 shadow-xs">
                  <Icon className="w-6 h-6" />
                </div>
                {/* Fixed, verified metric rendering - eliminates Elementor 0+ counter glitch */}
                <div className="font-serif text-2xl sm:text-3xl font-bold text-vedic-dark tracking-tight">
                  {item.value}
                </div>
                <div className="text-xs sm:text-sm font-semibold text-vedic-dark mt-1">
                  {item.label}
                </div>
                <div className="text-[11px] text-vedic-muted mt-0.5">
                  {item.subtext}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
