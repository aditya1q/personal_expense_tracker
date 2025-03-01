// app/components/layout/AppSidebar.js
"use client";

import { Wallet, ChevronsUpDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { MenuItems } from "@/constants/constant";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import ls from "localstorage-slim";
import { useState, useEffect } from "react";

// Simple Skeleton Component
function Skeleton({ className }) {
  return <div className={`animate-pulse bg-gray-300 rounded ${className}`}></div>;
}

export default function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [username, setUsername] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch username from local storage only on the client side
  useEffect(() => {
    const storedUsername = ls.get("username");
    setUsername(storedUsername);
    setIsLoading(false);
  }, []);

  // Handle sign out
  const handleSignOut = () => {
    console.log("Signing out..."); // Debug log
    ls.remove("username"); // Remove username
    ls.remove("access_token"); // Remove access token
    ls.remove("refresh_token"); // Remove refresh token
    document.cookie = "access_token=; path=/; max-age=0"; // Clear cookie
    setUsername(null); // Update state to reflect logout
    router.push("/login"); // Navigate to /login
    router.refresh(); // Force a refresh to ensure navigation
  };

  // Handle account navigation
  const handleAccount = () => {
    router.push("/expense"); // Navigate to /expense
  };

  return (
    <Sidebar className="bg-[#111116]">
      <SidebarHeader>
        <div className="flex items-center gap-3 w-full">
          <Wallet className="text-[#2563EB] w-5 h-5 shrink-0" />
          <div className="flex flex-col w-full gap-0">
            {isLoading ? (
              <>
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-3 w-16" />
              </>
            ) : (
              <>
                <span className="truncate font-semibold text-[14px]">
                  {username || "username"}
                </span>
                <span className="truncate text-[12px] text-[#6B7280]">
                  Expense Tracker
                </span>
              </>
            )}
          </div>
        </div>
        <span className="border-t border-[#E2E8F0] w-[100%]"></span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="font-semibold text-[12px]">
            Platform
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {MenuItems.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        href={item.url}
                        className={`flex items-center gap-3 text-[14px] p-2 rounded ${
                          isActive
                            ? "bg-[#3B82F610] text-[#3B82F6]"
                            : "hover:bg-[#3B82F610] hover:text-[#3B82F6]"
                        }`}
                      >
                        <item.icon
                          className={`w-5 h-5 ${
                            isActive ? "text-[#3B82F6]" : "hover:text-[#3B82F6]"
                          }`}
                        />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground py-6">
                  <span className="size-8 bg-gray-500 rounded-full shrink-0"></span>
                  {isLoading ? (
                    <Skeleton className="h-4 w-20 ml-2" />
                  ) : (
                    <span className="text-[14px] capitalize">
                      {username || "username"}
                    </span>
                  )}
                  <ChevronsUpDown className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="right"
                className="w-[--radix-popper-anchor-width] mb-8"
              >
                <DropdownMenuItem onClick={handleAccount}>
                  <span>Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Billing</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}