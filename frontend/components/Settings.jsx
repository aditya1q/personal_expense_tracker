"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

const Settings = () => {
  const [settings, setSettings] = useState({
    username: "johndoe",
    email: "john@example.com",
    notifications: true,
    darkMode: false,
  });

  useEffect(() => {
    const storedUsername = getCookie("username") || "johndoe";
    const storedEmail = getCookie("email") || "john@example.com";
    setSettings((prev) => ({
      ...prev,
      username: storedUsername,
      email: storedEmail,
    }));
  }, [])


  const handleSwitchChange = (name) => (checked) => {
    setSettings({
      ...settings,
      [name]: checked,
    });
  };

  return (
    <Card className="w-full flex justify-between items-center px-4">
      <div className="w-full">
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
        </CardHeader>
        <form>
          <CardContent className="space-y-6">
            {/* Account Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Account</h3>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  placeholder="johndoe"
                  value={settings.username}
                  readOnly
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={settings.email}
                  readOnly
                />
              </div>
            </div>
          </CardContent>
        </form>
      </div>
      <div className="space-y-4 w-full">
        <h3 className="text-lg font-medium">Preferences</h3>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Email Notifications</Label>
            <p className="text-sm text-muted-foreground">
              Receive email notifications
            </p>
          </div>
          <Switch
            checked={settings.notifications}
            onCheckedChange={handleSwitchChange("notifications")}
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Dark Mode</Label>
            <p className="text-sm text-muted-foreground">
              Enable dark theme
            </p>
          </div>
          <Switch
            checked={settings.darkMode}
            onCheckedChange={handleSwitchChange("darkMode")}
          />
        </div>
      </div>
    </Card>
  );
}


export default Settings;