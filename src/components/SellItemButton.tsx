
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
import { SellItemForm } from './sell-item/SellItemForm';

const SellItemButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleSuccess = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button id="sell-button" className="bg-[#3665f3] hover:bg-[#3665f3]/90 flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <span>Sell</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Listing</DialogTitle>
        </DialogHeader>
        
        <SellItemForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
};

export default SellItemButton;
