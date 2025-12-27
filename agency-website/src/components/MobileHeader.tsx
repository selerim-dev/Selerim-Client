"use client";

import React from "react";
import { useSidebar } from "../lib/sidebar-context";
import { Bars3Icon } from "@heroicons/react/24/outline";

export default function MobileHeader() {
  const { toggleMobileSidebar } = useSidebar();

  return (
    <header className="md:hidden fixed top-0 left-0 right-0 z-30 bg-black/80 backdrop-blur-sm border-b border-white/10">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={toggleMobileSidebar}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          <span className="text-lg font-semibold text-white">Selerim</span>
        </div>
      </div>
    </header>
  );
} 