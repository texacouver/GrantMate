import OpenAI from "openai";

// Using ChatGPT o1-preview model for enhanced reasoning capabilities in grant proposal generation
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY
});

interface GrantProposalInput {
  organizationName: string;
  projectTitle: string;
  mission: string;
  description: string;
  targetPopulation: string;
  amount: string;
  timeline: string;
  goals: string;
}

function generateDemoProposal(input: GrantProposalInput): string {
  return `# Grant Proposal: ${input.projectTitle}

## Executive Summary

${input.organizationName} respectfully requests $${input.amount} over ${input.timeline} to implement the ${input.projectTitle}. This innovative initiative addresses critical needs within ${input.targetPopulation} by ${input.description}.

Our organization's mission is to ${input.mission}. Through this project, we will directly impact the lives of hundreds of individuals while establishing sustainable solutions for long-term community benefit.

## Statement of Need

The target population of ${input.targetPopulation} faces significant challenges that require immediate intervention. Current data indicates a substantial gap in services, with limited resources available to address these pressing needs.

Research demonstrates that targeted interventions similar to our proposed project yield measurable improvements in community outcomes. The urgency of this need cannot be overstated, as delays in implementation result in continued hardship for those we aim to serve.

## Project Description

### Methodology

Our approach combines evidence-based practices with innovative solutions tailored to the specific needs of ${input.targetPopulation}. The project will be implemented through a phased approach over ${input.timeline}, ensuring systematic development and continuous quality improvement.

### Implementation Plan

**Phase 1 (Months 1-3):** Project startup, staff recruitment, and initial assessments
**Phase 2 (Months 4-8):** Full program implementation and service delivery
**Phase 3 (Months 9-12):** Evaluation, sustainability planning, and program optimization

### Expected Impact

This initiative will directly serve ${input.targetPopulation}, providing essential services and support. We anticipate measurable improvements in key indicators, including increased access to resources, enhanced community capacity, and improved quality of life outcomes.

## Goals & Objectives

${input.goals}

**Specific Measurable Outcomes:**
- Serve a minimum of 500 individuals annually
- Achieve 85% participant satisfaction rates
- Establish partnerships with 5 local organizations
- Reduce service gaps by 40% within the target population

## Budget Justification

The requested $${input.amount} will be allocated strategically across the following categories:

**Personnel (60% - $${Math.round(parseInt(input.amount) * 0.6).toLocaleString()}):**
- Project Director (1.0 FTE)
- Program Coordinators (2.0 FTE)
- Support Staff (1.5 FTE)

**Direct Services (25% - $${Math.round(parseInt(input.amount) * 0.25).toLocaleString()}):**
- Materials and supplies
- Transportation and outreach
- Technology and equipment

**Administrative Costs (15% - $${Math.round(parseInt(input.amount) * 0.15).toLocaleString()}):**
- Evaluation and reporting
- Training and professional development
- Administrative overhead

## Evaluation Plan

Our comprehensive evaluation framework includes both process and outcome measures:

**Process Evaluation:**
- Monthly progress reports
- Quarterly stakeholder surveys
- Continuous program monitoring

**Outcome Evaluation:**
- Pre/post assessments with participants
- Community impact measurements
- Long-term follow-up studies

## Organizational Capacity

${input.organizationName} brings extensive experience and proven track record in serving ${input.targetPopulation}. Our organization has successfully managed similar initiatives, demonstrating our capacity to deliver results within budget and timeline constraints.

**Key Organizational Strengths:**
- Experienced leadership team
- Strong community partnerships
- Proven financial management
- Established evaluation systems

## Sustainability Plan

This project is designed with sustainability as a core principle. By the end of the grant period, we will have:

- Developed diversified funding sources
- Established fee-for-service components
- Created organizational policy changes
- Built community capacity for program continuation

**Long-term Funding Strategy:**
- Government contracts (40%)
- Foundation grants (30%)
- Corporate partnerships (20%)
- Individual donations (10%)

## Conclusion

The ${input.projectTitle} represents a critical investment in ${input.targetPopulation}. With your support, ${input.organizationName} will implement this evidence-based initiative, creating lasting positive change and establishing a model for replication in other communities.

We respectfully request your partnership in this vital work and look forward to discussing this proposal further.

---

*This proposal was generated using AI assistance. Please review and customize as needed for your specific funder requirements.*`;
}

export async function generateGrantProposal(input: GrantProposalInput): Promise<string> {
  // If no API key or quota exceeded, return demo content
  if (!process.env.OPENAI_API_KEY) {
    return generateDemoProposal(input);
  }
  const prompt = `
You are a professional grant writer. Generate a full grant proposal draft based on the following information:

Organization Name: ${input.organizationName}
Project Title: ${input.projectTitle}
Mission Statement: ${input.mission}
Project Description: ${input.description}
Target Population: ${input.targetPopulation}
Amount Requested: $${input.amount}
Timeline: ${input.timeline}
Goals and Outcomes: ${input.goals}

The proposal should include:
- Executive Summary (2-3 paragraphs)
- Statement of Need (3-4 paragraphs with compelling statistics and evidence)
- Project Description (detailed methodology, implementation plan, 4-5 paragraphs)
- Goals & Objectives (specific, measurable outcomes with timeline)
- Budget Justification (detailed breakdown of how funds will be used)
- Evaluation Plan (metrics, assessment methods, accountability measures)
- Organizational Capacity (demonstrate ability to execute the project)
- Sustainability Plan (long-term impact and continuation)

The tone should be formal, persuasive, and clearly show how the project aligns with typical funder priorities. Use professional language and include compelling evidence for the need. Make it comprehensive and ready for submission.

Format the response with clear section headers and professional formatting.
`;

  try {
    // First try with o1-preview model
    const response = await openai.chat.completions.create({
      model: "o1-preview", // Using ChatGPT o1 model for enhanced reasoning
      messages: [
        {
          role: "user",
          content: `You are a professional grant writer with extensive experience in writing successful grant proposals. Your writing is persuasive, evidence-based, and follows best practices for grant writing.

${prompt}`
        }
      ],
    });

    return response.choices[0].message.content || "Failed to generate proposal content";
  } catch (error: any) {
    console.error("OpenAI API error:", error);
    
    // If o1-preview fails, try with gpt-4o-mini as fallback
    if (error?.status === 429 || error?.code === 'insufficient_quota') {
      try {
        console.log("Trying gpt-4o-mini as fallback...");
        const fallbackResponse = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "You are a professional grant writer with extensive experience in writing successful grant proposals. Your writing is persuasive, evidence-based, and follows best practices for grant writing."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          max_tokens: 4000,
          temperature: 0.7,
        });

        return fallbackResponse.choices[0].message.content || "Failed to generate proposal content";
      } catch (fallbackError: any) {
        console.error("Fallback model also failed:", fallbackError);
        console.log("All models failed, returning demo proposal");
        return generateDemoProposal(input);
      }
    }
    
    throw new Error("Failed to generate grant proposal using AI");
  }
}
