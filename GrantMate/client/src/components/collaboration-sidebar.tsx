import { Users, Clock, Share2, Copy, UserPlus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

interface Collaborator {
  id: number;
  userId?: number;
  guestName?: string;
  role: string;
  joinedAt: Date;
}

interface RecentUpdate {
  field: string;
  updatedBy: string;
  timestamp: Date;
}

interface CollaborationSidebarProps {
  collaborators: Collaborator[];
  recentUpdates: RecentUpdate[];
  isConnected: boolean;
  shareToken?: string;
  onInviteCollaborator?: () => void;
}

export function CollaborationSidebar({
  collaborators,
  recentUpdates,
  isConnected,
  shareToken,
  onInviteCollaborator
}: CollaborationSidebarProps) {
  const { toast } = useToast();

  const copyShareLink = () => {
    if (shareToken) {
      const shareUrl = `${window.location.origin}/shared/${shareToken}`;
      navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Share link copied",
        description: "Anyone with this link can collaborate on this proposal"
      });
    }
  };

  const getDisplayName = (collaborator: Collaborator) => {
    if (collaborator.userId) {
      return `User ${collaborator.userId}`;
    }
    return collaborator.guestName || "Anonymous";
  };

  const getFieldLabel = (field: string) => {
    const fieldLabels: Record<string, string> = {
      organizationName: "Organization Name",
      projectTitle: "Project Title",
      mission: "Mission Statement",
      description: "Project Description",
      targetPopulation: "Target Population",
      amount: "Funding Amount",
      timeline: "Timeline",
      goals: "Goals & Objectives"
    };
    return fieldLabels[field] || field;
  };

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card className="glass-card border-minimal rounded-medium">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-sm font-medium">
            <div className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            {isConnected ? 'Connected' : 'Disconnected'}
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Active Collaborators */}
      <Card className="glass-card hover-lift border-minimal rounded-medium">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-base font-medium">
            <span className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-foreground" />
              Collaborators ({collaborators.length})
            </span>
            {onInviteCollaborator && (
              <Button
                variant="outline"
                size="sm"
                onClick={onInviteCollaborator}
                className="hover-button"
              >
                <UserPlus className="h-3 w-3 mr-1" />
                Invite
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {collaborators.length === 0 ? (
            <p className="text-sm text-muted-foreground">No active collaborators</p>
          ) : (
            collaborators.map((collaborator) => (
              <div key={collaborator.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-xs font-medium text-primary">
                      {getDisplayName(collaborator).charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{getDisplayName(collaborator)}</p>
                    <p className="text-xs text-muted-foreground">
                      Joined {formatDistanceToNow(new Date(collaborator.joinedAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {collaborator.role}
                </Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Share Options */}
      {shareToken && (
        <Card className="glass-card hover-lift border-minimal rounded-medium">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-base font-medium">
              <Share2 className="h-5 w-5 mr-2 text-foreground" />
              Share Proposal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              size="sm"
              onClick={copyShareLink}
              className="w-full hover-button"
            >
              <Copy className="h-3 w-3 mr-2" />
              Copy Share Link
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              Anyone with this link can view and edit this proposal
            </p>
          </CardContent>
        </Card>
      )}

      {/* Recent Updates */}
      <Card className="glass-card hover-lift border-minimal rounded-medium">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-base font-medium">
            <Clock className="h-5 w-5 mr-2 text-foreground" />
            Recent Updates
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentUpdates.length === 0 ? (
            <p className="text-sm text-muted-foreground">No recent updates</p>
          ) : (
            recentUpdates.slice(0, 5).map((update, index) => (
              <div key={index} className="border-l-2 border-primary/20 pl-3">
                <p className="text-sm font-medium">{getFieldLabel(update.field)}</p>
                <p className="text-xs text-muted-foreground">
                  Updated by {update.updatedBy} • {formatDistanceToNow(update.timestamp, { addSuffix: true })}
                </p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}