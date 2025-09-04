// components/ConnectorStore.tsx
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Store, 
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
  Globe
} from "lucide-react";

interface Connector {
  id: string;
  name: string;
  description: string;
  author: string;
  category: string;
  downloads: number;
  rating: number;
  price: 'free' | 'paid';
  status: 'official' | 'community' | 'beta';
  lastUpdated: string;
  version: string;
  tags: string[];
}

export default function ConnectorStore() {
  const [connectors, setConnectors] = useState<Connector[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const sampleConnectors: Connector[] = [
    {
      id: '1',
      name: 'Shopify Advanced',
      description: 'Advanced Shopify integration with inventory sync and order management',
      author: 'Rightly Team',
      category: 'E-commerce',
      downloads: 1247,
      rating: 4.8,
      price: 'free',
      status: 'official',
      lastUpdated: '2024-01-15',
      version: '2.1.0',
      tags: ['shopify', 'ecommerce', 'inventory']
    },
    {
      id: '2',
      name: 'Slack Notifications',
      description: 'Real-time Slack notifications for DSAR updates and alerts',
      author: 'Community',
      category: 'Communication',
      downloads: 892,
      rating: 4.6,
      price: 'free',
      status: 'community',
      lastUpdated: '2024-01-14',
      version: '1.5.2',
      tags: ['slack', 'notifications', 'alerts']
    },
    {
      id: '3',
      name: 'Google Analytics Pro',
      description: 'Advanced Google Analytics integration with custom event tracking',
      author: 'DataFlow Inc',
      category: 'Analytics',
      downloads: 567,
      rating: 4.9,
      price: 'paid',
      status: 'community',
      lastUpdated: '2024-01-13',
      version: '3.0.1',
      tags: ['analytics', 'google', 'tracking']
    },
    {
      id: '4',
      name: 'Microsoft Teams',
      description: 'Microsoft Teams integration for team collaboration and notifications',
      author: 'Rightly Team',
      category: 'Communication',
      downloads: 423,
      rating: 4.7,
      price: 'free',
      status: 'official',
      lastUpdated: '2024-01-12',
      version: '1.2.0',
      tags: ['teams', 'microsoft', 'collaboration']
    },
    {
      id: '5',
      name: 'HubSpot CRM',
      description: 'HubSpot CRM integration for customer data management',
      author: 'CRM Solutions',
      category: 'CRM',
      downloads: 678,
      rating: 4.5,
      price: 'paid',
      status: 'community',
      lastUpdated: '2024-01-11',
      version: '2.0.0',
      tags: ['hubspot', 'crm', 'customers']
    },
    {
      id: '6',
      name: 'Zapier Bridge',
      description: 'Connect Rightly with 5000+ apps via Zapier',
      author: 'Rightly Team',
      category: 'Integration',
      downloads: 2341,
      rating: 4.9,
      price: 'free',
      status: 'official',
      lastUpdated: '2024-01-10',
      version: '1.8.3',
      tags: ['zapier', 'automation', 'workflow']
    }
  ];

  const categories = [
    { id: 'all', name: 'All Categories', icon: Store },
    { id: 'E-commerce', name: 'E-commerce', icon: ShoppingCart },
    { id: 'Communication', name: 'Communication', icon: MessageSquare },
    { id: 'Analytics', name: 'Analytics', icon: BarChart3 },
    { id: 'CRM', name: 'CRM', icon: Users },
    { id: 'Integration', name: 'Integration', icon: Zap }
  ];

  useEffect(() => {
    setConnectors(sampleConnectors);
  }, []);

  const filteredConnectors = connectors.filter(connector => {
    const matchesCategory = selectedCategory === 'all' || connector.category === selectedCategory;
    const matchesSearch = connector.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         connector.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         connector.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'official':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'community':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'beta':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getPriceColor = (price: string) => {
    return price === 'free' 
      ? 'bg-green-100 text-green-800 border-green-200'
      : 'bg-purple-100 text-purple-800 border-purple-200';
  };

  const installConnector = (connectorId: string) => {
    // Simulate installation
    console.log(`Installing connector: ${connectorId}`);
    alert('Connector installed successfully!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Store className="h-8 w-8 text-blue-600" />
          <h1 className="text-4xl font-bold text-slate-900">Connector Store</h1>
        </div>
        <p className="text-lg text-slate-600 mb-4">
          Extend Rightly's capabilities with powerful integrations
        </p>
        <div className="flex items-center justify-center gap-4 text-sm text-slate-500">
          <span>🔌 50+ connectors available</span>
          <span>•</span>
          <span>🚀 Easy one-click installation</span>
          <span>•</span>
          <span>💡 Community-driven ecosystem</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Store className="h-8 w-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-slate-900">{connectors.length}</div>
                <div className="text-sm text-slate-600">Total Connectors</div>
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
                  {connectors.reduce((sum, c) => sum + c.downloads, 0)}
                </div>
                <div className="text-sm text-slate-600">Total Downloads</div>
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
                  {connectors.filter(c => c.status === 'community').length}
                </div>
                <div className="text-sm text-slate-600">Community Connectors</div>
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
                  {(connectors.reduce((sum, c) => sum + c.rating, 0) / connectors.length).toFixed(1)}
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
              placeholder="Search connectors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex gap-2">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                  size="sm"
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {category.name}
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Connectors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredConnectors.map((connector) => (
          <Card key={connector.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{connector.name}</CardTitle>
                  <CardDescription className="mt-2">
                    {connector.description}
                  </CardDescription>
                </div>
                <div className="flex flex-col gap-2">
                  <Badge className={getStatusColor(connector.status)}>
                    {connector.status}
                  </Badge>
                  <Badge className={getPriceColor(connector.price)}>
                    {connector.price === 'free' ? 'Free' : 'Paid'}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Author and Version */}
                <div className="flex items-center justify-between text-sm text-slate-500">
                  <span>by {connector.author}</span>
                  <span>v{connector.version}</span>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Download className="h-3 w-3" />
                    {connector.downloads}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    {connector.rating}
                  </div>
                  <div className="text-slate-500">
                    {new Date(connector.lastUpdated).toLocaleDateString()}
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {connector.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {connector.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{connector.tags.length - 3}
                    </Badge>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => installConnector(connector.id)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    size="sm"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Install
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`/connectors/${connector.id}`, '_blank')}
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
      {filteredConnectors.length === 0 && (
        <Card>
          <CardContent className="pt-12 pb-12">
            <div className="text-center">
              <Store className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No connectors found</h3>
              <p className="text-slate-600 mb-6">
                Try adjusting your search or filter criteria
              </p>
              <Button onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}>
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Developer Section */}
      <Card className="mt-12">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Build Your Own Connector
          </CardTitle>
          <CardDescription>
            Create and publish connectors to the Rightly ecosystem
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 border rounded-lg">
              <Code className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold mb-2">Developer SDK</h3>
              <p className="text-sm text-slate-600 mb-3">
                Access our SDK and documentation
              </p>
              <Button variant="outline" size="sm">
                Get Started
              </Button>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Globe className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold mb-2">Publish Connector</h3>
              <p className="text-sm text-slate-600 mb-3">
                Submit your connector to the store
              </p>
              <Button variant="outline" size="sm">
                Submit
              </Button>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-semibold mb-2">Revenue Sharing</h3>
              <p className="text-sm text-slate-600 mb-3">
                Earn from your connector sales
              </p>
              <Button variant="outline" size="sm">
                Learn More
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
