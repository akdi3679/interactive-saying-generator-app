
import { useState } from 'react';
import { Product } from '../models/types';
import { formatDistanceToNow } from 'date-fns';
import WishlistButton from './WishlistButton';
import { useNavigate } from 'react-router-dom';
import { Tag, Truck, RotateCcw, Send, Check } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [message, setMessage] = useState('Is this item still available?');
  const [isSent, setIsSent] = useState(false);
  
  const handleClick = (e: React.MouseEvent) => {
    // Only navigate if not clicking on interactive elements
    if ((e.target as HTMLElement).closest('.no-navigate')) {
      return;
    }
    navigate(`/product/${product.id}`);
  };

  const handleSendMessage = () => {
    if (message.trim() === '') return;
    
    // Add conversation to localStorage for Messages page
    const conversations = JSON.parse(localStorage.getItem('conversations') || '[]');
    const newConversation = {
      id: Date.now().toString(),
      sellerId: product.seller.id,
      sellerName: product.seller.name,
      sellerAvatar: product.seller.avatar,
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
      description: `Your message has been sent to ${product.seller.name}.`,
    });
    
    setTimeout(() => {
      setIsSent(false);
      setMessage('Is this item still available?');
    }, 2000);
  };
  
  const hasAuction = product.bidding?.isAuction;
  const hasBuyNow = product.buyNowPrice !== undefined;
  
  return (
    <div 
      className="border border-gray-200 rounded-md overflow-hidden hover:shadow-md transition-shadow duration-200 bg-white cursor-pointer"
      onClick={handleClick}
    >
      <div className="relative">
        <img
          src={product.images[0]}
          alt={product.title}
          className="h-48 w-full object-cover"
        />
        <div className="absolute top-2 right-2 no-navigate">
          <WishlistButton productId={product.id} />
        </div>
        {product.isArchived && (
          <div className="absolute bottom-2 left-2 bg-gray-800/80 text-white text-xs py-1 px-2 rounded">
            Archived
          </div>
        )}
      </div>
      
      <div className="p-3">
        <h3 className="font-medium text-sm leading-tight line-clamp-2 h-10 mb-2">{product.title}</h3>
        
        <div className="mb-2">
          {hasAuction && (
            <div className="flex items-center text-xs text-gray-500 mb-1">
              <span>Current bid:</span>
              <span className="font-bold text-base ml-1 text-[#3665f3]">
                ${product.bidding?.currentBid?.toFixed(2)}
              </span>
            </div>
          )}
          
          {hasBuyNow && (
            <div className="flex items-center text-xs text-gray-500 mb-1">
              <span>{hasAuction ? "Buy it now:" : "Price:"}</span>
              <span className="font-bold text-base ml-1 text-black">
                ${product.buyNowPrice?.toFixed(2)}
              </span>
            </div>
          )}
          
          {!hasAuction && !hasBuyNow && (
            <div className="font-bold text-base text-black mb-1">
              ${product.price.toFixed(2)}
            </div>
          )}
        </div>
        
        <div className="space-y-1 text-xs text-gray-600 mb-3">
          <div className="flex items-center">
            <Tag className="h-3 w-3 mr-1" />
            <span>{product.condition}</span>
          </div>
          
          {product.shipping && (
            <div className="flex items-center">
              <Truck className="h-3 w-3 mr-1" />
              <span>
                {product.shipping.freeShipping ? 'Free shipping' : `$${product.shipping.cost.toFixed(2)} shipping`}
              </span>
            </div>
          )}
          
          {product.returns && (
            <div className="flex items-center">
              <RotateCcw className="h-3 w-3 mr-1" />
              <span>
                {product.returns.accepted ? `${product.returns.periodDays || 30} day returns` : 'No returns'}
              </span>
            </div>
          )}
        </div>
        
        {/* Contact Seller Section */}
        <div className="no-navigate mb-3">
          {!isSent ? (
            <div className="space-y-2">
              <Textarea
                placeholder="Write your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[60px] text-xs"
              />
              <Button onClick={handleSendMessage} size="sm" className="w-full">
                <Send className="h-3 w-3 mr-1" />
                Send
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-center py-3 text-green-600">
              <Check className="h-4 w-4 mr-2" />
              <span className="text-xs font-medium">Message sent!</span>
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center text-xs text-gray-500">
          <span className="truncate max-w-[70%]">{product.location}</span>
          <span>
            {formatDistanceToNow(new Date(product.createdAt), { addSuffix: true })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
