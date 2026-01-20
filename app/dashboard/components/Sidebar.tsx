'use client';
import { cn } from "@/lib/utils";
import { 
  Home, 
  Package, 
  ShoppingCart, 
  DollarSign, 
  Users, 
  Settings,
  LogOut,
  X
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Inventory", href: "/inventory", icon: Package },
  { name: "Sales", href: "/sales", icon: ShoppingCart },
  { name: "Expenses", href: "/expenses", icon: DollarSign },
  { name: "Customers", href: "/customers", icon: Users },
  { name: "Settings", href: "/settings", icon: Settings },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        
        "fixed top-0 left-0 bottom-0 z-50 w-64",
        "bg-gray-900 backdrop-blur-sm border-r border-gray-800",
        "transition-transform duration-300 ease-in-out",
        
        
        isOpen ? "translate-x-0" : "-translate-x-full",
        
       
        "lg:translate-x-0  lg:h-screen lg:sticky lg:top-0"
      )}
      style={{ height: '100vh' }} 
    >
      <div className="flex flex-col h-full">
        
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-800 shrink-0">
          <Link href="/dashboard" className="flex items-center gap-3" onClick={onClose}>
            <div className="h-8 w-8 bg-yellow-300 rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-sm">BMT</span>
            </div>
            <div>
              <div className="font-bold text-white text-lg">Big Men</div>
              <div className="text-xs text-gray-400 -mt-1">Transaction Apparel</div>
            </div>
          </Link>
          <button 
            onClick={onClose}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

       
        <div className="flex-1 overflow-y-auto py-6">
          <nav className="px-4 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-yellow-300 text-black"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        
        <div className="p-4 border-t border-gray-800 shrink-0">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="h-9 w-9 rounded-full bg-yellow-300/10 flex items-center justify-center">
              <span className="text-yellow-300 font-bold">AD</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">Admin User</p>
              <p className="text-xs text-gray-400 truncate">Administrator</p>
            </div>
          </div>
          
          <Link 
            href='/auth/login' 
            className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors mt-2"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </Link>
        </div>
      </div>
    </aside>
  );
}