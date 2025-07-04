import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertGrantProposalSchema, updateGrantProposalSchema, insertCollaboratorSchema } from "@shared/schema";
import { generateGrantProposal } from "./services/openai";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

interface WebSocketClient {
  ws: WebSocket;
  proposalId?: number;
  userId?: number;
  guestName?: string;
}

const clients = new Map<WebSocket, WebSocketClient>();

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Create a new grant proposal
  app.post("/api/grant-proposals", async (req, res) => {
    try {
      const validatedData = insertGrantProposalSchema.parse(req.body);
      const proposal = await storage.createGrantProposal(validatedData);
      res.json(proposal);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: fromZodError(error).details 
        });
      }
      res.status(500).json({ message: "Failed to create proposal" });
    }
  });

  // Get a grant proposal by ID
  app.get("/api/grant-proposals/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const proposal = await storage.getGrantProposal(id);
      if (!proposal) {
        return res.status(404).json({ message: "Proposal not found" });
      }
      res.json(proposal);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch proposal" });
    }
  });

  // Update a grant proposal
  app.put("/api/grant-proposals/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = updateGrantProposalSchema.parse(req.body);
      const proposal = await storage.updateGrantProposal(id, validatedData);
      if (!proposal) {
        return res.status(404).json({ message: "Proposal not found" });
      }
      res.json(proposal);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: fromZodError(error).details 
        });
      }
      res.status(500).json({ message: "Failed to update proposal" });
    }
  });

  // Generate AI proposal content directly (without storage)
  app.post("/api/generate-proposal", async (req, res) => {
    try {
      const validatedData = insertGrantProposalSchema.parse(req.body);
      
      const generatedContent = await generateGrantProposal({
        organizationName: validatedData.organizationName,
        projectTitle: validatedData.projectTitle,
        mission: validatedData.mission,
        description: validatedData.description,
        targetPopulation: validatedData.targetPopulation,
        amount: validatedData.amount,
        timeline: validatedData.timeline,
        goals: validatedData.goals,
      });

      res.json({ generatedProposal: generatedContent });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: fromZodError(error).details 
        });
      }
      console.error("Error generating proposal:", error);
      res.status(500).json({ message: "Failed to generate proposal" });
    }
  });

  // Generate AI proposal content for existing proposals
  app.post("/api/grant-proposals/:id/generate", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const proposal = await storage.getGrantProposal(id);
      if (!proposal) {
        return res.status(404).json({ message: "Proposal not found" });
      }

      const generatedContent = await generateGrantProposal({
        organizationName: proposal.organizationName,
        projectTitle: proposal.projectTitle,
        mission: proposal.mission,
        description: proposal.description,
        targetPopulation: proposal.targetPopulation,
        amount: proposal.amount,
        timeline: proposal.timeline,
        goals: proposal.goals,
      });

      const updatedProposal = await storage.updateGrantProposal(id, {
        generatedProposal: generatedContent,
        status: "generated",
      });

      res.json(updatedProposal);
    } catch (error) {
      console.error("Error generating proposal:", error);
      res.status(500).json({ message: "Failed to generate proposal" });
    }
  });

  // Get all proposals (for future use)
  app.get("/api/grant-proposals", async (req, res) => {
    try {
      // For now, return empty array since we don't have user authentication
      res.json([]);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch proposals" });
    }
  });

  // Delete a grant proposal
  app.delete("/api/grant-proposals/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteGrantProposal(id);
      if (!deleted) {
        return res.status(404).json({ message: "Proposal not found" });
      }
      res.json({ message: "Proposal deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete proposal" });
    }
  });

  // Collaboration routes
  app.get("/api/proposals/shared/:shareToken", async (req, res) => {
    try {
      const { shareToken } = req.params;
      const proposal = await storage.getGrantProposalByShareToken(shareToken);
      if (!proposal) {
        return res.status(404).json({ message: "Shared proposal not found" });
      }
      const collaborators = await storage.getCollaborators(proposal.id);
      res.json({ proposal, collaborators });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch shared proposal" });
    }
  });

  app.post("/api/proposals/:id/collaborators", async (req, res) => {
    try {
      const proposalId = parseInt(req.params.id);
      const validatedData = insertCollaboratorSchema.parse({
        ...req.body,
        proposalId
      });
      
      const collaborator = await storage.addCollaborator(validatedData);
      
      // Broadcast to other clients
      broadcastToProposal(proposalId, {
        type: "collaborator_joined",
        collaborator
      });
      
      res.json(collaborator);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: fromZodError(error).details 
        });
      }
      res.status(500).json({ message: "Failed to add collaborator" });
    }
  });

  app.get("/api/proposals/:id/collaborators", async (req, res) => {
    try {
      const proposalId = parseInt(req.params.id);
      const collaborators = await storage.getCollaborators(proposalId);
      res.json(collaborators);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch collaborators" });
    }
  });

  app.get("/api/proposals/:id/updates", async (req, res) => {
    try {
      const proposalId = parseInt(req.params.id);
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const updates = await storage.getProposalUpdates(proposalId, limit);
      res.json(updates);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch updates" });
    }
  });

  const httpServer = createServer(app);
  
  // WebSocket setup
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  wss.on('connection', (ws) => {
    console.log('New WebSocket connection');
    
    clients.set(ws, { ws });
    
    ws.on('message', async (message) => {
      try {
        const data = JSON.parse(message.toString());
        const client = clients.get(ws);
        if (!client) return;
        
        switch (data.type) {
          case 'join_proposal':
            client.proposalId = data.proposalId;
            client.userId = data.userId;
            client.guestName = data.guestName;
            
            // Add as collaborator if not already
            if (data.proposalId && (data.userId || data.guestName)) {
              try {
                await storage.addCollaborator({
                  proposalId: data.proposalId,
                  userId: data.userId,
                  guestName: data.guestName,
                  role: 'editor'
                });
              } catch (e) {
                // Collaborator might already exist
              }
            }
            
            // Send current collaborators
            const collaborators = await storage.getCollaborators(data.proposalId);
            ws.send(JSON.stringify({
              type: 'collaborators_update',
              collaborators
            }));
            break;
            
          case 'field_update':
            if (client.proposalId) {
              // Save the update
              await storage.addProposalUpdate({
                proposalId: client.proposalId,
                userId: client.userId,
                guestName: client.guestName,
                field: data.field,
                oldValue: data.oldValue,
                newValue: data.newValue
              });
              
              // Broadcast to other clients
              broadcastToProposal(client.proposalId, {
                type: 'field_changed',
                field: data.field,
                value: data.newValue,
                updatedBy: client.userId ? `User ${client.userId}` : client.guestName || 'Anonymous'
              }, ws);
            }
            break;
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });
    
    ws.on('close', () => {
      clients.delete(ws);
    });
  });
  
  function broadcastToProposal(proposalId: number, message: any, excludeWs?: WebSocket) {
    clients.forEach((client, ws) => {
      if (client.proposalId === proposalId && ws !== excludeWs && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message));
      }
    });
  }

  return httpServer;
}
