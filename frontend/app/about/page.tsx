import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Shield, Users, Zap, Globe, Award, CheckCircle } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <Badge className="mb-4">About Rightly</Badge>
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              Enterprise-Grade GDPR Compliance Platform
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Rightly helps businesses of all sizes achieve and maintain GDPR compliance through automated DSAR management, 
              comprehensive audit trails, and seamless integrations with popular e-commerce platforms.
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg">Start Free Trial</Button>
              <Button variant="outline" size="lg">Schedule Demo</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <Card className="text-center p-6">
            <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">500+</h3>
            <p className="text-gray-600">Active Companies</p>
          </Card>
          <Card className="text-center p-6">
            <Shield className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">99.9%</h3>
            <p className="text-gray-600">Compliance Rate</p>
          </Card>
          <Card className="text-center p-6">
            <Zap className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">24/7</h3>
            <p className="text-gray-600">Support Available</p>
          </Card>
          <Card className="text-center p-6">
            <Globe className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">50+</h3>
            <p className="text-gray-600">Countries Served</p>
          </Card>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-lg text-gray-600 mb-6">
              We believe that privacy is a fundamental human right. Our mission is to make GDPR compliance 
              accessible, affordable, and automated for businesses of all sizes.
            </p>
            <p className="text-lg text-gray-600 mb-8">
              By providing enterprise-grade tools with simple interfaces, we help companies protect their 
              customers' data while building trust and maintaining operational efficiency.
            </p>
            <div className="flex gap-4">
              <Button>Learn More</Button>
              <Button variant="outline">Contact Sales</Button>
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-2xl">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Why Choose Rightly?</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-gray-700">Automated DSAR processing</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-gray-700">Real-time compliance monitoring</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-gray-700">Seamless platform integrations</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-gray-700">Comprehensive audit trails</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-gray-700">Expert support team</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Leadership Team</h2>
          <p className="text-lg text-gray-600">Meet the experts behind Rightly's success</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="text-center p-6">
            <div className="w-20 h-20 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Users className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Sarah Johnson</h3>
            <p className="text-blue-600 mb-2">CEO & Founder</p>
            <p className="text-gray-600 text-sm">
              Former privacy officer at Fortune 500 companies with 15+ years of GDPR expertise.
            </p>
          </Card>
          <Card className="text-center p-6">
            <div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Shield className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Michael Chen</h3>
            <p className="text-green-600 mb-2">CTO</p>
            <p className="text-gray-600 text-sm">
              Security expert with experience building scalable compliance platforms.
            </p>
          </Card>
          <Card className="text-center p-6">
            <div className="w-20 h-20 bg-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Award className="w-10 h-10 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Emma Rodriguez</h3>
            <p className="text-purple-600 mb-2">Head of Compliance</p>
            <p className="text-gray-600 text-sm">
              Certified GDPR practitioner with deep knowledge of EU privacy regulations.
            </p>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join hundreds of companies already using Rightly for GDPR compliance.
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="secondary" size="lg">Start Free Trial</Button>
            <Button variant="outline" size="lg" className="text-white border-white hover:bg-white hover:text-blue-600">
              Schedule Demo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
