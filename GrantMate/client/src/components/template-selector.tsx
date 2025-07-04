import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileText, Search, X, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { grantTemplates, getTemplateById, getAllCategories, type GrantTemplate } from "@/lib/grant-templates";
import { type InsertGrantProposal } from "@shared/schema";

interface TemplateSelectorProps {
  onSelectTemplate: (templateData: Partial<InsertGrantProposal>) => void;
  currentData: InsertGrantProposal;
}

export function TemplateSelector({ onSelectTemplate, currentData }: TemplateSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedTemplate, setSelectedTemplate] = useState<GrantTemplate | null>(null);

  const categories = ["All", ...getAllCategories()];

  const filteredTemplates = grantTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSelectTemplate = (template: GrantTemplate) => {
    setSelectedTemplate(template);
  };

  const handleApplyTemplate = () => {
    if (selectedTemplate) {
      onSelectTemplate(selectedTemplate.data);
      setIsOpen(false);
      setSelectedTemplate(null);
      setSearchQuery("");
      setSelectedCategory("All");
    }
  };

  const hasFormData = Object.values(currentData).some(value => 
    typeof value === 'string' && value.trim() !== ""
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="interactive-button"
        >
          <FileText className="h-4 w-4 mr-2" />
          Use Template
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl w-[95vw] h-[85vh] p-0 overflow-hidden frosted-glass-modal">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="text-lg font-medium flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Choose a Grant Template
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-1 overflow-hidden">
          {/* Left Panel - Template List */}
          <div className="w-1/2 border-r flex flex-col">
            {/* Search and Filters */}
            <div className="p-4 border-b space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 interactive-input"
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="text-xs interactive-button"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            {/* Template List */}
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-3">
                {filteredTemplates.map((template, index) => (
                  <Card
                    key={template.id}
                    className={`cursor-pointer transition-all duration-200 interactive-card stagger-item ${
                      selectedTemplate?.id === template.id 
                        ? 'ring-2 ring-foreground bg-muted/20' 
                        : 'hover:bg-muted/10'
                    }`}
                    style={{ animationDelay: `${index * 0.05}s` }}
                    onClick={() => handleSelectTemplate(template)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">{template.icon}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-sm truncate">{template.name}</h3>
                            <Badge variant="secondary" className="text-xs">
                              {template.category}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {template.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {filteredTemplates.length === 0 && (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">
                      No templates found matching your criteria
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Right Panel - Template Preview */}
          <div className="w-1/2 flex flex-col">
            {selectedTemplate ? (
              <>
                <div className="p-4 border-b">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-3xl">{selectedTemplate.icon}</div>
                    <div>
                      <h2 className="font-semibold text-lg">{selectedTemplate.name}</h2>
                      <Badge variant="outline" className="text-xs">
                        {selectedTemplate.category}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {selectedTemplate.description}
                  </p>
                </div>

                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm mb-2">Mission Statement</h4>
                      <div className="bg-muted/30 rounded-lg p-3 text-sm">
                        {selectedTemplate.data.mission}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm mb-2">Project Description</h4>
                      <div className="bg-muted/30 rounded-lg p-3 text-sm">
                        {selectedTemplate.data.description}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm mb-2">Target Population</h4>
                      <div className="bg-muted/30 rounded-lg p-3 text-sm">
                        {selectedTemplate.data.targetPopulation}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm mb-2">Timeline</h4>
                      <div className="bg-muted/30 rounded-lg p-3 text-sm">
                        {selectedTemplate.data.timeline}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm mb-2">Goals</h4>
                      <div className="bg-muted/30 rounded-lg p-3 text-sm">
                        {selectedTemplate.data.goals}
                      </div>
                    </div>
                  </div>
                </ScrollArea>

                <div className="p-4 border-t">
                  {hasFormData && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mb-3">
                      <p className="text-xs text-yellow-800 dark:text-yellow-200">
                        ⚠️ Applying this template will replace your current form data. 
                        Make sure to save any important information first.
                      </p>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleApplyTemplate}
                      className="flex-1 interactive-button"
                    >
                      Apply Template
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsOpen(false)}
                      className="interactive-button"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3 animate-float" />
                  <p className="text-sm text-muted-foreground">
                    Select a template to preview its contents
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}