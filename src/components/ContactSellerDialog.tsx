
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { MessageSquare } from 'lucide-react';
import { Product, User } from '@/models/types';
import { getCurrentUser } from '@/utils/mockData';

interface ContactSellerDialogProps {
  seller: User;
  product: Product;
}

const ContactSellerDialog = ({ seller, product }: ContactSellerDialogProps) => {
  const [message, setMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const currentUser = getCurrentUser();
  
  const handleSendMessage = () => {
    if (message.trim() === '') return;
    
    toast({
      title: 'Message Sent',
      description: `Your message has been sent to ${seller.name}. They will respond shortly.`,
    });
    
    setMessage('');
    setIsOpen(false);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <MessageSquare className="h-4 w-4 mr-2" />
          Contact Seller
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Contact {seller.name}</DialogTitle>
          <DialogDescription>
            Ask a question about "{product.title}"
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4">
          <div className="flex items-start gap-4 mb-4">
            <div className="h-10 w-10 rounded-full overflow-hidden flex-shrink-0">
              <img src={seller.avatar} alt={seller.name} className="h-full w-full object-cover" />
            </div>
            <div>
              <p className="font-medium">{seller.name}</p>
              <p className="text-xs text-gray-500">Member since {new Date(seller.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          
          <Textarea
            placeholder="Write your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[120px]"
          />
        </div>
        
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button onClick={handleSendMessage}>Send Message</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContactSellerDialog;
