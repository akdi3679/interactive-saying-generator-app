
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreateGroupDialog } from '@/components/groups/CreateGroupDialog';
import { GroupService } from '@/services/GroupService';
import { Group } from '@/models/group.types';
import { useAuth } from '@/context/AuthContext';
import { Users, Plus, Eye } from 'lucide-react';

const GroupsDropdown = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [userGroups, setUserGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchGroups();
  }, [user]);

  const fetchGroups = async () => {
    try {
      await GroupService.initializeDefaultGroups();
      const allGroups = await GroupService.getGroups();
      setGroups(allGroups);
      
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
    fetchGroups();
  };

  const handleViewAllGroups = () => {
    navigate('/groups');
  };

  const handleViewGroup = (groupId: string) => {
    navigate(`/groups/${groupId}`);
  };

  if (loading) {
    return (
      <Button variant="ghost" size="sm" disabled>
        <Users className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Users className="h-4 w-4" />
          {userGroups.length > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs">
              {userGroups.length}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 bg-white">
        <div className="p-2">
          <h3 className="font-semibold text-sm mb-2">My Groups</h3>
          {userGroups.length > 0 ? (
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {userGroups.map((group) => (
                <DropdownMenuItem 
                  key={group.id}
                  onClick={() => handleViewGroup(group.id)}
                  className="flex items-center justify-between p-2 rounded cursor-pointer hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <div className="font-medium text-sm">{group.name}</div>
                    <div className="text-xs text-gray-500">{group.memberCount} members</div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {group.category}
                  </Badge>
                </DropdownMenuItem>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-500 py-2">
              You haven't joined any groups yet
            </div>
          )}
        </div>
        
        <DropdownMenuSeparator />
        
        <div className="p-2">
          <h3 className="font-semibold text-sm mb-2">Available Groups</h3>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {groups.filter(group => !userGroups.some(ug => ug.id === group.id)).slice(0, 3).map((group) => (
              <DropdownMenuItem 
                key={group.id}
                onClick={() => handleViewGroup(group.id)}
                className="flex items-center justify-between p-2 rounded cursor-pointer hover:bg-gray-50"
              >
                <div className="flex-1">
                  <div className="font-medium text-sm">{group.name}</div>
                  <div className="text-xs text-gray-500">{group.memberCount} members</div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {group.category}
                </Badge>
              </DropdownMenuItem>
            ))}
          </div>
        </div>
        
        <DropdownMenuSeparator />
        
        <div className="p-2 space-y-2">
          <DropdownMenuItem 
            onClick={handleViewAllGroups}
            className="flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-gray-50"
          >
            <Eye className="h-4 w-4" />
            <span>View All Groups</span>
          </DropdownMenuItem>
          
          {user && (
            <div className="px-2">
              <CreateGroupDialog onGroupCreated={handleGroupCreated} />
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default GroupsDropdown;
