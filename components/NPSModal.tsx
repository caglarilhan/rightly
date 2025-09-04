// components/NPSModal.tsx
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { X, Star } from "lucide-react";

interface NPSModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (score: number, feedback: string) => void;
}

export default function NPSModal({ isOpen, onClose, onSubmit }: NPSModalProps) {
  const [score, setScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setScore(null);
      setFeedback("");
      setSubmitted(false);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (score === null) return;
    
    try {
      await onSubmit(score, feedback);
      setSubmitted(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error("NPS submission failed:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute right-4 top-4"
          >
            <X className="h-4 w-4" />
          </Button>
          <CardTitle className="text-center">
            {submitted ? "Thank you! 🙏" : "How likely are you to recommend Rightly?"}
          </CardTitle>
          <CardDescription className="text-center">
            {submitted 
              ? "Your feedback helps us improve!"
              : "Your honest feedback helps us serve you better."
            }
          </CardDescription>
        </CardHeader>
        
        {!submitted && (
          <CardContent className="space-y-6">
            {/* Score Selection */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-slate-600">Not likely</span>
                <span className="text-sm text-slate-600">Very likely</span>
              </div>
              <div className="grid grid-cols-11 gap-1">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <button
                    key={num}
                    onClick={() => setScore(num)}
                    className={`
                      p-2 rounded text-sm font-medium transition-colors
                      ${score === num 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }
                    `}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Feedback */}
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Additional feedback (optional)
              </label>
              <Textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="What could we improve? What do you love?"
                rows={3}
                className="resize-none"
              />
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={score === null}
              className="w-full"
            >
              Submit Feedback
            </Button>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
