"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ls from 'localstorage-slim'
import { fetchRefreshToken } from "@/app/api/auth";

export default function TokenRefresher() {
  const router = useRouter();

  useEffect(() => {
    // get the refresh token in every 30 min
    const refreshToken = ls.get("refresh_token");

    if (refreshToken) {
      const refreshTokenFn = async () => {
        try {
          const response = await fetchRefreshToken(refreshToken);
          // console.log("Token refreshed:", response);
          // Sync with cookie
          document.cookie = `access_token=${response.access_token}; path=/; max-age=1800`; // 30 min
        } catch (error) {
          console.error("Token refresh failed:", error);
          ls.remove("access_token");
          ls.remove("refresh_token");
          document.cookie = "access_token=; path=/; max-age=0"; // Clear cookie
          router.push("/login");
        }
      };

      refreshTokenFn(); // Initial refresh
      const interval = setInterval(refreshTokenFn, 30 * 60 * 1000); // Every 30 min
      return () => clearInterval(interval);
    }
  }, [router]);

  return null;
}