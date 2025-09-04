// components/APIMarketplace.tsx
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Globe, 
  Code, 
  Download, 
  Star, 
  Users, 
  TrendingUp,
  Plus,
  Settings,
  ExternalLink,
  Zap,
  Shield,
  DollarSign,
  Lock,
  Unlock,
  BarChart3,
  FileText,
  Target
} from "lucide-react";

interface APIService {
  id: string;
  name: string;
  description: string;
  provider: string;
  category: string;
  usage: number;
  rating: number;
  price: 'free' | 'paid' | 'enterprise';
  status: 'public' | 'private' | 'beta';
  lastUpdated: string;
  version: string;
  tags: string[];
  endpoints: number;
  documentation: string;
}

export default function APIMarketplace() {
  const [apis, setApis] = useState<APIService[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceFilter, setPriceFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);

  const sampleAPIs: APIService[] = [
    {
      id: '1',
      name: 'GDPR Compliance API',
      description: 'Complete GDPR compliance automation with data discovery and DSAR processing',
      provider: 'Rightly',
      category: 'Compliance',
      usage: 15420,
      rating: 4.9,
      price: 'free',
      status: 'public',
      lastUpdated: '2024-01-15',
      version: '2.1.0',
      tags: ['gdpr', 'compliance', 'dsar', 'automation'],
      endpoints: 25,
      documentation: 'https://docs.rightly.com/gdpr-api'
    },
    {
      id: '2',
      name: 'Data Discovery Engine',
      description: 'AI-powered data discovery and classification across multiple data sources',
      provider: 'DataFlow Inc',
      category: 'Analytics',
      usage: 8920,
      rating: 4.7,
      price: 'paid',
      status: 'public',
      lastUpdated: '2024-01-14',
      version: '1.8.2',
      tags: ['ai', 'discovery', 'classification', 'ml'],
      endpoints: 18,
      documentation: 'https://docs.dataflow.com/discovery'
    },
    {
      id: '3',
      name: 'Privacy Impact Assessment',
      description: 'Automated PIA generation and risk assessment for data processing activities',
      provider: 'PrivacyGuard',
      category: 'Assessment',
      usage: 5670,
      rating: 4.6,
      price: 'paid',
      status: 'public',
      lastUpdated: '2024-01-13',
      version: '3.0.1',
      tags: ['pia', 'assessment', 'risk', 'automation'],
      endpoints: 12,
      documentation: 'https://docs.privacyguard.com/pia'
    },
    {
      id: '4',
      name: 'Consent Management',
      description: 'Comprehensive consent collection and management system',
      provider: 'ConsentHub',
      category: 'Consent',
      usage: 12340,
      rating: 4.8,
      price: 'free',
      status: 'public',
      lastUpdated: '2024-01-12',
      version: '2.5.0',
      tags: ['consent', 'management', 'collection'],
      endpoints: 15,
      documentation: 'https://docs.consenthub.com/consent'
    },
    {
      id: '5',
      name: 'Data Breach Notification',
      description: 'Automated breach detection and regulatory notification system',
      provider: 'BreachAlert',
      category: 'Security',
      usage: 3450,
      rating: 4.5,
      price: 'enterprise',
      status: 'private',
      lastUpdated: '2024-01-11',
      version: '1.2.0',
      tags: ['breach', 'notification', 'security'],
      endpoints: 8,
      documentation: 'https://docs.breachalert.com/notification'
    },
    {
      id: '6',
      name: 'Data Retention Policy',
      description: 'Automated data retention and deletion policy enforcement',
      provider: 'RetentionPro',
      category: 'Retention',
      usage: 7890,
      rating: 4.7,
      price: 'paid',
      status: 'public',
      lastUpdated: '2024-01-10',
      version: '1.6.3',
      tags: ['retention', 'deletion', 'policy'],
      endpoints: 20,
      documentation: 'https://docs.retentionpro.com/policy'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Categories', icon: Globe },
    { id: 'Compliance', name: 'Compliance', icon: Shield },
    { id: 'Analytics', name: 'Analytics', icon: TrendingUp },
    { id: 'Assessment', name: 'Assessment', icon: Code },
    { id: 'Consent', name: 'Consent', icon: Users },
    { id: 'Security', name: 'Security', icon: Lock },
    { id: 'Retention', name: 'Retention', icon: Zap }
  ];

  useEffect(() => {
    setApis(sampleAPIs);
  }, []);

  const filteredAPIs = apis.filter(api => {
    const matchesCategory = selectedCategory === 'all' || api.category === selectedCategory;
    const matchesSearch = api.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         api.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         api.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesPrice = priceFilter === 'all' || api.price === priceFilter;
    return matchesCategory && matchesSearch && matchesPrice;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'public':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'private':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'beta':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getPriceColor = (price: string) => {
    switch (price) {
      case 'free':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'paid':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'enterprise':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const subscribeToAPI = (apiId: string) => {
    setIsLoading(true);
    console.log(`Subscribing to API: ${apiId}`);
    setTimeout(() => {
      alert('API subscription initiated!');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 dark:bg-slate-900">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Globe className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">API Marketplace</h1>
        </div>
        <p className="text-lg text-slate-600 dark:text-slate-300 mb-4">
          Discover and integrate powerful privacy and compliance APIs
        </p>
        <div className="flex items-center justify-center gap-4 text-sm text-slate-500 dark:text-slate-400">
          <span>🔌 100+ APIs available</span>
          <span>•</span>
          <span>🚀 One-click integration</span>
          <span>•</span>
          <span>💡 Revenue sharing</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Globe className="h-8 w-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-slate-900">{apis.length}</div>
                <div className="text-sm text-slate-600">Total APIs</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Download className="h-8 w-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-slate-900">
                  {apis.reduce((sum, api) => sum + api.usage, 0)}
                </div>
                <div className="text-sm text-slate-600">Total Usage</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-purple-600" />
              <div>
                <div className="text-2xl font-bold text-slate-900">
                  {apis.filter(api => api.status === 'public').length}
                </div>
                <div className="text-sm text-slate-600">Public APIs</div>
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
                  {(apis.reduce((sum, api) => sum + api.rating, 0) / apis.length).toFixed(1)}
                </div>
                <div className="text-sm text-slate-600">Average Rating</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search APIs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
              aria-label="Search APIs"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                  size="sm"
                  aria-label={`Filter by ${category.name}`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {category.name}
                </Button>
              );
            })}
          </div>
        </div>
        
        {/* Price Filter */}
        <div className="flex flex-wrap gap-2 mt-4">
          <Button
            variant={priceFilter === 'all' ? "default" : "outline"}
            onClick={() => setPriceFilter('all')}
            size="sm"
            aria-label="Show all prices"
          >
            All Prices
          </Button>
          <Button
            variant={priceFilter === 'free' ? "default" : "outline"}
            onClick={() => setPriceFilter('free')}
            size="sm"
            aria-label="Show free APIs"
          >
            <DollarSign className="h-4 w-4 mr-2" />
            Free
          </Button>
          <Button
            variant={priceFilter === 'paid' ? "default" : "outline"}
            onClick={() => setPriceFilter('paid')}
            size="sm"
            aria-label="Show paid APIs"
          >
            <DollarSign className="h-4 w-4 mr-2" />
            Paid
          </Button>
          <Button
            variant={priceFilter === 'enterprise' ? "default" : "outline"}
            onClick={() => setPriceFilter('enterprise')}
            size="sm"
            aria-label="Show enterprise APIs"
          >
            <DollarSign className="h-4 w-4 mr-2" />
            Enterprise
          </Button>
        </div>
      </div>

      {/* APIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAPIs.map((api) => (
          <Card key={api.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{api.name}</CardTitle>
                  <CardDescription className="mt-2">
                    {api.description}
                  </CardDescription>
                </div>
                <div className="flex flex-col gap-2">
                  <Badge className={getStatusColor(api.status)}>
                    {api.status}
                  </Badge>
                  <Badge className={getPriceColor(api.price)}>
                    {api.price === 'free' ? 'Free' : api.price === 'paid' ? 'Paid' : 'Enterprise'}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Provider and Version */}
                <div className="flex items-center justify-between text-sm text-slate-500">
                  <span>by {api.provider}</span>
                  <span>v{api.version}</span>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Download className="h-3 w-3" />
                    {api.usage}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    {api.rating}
                  </div>
                  <div className="flex items-center gap-1">
                    <Code className="h-3 w-3" />
                    {api.endpoints}
                  </div>
                  <div className="text-slate-500">
                    {new Date(api.lastUpdated).toLocaleDateString()}
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {api.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {api.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{api.tags.length - 3}
                    </Badge>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => subscribeToAPI(api.id)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    size="sm"
                    disabled={isLoading}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {isLoading ? 'Subscribing...' : 'Subscribe'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(api.documentation, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredAPIs.length === 0 && (
        <Card>
          <CardContent className="pt-12 pb-12">
            <div className="text-center">
              <Globe className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No APIs found</h3>
              <p className="text-slate-600 mb-6">
                Try adjusting your search or filter criteria
              </p>
              <Button onClick={() => { 
                setSearchQuery(''); 
                setSelectedCategory('all'); 
                setPriceFilter('all');
              }}>
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Publish Your API */}
      <Card className="mt-12">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Publish Your API
          </CardTitle>
          <CardDescription>
            Share your API with the community and earn revenue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 border rounded-lg">
              <Code className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold mb-2">Easy Publishing</h3>
              <p className="text-sm text-slate-600 mb-3">
                Publish your API with our simple submission process
              </p>
              <Button variant="outline" size="sm">
                Submit API
              </Button>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold mb-2">Revenue Sharing</h3>
              <p className="text-sm text-slate-600 mb-3">
                Earn 70% of revenue from your API subscriptions
              </p>
              <Button variant="outline" size="sm">
                Learn More
              </Button>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-semibold mb-2">Analytics</h3>
              <p className="text-sm text-slate-600 mb-3">
                Track usage, revenue, and performance metrics
              </p>
              <Button variant="outline" size="sm">
                View Analytics
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
