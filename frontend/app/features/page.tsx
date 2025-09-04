import React from 'react'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import Link from 'next/link'
import { Shield, Zap, Users, BarChart, Lock, Globe, CheckCircle, ArrowRight } from "lucide-react";

const features = [
  {
    title: "Automated DSAR Processing",
    description: "Handle data subject access requests automatically with AI-powered processing and response generation.",
    icon: Shield,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    benefits: ["24/7 processing", "Multi-language support", "Legal compliance", "Audit trail"]
  },
  {
    title: "Real-time Compliance Monitoring",
    description: "Monitor your GDPR compliance status in real-time with automated alerts and reporting.",
    icon: BarChart,
    color: "text-green-600",
    bgColor: "bg-green-100",
    benefits: ["Live dashboards", "Risk assessment", "Compliance scoring", "Alert system"]
  },
  {
    title: "Platform Integrations",
    description: "Seamlessly integrate with Shopify, WooCommerce, and other popular e-commerce platforms.",
    icon: Globe,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
    benefits: ["One-click setup", "Data synchronization", "API access", "Custom connectors"]
  },
  {
    title: "Advanced Security",
    description: "Enterprise-grade security with encryption, access controls, and compliance certifications.",
    icon: Lock,
    color: "text-red-600",
    bgColor: "bg-red-100",
    benefits: ["End-to-end encryption", "Role-based access", "SOC 2 certified", "GDPR compliant"]
  },
  {
    title: "Team Collaboration",
    description: "Work together with your team on compliance tasks with shared workspaces and permissions.",
    icon: Users,
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
    benefits: ["Shared workspaces", "Task assignment", "Progress tracking", "Team notifications"]
  },
  {
    title: "Performance Analytics",
    description: "Track and optimize your compliance performance with detailed analytics and insights.",
    icon: Zap,
    color: "text-indigo-600",
    bgColor: "bg-indigo-100",
    benefits: ["Performance metrics", "Trend analysis", "Custom reports", "Export capabilities"]
  }
];

const integrations = [
  { name: "Shopify", status: "Connected", icon: "🛍️" },
  { name: "WooCommerce", status: "Connected", icon: "🛒" },
  { name: "Magento", status: "Available", icon: "🏪" },
  { name: "BigCommerce", status: "Available", icon: "🛍️" },
  { name: "Stripe", status: "Connected", icon: "💳" },
  { name: "PayPal", status: "Available", icon: "💰" }
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <Badge className="mb-4">Features</Badge>
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              Everything You Need for GDPR Compliance
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              From automated DSAR processing to real-time compliance monitoring, Rightly provides all the tools 
              you need to achieve and maintain GDPR compliance.
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg">Start Free Trial</Button>
              <Button variant="outline" size="lg">View Demo</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <div className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 mb-4">{feature.description}</p>
              <ul className="space-y-2">
                {feature.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </div>

      {/* Integrations Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Seamless Integrations</h2>
            <p className="text-lg text-gray-600">
              Connect with your existing tools and platforms for a unified compliance experience.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {integrations.map((integration, index) => (
              <Card key={index} className="text-center p-4">
                <div className="text-3xl mb-2">{integration.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-1">{integration.name}</h3>
                <Badge className={integration.status === "Connected" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                  {integration.status}
                </Badge>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Comparison Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Rightly Stands Out</h2>
          <p className="text-lg text-gray-600">
            Compare how Rightly's comprehensive approach to GDPR compliance outperforms traditional solutions.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Traditional Approach</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-gray-600">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                Manual DSAR processing (weeks)
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                Limited platform support
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                No real-time monitoring
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                Expensive legal consultations
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                Risk of non-compliance
              </li>
            </ul>
          </Card>
          <Card className="p-6 border-blue-200 bg-blue-50">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Rightly Solution</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Automated DSAR processing (hours)
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Multi-platform integrations
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Real-time compliance monitoring
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Built-in legal compliance
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Guaranteed compliance
              </li>
            </ul>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Experience the Difference?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of businesses that trust Rightly for their GDPR compliance needs.
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="secondary" size="lg" className="group">
              Start Free Trial
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" size="lg" className="text-white border-white hover:bg-white hover:text-blue-600">
              Schedule Demo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
