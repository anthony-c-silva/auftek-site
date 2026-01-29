"use client";

import React from "react";
import { Logo } from "@/components/ui/Logo";

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-auftek-dark">
      {/* Animated background gradient */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-[10px] opacity-50">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-auftek-blue/30 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-auftek-green/20 rounded-full blur-[100px] animate-pulse delay-700" />
        </div>
      </div>

      {/* Loading content */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Logo or brand name */}
        <div className="text-center mb-4">
          <div className="relative w-48 mx-auto">
            <Logo className="w-full h-auto text-white drop-shadow-2xl" />
          </div>
        </div>

        {/* Animated spinner */}
        <div className="relative w-20 h-20">
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border-4 border-auftek-blue/20" />

          {/* Spinning ring */}
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-auftek-blue border-r-auftek-blue animate-spin" />

          {/* Inner pulse */}
          <div className="absolute inset-3 rounded-full bg-auftek-blue/20 animate-pulse" />
        </div>

        {/* Loading dots */}
        <div className="flex gap-2">
          <div className="w-2 h-2 rounded-full bg-auftek-blue animate-bounce" />
          <div className="w-2 h-2 rounded-full bg-auftek-blue animate-bounce delay-150" />
          <div className="w-2 h-2 rounded-full bg-auftek-blue animate-bounce delay-300" />
        </div>
      </div>
    </div>
  );
}
