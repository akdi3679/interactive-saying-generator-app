
import { useState, useEffect } from 'react';
import { GroupCard } from '@/components/groups/GroupCard';
import { CreateGroupDialog } from '@/components/groups/CreateGroupDialog';
import { GroupService } from '@/services/GroupService';
import { Group } from '@/models/group.types';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Groups = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeAndFetchGroups();
  }, []);

  const initializeAndFetchGroups = async () => {
    try {
      await GroupService.initializeDefaultGroups();
      const fetchedGroups = await GroupService.getGroups();
      setGroups(fetchedGroups);
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Groups</h1>
            <p className="text-gray-600 mt-2">Join groups to buy and sell specific types of products</p>
          </div>
          <CreateGroupDialog onGroupCreated={handleGroupCreated} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <GroupCard 
              key={group.id} 
              group={group} 
              onJoin={handleGroupJoin}
            />
          ))}
        </div>

        {groups.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No groups available yet.</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Groups;
