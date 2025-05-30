
import { useState } from 'react';
import { Button } from './ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from './ui/dialog';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TestAuthService } from '../services/TestAuthService';
import { useToast } from '@/hooks/use-toast';

const SellItemButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleSellClick = () => {
    const user = TestAuthService.getCurrentUser();
    if (!user) {
      navigate('/signin');
      return;
    }
    
    toast({
      title: "Sell Feature",
      description: "Sell item dialog would open here. In a full app, this would show the sell form.",
    });
    setIsOpen(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button 
        className="bg-[#3665f3] hover:bg-[#3665f3]/90 flex items-center gap-2"
        onClick={handleSellClick}
      >
        <Plus className="h-4 w-4" />
        <span>Sell</span>
      </Button>
      
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Listing</DialogTitle>
        </DialogHeader>
        
        <div className="p-4">
          <p className="text-gray-600">
            Sell item form would be implemented here. This would include:
          </p>
          <ul className="list-disc ml-6 mt-2 text-gray-600">
            <li>Product title and description</li>
            <li>Images upload</li>
            <li>Price and category selection</li>
            <li>Shipping options</li>
            <li>Auction vs Buy Now options</li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SellItemButton;
