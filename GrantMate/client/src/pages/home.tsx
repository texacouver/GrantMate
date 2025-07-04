import { useState } from "react";
import { GrantForm } from "@/components/grant-form-simple";
import { ProposalPreview } from "@/components/proposal-preview";
import { ProgressBar } from "@/components/progress-bar";
import { SuggestionChips } from "@/components/suggestion-chips";
import { Card } from "@/components/ui/card";
import { FileText, Lightbulb, CheckCircle } from "lucide-react";

export default function Home() {
  const [formData, setFormData] = useState({
    organizationName: "",
    projectTitle: "",
    mission: "",
    description: "",
    targetPopulation: "",
    amount: "",
    timeline: "",
    goals: "",
  });

  const [progress, setProgress] = useState(0);
  const [generatedProposal, setGeneratedProposal] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleFormDataChange = (data: typeof formData) => {
    setFormData(data);
    
    // Calculate progress based on filled fields
    const totalFields = Object.keys(data).length;
    const filledFields = Object.values(data).filter(value => value.trim() !== "").length;
    const newProgress = Math.round((filledFields / totalFields) * 100);
    setProgress(newProgress);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass-header sticky top-0 z-50 animate-slide-in-up">
        <div className="max-w-6xl mx-auto px-8">
          <div className="flex items-center h-16">
            <FileText className="h-6 w-6 text-foreground mr-4 animate-float" />
            <h1 className="text-xl text-foreground tracking-tight font-bold">GrantMate</h1>
          </div>
        </div>
      </header>
      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2">
            <ProgressBar progress={progress} />
            <GrantForm
              data={formData}
              onChange={handleFormDataChange}
              onGenerate={setGeneratedProposal}
              isGenerating={isGenerating}
              setIsGenerating={setIsGenerating}
            />
          </div>

          {/* Right Column - Preview/Tips */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Smart Suggestion Chips */}
              <SuggestionChips formData={formData} />

              {/* Preview */}
              <ProposalPreview
                formData={formData}
                generatedProposal={generatedProposal}
                isGenerating={isGenerating}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
