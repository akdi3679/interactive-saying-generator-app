
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GroupService } from '@/services/GroupService';
import { Group } from '@/models/group.types';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, ArrowLeft, Calendar } from 'lucide-react';

const GroupDetail = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const [group, setGroup] = useState<Group | null>(null);
  const [isMember, setIsMember] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (groupId) {
      fetchGroup();
    }
  }, [groupId, user]);

  const fetchGroup = async () => {
    if (!groupId) return;
    
    try {
      const groupData = await GroupService.getGroupById(groupId);
      setGroup(groupData);
      
      if (user) {
        const membership = await GroupService.isUserMember(groupId, user.id);
        setIsMember(membership);
      }
    } catch (error) {
      console.error('Error fetching group:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load group details.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    if (!user || !groupId) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please sign in to join groups.",
      });
      return;
    }

    setIsJoining(true);
    try {
      const success = await GroupService.joinGroup(groupId, user.id);
      if (success) {
        setIsMember(true);
        toast({
          title: "Joined Group",
          description: `You've successfully joined ${group?.name}`,
        });
        // Refresh group data to update member count
        fetchGroup();
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

  const handleGoBack = () => {
    navigate('/groups');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <div>Loading group details...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!group) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Group Not Found</h1>
            <p className="text-gray-600 mb-6">The group you're looking for doesn't exist.</p>
            <Button onClick={handleGoBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Groups
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button variant="outline" onClick={handleGoBack} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Groups
          </Button>
          
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-3xl">{group.name}</CardTitle>
                  <CardDescription className="mt-2 text-lg">{group.description}</CardDescription>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge variant="outline" className="text-sm">
                    {group.category}
                  </Badge>
                  {isMember ? (
                    <Badge variant="secondary">Member</Badge>
                  ) : (
                    <Button onClick={handleJoin} disabled={isJoining}>
                      {isJoining ? 'Joining...' : 'Join Group'}
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>{group.memberCount} members</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Created {new Date(group.createdAt).toLocaleDateString()}</span>
                </div>
                <Badge variant={group.isPublic ? "default" : "secondary"}>
                  {group.isPublic ? "Public" : "Private"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Group Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Group Feed</CardTitle>
                <CardDescription>Latest posts and updates from group members</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  <p>No posts yet. Be the first to share something!</p>
                  {isMember && (
                    <Button className="mt-4">Create Post</Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Group Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium">Category</h4>
                  <p className="text-sm text-gray-600">{group.category}</p>
                </div>
                <div>
                  <h4 className="font-medium">Visibility</h4>
                  <p className="text-sm text-gray-600">
                    {group.isPublic ? "Public - Anyone can join" : "Private - Invite only"}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium">Created</h4>
                  <p className="text-sm text-gray-600">
                    {new Date(group.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Members</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6 text-gray-500">
                  <p className="text-sm">Member list coming soon</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default GroupDetail;
