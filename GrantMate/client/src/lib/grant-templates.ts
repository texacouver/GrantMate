import { InsertGrantProposal } from "@shared/schema";

export interface GrantTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  data: Partial<InsertGrantProposal>;
}

export const grantTemplates: GrantTemplate[] = [
  {
    id: "medical-research",
    name: "Medical Research Grant",
    description: "For clinical trials, medical studies, and healthcare research projects",
    category: "Research",
    icon: "🔬",
    data: {
      mission: "To advance medical knowledge and improve patient outcomes through rigorous scientific research and evidence-based healthcare innovations.",
      description: "This research project aims to investigate [specific medical condition/treatment] through a comprehensive study design that will contribute valuable insights to the medical community and potentially improve patient care outcomes.",
      targetPopulation: "Patients with [specific condition], healthcare providers, and the broader medical community",
      timeline: "36 months - Phase 1: Study design and ethics approval (6 months), Phase 2: Patient recruitment and data collection (24 months), Phase 3: Analysis and dissemination (6 months)",
      goals: "Conduct rigorous scientific research to advance medical knowledge, Generate peer-reviewed publications and evidence-based recommendations, Improve patient care protocols and treatment outcomes, Train the next generation of medical researchers"
    }
  },
  {
    id: "education-program",
    name: "Education Program Grant",
    description: "For K-12 education, higher education, and educational technology initiatives",
    category: "Education",
    icon: "📚",
    data: {
      mission: "To enhance educational opportunities and outcomes for students through innovative programs, evidence-based teaching methods, and equitable access to quality learning experiences.",
      description: "This educational initiative will develop and implement innovative learning programs designed to improve student achievement, engagement, and long-term academic success through evidence-based pedagogical approaches.",
      targetPopulation: "Students, educators, families, and the broader educational community",
      timeline: "24 months - Year 1: Program development and pilot implementation (12 months), Year 2: Full implementation and evaluation (12 months)",
      goals: "Improve student learning outcomes and academic achievement, Enhance teacher professional development and instructional capacity, Increase student engagement and motivation to learn, Develop scalable and sustainable educational innovations"
    }
  },
  {
    id: "community-development",
    name: "Community Development Grant",
    description: "For neighborhood improvement, social services, and community infrastructure",
    category: "Community",
    icon: "🏘️",
    data: {
      mission: "To strengthen communities by addressing local needs, fostering economic development, and improving quality of life for residents through collaborative and sustainable initiatives.",
      description: "This community development project will address critical local needs through strategic investments in infrastructure, services, and capacity building that will create lasting positive impact for residents.",
      targetPopulation: "Community residents, local businesses, neighborhood organizations, and community stakeholders",
      timeline: "18 months - Phase 1: Community assessment and planning (6 months), Phase 2: Implementation and construction (9 months), Phase 3: Evaluation and sustainability planning (3 months)",
      goals: "Improve community infrastructure and quality of life, Strengthen local economic development and job creation, Enhance community capacity and resident engagement, Create sustainable and replicable community solutions"
    }
  },
  {
    id: "environmental-conservation",
    name: "Environmental Conservation Grant",
    description: "For environmental protection, sustainability, and climate change initiatives",
    category: "Environment",
    icon: "🌱",
    data: {
      mission: "To protect and restore natural environments while promoting sustainable practices that address climate change and preserve biodiversity for future generations.",
      description: "This environmental conservation project will implement evidence-based strategies to protect natural resources, reduce environmental impact, and promote sustainable practices within our community and beyond.",
      targetPopulation: "Local ecosystems, community members, environmental organizations, and future generations",
      timeline: "30 months - Year 1: Environmental assessment and planning (12 months), Year 2: Implementation of conservation measures (12 months), Year 3: Monitoring and evaluation (6 months)",
      goals: "Protect and restore critical natural habitats and biodiversity, Reduce greenhouse gas emissions and environmental impact, Promote sustainable practices and environmental education, Develop innovative conservation technologies and methods"
    }
  },
  {
    id: "arts-culture",
    name: "Arts & Culture Grant",
    description: "For artistic projects, cultural preservation, and creative community programs",
    category: "Arts",
    icon: "🎨",
    data: {
      mission: "To enrich communities through artistic expression, cultural preservation, and creative programming that celebrates diversity and fosters cultural understanding and appreciation.",
      description: "This arts and culture initiative will create meaningful opportunities for artistic expression and cultural engagement while preserving important cultural traditions and fostering creative community connections.",
      targetPopulation: "Artists, cultural practitioners, community members, and cultural organizations",
      timeline: "24 months - Phase 1: Program design and artist recruitment (6 months), Phase 2: Implementation and programming (15 months), Phase 3: Documentation and evaluation (3 months)",
      goals: "Support artistic development and creative expression, Preserve and celebrate cultural heritage and traditions, Increase community access to arts and cultural programming, Foster cultural understanding and community cohesion"
    }
  },
  {
    id: "technology-innovation",
    name: "Technology Innovation Grant",
    description: "For tech startups, digital solutions, and innovation research projects",
    category: "Technology",
    icon: "💻",
    data: {
      mission: "To advance technological innovation and digital solutions that address real-world challenges while promoting economic growth and improving quality of life through cutting-edge technology.",
      description: "This technology innovation project will develop and deploy cutting-edge digital solutions that address critical challenges while demonstrating commercial viability and positive social impact.",
      targetPopulation: "Technology users, businesses, researchers, and the broader innovation ecosystem",
      timeline: "30 months - Phase 1: Research and development (12 months), Phase 2: Prototype development and testing (12 months), Phase 3: Market validation and scaling (6 months)",
      goals: "Develop innovative technology solutions with real-world applications, Advance scientific and technical knowledge in emerging fields, Create economic opportunities and job growth in technology sectors, Demonstrate measurable impact and commercial potential"
    }
  },
  {
    id: "small-business",
    name: "Small Business Development Grant",
    description: "For entrepreneurship, small business support, and economic development",
    category: "Business",
    icon: "🏢",
    data: {
      mission: "To foster entrepreneurship and small business growth by providing resources, training, and support that creates jobs, strengthens local economies, and promotes innovation in business practices.",
      description: "This small business development program will provide comprehensive support to entrepreneurs and small business owners through training, mentorship, and resources that promote sustainable business growth and economic development.",
      targetPopulation: "Entrepreneurs, small business owners, aspiring business leaders, and local economic development organizations",
      timeline: "24 months - Year 1: Program development and participant recruitment (6 months), Implementation of training and support services (6 months), Year 2: Business incubation and mentorship (12 months)",
      goals: "Support small business creation and growth, Provide entrepreneurship training and business development resources, Create sustainable jobs and economic opportunities, Foster innovation and competitive business practices"
    }
  },
  {
    id: "workforce-development",
    name: "Workforce Development Grant",
    description: "For job training, skills development, and career advancement programs",
    category: "Workforce",
    icon: "👥",
    data: {
      mission: "To prepare individuals for meaningful employment and career advancement through skills training, professional development, and workforce readiness programs that meet industry demands.",
      description: "This workforce development initiative will provide comprehensive training and support services that prepare participants for in-demand careers while addressing critical skills gaps in key industries.",
      targetPopulation: "Job seekers, displaced workers, underemployed individuals, and industry partners",
      timeline: "18 months - Phase 1: Curriculum development and employer partnerships (6 months), Phase 2: Training delivery and job placement (9 months), Phase 3: Follow-up and program evaluation (3 months)",
      goals: "Provide job training in high-demand occupations, Increase employment and earning potential for participants, Address critical skills gaps in key industries, Develop sustainable workforce development partnerships"
    }
  }
];

export const getTemplateByCategory = (category: string): GrantTemplate[] => {
  return grantTemplates.filter(template => template.category.toLowerCase() === category.toLowerCase());
};

export const getTemplateById = (id: string): GrantTemplate | undefined => {
  return grantTemplates.find(template => template.id === id);
};

export const getAllCategories = (): string[] => {
  const categories: string[] = [];
  grantTemplates.forEach(template => {
    if (!categories.includes(template.category)) {
      categories.push(template.category);
    }
  });
  return categories;
};