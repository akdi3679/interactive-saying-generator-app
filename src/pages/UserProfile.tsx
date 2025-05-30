
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
  Link as LinkIcon
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
          {/* Profile Header */}
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

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="badges">Badges</TabsTrigger>
              <TabsTrigger value="groups">Groups</TabsTrigger>
              <TabsTrigger value="connections">Connections</TabsTrigger>
              <TabsTrigger value="listings">Listings</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${user.analytics.earnings.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                      From {user.analytics.totalSales} sales
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
                    <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{user.analytics.activeListings}</div>
                    <p className="text-xs text-muted-foreground">
                      Currently listed
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Profile Views</CardTitle>
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{user.analytics.profileVisits.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                      This month
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="badges">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="h-5 w-5 mr-2" />
                    Your Badges
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {user.badges.map((badge, index) => (
                      <div key={index} className="flex flex-col items-center p-4 border border-gray-200 rounded-lg">
                        <Award className="h-8 w-8 text-yellow-500 mb-2" />
                        <span className="font-medium text-sm text-center">{badge}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="groups">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Joined Groups
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {user.groups.map((group) => (
                      <div key={group.id} className="flex items-center p-4 border border-gray-200 rounded-lg">
                        <img src={group.image} alt={group.name} className="w-12 h-12 rounded-full mr-3" />
                        <div>
                          <h3 className="font-medium">{group.name}</h3>
                          <p className="text-sm text-gray-500">Active member</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="connections">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <LinkIcon className="h-5 w-5 mr-2" />
                    Connections
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {user.connections.map((connection) => (
                      <div key={connection.id} className="flex items-center p-4 border border-gray-200 rounded-lg">
                        <img src={connection.avatar} alt={connection.name} className="w-12 h-12 rounded-full mr-3" />
                        <div>
                          <h3 className="font-medium">{connection.name}</h3>
                          <p className="text-sm text-gray-500">Connected</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="listings">
              <Card>
                <CardHeader>
                  <CardTitle>My Listings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Your listings will appear here</p>
                    <Button className="mt-4">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Listing
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Product Views</CardTitle>
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{user.analytics.productViews.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                      Total product views
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Product Likes</CardTitle>
                    <Heart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{user.analytics.productLikes.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                      Total likes received
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">18.7%</div>
                    <p className="text-xs text-muted-foreground">
                      Views to sales
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg. Sale Price</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${(user.analytics.earnings / user.analytics.totalSales).toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">
                      Per item sold
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">94%</div>
                    <p className="text-xs text-muted-foreground">
                      Within 24 hours
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Repeat Customers</CardTitle>
                    <Heart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">34%</div>
                    <p className="text-xs text-muted-foreground">
                      Return rate
                    </p>
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
