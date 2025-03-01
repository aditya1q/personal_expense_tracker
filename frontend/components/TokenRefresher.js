"use client";
import { useEffect } from "react";
import { fetchRefreshToken } from "@/app/api/auth";
import { useRouter } from "next/navigation";
import ls from 'localstorage-slim'
import { jwtDecode } from "jwt-decode";

export default function TokenRefresher() {
  const router = useRouter();

  useEffect(() => {
    const refreshToken = ls.get("refresh_token");
    const accessToken = ls.get("access_token");

    if (refreshToken && accessToken) {
      const refreshTokenFn = async () => {
        try {
          const decoded = jwtDecode(accessToken);
          const now = Date.now() / 1000; // Current time in seconds
          const expiresIn = decoded.exp - now;

          // Refresh if less than 1 hour remains
          if (expiresIn < 60 * 60) {
            const response = await fetchRefreshToken(refreshToken);
            console.log("Token refreshed:");
            document.cookie = `access_token=${response.access_token}; path=/; max-age=86400`;
          }
        } catch (error) {
          console.error("Token refresh failed:", error);
          ls.remove("access_token");
          ls.remove("refresh_token");
          document.cookie = "access_token=; path=/; max-age=0";
          router.push("/login");
        }
      };

      refreshTokenFn(); // Initial check
      const interval = setInterval(refreshTokenFn, 60 * 60 * 1000); // Check every hour
      return () => clearInterval(interval);
    } else {
      router.push("/login");
    }
  }, [router]);

  return null;
}