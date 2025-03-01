"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fetchLoginUser } from "../api/auth";
import ls from 'localstorage-slim'

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.email || !formData.password) {
      toast.error("Please fill in all required fields"); // Use toast.error with a string message
      setIsLoading(false);
      return;
    }
    try {
      const response = await fetchLoginUser({
        email: formData.email,
        password: formData.password,
      })
      console.log(response)
      console.log(response.access_token)
      console.log(response.refresh_token)
      ls.set("access_token", response.access_token);
      ls.set("refresh_token", response.refresh_token);
      ls.set("username", response.username);
      document.cookie = `access_token=${response.access_token}; path=/; max-age=86400`; // Sync with cookie
      toast.success("Registration Successful", { // Use toast.success with a message and options
        description: response.message || "User registered successfully",
      });
      router.push("/dashboard");
    } catch (error) {
      toast.error("Registration Failed", { // Use toast.error with a message and options
        description: error.message || "An error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Expense Tracker</CardTitle>
          <CardDescription>
            Sign in to manage your personal finances
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
            <div className="text-sm text-center text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="text-primary hover:underline"
              >
                Register
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}