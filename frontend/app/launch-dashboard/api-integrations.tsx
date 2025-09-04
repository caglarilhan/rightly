import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Link,
  Settings,
  CheckCircle,
  AlertTriangle,
  Clock,
  RefreshCw,
  Zap,
  BarChart3,
  DollarSign,
  Users,
  Mail,
  MessageSquare
} from "lucide-react";

interface Integration {
  name: string;
  status: "connected" | "pending" | "disconnected";
  icon: React.ReactNode;
  description: string;
  lastSync: string;
  dataPoints: string[];
}

const APIIntegrations = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      name: "Google Analytics",
      status: "connected",
      icon: <BarChart3 className="w-6 h-6 text-blue-600" />,
      description: "Track website traffic and user behavior",
      lastSync: "2 minutes ago",
      dataPoints: ["Real-time visitors", "Page views", "Bounce rate", "Conversion tracking"]
    },
    {
      name: "Stripe",
      status: "connected",
      icon: <DollarSign className="w-6 h-6 text-green-600" />,
      description: "Monitor revenue and subscription metrics",
      lastSync: "1 minute ago",
      dataPoints: ["MRR", "Revenue", "Subscriptions", "Churn rate"]
    },
    {
      name: "Product Hunt",
      status: "connected",
      icon: <MessageSquare className="w-6 h-6 text-orange-600" />,
      description: "Track Product Hunt performance",
      lastSync: "30 seconds ago",
      dataPoints: ["Upvotes", "Comments", "Ranking", "Engagement"]
    },
    {
      name: "LinkedIn",
      status: "pending",
      icon: <Users className="w-6 h-6 text-blue-600" />,
      description: "Monitor LinkedIn post performance",
      lastSync: "Never",
      dataPoints: ["Post views", "Engagement", "Profile visits", "Connection requests"]
    },
    {
      name: "Email Service",
      status: "connected",
      icon: <Mail className="w-6 h-6 text-purple-600" />,
      description: "Track email campaign metrics",
      lastSync: "5 minutes ago",
      dataPoints: ["Open rate", "Click rate", "Bounce rate", "Unsubscribe rate"]
    },
    {
      name: "Slack",
      status: "disconnected",
      icon: <MessageSquare className="w-6 h-6 text-purple-600" />,
      description: "Send alerts and notifications",
      lastSync: "Never",
      dataPoints: ["Alert notifications", "Status updates", "Team collaboration"]
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "disconnected": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected": return <CheckCircle className="w-4 h-4" />;
      case "pending": return <Clock className="w-4 h-4" />;
      case "disconnected": return <AlertTriangle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const connectIntegration = (index: number) => {
    const newIntegrations = [...integrations];
    newIntegrations[index].status = "connected";
    newIntegrations[index].lastSync = "Just now";
    setIntegrations(newIntegrations);
  };

  const disconnectIntegration = (index: number) => {
    const newIntegrations = [...integrations];
    newIntegrations[index].status = "disconnected";
    newIntegrations[index].lastSync = "Never";
    setIntegrations(newIntegrations);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Zap className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold">API Integrations</h2>
        </div>
        <Button variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Sync All
        </Button>
      </div>

      {/* Integration Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((integration, index) => (
          <Card key={integration.name} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {integration.icon}
                <div>
                  <h3 className="font-semibold">{integration.name}</h3>
                  <p className="text-sm text-gray-600">{integration.description}</p>
                </div>
              </div>
              <Badge className={`text-xs ${getStatusColor(integration.status)}`}>
                {getStatusIcon(integration.status)}
                {integration.status}
              </Badge>
            </div>

            <div className="space-y-3 mb-4">
              <div className="text-xs text-gray-500">
                Last sync: {integration.lastSync}
              </div>
              
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-700">Data Points:</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  {integration.dataPoints.map((point, pointIndex) => (
                    <li key={pointIndex} className="flex items-center gap-1">
                      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex gap-2">
              {integration.status === "connected" ? (
                <>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Settings className="w-3 h-3 mr-1" />
                    Configure
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => disconnectIntegration(index)}
                  >
                    Disconnect
                  </Button>
                </>
              ) : (
                <Button 
                  className="flex-1"
                  onClick={() => connectIntegration(index)}
                >
                  Connect {integration.name}
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Integration Status Summary */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Integration Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {integrations.filter(i => i.status === "connected").length}
            </div>
            <div className="text-sm text-green-600">Connected</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">
              {integrations.filter(i => i.status === "pending").length}
            </div>
            <div className="text-sm text-yellow-600">Pending</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">
              {integrations.filter(i => i.status === "disconnected").length}
            </div>
            <div className="text-sm text-red-600">Disconnected</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default APIIntegrations;
