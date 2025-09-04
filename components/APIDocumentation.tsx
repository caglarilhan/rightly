// components/APIDocumentation.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Code, 
  BookOpen, 
  Download, 
  Copy, 
  Play,
  Terminal,
  FileText,
  Globe,
  Shield,
  Zap,
  ExternalLink,
  CheckCircle,
  AlertCircle
} from "lucide-react";

interface APIEndpoint {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  category: string;
  status: 'stable' | 'beta' | 'deprecated';
  auth: 'required' | 'optional' | 'none';
  rateLimit: string;
}

interface CodeExample {
  language: string;
  code: string;
  description: string;
}

export default function APIDocumentation() {
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('curl');

  const endpoints: APIEndpoint[] = [
    {
      id: '1',
      method: 'GET',
      path: '/api/v1/dsar',
      description: 'Retrieve DSAR requests',
      category: 'DSAR',
      status: 'stable',
      auth: 'required',
      rateLimit: '1000/hour'
    },
    {
      id: '2',
      method: 'POST',
      path: '/api/v1/dsar',
      description: 'Create a new DSAR request',
      category: 'DSAR',
      status: 'stable',
      auth: 'required',
      rateLimit: '100/hour'
    },
    {
      id: '3',
      method: 'GET',
      path: '/api/v1/dsar/{id}',
      description: 'Get specific DSAR request',
      category: 'DSAR',
      status: 'stable',
      auth: 'required',
      rateLimit: '1000/hour'
    },
    {
      id: '4',
      method: 'PUT',
      path: '/api/v1/dsar/{id}',
      description: 'Update DSAR request status',
      category: 'DSAR',
      status: 'stable',
      auth: 'required',
      rateLimit: '500/hour'
    },
    {
      id: '5',
      method: 'GET',
      path: '/api/v1/analytics',
      description: 'Get analytics data',
      category: 'Analytics',
      status: 'beta',
      auth: 'required',
      rateLimit: '200/hour'
    },
    {
      id: '6',
      method: 'POST',
      path: '/api/v1/webhooks',
      description: 'Configure webhooks',
      category: 'Webhooks',
      status: 'stable',
      auth: 'required',
      rateLimit: '50/hour'
    }
  ];

  const codeExamples: Record<string, CodeExample[]> = {
    'curl': [
      {
        language: 'curl',
        code: `curl -X GET "https://api.rightly.com/api/v1/dsar" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`,
        description: 'Basic GET request with authentication'
      },
      {
        language: 'curl',
        code: `curl -X POST "https://api.rightly.com/api/v1/dsar" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "requestor_email": "user@example.com",
    "request_type": "access",
    "data_sources": ["database", "analytics"]
  }'`,
        description: 'Create a new DSAR request'
      }
    ],
    'javascript': [
      {
        language: 'javascript',
        code: `const response = await fetch('https://api.rightly.com/api/v1/dsar', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
console.log(data);`,
        description: 'JavaScript fetch example'
      },
      {
        language: 'javascript',
        code: `const dsarRequest = {
  requestor_email: 'user@example.com',
  request_type: 'access',
  data_sources: ['database', 'analytics']
};

const response = await fetch('https://api.rightly.com/api/v1/dsar', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(dsarRequest)
});`,
        description: 'Create DSAR with JavaScript'
      }
    ],
    'python': [
      {
        language: 'python',
        code: `import requests

headers = {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
}

response = requests.get('https://api.rightly.com/api/v1/dsar', headers=headers)
data = response.json()
print(data)`,
        description: 'Python requests example'
      },
      {
        language: 'python',
        code: `import requests

dsar_data = {
    'requestor_email': 'user@example.com',
    'request_type': 'access',
    'data_sources': ['database', 'analytics']
}

headers = {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
}

response = requests.post('https://api.rightly.com/api/v1/dsar', 
                       json=dsar_data, headers=headers)
print(response.json())`,
        description: 'Create DSAR with Python'
      }
    ]
  };

  const categories = ['All', 'DSAR', 'Analytics', 'Webhooks', 'Authentication'];

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'POST':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'PUT':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'DELETE':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'stable':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'beta':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'deprecated':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Show success message
  };

  const testEndpoint = (endpoint: APIEndpoint) => {
    // Simulate API test
    console.log(`Testing endpoint: ${endpoint.method} ${endpoint.path}`);
    alert('API test initiated! Check console for results.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Code className="h-8 w-8 text-blue-600" />
          <h1 className="text-4xl font-bold text-slate-900">API Documentation</h1>
        </div>
        <p className="text-lg text-slate-600 mb-4">
          Integrate Rightly into your applications with our comprehensive API
        </p>
        <div className="flex items-center justify-center gap-4 text-sm text-slate-500">
          <span>🔑 RESTful API</span>
          <span>•</span>
          <span>📚 Comprehensive docs</span>
          <span>•</span>
          <span>🚀 SDKs available</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Code className="h-8 w-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-slate-900">{endpoints.length}</div>
                <div className="text-sm text-slate-600">API Endpoints</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-slate-900">99.9%</div>
                <div className="text-sm text-slate-600">Uptime</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Zap className="h-8 w-8 text-yellow-600" />
              <div>
                <div className="text-2xl font-bold text-slate-900">&lt;100ms</div>
                <div className="text-sm text-slate-600">Avg Response</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Globe className="h-8 w-8 text-purple-600" />
              <div>
                <div className="text-2xl font-bold text-slate-900">3</div>
                <div className="text-sm text-slate-600">SDKs Available</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* API Endpoints */}
      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Terminal className="h-5 w-5" />
              API Endpoints
            </CardTitle>
            <CardDescription>
              All available API endpoints with authentication and rate limiting details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {endpoints.map((endpoint) => (
                <div
                  key={endpoint.id}
                  className="p-4 border rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                  onClick={() => setSelectedEndpoint(endpoint.id)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Badge className={getMethodColor(endpoint.method)}>
                        {endpoint.method}
                      </Badge>
                      <code className="text-sm font-mono text-slate-700">
                        {endpoint.path}
                      </code>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(endpoint.status)}>
                        {endpoint.status}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          testEndpoint(endpoint);
                        }}
                      >
                        <Play className="h-3 w-3 mr-1" />
                        Test
                      </Button>
                    </div>
                  </div>
                  
                  <p className="text-slate-700 mb-3">
                    {endpoint.description}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-slate-600">
                    <span>Auth: {endpoint.auth}</span>
                    <span>Rate Limit: {endpoint.rateLimit}</span>
                    <span>Category: {endpoint.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Code Examples */}
      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Code Examples
            </CardTitle>
            <CardDescription>
              Get started quickly with code examples in multiple languages
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Language Tabs */}
            <div className="flex gap-2 mb-6">
              {Object.keys(codeExamples).map((language) => (
                <Button
                  key={language}
                  variant={selectedLanguage === language ? "default" : "outline"}
                  onClick={() => setSelectedLanguage(language)}
                  size="sm"
                >
                  {language.toUpperCase()}
                </Button>
              ))}
            </div>

            {/* Code Examples */}
            <div className="space-y-6">
              {codeExamples[selectedLanguage]?.map((example, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-900">
                      {example.description}
                    </h3>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(example.code)}
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </Button>
                  </div>
                  <div className="bg-slate-900 text-slate-100 p-4 rounded-lg">
                    <pre className="text-sm overflow-x-auto">
                      <code>{example.code}</code>
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SDKs and Libraries */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              JavaScript SDK
            </CardTitle>
            <CardDescription>
              Official JavaScript/Node.js SDK
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">TypeScript support</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">Promise-based API</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">Error handling</span>
              </div>
              <Button className="w-full" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Install SDK
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              Python SDK
            </CardTitle>
            <CardDescription>
              Official Python SDK
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">Async support</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">Type hints</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">Pandas integration</span>
              </div>
              <Button className="w-full" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Install SDK
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              Go SDK
            </CardTitle>
            <CardDescription>
              Official Go SDK
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">Context support</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">Goroutines</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">High performance</span>
              </div>
              <Button className="w-full" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Install SDK
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Getting Started */}
      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
          <CardDescription>
            Quick setup guide for integrating with Rightly API
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold">Get Your API Key</h3>
                <p className="text-sm text-slate-600">
                  Sign up for a Rightly account and generate your API key from the dashboard.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold">Install SDK</h3>
                <p className="text-sm text-slate-600">
                  Choose your preferred language and install the official SDK.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold">Make Your First Request</h3>
                <p className="text-sm text-slate-600">
                  Use the code examples above to make your first API call.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
