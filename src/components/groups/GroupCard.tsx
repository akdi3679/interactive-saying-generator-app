
import { Group } from '@/models/group.types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GroupService } from '@/services/GroupService';
import { useDatabase } from '@/hooks/useDatabase';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { Users } from 'lucide-react';

interface GroupCardProps {
  group: Group;
  onJoin?: () => void;
}

export const GroupCard = ({ group, onJoin }: GroupCardProps) => {
  const [isMember, setIsMember] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const { user } = useDatabase();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      checkMembership();
    }
  }, [user, group.id]);

  const checkMembership = async () => {
    if (!user) return;
    const membership = await GroupService.isUserMember(group.id, user.id);
    setIsMember(membership);
  };

  const handleJoin = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please sign in to join groups.",
      });
      return;
    }

    setIsJoining(true);
    try {
      const success = await GroupService.joinGroup(group.id, user.id);
      if (success) {
        setIsMember(true);
        toast({
          title: "Joined Group",
          description: `You've successfully joined ${group.name}`,
        });
        onJoin?.();
      }
    } catch (error) {
      console.error('Error joining group:', error);
      toast({
        variant: "destructive",
        title: "Error Joining Group",
        description: "There was a problem joining the group. Please try again.",
      });
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{group.name}</CardTitle>
            <CardDescription className="mt-2">{group.description}</CardDescription>
          </div>
          <Badge variant="outline">{group.category}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="h-4 w-4" />
            <span>{group.memberCount} members</span>
          </div>
          {!isMember ? (
            <Button 
              onClick={handleJoin} 
              disabled={isJoining}
              size="sm"
            >
              {isJoining ? 'Joining...' : 'Join'}
            </Button>
          ) : (
            <Badge variant="secondary">Member</Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
