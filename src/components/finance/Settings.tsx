'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Mail, Bell, Shield, Wallet } from "lucide-react";
import { updateSettingsAction } from "@/app/actions";

interface SettingsProps {
  initialSettings: {
    dailySpendingLimit: number;
    receiveDailyAlerts: boolean;
    receiveMonthlyReports: boolean;
  }
}

export function Settings({ initialSettings }: SettingsProps) {
  const [dailyLimit, setDailyLimit] = useState<string>(initialSettings.dailySpendingLimit.toString() || "");
  const [receiveDailyAlerts, setReceiveDailyAlerts] = useState(initialSettings.receiveDailyAlerts);
  const [receiveMonthlyReports, setReceiveMonthlyReports] = useState(initialSettings.receiveMonthlyReports);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await updateSettingsAction({
      dailySpendingLimit: parseFloat(dailyLimit) || 0,
      receiveDailyAlerts,
      receiveMonthlyReports
    });
    setIsSaving(false);
    
    toast({
      title: "Settings Saved",
      description: "Your notification preferences have been updated.",
    });
  };

  return (
    <Card id="settings" className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" /> Notification Settings
        </CardTitle>
        <CardDescription>
          Configure how you receive spending alerts and reports via email.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between space-x-2">
            <div className="flex flex-col space-y-1">
              <Label className="text-base flex items-center gap-2">
                <Bell className="h-4 w-4" /> Daily Spending Alerts
              </Label>
              <p className="text-sm text-muted-foreground">
                Receive an email if you exceed your daily limit.
              </p>
            </div>
            <Switch 
              checked={receiveDailyAlerts}
              onCheckedChange={setReceiveDailyAlerts}
            />
          </div>

          <div className="flex items-center justify-between space-x-2">
            <div className="flex flex-col space-y-1">
              <Label className="text-base flex items-center gap-2">
                <Mail className="h-4 w-4" /> Monthly Spending Reports
              </Label>
              <p className="text-sm text-muted-foreground">
                Get a detailed breakdown of your monthly finances.
              </p>
            </div>
            <Switch 
              checked={receiveMonthlyReports}
              onCheckedChange={setReceiveMonthlyReports}
            />
          </div>

          <div className="pt-4 border-t space-y-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Wallet className="h-4 w-4" /> Daily Spending Limit (₹)
              </Label>
              <Input 
                type="number" 
                placeholder="2000" 
                value={dailyLimit}
                onChange={(e) => setDailyLimit(e.target.value)}
              />
            </div>
          </div>
        </div>

        <Button onClick={handleSave} className="w-full" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Preferences"}
        </Button>
      </CardContent>
    </Card>
  );
}
