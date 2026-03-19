
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Wallet, Settings, LayoutDashboard, History, Menu } from "lucide-react";

export function Navbar() {
  return (
    <nav className="border-b bg-card text-card-foreground shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-primary p-1.5 rounded-lg">
            <Wallet className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight text-primary">SpendSense</span>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4" /> Dashboard
          </Link>
          <Link href="#expenses" className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-2">
            <History className="h-4 w-4" /> Expenses
          </Link>
          <Link href="#settings" className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-2">
            <Settings className="h-4 w-4" /> Settings
          </Link>
          <Button size="sm">Upgrade to Pro</Button>
        </div>

        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </div>
    </nav>
  );
}
