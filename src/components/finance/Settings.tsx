'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { toast } from "@/hooks/use-toast";
import { Mail, Bell, Shield, Wallet } from "lucide-react";

export function Settings() {
  const { user } = useUser();
  const db = useFirestore();

  const userProfileRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, "users", user.uid);
  }, [db, user]);

  const { data: profile, isLoading } = useDoc(userProfileRef);

  const [dailyLimit, setDailyLimit] = useState<string>("");
  const [receiveDailyAlerts, setReceiveDailyAlerts] = useState(false);
  const [receiveMonthlyReports, setReceiveMonthlyReports] = useState(false);

  useEffect(() => {
    if (profile) {
      setDailyLimit(profile.dailySpendingLimit?.toString() || "");
      setReceiveDailyAlerts(profile.receiveDailyAlerts || false);
      setReceiveMonthlyReports(profile.receiveMonthlyReports || false);
    }
  }, [profile]);

  const handleSave = () => {
    if (!userProfileRef || !user) return;

    const updatedProfile = {
      id: user.uid,
      email: user.email,
      displayName: user.displayName,
      currency: "INR",
      dailySpendingLimit: parseFloat(dailyLimit) || 0,
      receiveDailyAlerts,
      receiveMonthlyReports,
      updatedAt: serverTimestamp(),
      ...(profile ? {} : { createdAt: serverTimestamp() })
    };

    setDocumentNonBlocking(userProfileRef, updatedProfile, { merge: true });
    
    toast({
      title: "Settings Saved",
      description: "Your notification preferences have been updated.",
    });
  };

  if (isLoading) return <div>Loading settings...</div>;

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

        <Button onClick={handleSave} className="w-full">
          Save Preferences
        </Button>
      </CardContent>
    </Card>
  );
}
