import { 
  users, 
  grantProposals, 
  collaborators, 
  proposalUpdates,
  type User, 
  type InsertUser, 
  type GrantProposal, 
  type InsertGrantProposal, 
  type UpdateGrantProposal,
  type Collaborator,
  type InsertCollaborator,
  type ProposalUpdate,
  type InsertProposalUpdate
} from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getGrantProposal(id: number): Promise<GrantProposal | undefined>;
  getGrantProposalByShareToken(shareToken: string): Promise<GrantProposal | undefined>;
  getGrantProposalsByUser(userId: number): Promise<GrantProposal[]>;
  createGrantProposal(proposal: InsertGrantProposal & { userId?: number }): Promise<GrantProposal>;
  updateGrantProposal(id: number, proposal: UpdateGrantProposal): Promise<GrantProposal | undefined>;
  deleteGrantProposal(id: number): Promise<boolean>;
  
  // Collaboration methods
  addCollaborator(collaborator: InsertCollaborator): Promise<Collaborator>;
  getCollaborators(proposalId: number): Promise<Collaborator[]>;
  removeCollaborator(proposalId: number, userId?: number, guestName?: string): Promise<boolean>;
  
  // Update tracking
  addProposalUpdate(update: InsertProposalUpdate): Promise<ProposalUpdate>;
  getProposalUpdates(proposalId: number, limit?: number): Promise<ProposalUpdate[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private grantProposals: Map<number, GrantProposal>;
  private collaborators: Map<number, Collaborator>;
  private proposalUpdates: Map<number, ProposalUpdate>;
  private currentUserId: number;
  private currentProposalId: number;
  private currentCollaboratorId: number;
  private currentUpdateId: number;

  constructor() {
    this.users = new Map();
    this.grantProposals = new Map();
    this.collaborators = new Map();
    this.proposalUpdates = new Map();
    this.currentUserId = 1;
    this.currentProposalId = 1;
    this.currentCollaboratorId = 1;
    this.currentUpdateId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getGrantProposal(id: number): Promise<GrantProposal | undefined> {
    return this.grantProposals.get(id);
  }

  async getGrantProposalsByUser(userId: number): Promise<GrantProposal[]> {
    return Array.from(this.grantProposals.values()).filter(
      (proposal) => proposal.userId === userId,
    );
  }

  async createGrantProposal(insertProposal: InsertGrantProposal & { userId?: number }): Promise<GrantProposal> {
    const id = this.currentProposalId++;
    const now = new Date();
    const shareToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    const proposal: GrantProposal = {
      ...insertProposal,
      id,
      userId: insertProposal.userId || null,
      generatedProposal: null,
      status: "draft",
      shareToken: shareToken,
      isPublic: false,
      createdAt: now,
      updatedAt: now,
    };
    this.grantProposals.set(id, proposal);
    return proposal;
  }

  async updateGrantProposal(id: number, updateProposal: UpdateGrantProposal): Promise<GrantProposal | undefined> {
    const existing = this.grantProposals.get(id);
    if (!existing) {
      return undefined;
    }

    const updated: GrantProposal = {
      ...existing,
      ...updateProposal,
      updatedAt: new Date(),
    };
    this.grantProposals.set(id, updated);
    return updated;
  }

  async deleteGrantProposal(id: number): Promise<boolean> {
    return this.grantProposals.delete(id);
  }

  async getGrantProposalByShareToken(shareToken: string): Promise<GrantProposal | undefined> {
    return Array.from(this.grantProposals.values()).find(
      (proposal) => proposal.shareToken === shareToken
    );
  }

  // Collaboration methods
  async addCollaborator(insertCollaborator: InsertCollaborator): Promise<Collaborator> {
    const id = this.currentCollaboratorId++;
    const collaborator: Collaborator = {
      ...insertCollaborator,
      id,
      userId: insertCollaborator.userId || null,
      guestName: insertCollaborator.guestName || null,
      role: insertCollaborator.role || "editor",
      joinedAt: new Date(),
    };
    this.collaborators.set(id, collaborator);
    return collaborator;
  }

  async getCollaborators(proposalId: number): Promise<Collaborator[]> {
    return Array.from(this.collaborators.values()).filter(
      (collaborator) => collaborator.proposalId === proposalId
    );
  }

  async removeCollaborator(proposalId: number, userId?: number, guestName?: string): Promise<boolean> {
    const collaboratorToRemove = Array.from(this.collaborators.values()).find(
      (collaborator) => 
        collaborator.proposalId === proposalId &&
        ((userId && collaborator.userId === userId) || 
         (guestName && collaborator.guestName === guestName))
    );
    
    if (collaboratorToRemove) {
      return this.collaborators.delete(collaboratorToRemove.id);
    }
    return false;
  }

  // Update tracking
  async addProposalUpdate(insertUpdate: InsertProposalUpdate): Promise<ProposalUpdate> {
    const id = this.currentUpdateId++;
    const update: ProposalUpdate = {
      ...insertUpdate,
      id,
      userId: insertUpdate.userId || null,
      guestName: insertUpdate.guestName || null,
      oldValue: insertUpdate.oldValue || null,
      newValue: insertUpdate.newValue || null,
      timestamp: new Date(),
    };
    this.proposalUpdates.set(id, update);
    return update;
  }

  async getProposalUpdates(proposalId: number, limit: number = 50): Promise<ProposalUpdate[]> {
    return Array.from(this.proposalUpdates.values())
      .filter((update) => update.proposalId === proposalId)
      .sort((a, b) => b.timestamp!.getTime() - a.timestamp!.getTime())
      .slice(0, limit);
  }
}

export const storage = new MemStorage();
