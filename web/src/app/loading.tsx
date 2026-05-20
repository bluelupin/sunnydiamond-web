"use client";

import React from "react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background">
      <div className="relative flex flex-col items-center space-y-6">
        {/* Pulsing Luxury Diamond Outline */}
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border border-primary/20 animate-ping duration-1000" />
          <div className="absolute inset-2 border-2 border-primary rounded-tr-none rounded-bl-none rotate-45 animate-spin [animation-duration:3s]" />
          <div className="absolute inset-4 border border-primary/40 rounded-tl-none rounded-br-none -rotate-45 animate-pulse" />
        </div>
        
        {/* Branding text with luxury tracking */}
        <div className="flex flex-col items-center space-y-1">
          <span className="font-heading italic text-xl md:text-2xl text-foreground tracking-[0.2em] uppercase font-semibold">
            Sunny Diamonds
          </span>
          <span className="text-[10px] font-gill tracking-[0.3em] uppercase text-muted-foreground">
            Crafting Brilliance Since 1997
          </span>
        </div>
      </div>
    </div>
  );
}
