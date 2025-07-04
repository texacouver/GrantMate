import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Eye, Download, Copy, FileText, Loader2, X, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { type InsertGrantProposal } from "@shared/schema";

interface ProposalPreviewProps {
  formData: InsertGrantProposal;
  generatedProposal: string | null;
  isGenerating: boolean;
}

export function ProposalPreview({ formData, generatedProposal, isGenerating }: ProposalPreviewProps) {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Format proposal text to convert markdown symbols to proper HTML
  const formatProposalText = (text: string) => {
    return text
      // Remove random periods that appear alone on lines
      .replace(/^\.\s*$/gm, '')
      // Clean up multiple consecutive periods
      .replace(/\.{3,}/g, '...')
      // Remove periods at the start of lines
      .replace(/^\.\s+/gm, '')
      // Convert # headers to bold text with proper spacing
      .replace(/^#{1,3}\s+(.+)$/gm, '<strong class="block mt-4 mb-2 text-lg">$1</strong>')
      // Convert **bold** to <strong>
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      // Convert *italic* to <em> (but not bullet points)
      .replace(/(?<!\n)\*([^*\n]+)\*/g, '<em>$1</em>')
      // Convert bullet points with * to proper bullets
      .replace(/^\*\s+(.+)$/gm, '<div class="ml-4 mb-1">• $1</div>')
      // Convert numbered lists with better formatting
      .replace(/^(\d+\.)\s+(.+)$/gm, '<div class="ml-4 mb-1"><strong>$1</strong> $2</div>')
      // Clean up extra whitespace
      .replace(/\n{3,}/g, '\n\n')
      // Remove trailing periods from headers
      .replace(/(<strong[^>]*>.*?)\.(<\/strong>)/g, '$1$2')
      // Fix spacing around periods
      .replace(/\s+\./g, '.')
      // Convert section dividers
      .replace(/^---+$/gm, '<hr class="my-4 border-muted">')
      // Ensure paragraphs have proper spacing
      .replace(/\n\n/g, '</p><p class="mb-3">')
      // Wrap in paragraph tags
      .replace(/^(.+)/, '<p class="mb-3">$1')
      .replace(/(.+)$/, '$1</p>');
  };

  const handleDownload = () => {
    if (!generatedProposal) return;
    
    const blob = new Blob([generatedProposal], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formData.projectTitle || 'grant-proposal'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded!",
      description: "Your proposal has been downloaded as a text file.",
    });
  };

  const handleCopy = async () => {
    if (!generatedProposal) return;
    
    try {
      await navigator.clipboard.writeText(generatedProposal);
      toast({
        title: "Copied!",
        description: "Proposal content has been copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  const hasFormData = Object.values(formData).some(value => 
    typeof value === 'string' && value.trim() !== ""
  );

  if (isGenerating) {
    return (
      <Card className="glass-card hover-lift border-minimal rounded-medium animate-slide-in-up">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-foreground text-base font-medium">
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Generating Proposal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/30 rounded p-4 text-center">
            <div className="animate-pulse">
              <div className="h-2 bg-muted rounded w-3/4 mb-2 mx-auto"></div>
              <div className="h-2 bg-muted rounded w-1/2 mb-2 mx-auto"></div>
              <div className="h-2 bg-muted rounded w-5/6 mx-auto"></div>
            </div>
            <p className="text-muted-foreground mt-4 text-xs">
              This may take a few moments. Please don't close this window.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (generatedProposal) {
    return (
      <Card className="glass-card hover-lift border-minimal rounded-medium interactive-card animate-slide-in-up">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-foreground text-base font-medium">
            <span className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
              Generated Proposal
            </span>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogContent className="max-w-5xl w-[95vw] h-[90vh] p-0 overflow-hidden frosted-glass-modal">
                <DialogHeader className="px-6 py-4 border-b backdrop-blur-sm">
                  <DialogTitle className="text-lg font-medium">
                    {formData.projectTitle || 'Grant Proposal'}
                  </DialogTitle>
                  <DialogDescription className="sr-only">
                    Full view of the generated grant proposal with options to download or copy
                  </DialogDescription>
                </DialogHeader>
                <div className="flex-1 p-6 overflow-hidden backdrop-blur-sm">
                  <ScrollArea className="h-[calc(90vh-120px)]">
                    <div 
                      className="proposal-modal whitespace-pre-wrap leading-relaxed max-w-none"
                      dangerouslySetInnerHTML={{ __html: formatProposalText(generatedProposal) }}
                    />
                  </ScrollArea>
                </div>
                <div className="flex justify-between items-center px-6 py-4 border-t bg-muted/30 backdrop-blur-sm">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleDownload}
                      className="button-shadow text-xs hover-button interactive-button"
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCopy}
                      className="button-shadow text-xs hover-button interactive-button"
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </Button>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                    className="button-shadow text-xs hover-button interactive-button"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Close
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/30 rounded p-8 text-center">
            <div className="mb-4">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">
                Your proposal has been generated and is ready to view.
              </p>
            </div>
            <Button
              variant="default"
              size="sm"
              onClick={() => setIsModalOpen(true)}
              className="button-shadow text-xs hover-button interactive-button"
            >
              <Eye className="h-3 w-3 mr-1" />
              View Full Proposal
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card hover-lift border-minimal rounded-medium">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-foreground text-base font-medium">
          <Eye className="h-5 w-5 mr-2 text-foreground" />
          Live Preview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-muted/30 rounded p-4 text-center">
          {hasFormData ? (
            <div className="text-left space-y-3">
              {formData.organizationName && (
                <div className="flex items-center text-sm">
                  <span className="font-medium text-foreground">Organization:</span>
                  <span className="ml-2 text-muted-foreground">{formData.organizationName}</span>
                </div>
              )}
              {formData.projectTitle && (
                <div className="flex items-center text-sm">
                  <span className="font-medium text-foreground">Project:</span>
                  <span className="ml-2 text-muted-foreground">{formData.projectTitle}</span>
                </div>
              )}
              {formData.amount && (
                <div className="flex items-center text-sm">
                  <span className="font-medium text-foreground">Amount:</span>
                  <span className="ml-2 text-muted-foreground">${formData.amount}</span>
                </div>
              )}
              {formData.timeline && (
                <div className="flex items-center text-sm">
                  <span className="font-medium text-foreground">Timeline:</span>
                  <span className="ml-2 text-muted-foreground">{formData.timeline}</span>
                </div>
              )}
              <div className="pt-3 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  Complete the form and click "Generate Grant Proposal" to create your professional proposal.
                </p>
              </div>
            </div>
          ) : (
            <>
              <FileText className="h-8 w-8 text-muted mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">
                Fill out the form to see your proposal preview
              </p>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
