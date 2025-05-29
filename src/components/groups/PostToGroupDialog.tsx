
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { GroupService } from '@/services/GroupService';
import { Group } from '@/models/group.types';
import { useAuth } from '@/context/AuthContext';
import { Share } from 'lucide-react';

interface PostToGroupDialogProps {
  productId: string;
  productTitle: string;
}

export const PostToGroupDialog = ({ productId, productTitle }: PostToGroupDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [userGroups, setUserGroups] = useState<Group[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user && isOpen) {
      fetchUserGroups();
    }
  }, [user, isOpen]);

  const fetchUserGroups = async () => {
    if (!user) return;
    const groups = await GroupService.getUserGroups(user.id);
    setUserGroups(groups);
  };

  const handleShare = () => {
    if (!selectedGroupId) {
      toast({
        variant: "destructive",
        title: "No Group Selected",
        description: "Please select a group to share to.",
      });
      return;
    }

    // In a real app, this would create a post or share the product to the group
    toast({
      title: "Shared to Group",
      description: `"${productTitle}" has been shared to the group.`,
    });
    setIsOpen(false);
    setSelectedGroupId('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Share className="h-4 w-4" />
          Share to Group
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share to Group</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Select Group</label>
            <Select value={selectedGroupId} onValueChange={setSelectedGroupId}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Choose a group to share to" />
              </SelectTrigger>
              <SelectContent>
                {userGroups.map((group) => (
                  <SelectItem key={group.id} value={group.id}>
                    {group.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {userGroups.length === 0 && (
            <p className="text-sm text-gray-500">
              You need to join groups first to share products.
            </p>
          )}
          
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleShare}
              disabled={!selectedGroupId}
            >
              Share
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
