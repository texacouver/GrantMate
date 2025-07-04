import { useState, useEffect, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertGrantProposalSchema, InsertGrantProposal } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { TemplateSelector } from "@/components/template-selector";
import { Building, Compass, Target, DollarSign, Sparkles, Loader2 } from "lucide-react";

interface GrantFormProps {
  data: InsertGrantProposal;
  onChange: (data: InsertGrantProposal) => void;
  onGenerate: (proposal: string) => void;
  isGenerating: boolean;
  setIsGenerating: (generating: boolean) => void;
}

export function GrantForm({ data, onChange, onGenerate, isGenerating, setIsGenerating }: GrantFormProps) {
  const { toast } = useToast();

  const form = useForm<InsertGrantProposal>({
    resolver: zodResolver(insertGrantProposalSchema),
    defaultValues: data,
  });

  const watchedValues = form.watch();

  // Update parent component when form data changes
  useEffect(() => {
    onChange(watchedValues);
  }, [watchedValues, onChange]);

  const handleSubmit = async (formData: InsertGrantProposal) => {
    try {
      setIsGenerating(true);
      
      // Create proposal
      const createResponse = await apiRequest("POST", "/api/grant-proposals", formData);
      const createdProposal = await createResponse.json();
      const proposalId = createdProposal.id;

      // Generate AI proposal content
      const generateResponse = await apiRequest("POST", `/api/grant-proposals/${proposalId}/generate`);
      const result = await generateResponse.json();

      if (result.generatedProposal) {
        onGenerate(result.generatedProposal);
        toast({
          title: "Success!",
          description: "Your grant proposal has been generated successfully.",
        });
      } else {
        throw new Error("No proposal content received");
      }
    } catch (error) {
      console.error("Error generating proposal:", error);
      toast({
        title: "Error",
        description: "Failed to generate proposal. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const getCharacterCount = (fieldName: keyof InsertGrantProposal, maxLength: number) => {
    const value = watchedValues[fieldName] as string || "";
    return `${value.length}/${maxLength}`;
  };

  const handleTemplateSelect = (templateData: Partial<InsertGrantProposal>) => {
    // Apply template data to form
    Object.entries(templateData).forEach(([key, value]) => {
      if (value && key in form.getValues()) {
        form.setValue(key as keyof InsertGrantProposal, value);
      }
    });
    
    // Update parent component with new data
    const updatedData = { ...watchedValues, ...templateData };
    onChange(updatedData);
    
    toast({
      title: "Template Applied",
      description: "The grant template has been successfully applied to your form.",
    });
  };

  return (
    <Card className="p-8 glass-card border-minimal rounded-medium animate-slide-in-up">
      <CardContent className="p-0">
        {/* Template Selector Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-border/50">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Grant Proposal Form</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Fill out the details below or start with a template
            </p>
          </div>
          <TemplateSelector 
            onSelectTemplate={handleTemplateSelect}
            currentData={watchedValues}
          />
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-12">
            {/* Organization Information */}
            <div className="space-y-6">
              <div className="pb-4">
                <h2 className="text-lg font-medium text-foreground flex items-center">
                  <Building className="h-6 w-6 text-foreground mr-3" />
                  Organization Information
                </h2>
                <p className="text-muted-foreground mt-2 text-sm">Tell us about your organization</p>
              </div>
              
              <FormField
                control={form.control}
                name="organizationName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization Name *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your organization's legal name"
                        {...field}
                        className="input-field interactive-input"
                        onChange={(e) => {
                          field.onChange(e);
                          onChange({ ...watchedValues, organizationName: e.target.value });
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="projectTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Title *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="A compelling project title"
                        {...field}
                        className="input-field interactive-input"
                        onChange={(e) => {
                          field.onChange(e);
                          onChange({ ...watchedValues, projectTitle: e.target.value });
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="mission"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mission Statement *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your organization's mission, vision, and core values..."
                        rows={4}
                        {...field}
                        className="input-field interactive-input"
                        onChange={(e) => {
                          field.onChange(e);
                          onChange({ ...watchedValues, mission: e.target.value });
                        }}
                      />
                    </FormControl>
                    <div className="flex justify-between items-center">
                      <FormMessage />
                      <span className="text-xs text-gray-500">
                        {getCharacterCount("mission", 500)}
                      </span>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            {/* Project Details */}
            <div className="space-y-6">
              <div className="pb-4">
                <h2 className="text-lg font-medium text-foreground flex items-center">
                  <Compass className="h-6 w-6 text-foreground mr-3" />
                  Project Details
                </h2>
                <p className="text-muted-foreground mt-2 text-sm">Describe your project in detail</p>
              </div>
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Description *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Provide a detailed description of your project, including background, methodology, and expected impact..."
                        rows={6}
                        {...field}
                        className="input-field interactive-input"
                        onChange={(e) => {
                          field.onChange(e);
                          onChange({ ...watchedValues, description: e.target.value });
                        }}
                      />
                    </FormControl>
                    <div className="flex justify-between items-center">
                      <FormMessage />
                      <span className="text-xs text-gray-500">
                        {getCharacterCount("description", 1000)}
                      </span>
                    </div>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="targetPopulation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Population *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the specific population or community that will benefit from this project..."
                        rows={3}
                        {...field}
                        className="input-field interactive-input"
                        onChange={(e) => {
                          field.onChange(e);
                          onChange({ ...watchedValues, targetPopulation: e.target.value });
                        }}
                      />
                    </FormControl>
                    <div className="flex justify-between items-center">
                      <FormMessage />
                      <span className="text-xs text-gray-500">
                        {getCharacterCount("targetPopulation", 400)}
                      </span>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            {/* Financial Information */}
            <div className="space-y-6">
              <div className="pb-4">
                <h2 className="text-lg font-medium text-foreground flex items-center">
                  <DollarSign className="h-6 w-6 text-foreground mr-3" />
                  Financial Information
                </h2>
                <p className="text-muted-foreground mt-2 text-sm">Budget and timeline details</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount Requested *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-3 text-gray-500">$</span>
                          <Input
                            type="text"
                            placeholder="0.00"
                            className="pl-8 input-field"
                            {...field}
                            onChange={(e) => {
                              // Remove all non-digit characters except dots
                              const cleanValue = e.target.value.replace(/[^0-9.]/g, '');
                              // Add commas for thousands
                              const formattedValue = cleanValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                              field.onChange(formattedValue);
                              onChange({ ...watchedValues, amount: formattedValue });
                            }}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="timeline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Timeline *</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          onChange({ ...watchedValues, timeline: value });
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="input-field interactive-input">
                            <SelectValue placeholder="Select project duration" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="3 months">3 months</SelectItem>
                          <SelectItem value="6 months">6 months</SelectItem>
                          <SelectItem value="12 months">12 months</SelectItem>
                          <SelectItem value="18 months">18 months</SelectItem>
                          <SelectItem value="24 months">24 months</SelectItem>
                          <SelectItem value="36 months">36 months</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Goals & Objectives */}
            <div className="space-y-6">
              <div className="pb-4">
                <h2 className="text-lg font-medium text-foreground flex items-center">
                  <Target className="h-6 w-6 text-foreground mr-3" />
                  Goals & Objectives
                </h2>
                <p className="text-muted-foreground mt-2 text-sm">Define your project's success metrics</p>
              </div>
              
              <FormField
                control={form.control}
                name="goals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Goals & Objectives *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="List specific, measurable goals and expected outcomes. Include both short-term and long-term objectives..."
                        rows={5}
                        {...field}
                        className="input-field interactive-input"
                        onChange={(e) => {
                          field.onChange(e);
                          onChange({ ...watchedValues, goals: e.target.value });
                        }}
                      />
                    </FormControl>
                    <div className="flex justify-between items-center">
                      <FormMessage />
                      <span className="text-xs text-gray-500">
                        {getCharacterCount("goals", 800)}
                      </span>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            {/* Generate Button */}
            <div className="pt-8">
              <Button
                type="submit"
                disabled={isGenerating}
                className="bg-[#000000] w-full h-14 text-base font-medium hover-button interactive-button"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                    Generating Your Proposal...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-3 h-5 w-5" />
                    Generate Grant Proposal
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}