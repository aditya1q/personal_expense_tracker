"use client";

import { BellIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import Search from "../main/Search";
import { getCookie } from "@/utils/coockie";

const Navbar = () => {
  const [username, setUsername] = useState("");
  const [greeting, setGreeting] = useState("");

  const updateGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setGreeting("Good Morning");
    } else if (hour >= 12 && hour < 15) {
      setGreeting("Good Afternoon");
    } else if (hour >= 15 && hour < 18) {
      setGreeting("Good Evening");
    } else {
      setGreeting("Good Night");
    }
  };

  useEffect(() => {
    const storedUsername = getCookie("username");
    setUsername(storedUsername || "User"); 

    updateGreeting();

    const interval = setInterval(updateGreeting, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-between w-full p-4">
      <div className="flex flex-col items-start justify-center">
        <h1 className="text-[16px] font-semibold capitalize">
          {greeting}, {username}
        </h1>
        <p className="text-[12px] text-[#9CA3AF]">Here's your financial summary</p>
      </div>
      <div className="flex items-center gap-4">
        <Search />
        <div className="bg-[#16171C] p-2 rounded-lg">
          <BellIcon />
        </div>
      </div>
    </div>
  );
};

export default Navbar;