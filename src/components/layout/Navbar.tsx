'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Wallet, Settings, LayoutDashboard, History, Menu, Beaker, LogOut, User } from "lucide-react";
import { useFinanceStore } from "@/hooks/use-finance-store";
import { toast } from "@/hooks/use-toast";
import { useAuth, useUser } from "@/firebase";
import { initiateSignOut } from "@/firebase/non-blocking-login";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const { seedTestData } = useFinanceStore();
  const { user } = useUser();
  const auth = useAuth();

  const handleSeedData = () => {
    seedTestData();
    toast({
      title: "Reviewer Mode Active",
      description: "Test data (Rupees) has been successfully seeded.",
    });
  };

  const handleLogout = () => {
    initiateSignOut(auth);
  };

  return (
    <nav className="border-b bg-card text-card-foreground shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-primary p-1.5 rounded-lg">
            <Wallet className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight text-primary">SpendSense</span>
        </Link>

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
          
          <div className="flex items-center gap-2 ml-4 pl-4 border-l">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSeedData}
              className="border-accent text-accent hover:bg-accent/10"
            >
              <Beaker className="h-4 w-4 mr-2" /> Seed Test Data
            </Button>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.photoURL || undefined} alt={user.displayName || "User"} />
                      <AvatarFallback>{user.displayName?.charAt(0) || <User className="h-4 w-4" />}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.displayName}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button size="sm" asChild>
                <Link href="/login">Login</Link>
              </Button>
            )}
          </div>
        </div>

        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </div>
    </nav>
  );
}
