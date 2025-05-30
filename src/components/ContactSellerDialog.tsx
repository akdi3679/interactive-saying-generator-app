
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { MessageSquare, Send, Check } from 'lucide-react';
import { Product, User } from '@/models/types';

interface ContactSellerDialogProps {
  seller: User;
  product: Product;
}

const ContactSellerDialog = ({ seller, product }: ContactSellerDialogProps) => {
  const [message, setMessage] = useState('Is this item still available?');
  const [isOpen, setIsOpen] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const { toast } = useToast();
  
  const handleSendMessage = () => {
    if (message.trim() === '') return;
    
    // Add conversation to localStorage for Messages page
    const conversations = JSON.parse(localStorage.getItem('conversations') || '[]');
    const newConversation = {
      id: Date.now().toString(),
      sellerId: seller.id,
      sellerName: seller.name,
      sellerAvatar: seller.avatar,
      productTitle: product.title,
      lastMessage: message,
      lastMessageTime: new Date().toISOString(),
      messages: [
        {
          id: Date.now().toString(),
          fromUser: 'current',
          content: message,
          timestamp: new Date().toISOString(),
          isRead: true
        }
      ]
    };
    
    conversations.push(newConversation);
    localStorage.setItem('conversations', JSON.stringify(conversations));
    
    setIsSent(true);
    
    toast({
      title: 'Message Sent',
      description: `Your message has been sent to ${seller.name}.`,
    });
    
    setTimeout(() => {
      setIsOpen(false);
      setIsSent(false);
      setMessage('Is this item still available?');
    }, 2000);
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
            Ask about "{product.title}"
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4">
          <div className="flex items-start gap-4 mb-4">
            <div className="h-10 w-10 rounded-full overflow-hidden flex-shrink-0">
              <img src={seller.avatar} alt={seller.name} className="h-full w-full object-cover" />
            </div>
            <div>
              <p className="font-medium">{seller.name}</p>
              <p className="text-xs text-gray-500">Member since {new Date(seller.createdAt).getFullYear()}</p>
            </div>
          </div>
          
          {!isSent ? (
            <div className="space-y-4">
              <Textarea
                placeholder="Write your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[80px]"
              />
              <Button onClick={handleSendMessage} className="w-full">
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-center py-8 text-green-600">
              <Check className="h-8 w-8 mr-2" />
              <span className="font-medium">Message sent successfully!</span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactSellerDialog;
