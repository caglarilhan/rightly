import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { HelpCircle } from "lucide-react";
import HelpModal from "./HelpModal";

interface HelpButtonProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "outline" | "ghost";
}

const HelpButton: React.FC<HelpButtonProps> = ({ 
  className = "", 
  size = "sm", 
  variant = "ghost" 
}) => {
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  return (
    <>
      <Button
        size={size}
        variant={variant}
        onClick={() => setIsHelpOpen(true)}
        className={`${className}`}
      >
        <HelpCircle className="w-4 h-4" />
      </Button>

      <HelpModal 
        isOpen={isHelpOpen} 
        onClose={() => setIsHelpOpen(false)} 
      />
    </>
  );
};

export default HelpButton;
