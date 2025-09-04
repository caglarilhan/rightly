// components/TwoFactorSetup.tsx
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  Copy,
  RefreshCw,
  Smartphone,
  Key,
  Download
} from "lucide-react";
import { twoFactorManager, TwoFactorAuth } from "@/lib/auth/2fa";

export default function TwoFactorSetup() {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'setup' | 'verify' | 'complete'>('setup');
  const [secret, setSecret] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [token, setToken] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [twoFactorStatus, setTwoFactorStatus] = useState<TwoFactorAuth | null>(null);
  const [userId] = useState('user123'); // Replace with actual user ID

  useEffect(() => {
    load2FAStatus();
  }, []);

  const load2FAStatus = async () => {
    try {
      const status = await twoFactorManager.get2FASettings(userId);
      setTwoFactorStatus(status);
      
      if (status?.enabled) {
        setStep('complete');
      }
    } catch (error) {
      console.error('Failed to load 2FA status:', error);
    }
  };

  const startSetup = async () => {
    setIsLoading(true);
    try {
      const newSecret = twoFactorManager.generateSecret(userId, 'user@example.com');
      const qrCodeUrl = twoFactorManager.generateQRCode(newSecret, 'user@example.com');
      
      setSecret(newSecret);
      setQrCode(qrCodeUrl);
      setStep('verify');
    } catch (error) {
      console.error('Failed to start 2FA setup:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyAndEnable = async () => {
    if (!token || !secret) return;
    
    setIsLoading(true);
    try {
      const isValid = twoFactorManager.verifyToken(token, secret);
      
      if (isValid) {
        const twoFactorAuth = await twoFactorManager.enable2FA(userId, secret);
        setBackupCodes(twoFactorAuth.backupCodes.map(code => code.code));
        setTwoFactorStatus(twoFactorAuth);
        setStep('complete');
      } else {
        alert('Invalid verification code. Please try again.');
      }
    } catch (error) {
      console.error('Failed to verify 2FA:', error);
      alert('Failed to verify 2FA. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const disable2FA = async () => {
    setIsLoading(true);
    try {
      await twoFactorManager.disable2FA(userId);
      setTwoFactorStatus(null);
      setStep('setup');
      setSecret('');
      setQrCode('');
      setToken('');
      setBackupCodes([]);
    } catch (error) {
      console.error('Failed to disable 2FA:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const regenerateBackupCodes = async () => {
    setIsLoading(true);
    try {
      const newCodes = await twoFactorManager.regenerateBackupCodes(userId);
      setBackupCodes(newCodes.map(code => code.code));
    } catch (error) {
      console.error('Failed to regenerate backup codes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyBackupCodes = () => {
    const codesText = backupCodes.join('\n');
    navigator.clipboard.writeText(codesText);
    alert('Backup codes copied to clipboard');
  };

  const downloadBackupCodes = () => {
    const codesText = backupCodes.join('\n');
    const blob = new Blob([codesText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rightly-backup-codes.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (step === 'complete' && twoFactorStatus?.enabled) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <CardTitle className="text-2xl text-green-900">Two-Factor Authentication Enabled</CardTitle>
                <CardDescription className="text-green-700">
                  Your account is now protected with 2FA
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-white rounded-lg">
              <h3 className="font-semibold mb-2">Backup Codes</h3>
              <p className="text-sm text-slate-600 mb-3">
                Save these codes in a secure location. You can use them to access your account if you lose your authenticator device.
              </p>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {backupCodes.map((code, index) => (
                  <div key={index} className="p-2 bg-slate-100 rounded text-center font-mono text-sm">
                    {code}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={copyBackupCodes}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Codes
                </Button>
                <Button variant="outline" size="sm" onClick={downloadBackupCodes}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button variant="outline" size="sm" onClick={regenerateBackupCodes} disabled={isLoading}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Regenerate
                </Button>
              </div>
            </div>
            
            <Button
              variant="outline"
              onClick={disable2FA}
              disabled={isLoading}
              className="border-red-300 text-red-700 hover:bg-red-50"
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Disable 2FA
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Shield className="h-8 w-8 text-blue-600" />
          <h1 className="text-4xl font-bold text-slate-900">Two-Factor Authentication</h1>
        </div>
        <p className="text-lg text-slate-600 mb-4">
          Add an extra layer of security to your account
        </p>
        <div className="flex items-center justify-center gap-4 text-sm text-slate-500">
          <span>🔐 TOTP authenticator apps</span>
          <span>•</span>
          <span>📱 Backup codes</span>
          <span>•</span>
          <span>🔒 Enterprise security</span>
        </div>
      </div>

      {step === 'setup' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Setup 2FA
            </CardTitle>
            <CardDescription>
              Follow these steps to enable two-factor authentication
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-600">
                  1
                </div>
                <div>
                  <h3 className="font-semibold">Download an authenticator app</h3>
                  <p className="text-sm text-slate-600">
                    Install Google Authenticator, Authy, or any TOTP-compatible app
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-600">
                  2
                </div>
                <div>
                  <h3 className="font-semibold">Scan the QR code</h3>
                  <p className="text-sm text-slate-600">
                    Use your authenticator app to scan the QR code
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-600">
                  3
                </div>
                <div>
                  <h3 className="font-semibold">Enter verification code</h3>
                  <p className="text-sm text-slate-600">
                    Enter the 6-digit code from your authenticator app
                  </p>
                </div>
              </div>
            </div>

            <Button
              onClick={startSetup}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Setting up...
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4 mr-2" />
                  Start Setup
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 'verify' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Verify Setup
            </CardTitle>
            <CardDescription>
              Scan the QR code and enter the verification code
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="mb-4">
                <img 
                  src={qrCode} 
                  alt="QR Code" 
                  className="mx-auto border rounded-lg"
                  width={200}
                  height={200}
                />
              </div>
              <p className="text-sm text-slate-600 mb-4">
                Scan this QR code with your authenticator app
              </p>
              <div className="p-3 bg-slate-100 rounded-lg font-mono text-sm">
                {secret}
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Or manually enter this code in your authenticator app
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Verification Code
              </label>
              <Input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Enter 6-digit code"
                maxLength={6}
                className="text-center text-lg font-mono"
              />
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={verifyAndEnable}
                disabled={!token || token.length !== 6 || isLoading}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Verify & Enable
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => setStep('setup')}
                disabled={isLoading}
              >
                Back
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Security Benefits */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Why Enable 2FA?</CardTitle>
          <CardDescription>
            Benefits of two-factor authentication
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 border rounded-lg">
              <Shield className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold">Account Protection</h3>
              <p className="text-sm text-slate-600">
                Prevent unauthorized access even if password is compromised
              </p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold">Compliance</h3>
              <p className="text-sm text-slate-600">
                Meet enterprise security and compliance requirements
              </p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Key className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-semibold">Backup Access</h3>
              <p className="text-sm text-slate-600">
                Recovery codes ensure you never lose access to your account
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
