'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Wallet, Settings, LayoutDashboard, History, LogOut, User } from "lucide-react";
import { signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavbarProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }
}

export function Navbar({ user }: NavbarProps) {
  const handleLogout = () => {
    signOut({ callbackUrl: '/login' });
  };

  return (
    <nav className="border-b bg-card text-card-foreground shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-primary p-1.5 rounded-lg">
            <Wallet className="h-5 w-5 sm:h-6 sm:w-6 text-primary-foreground" />
          </div>
          <span className="text-lg sm:text-xl font-bold tracking-tight text-primary">SpendSense</span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-6">
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
          </div>
          
          <div className="flex items-center gap-2 sm:ml-4 sm:pl-4 sm:border-l">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full border">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.image || undefined} alt={user.name || "User"} />
                      <AvatarFallback>{user.name?.charAt(0) || <User className="h-4 w-4" />}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="md:hidden">
                    <DropdownMenuItem asChild>
                      <Link href="/" className="w-full">Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="#expenses" className="w-full">Expenses</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="#settings" className="w-full">Settings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </div>
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
      </div>
    </nav>
  );
}
