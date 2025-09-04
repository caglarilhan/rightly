// components/SSOSetup.tsx
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
  ExternalLink,
  Copy,
  RefreshCw,
  Settings,
  Users
} from "lucide-react";
import { SSOProvider, ssoManager } from "@/lib/auth/sso";

export default function SSOSetup() {
  const [providers, setProviders] = useState<SSOProvider[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);

  useEffect(() => {
    setProviders(ssoManager.getProviders());
  }, []);

  const handleEnableProvider = async (providerId: string) => {
    setIsLoading(true);
    try {
      ssoManager.toggleProvider(providerId, true);
      setProviders(ssoManager.getProviders());
      setSelectedProvider(providerId);
    } catch (error) {
      console.error('Failed to enable provider:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisableProvider = async (providerId: string) => {
    setIsLoading(true);
    try {
      ssoManager.toggleProvider(providerId, false);
      setProviders(ssoManager.getProviders());
      setSelectedProvider(null);
    } catch (error) {
      console.error('Failed to disable provider:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const initiateSSO = async (providerId: string) => {
    try {
      const provider = ssoManager.getProvider(providerId);
      if (!provider) return;

      if (provider.type === 'oauth') {
        const authUrl = await ssoManager.initiateGoogleAuth();
        window.location.href = authUrl;
      } else if (provider.type === 'saml') {
        const samlUrl = await ssoManager.initiateSAML(providerId);
        window.location.href = samlUrl;
      }
    } catch (error) {
      console.error('SSO initiation failed:', error);
    }
  };

  const getStatusColor = (enabled: boolean) => {
    return enabled 
      ? 'bg-green-100 text-green-800 border-green-200' 
      : 'bg-slate-100 text-slate-800 border-slate-200';
  };

  const getStatusText = (enabled: boolean) => {
    return enabled ? 'Enabled' : 'Disabled';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Shield className="h-8 w-8 text-blue-600" />
          <h1 className="text-4xl font-bold text-slate-900">SSO Configuration</h1>
        </div>
        <p className="text-lg text-slate-600 mb-4">
          Configure Single Sign-On for your organization
        </p>
        <div className="flex items-center justify-center gap-4 text-sm text-slate-500">
          <span>🔐 Enterprise-grade security</span>
          <span>•</span>
          <span>👥 Team management</span>
          <span>•</span>
          <span>🔒 Compliance ready</span>
        </div>
      </div>

      {/* SSO Providers */}
      <div className="space-y-6">
        {providers.map((provider) => (
          <Card key={provider.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{provider.icon}</span>
                  <div>
                    <CardTitle className="text-xl">{provider.name}</CardTitle>
                    <CardDescription>{provider.description}</CardDescription>
                  </div>
                </div>
                <Badge className={getStatusColor(provider.isEnabled)}>
                  {getStatusText(provider.isEnabled)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Shield className="h-4 w-4" />
                  {provider.type === 'oauth' ? 'OAuth 2.0' : 'SAML 2.0'}
                </div>
                <div className="flex items-center gap-2">
                  {provider.isEnabled ? (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => initiateSSO(provider.id)}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Test SSO
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDisableProvider(provider.id)}
                        disabled={isLoading}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Configure
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={() => handleEnableProvider(provider.id)}
                      disabled={isLoading}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Enabling...
                        </>
                      ) : (
                        <>
                          <Shield className="h-4 w-4 mr-2" />
                          Enable SSO
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Configuration Guide */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configuration Guide
          </CardTitle>
          <CardDescription>
            Step-by-step instructions for setting up SSO
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Google Workspace Setup</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm text-slate-600">
                <li>Go to Google Cloud Console</li>
                <li>Create OAuth 2.0 credentials</li>
                <li>Add authorized redirect URIs</li>
                <li>Copy Client ID and Secret</li>
                <li>Configure in Rightly settings</li>
              </ol>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">SAML Setup (Okta/Azure)</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm text-slate-600">
                <li>Configure SAML application in your IdP</li>
                <li>Set Entity ID and SSO URL</li>
                <li>Upload certificate</li>
                <li>Configure attribute mapping</li>
                <li>Test SAML connection</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Benefits */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Security Benefits</CardTitle>
            <CardDescription>
              Why SSO improves your security posture
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 border rounded-lg">
                <Shield className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold">Centralized Access</h3>
                <p className="text-sm text-slate-600">
                  Manage all user access from one place
                </p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold">User Provisioning</h3>
                <p className="text-sm text-slate-600">
                  Automatic user creation and deactivation
                </p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <CheckCircle className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <h3 className="font-semibold">Compliance</h3>
                <p className="text-sm text-slate-600">
                  Meet enterprise security requirements
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
