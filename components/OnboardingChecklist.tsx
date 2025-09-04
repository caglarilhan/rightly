"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  Circle, 
  ArrowRight, 
  Sparkles, 
  Database, 
  FileText,
  Trophy,
  X
} from "lucide-react";
import { useRouter } from "next/navigation";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  action: () => void;
  isCompleted: boolean;
  isOptional?: boolean;
}

interface OnboardingChecklistProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export default function OnboardingChecklist({ 
  isOpen, 
  onClose, 
  onComplete 
}: OnboardingChecklistProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const router = useRouter();

  const steps: OnboardingStep[] = [
    {
      id: "account",
      title: "Complete Your Profile",
      description: "Add your company details and preferences",
      icon: Sparkles,
      action: () => router.push("/settings/profile"),
      isCompleted: false
    },
    {
      id: "connect",
      title: "Connect Your First Data Source",
      description: "Link Shopify, Google Drive, or upload sample data",
      icon: Database,
      action: () => router.push("/connectors"),
      isCompleted: false
    },
    {
      id: "test",
      title: "Run Your First DSAR Test",
      description: "Test the data discovery and export process",
      icon: FileText,
      action: () => router.push("/requests/new"),
      isCompleted: false
    },
    {
      id: "report",
      title: "Download Sample Report",
      description: "See how your compliance reports will look",
      icon: Trophy,
      action: () => router.push("/compliance-reports"),
      isCompleted: false
    }
  ];

  useEffect(() => {
    // Check localStorage for completed steps
    const saved = localStorage.getItem("onboarding-completed");
    if (saved) {
      setCompletedSteps(JSON.parse(saved));
    }
  }, []);

  const handleStepComplete = (stepId: string) => {
    const newCompleted = [...completedSteps, stepId];
    setCompletedSteps(newCompleted);
    localStorage.setItem("onboarding-completed", JSON.stringify(newCompleted));
    
    // Move to next step
    const currentIndex = steps.findIndex(s => s.id === stepId);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(currentIndex + 1);
    } else {
      // All steps completed
      onComplete();
    }
  };

  const handleSkip = () => {
    onClose();
  };

  const progress = (completedSteps.length / steps.length) * 100;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl mx-4 shadow-2xl">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSkip}
            className="absolute right-4 top-4"
          >
            <X className="h-4 w-4" />
          </Button>
          <CardTitle className="text-center text-2xl">
            Welcome to Rightly! 🎉
          </CardTitle>
          <CardDescription className="text-center">
            Let's get you set up in just a few minutes
          </CardDescription>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">
                Setup Progress
              </span>
              <span className="text-sm text-slate-500">
                {completedSteps.length} of {steps.length} completed
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = completedSteps.includes(step.id);
            const isCurrent = index === currentStep;
            
            return (
              <div
                key={step.id}
                className={`
                  p-4 rounded-lg border transition-all duration-200
                  ${isCompleted 
                    ? 'bg-green-50 border-green-200' 
                    : isCurrent 
                    ? 'bg-blue-50 border-blue-200 shadow-sm' 
                    : 'bg-slate-50 border-slate-200'
                  }
                `}
              >
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    {isCompleted ? (
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    ) : (
                      <Circle className="h-6 w-6 text-slate-400" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="h-4 w-4 text-slate-600" />
                      <h3 className="font-semibold text-slate-900">
                        {step.title}
                      </h3>
                      {isCompleted && (
                        <Badge variant="secondary" className="text-xs">
                          Completed
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 mb-3">
                      {step.description}
                    </p>
                    
                    {!isCompleted && isCurrent && (
                      <Button
                        onClick={() => {
                          step.action();
                          handleStepComplete(step.id);
                        }}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {step.id === "connect" ? "Connect Data Source" :
                         step.id === "test" ? "Start Test" :
                         step.id === "report" ? "View Reports" :
                         "Get Started"}
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          
          {/* Completion Message */}
          {completedSteps.length === steps.length && (
            <div className="text-center py-6">
              <Trophy className="h-12 w-12 text-yellow-500 mx-auto mb-3" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                You're All Set! 🎉
              </h3>
              <p className="text-slate-600 mb-4">
                You've completed the setup process. Start exploring Rightly's features!
              </p>
              <Button onClick={onClose} className="bg-green-600 hover:bg-green-700">
                Continue to Dashboard
              </Button>
            </div>
          )}
          
          {/* Skip Option */}
          {completedSteps.length < steps.length && (
            <div className="text-center pt-4">
              <Button
                variant="ghost"
                onClick={handleSkip}
                className="text-slate-500 hover:text-slate-700"
              >
                Skip for now
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
