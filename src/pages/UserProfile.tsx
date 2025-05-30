
import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { TestAuthService, TestUser } from '../services/TestAuthService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  User, 
  MapPin, 
  Calendar, 
  Award, 
  Users, 
  Heart, 
  Eye, 
  DollarSign, 
  ShoppingBag,
  TrendingUp,
  Plus,
  Gavel,
  Settings,
  Link as LinkIcon,
  UserPlus
} from 'lucide-react';
import StarRating from '../components/StarRating';

const UserProfile = () => {
  const [user, setUser] = useState<TestUser | null>(TestAuthService.getCurrentUser());
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    location: user?.location || ''
  });
  const { toast } = useToast();

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8 flex justify-center items-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
            <p className="mb-6">Please sign in to view your profile.</p>
            <Button onClick={() => window.location.href = '/signin'}>Sign In</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleSave = () => {
    const updatedUser = TestAuthService.updateUser(formData);
    setUser(updatedUser);
    setEditMode(false);
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
  };

  const handleCancel = () => {
    setFormData({
      name: user.name,
      bio: user.bio,
      location: user.location
    });
    setEditMode(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header - Always Visible Overview */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="w-32 h-32 rounded-full overflow-hidden">
                  <img 
                    src={user.avatar} 
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <h1 className="text-3xl font-bold">{user.name}</h1>
                    <Button 
                      variant="outline" 
                      onClick={() => setEditMode(!editMode)}
                      className="mt-2 md:mt-0"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      {editMode ? 'Cancel' : 'Edit Profile'}
                    </Button>
                  </div>
                  
                  {editMode ? (
                    <div className="space-y-4">
                      <div>
                        <Input
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <Textarea
                          value={formData.bio}
                          onChange={(e) => setFormData({...formData, bio: e.target.value})}
                          placeholder="Tell us about yourself"
                          className="min-h-[100px]"
                        />
                      </div>
                      <div>
                        <Input
                          value={formData.location}
                          onChange={(e) => setFormData({...formData, location: e.target.value})}
                          placeholder="Your location"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleSave}>Save Changes</Button>
                        <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-gray-600 mb-4">{user.bio}</p>
                      
                      <div className="flex flex-col md:flex-row gap-4 mb-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{user.location}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>Joined {new Date(user.joinDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <UserPlus className="h-4 w-4 mr-1" />
                          <span>{user.connections.length} relations</span>
                        </div>
                      </div>
                      
                      {/* Last Badges - Show top 3 */}
                      <div className="flex gap-2 mb-4">
                        {user.badges.slice(0, 3).map((badge, index) => (
                          <div key={index} className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full flex items-center">
                            <Award className="h-3 w-3 mr-1" />
                            {badge}
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex items-center gap-4 mb-4">
                        <StarRating rating={user.rating} totalRatings={user.totalRatings} />
                        <span className="text-sm text-gray-500">
                          {user.followers} followers • {user.following} following
                        </span>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button className="bg-[#3665f3] hover:bg-[#3665f3]/90">
                          <Plus className="h-4 w-4 mr-2" />
                          Sell Item
                        </Button>
                        <Button variant="outline">
                          <Gavel className="h-4 w-4 mr-2" />
                          Start Bidding
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${user.analytics.earnings.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">From {user.analytics.totalSales} sales</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{user.analytics.activeListings}</div>
                <p className="text-xs text-muted-foreground">Currently listed</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Profile Views</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{user.analytics.profileVisits.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>
          </div>

          {/* Two Main Tabs */}
          <Tabs defaultValue="posts" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="posts">Posts</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>

            <TabsContent value="posts" className="space-y-6">
              {/* Sell/Post Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Create New Listing</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    <Button className="flex-1 bg-[#3665f3] hover:bg-[#3665f3]/90">
                      <Plus className="h-4 w-4 mr-2" />
                      Sell Product
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Want to Buy
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* User Listings */}
              <Card>
                <CardHeader>
                  <CardTitle>My Listings & Posts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Your listings and posts will appear here</p>
                    <Button className="mt-4">
                      <Plus className="h-4 w-4 mr-2" />
                      Create First Listing
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="details" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Groups */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="h-5 w-5 mr-2" />
                      Joined Groups
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {user.groups.map((group) => (
                        <div key={group.id} className="flex items-center p-3 border border-gray-200 rounded-lg">
                          <img src={group.image} alt={group.name} className="w-10 h-10 rounded-full mr-3" />
                          <div>
                            <h3 className="font-medium text-sm">{group.name}</h3>
                            <p className="text-xs text-gray-500">Active member</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Connections */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <LinkIcon className="h-5 w-5 mr-2" />
                      Connections
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {user.connections.map((connection) => (
                        <div key={connection.id} className="flex items-center p-3 border border-gray-200 rounded-lg">
                          <img src={connection.avatar} alt={connection.name} className="w-10 h-10 rounded-full mr-3" />
                          <div>
                            <h3 className="font-medium text-sm">{connection.name}</h3>
                            <p className="text-xs text-gray-500">Connected</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* All Badges */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Award className="h-5 w-5 mr-2" />
                      All Badges
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      {user.badges.map((badge, index) => (
                        <div key={index} className="flex flex-col items-center p-3 border border-gray-200 rounded-lg">
                          <Award className="h-6 w-6 text-yellow-500 mb-1" />
                          <span className="font-medium text-xs text-center">{badge}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Professional Analytics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2" />
                      Professional Analytics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-xl font-bold text-blue-600">{user.analytics.productViews.toLocaleString()}</div>
                        <div className="text-xs text-blue-500">Product Views</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-xl font-bold text-green-600">{user.analytics.productLikes.toLocaleString()}</div>
                        <div className="text-xs text-green-500">Product Likes</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-xl font-bold text-purple-600">18.7%</div>
                        <div className="text-xs text-purple-500">Conversion Rate</div>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <div className="text-xl font-bold text-orange-600">94%</div>
                        <div className="text-xs text-orange-500">Response Rate</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default UserProfile;
