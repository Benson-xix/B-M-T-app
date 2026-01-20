'use client';
import { Bell, Menu, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Link from "next/link";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const [notifications] = useState(3);

  return (
    <header className="sticky top-0 z-40 bg-gray-900 backdrop-blur-sm border-b border-gray-800">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <Menu className="h-6 w-6" />
          </Button>
          
          <div className="hidden md:block">
            <div className="relative">
             <Link href="/dashboard" className="flex items-center gap-3">
          <div className="h-8 w-8 bg-yellow-300 rounded-lg flex items-center justify-center">
            <span className="text-black font-bold text-sm">BMT</span>
          </div>
          <div>
            <div className="font-bold text-white text-lg">Big Men</div>
            <div className="text-xs text-gray-400 -mt-1">Transaction Apparel</div>
          </div>
        </Link>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="relative text-gray-400 hover:text-white">
            <Bell className="h-5 w-5" />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {notifications}
              </span>
            )}
          </Button>
          
          <div className="hidden md:flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-800">
            <div className="h-8 w-8 rounded-full bg-yellow-300/10 flex items-center justify-center">
              <span className="text-yellow-300 font-bold text-sm">AD</span>
            </div>
            <div>
              <div className="text-sm font-medium text-white">Admin Dashboard</div>
              <div className="text-xs text-gray-400">Executive View</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}