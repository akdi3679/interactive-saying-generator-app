
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GroupCard } from '../components/groups/GroupCard';
import { CreateGroupDialog } from '../components/groups/CreateGroupDialog';
import { GroupService } from '../services/GroupService';
import { useDatabase } from '../hooks/useDatabase';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import { Search, Users, TrendingUp, ShoppingBag } from 'lucide-react';

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [userGroups, setUserGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useDatabase();
  const navigate = useNavigate();

  useEffect(() => {
    initializeAndFetchGroups();
  }, [user]);

  const initializeAndFetchGroups = async () => {
    try {
      await GroupService.initializeDefaultGroups();
      const fetchedGroups = await GroupService.getGroups();
      setGroups(fetchedGroups);
      
      if (user) {
        const memberGroups = await GroupService.getUserGroups(user.id);
        setUserGroups(memberGroups);
      }
    } catch (error) {
      console.error('Error fetching groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGroupCreated = () => {
    initializeAndFetchGroups();
  };

  const handleGroupJoin = () => {
    initializeAndFetchGroups();
  };

  const handleGroupClick = (groupId) => {
    navigate(`/groups/${groupId}`);
  };

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <div>Loading groups...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Buy & Sell Groups</h1>
              <p className="text-gray-600 mt-2">Join communities to buy and sell with people near you</p>
            </div>
            <CreateGroupDialog onGroupCreated={handleGroupCreated} />
          </div>

          {/* Search Bar */}
          <div className="mt-6 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search groups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 max-w-md"
            />
          </div>
        </div>

        {/* My Groups Section */}
        {user && userGroups.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-5 w-5 text-blue-600" />
              <h2 className="text-xl font-semibold">My Groups</h2>
              <Badge variant="secondary">{userGroups.length}</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userGroups.map((group) => (
                <Card key={group.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleGroupClick(group.id)}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{group.name}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2">{group.description}</p>
                      </div>
                      <Badge variant="secondary" className="ml-2">Member</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Users className="h-4 w-4" />
                        <span>{group.memberCount} members</span>
                      </div>
                      <Badge variant="outline">{group.category}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Featured Groups Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <h2 className="text-xl font-semibold">Popular Groups</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGroups.slice(0, 6).map((group) => (
              <div key={group.id} onClick={() => handleGroupClick(group.id)}>
                <GroupCard 
                  group={group} 
                  onJoin={handleGroupJoin}
                  showJoinButton={user && !userGroups.some(ug => ug.id === group.id)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Browse by Category */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <ShoppingBag className="h-5 w-5 text-purple-600" />
            <h2 className="text-xl font-semibold">Browse by Category</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {['Electronics', 'Fashion', 'Furniture', 'Vehicles', 'Collectibles', 'General'].map((category) => (
              <Button 
                key={category}
                variant="outline" 
                className="h-16 flex flex-col items-center justify-center"
                onClick={() => setSearchQuery(category)}
              >
                <span className="text-sm font-medium">{category}</span>
                <span className="text-xs text-gray-500">
                  {groups.filter(g => g.category === category).length} groups
                </span>
              </Button>
            ))}
          </div>
        </div>

        {/* All Groups */}
        {filteredGroups.length === 0 && searchQuery && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No groups found</h3>
            <p className="text-gray-500">Try searching with different keywords</p>
          </div>
        )}

        {filteredGroups.length === 0 && !searchQuery && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No groups available yet</h3>
            <p className="text-gray-500 mb-4">Be the first to create a group in your community</p>
            <CreateGroupDialog onGroupCreated={handleGroupCreated} />
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Groups;
