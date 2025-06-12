
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GroupService } from '../services/GroupService';
import { useDatabase } from '../hooks/useDatabase';
import { useToast } from '../hooks/use-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Users, ArrowLeft, Calendar, Search, Plus, Image, DollarSign, ShoppingBag, MessageCircle, Heart, Share2 } from 'lucide-react';

const GroupDetail = () => {
  const { groupId } = useParams();
  const [group, setGroup] = useState(null);
  const [isMember, setIsMember] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const [postDescription, setPostDescription] = useState('');
  const [postPrice, setPostPrice] = useState('');
  const [postType, setPostType] = useState('sell');
  const { user } = useDatabase();
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

  const handleCreatePost = () => {
    if (!postTitle || !postDescription) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in the title and description.",
      });
      return;
    }

    toast({
      title: "Post Created",
      description: `Your ${postType} post has been created successfully.`,
    });
    
    setShowCreatePost(false);
    setPostTitle('');
    setPostDescription('');
    setPostPrice('');
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

  const mockPosts = [
    {
      id: 1,
      type: 'sell',
      title: 'iPhone 13 Pro - Like New',
      description: 'Selling my iPhone 13 Pro in excellent condition. Comes with original box and charger.',
      price: 750,
      author: 'John Doe',
      authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
      images: ['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=200&fit=crop'],
      createdAt: '2 hours ago',
      likes: 12,
      comments: 5
    },
    {
      id: 2,
      type: 'buy',
      title: 'Looking for Gaming Chair',
      description: 'Need a comfortable gaming chair for my setup. Budget around $200-300.',
      author: 'Sarah Wilson',
      authorAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
      createdAt: '5 hours ago',
      likes: 3,
      comments: 8
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Button variant="outline" onClick={handleGoBack} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Groups
        </Button>
        
        {/* Group Header - Facebook Style */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="h-48 bg-gradient-to-r from-blue-500 to-blue-600 rounded-t-lg relative">
            <div className="absolute bottom-4 left-6 text-white">
              <h1 className="text-3xl font-bold">{group.name}</h1>
              <div className="flex items-center gap-4 mt-2 text-blue-100">
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {group.memberCount} members
                </span>
                <Badge variant={group.isPublic ? "secondary" : "outline"} className="bg-white/20 text-white border-white/30">
                  {group.isPublic ? "Public" : "Private"}
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="p-6 pt-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <p className="text-gray-600 mb-4">{group.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Created {new Date(group.createdAt).toLocaleDateString()}
                  </span>
                  <Badge variant="outline">{group.category}</Badge>
                </div>
              </div>
              
              {!isMember ? (
                <Button onClick={handleJoin} disabled={isJoining} className="bg-blue-600 hover:bg-blue-700">
                  {isJoining ? 'Joining...' : 'Join Group'}
                </Button>
              ) : (
                <Badge variant="secondary" className="px-3 py-1">✓ Member</Badge>
              )}
            </div>
          </div>
        </div>

        {isMember && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Create Post Card */}
              <Card>
                <CardContent className="p-4">
                  {!showCreatePost ? (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium">{user?.name?.charAt(0) || 'U'}</span>
                      </div>
                      <Button 
                        variant="outline" 
                        className="flex-1 justify-start text-gray-500"
                        onClick={() => setShowCreatePost(true)}
                      >
                        What do you want to sell or buy?
                      </Button>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium">{user?.name?.charAt(0) || 'U'}</span>
                        </div>
                        <div>
                          <p className="font-medium">{user?.name || 'User'}</p>
                          <p className="text-sm text-gray-500">Create a listing</p>
                        </div>
                      </div>

                      <Tabs value={postType} onValueChange={setPostType}>
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="sell" className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            Sell Something
                          </TabsTrigger>
                          <TabsTrigger value="buy" className="flex items-center gap-2">
                            <ShoppingBag className="h-4 w-4" />
                            Looking to Buy
                          </TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="sell" className="space-y-4">
                          <Input
                            placeholder="What are you selling?"
                            value={postTitle}
                            onChange={(e) => setPostTitle(e.target.value)}
                          />
                          <Textarea
                            placeholder="Describe your item..."
                            value={postDescription}
                            onChange={(e) => setPostDescription(e.target.value)}
                            rows={3}
                          />
                          <Input
                            type="number"
                            placeholder="Price ($)"
                            value={postPrice}
                            onChange={(e) => setPostPrice(e.target.value)}
                          />
                        </TabsContent>
                        
                        <TabsContent value="buy" className="space-y-4">
                          <Input
                            placeholder="What are you looking for?"
                            value={postTitle}
                            onChange={(e) => setPostTitle(e.target.value)}
                          />
                          <Textarea
                            placeholder="Describe what you need..."
                            value={postDescription}
                            onChange={(e) => setPostDescription(e.target.value)}
                            rows={3}
                          />
                        </TabsContent>
                      </Tabs>

                      <div className="flex items-center gap-2 pt-2 border-t">
                        <Button variant="outline" size="sm">
                          <Image className="h-4 w-4 mr-2" />
                          Add Photos
                        </Button>
                        <div className="flex-1"></div>
                        <Button variant="outline" onClick={() => setShowCreatePost(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleCreatePost} className="bg-blue-600 hover:bg-blue-700">
                          Post
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Search Bar */}
              <Card>
                <CardContent className="p-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search in this group..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Posts Feed */}
              <div className="space-y-4">
                {mockPosts.map((post) => (
                  <Card key={post.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-3 mb-4">
                        <img 
                          src={post.authorAvatar} 
                          alt={post.author}
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{post.author}</h4>
                            <Badge variant={post.type === 'sell' ? 'default' : 'secondary'} className="text-xs">
                              {post.type === 'sell' ? 'Selling' : 'Looking to Buy'}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500">{post.createdAt}</p>
                        </div>
                      </div>

                      <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
                      <p className="text-gray-600 mb-3">{post.description}</p>
                      
                      {post.price && (
                        <div className="text-2xl font-bold text-green-600 mb-3">
                          ${post.price}
                        </div>
                      )}

                      {post.images && (
                        <div className="mb-4">
                          <img 
                            src={post.images[0]} 
                            alt={post.title}
                            className="rounded-lg max-w-md w-full h-48 object-cover"
                          />
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center gap-4">
                          <Button variant="ghost" size="sm" className="text-gray-500 hover:text-red-500">
                            <Heart className="h-4 w-4 mr-2" />
                            {post.likes}
                          </Button>
                          <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-500">
                            <MessageCircle className="h-4 w-4 mr-2" />
                            {post.comments}
                          </Button>
                          <Button variant="ghost" size="sm" className="text-gray-500 hover:text-green-500">
                            <Share2 className="h-4 w-4 mr-2" />
                            Share
                          </Button>
                        </div>
                        {post.type === 'sell' && (
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            Message Seller
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">About this group</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm">Description</h4>
                    <p className="text-sm text-gray-600">{group.description}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Visibility</h4>
                    <p className="text-sm text-gray-600">
                      {group.isPublic ? "Public - Anyone can see posts" : "Private - Only members can see posts"}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Created</h4>
                    <p className="text-sm text-gray-600">
                      {new Date(group.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Group Rules</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>• Be respectful to all members</p>
                    <p>• No spam or duplicate posts</p>
                    <p>• Use clear photos and descriptions</p>
                    <p>• Meet in safe, public places</p>
                    <p>• Report suspicious activity</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {!isMember && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Join this group to see posts</h2>
            <p className="text-gray-600 mb-6">Connect with members and start buying and selling</p>
            <Button onClick={handleJoin} disabled={isJoining} size="lg" className="bg-blue-600 hover:bg-blue-700">
              {isJoining ? 'Joining...' : 'Join Group'}
            </Button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default GroupDetail;
