"use client"

import { Wallet, ChevronsUpDown } from "lucide-react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, } from "@/components/ui/sidebar"
import { MenuItems } from "@/constants/constant";
import Link from "next/link";
import { usePathname } from "next/navigation";

function AppSidebar() {
  const pathname = usePathname();
  return (
    <Sidebar className='bg-[#111116]'>
      <SidebarHeader>
        <div className="flex items-center gap-3 w-full">
          <Wallet className="text-[#2563EB] w-5 h-5 shrink-0" />
          <div className="flex flex-col w-full gap-0">
            <span className="truncate font-semibold text-[14px]">username</span>
            <span className="truncate text-[12px] text-[#6B7280]">Expense Tracker</span>
          </div>
        </div>
        <span className="border-t border border-[#E2E8F0]' w-[100%]"></span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className='font-semibold text-[12px]'>Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {MenuItems.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        href={item.url}
                        className={`flex items-center gap-3 text-[14px] p-2 rounded ${isActive
                          ? "bg-[#3B82F610] text-[#3B82F6]"
                          : "hover:bg-[#3B82F610] hover:text-[#3B82F6]"
                          }`}
                      >
                        <item.icon className={`w-5 h-5 ${isActive ? "text-[#3B82F6]" : "hover:text-[#3B82F6]"}`} />
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
        <span className="border-t border border-[#E2E8F0]' w-[100%]"></span>
        <div className="flex items-center gap-2 justify-between">
          <div className="flex items-center w-full px-2 gap-2">
            <span className="size-8 bg-gray-500 rounded-full shrink-0"></span>
            <div className="flex flex-col">
              <span className="truncate font-semibold text-[14px]">username</span>
              <span className="truncate text-[11px] text-[#6B7280]">user@gmail.com</span>
            </div>
          </div>
          <span><ChevronsUpDown className="w-5 h-5 shrink-0" /></span>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar;
