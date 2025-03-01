// app/settings/page.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
// import { toast } from "@/components/ui/use-toast";

const Settings = () => {
  const [formData, setFormData] = useState({
    username: "johndoe",
    email: "john@example.com",
    notifications: true,
    darkMode: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically save to an API
    // toast({
    //   title: "Settings saved!",
    //   description: "Your preferences have been updated.",
    // });
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSwitchChange = (name) => (checked) => {
    setFormData({
      ...formData,
      [name]: checked,
    });
  };

  return (
    // <div className=" py-10 w-full">
      <Card className="w-full flex justify-between items-center px-4">
        <div className="w-full">
          <CardHeader>
            <CardTitle>Settings</CardTitle>
            {/* <CardDescription>Manage your account preferences</CardDescription> */}
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              {/* Account Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Account</h3>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
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
                  checked={formData.notifications}
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
                  checked={formData.darkMode}
                  onCheckedChange={handleSwitchChange("darkMode")}
                />
          </div>
        </div>
      </Card>
    // </div>
  );
}


export default Settings;