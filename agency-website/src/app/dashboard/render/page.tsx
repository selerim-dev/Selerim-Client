"use client";

import React, { useState } from "react";

const platforms = [
  { label: "iPhone", value: "ios" },
  { label: "Android", value: "android" },
  { label: "Web", value: "web" },
];

export default function RenderPage() {
  const [platform, setPlatform] = useState("ios");
  const [isRunning, setIsRunning] = useState(false);

  const handleRun = () => {
    setIsRunning(true);
    setTimeout(() => setIsRunning(false), 2000); // Simulate build
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-10">
      <h1 className="text-3xl font-bold text-white mb-6">Render App</h1>
      <div className="flex gap-4 mb-8">
        {platforms.map((p) => (
          <button
            key={p.value}
            onClick={() => setPlatform(p.value)}
            className={`px-6 py-2 rounded-full font-semibold text-lg transition border-2
              ${platform === p.value ? "bg-blue-400/80 border-blue-400 text-white" : "bg-black/30 border-white/20 text-white/70 hover:bg-blue-400/20"}`}
          >
            {p.label}
          </button>
        ))}
      </div>
      <div className="bg-black/40 border border-white/10 rounded-2xl p-8 flex flex-col items-center min-h-[320px] justify-center">
        <div className="mb-6 text-white/80 text-lg">{platform === "ios" ? "iPhone Simulator" : platform === "android" ? "Android Simulator" : "Web Preview"}</div>
        <div className="w-full h-48 bg-gradient-to-br from-blue-400/10 to-pink-400/10 rounded-xl flex items-center justify-center text-white/40 text-2xl font-bold">
          {isRunning ? "Running latest build..." : "[App Preview Placeholder]"}
        </div>
        <button
          onClick={handleRun}
          disabled={isRunning}
          className="mt-8 rounded-full bg-blue-400/80 hover:bg-blue-400 text-white font-semibold px-8 py-3 text-lg shadow transition disabled:opacity-60"
        >
          {isRunning ? "Running..." : "Run Latest Build"}
        </button>
      </div>
    </div>
  );
} 