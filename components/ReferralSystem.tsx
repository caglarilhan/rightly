// components/ReferralSystem.tsx
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Copy, 
  Check, 
  Users, 
  Gift, 
  Share2, 
  TrendingUp,
  Calendar,
  Star
} from "lucide-react";

interface Referral {
  id: string;
  email: string;
  status: "pending" | "signed_up" | "converted";
  date: string;
  reward?: string;
}

export default function ReferralSystem() {
  const [referralLink, setReferralLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [totalRewards, setTotalRewards] = useState(0);

  useEffect(() => {
    // Generate referral link
    const userId = "user123"; // Replace with actual user ID
    const link = `${window.location.origin}/signup?ref=${userId}`;
    setReferralLink(link);

    // Load sample referrals
    const sampleReferrals: Referral[] = [
      {
        id: "1",
        email: "john@example.com",
        status: "converted",
        date: "2024-01-15",
        reward: "1 month Pro"
      },
      {
        id: "2",
        email: "sarah@company.com",
        status: "signed_up",
        date: "2024-01-14"
      },
      {
        id: "3",
        email: "mike@startup.io",
        status: "pending",
        date: "2024-01-13"
      }
    ];
    setReferrals(sampleReferrals);
    setTotalRewards(1); // 1 converted referral
  }, []);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const shareReferral = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join Rightly - GDPR Compliance Made Easy",
          text: "I've been using Rightly for GDPR compliance and it's amazing! Get 1 month of Pro free when you sign up with my link:",
          url: referralLink
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      // Fallback to copy
      copyToClipboard();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "converted":
        return "bg-green-100 text-green-800 border-green-200";
      case "signed_up":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "converted":
        return "Converted";
      case "signed_up":
        return "Signed Up";
      case "pending":
        return "Pending";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Gift className="h-8 w-8 text-purple-600" />
          <h1 className="text-4xl font-bold text-slate-900">Referral Program</h1>
        </div>
        <p className="text-lg text-slate-600 mb-4">
          Share Rightly with friends and earn rewards
        </p>
        <div className="flex items-center justify-center gap-4 text-sm text-slate-500">
          <span>🎁 1 month Pro free for each referral</span>
          <span>•</span>
          <span>👥 Unlimited referrals</span>
          <span>•</span>
          <span>⚡ Instant rewards</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-slate-900">{referrals.length}</div>
                <div className="text-sm text-slate-600">Total Referrals</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-slate-900">{totalRewards}</div>
                <div className="text-sm text-slate-600">Rewards Earned</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Star className="h-8 w-8 text-yellow-600" />
              <div>
                <div className="text-2xl font-bold text-slate-900">
                  {referrals.filter(r => r.status === "converted").length}
                </div>
                <div className="text-sm text-slate-600">Converted</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Referral Link Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Your Referral Link
          </CardTitle>
          <CardDescription>
            Share this link with friends to earn rewards
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <Input
              value={referralLink}
              readOnly
              className="flex-1"
              placeholder="Generating your referral link..."
            />
            <Button
              onClick={copyToClipboard}
              variant="outline"
              className="min-w-[100px]"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-1" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </>
              )}
            </Button>
            <Button onClick={shareReferral}>
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* How It Works */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
          <CardDescription>
            Simple steps to earn rewards
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <h3 className="font-semibold mb-2">Share Your Link</h3>
              <p className="text-sm text-slate-600">
                Send your unique referral link to friends and colleagues
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-green-600 font-bold">2</span>
              </div>
              <h3 className="font-semibold mb-2">They Sign Up</h3>
              <p className="text-sm text-slate-600">
                Your friends sign up using your link and get started
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-600 font-bold">3</span>
              </div>
              <h3 className="font-semibold mb-2">You Get Rewarded</h3>
              <p className="text-sm text-slate-600">
                Earn 1 month of Pro free for each successful referral
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Referrals List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Referrals</CardTitle>
          <CardDescription>
            Track your referral activity and rewards
          </CardDescription>
        </CardHeader>
        <CardContent>
          {referrals.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-semibold text-slate-900 mb-2">No Referrals Yet</h3>
              <p className="text-slate-600 mb-4">
                Start sharing your referral link to see your referrals here
              </p>
              <Button onClick={shareReferral}>
                <Share2 className="h-4 w-4 mr-1" />
                Share Your Link
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {referrals.map((referral) => (
                <div
                  key={referral.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                      <span className="text-slate-600 font-medium">
                        {referral.email.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-slate-900">{referral.email}</div>
                      <div className="text-sm text-slate-500">
                        <Calendar className="h-3 w-3 inline mr-1" />
                        {new Date(referral.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={getStatusColor(referral.status)}>
                      {getStatusText(referral.status)}
                    </Badge>
                    {referral.reward && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        <Gift className="h-3 w-3 mr-1" />
                        {referral.reward}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Terms */}
      <div className="mt-8 text-center">
        <p className="text-sm text-slate-500">
          * Rewards are applied after your referral completes their first DSAR request. 
          Terms and conditions apply.
        </p>
      </div>
    </div>
  );
}
