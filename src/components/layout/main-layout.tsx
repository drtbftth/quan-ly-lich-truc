import * as React from "react";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { CommandPalette } from "../command-palette";

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background bg-grid-pattern relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[5%] left-[10%] w-[40vw] h-[40vw] rounded-full bg-primary/10 dark:bg-primary/20 blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-[10%] right-[5%] w-[45vw] h-[45vw] rounded-full bg-amber-500/10 dark:bg-amber-500/20 blur-[150px] animate-pulse-slow"></div>
        <div className="absolute top-[40%] right-[30%] w-[30vw] h-[30vw] rounded-full bg-rose-500/5 dark:bg-rose-500/10 blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="flex min-h-screen w-full relative z-10">
        <Sidebar />
        <div className="flex w-full flex-col">
          <Header />
          <main className="flex-1 p-4 md:p-6 lg:p-8 relative">{children}</main>
        </div>
      </div>
      <CommandPalette />
    </div>
  );
}
