import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, X, ChevronDown, ChevronUp } from "lucide-react";
import { type InsertGrantProposal } from "@shared/schema";

interface SuggestionChip {
  id: string;
  title: string;
  content: string;
  category: "organization" | "project" | "financial" | "writing" | "general";
  relevantFields?: (keyof InsertGrantProposal)[];
}

interface SuggestionChipsProps {
  formData: InsertGrantProposal;
  onDismiss?: (chipId: string) => void;
}

const suggestionChips: SuggestionChip[] = [
  {
    id: "clear-mission",
    title: "Clear Mission Statement",
    content: "Your mission should be concise and clearly state your organization's purpose. Focus on the impact you want to make rather than activities.",
    category: "organization",
    relevantFields: ["mission"]
  },
  {
    id: "specific-goals",
    title: "SMART Goals",
    content: "Make your goals Specific, Measurable, Achievable, Relevant, and Time-bound. Include concrete metrics and deadlines.",
    category: "project",
    relevantFields: ["goals"]
  },
  {
    id: "target-population",
    title: "Define Your Audience",
    content: "Be specific about who you're serving. Include demographics, geographic location, and why this population needs your services.",
    category: "project",
    relevantFields: ["targetPopulation"]
  },
  {
    id: "realistic-budget",
    title: "Realistic Budget",
    content: "Research typical costs for similar projects. Include a 10-15% contingency buffer and ensure your budget aligns with project scope.",
    category: "financial",
    relevantFields: ["amount"]
  },
  {
    id: "detailed-timeline",
    title: "Detailed Timeline",
    content: "Break down your project into phases with specific milestones. Allow time for setup, implementation, evaluation, and reporting.",
    category: "project",
    relevantFields: ["timeline"]
  },
  {
    id: "compelling-description",
    title: "Tell a Story",
    content: "Your project description should tell a compelling story about the problem, your solution, and the expected impact. Use concrete examples.",
    category: "writing",
    relevantFields: ["description"]
  },
  {
    id: "evidence-based",
    title: "Use Data & Evidence",
    content: "Support your claims with statistics, research, and evidence. Cite credible sources and demonstrate need with concrete data.",
    category: "writing"
  },
  {
    id: "sustainability",
    title: "Show Sustainability",
    content: "Funders want to know how your project will continue beyond the grant period. Include plans for ongoing funding and impact.",
    category: "project"
  }
];

export function SuggestionChips({ formData, onDismiss }: SuggestionChipsProps) {
  const [dismissedChips, setDismissedChips] = useState<Set<string>>(new Set());
  const [isExpanded, setIsExpanded] = useState(true);

  // Filter chips based on form completion and relevance
  const getRelevantChips = () => {
    return suggestionChips.filter(chip => {
      // Don't show dismissed chips
      if (dismissedChips.has(chip.id)) return false;

      // If chip has relevant fields, check if any are empty or could use improvement
      if (chip.relevantFields) {
        return chip.relevantFields.some(field => {
          const value = formData[field] as string;
          return !value || value.length < 20; // Show tip if field is empty or very short
        });
      }

      // Show general tips if less than half the form is complete
      const completedFields = Object.values(formData).filter(value => 
        value && typeof value === 'string' && value.length > 10
      ).length;
      const totalFields = Object.keys(formData).length;
      
      return completedFields < totalFields / 2;
    });
  };

  const relevantChips = getRelevantChips();

  const handleDismiss = (chipId: string) => {
    setDismissedChips(prev => new Set(Array.from(prev).concat(chipId)));
    onDismiss?.(chipId);
  };

  if (relevantChips.length === 0) return null;

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "organization": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "project": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "financial": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "writing": return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  return (
    <Card className="glass-card border-minimal rounded-medium mb-6 interactive-card animate-slide-in-up">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-foreground animate-float" />
            <h3 className="font-medium text-foreground">Writing Tips</h3>
            <Badge variant="secondary" className="text-xs">
              {relevantChips.length}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-6 w-6 p-0"
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>

        {isExpanded && (
          <div className="space-y-3">
            {relevantChips.slice(0, 3).map((chip, index) => (
              <div
                key={chip.id}
                className="bg-muted/30 rounded-lg p-3 border border-border/50 stagger-item interactive-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm text-foreground">
                        {chip.title}
                      </h4>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getCategoryColor(chip.category)}`}
                      >
                        {chip.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {chip.content}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDismiss(chip.id)}
                    className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}

            {relevantChips.length > 3 && (
              <div className="text-center">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => {
                    // Could expand to show more tips or link to a tips page
                  }}
                >
                  View More Tips ({relevantChips.length - 3})
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}