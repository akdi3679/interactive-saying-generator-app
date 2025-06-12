
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { GroupService } from '../../services/GroupService';
import { useDatabase } from '../../hooks/useDatabase';
import { useToast } from '../../hooks/use-toast';
import { useState, useEffect } from 'react';
import { Users, Clock } from 'lucide-react';

export const GroupCard = ({ group, onJoin, showJoinButton = true }) => {
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

  const handleJoin = async (e) => {
    e.stopPropagation();
    
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
    <Card className="h-full hover:shadow-lg transition-all duration-200 cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg line-clamp-1">{group.name}</CardTitle>
            <CardDescription className="mt-2 line-clamp-2">{group.description}</CardDescription>
          </div>
          <Badge variant="outline" className="ml-2 text-xs">{group.category}</Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {group.memberCount} members
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {group.isPublic ? 'Public' : 'Private'}
            </span>
          </div>
          
          {showJoinButton && !isMember ? (
            <Button 
              onClick={handleJoin} 
              disabled={isJoining}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isJoining ? 'Joining...' : 'Join'}
            </Button>
          ) : isMember ? (
            <Badge variant="secondary" className="text-xs">✓ Member</Badge>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
};
