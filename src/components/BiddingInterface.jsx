
import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useToast } from '../hooks/use-toast';
import { ProductService } from '../services/ProductService';
import { TestAuthService } from '../services/TestAuthService';
import { formatDistanceToNow } from 'date-fns';
import { Clock, Gavel } from 'lucide-react';

const BiddingInterface = ({ 
  productId, 
  currentBid, 
  bidCount, 
  endTime, 
  onBidPlaced 
}) => {
  const [bidAmount, setBidAmount] = useState('');
  const [isPlacingBid, setIsPlacingBid] = useState(false);
  const { toast } = useToast();

  const user = TestAuthService.getCurrentUser();
  const minBid = currentBid + 1;

  const handlePlaceBid = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Sign In Required",
        description: "Please sign in to place a bid.",
      });
      return;
    }

    const amount = parseFloat(bidAmount);
    if (isNaN(amount) || amount < minBid) {
      toast({
        variant: "destructive",
        title: "Invalid Bid",
        description: `Your bid must be at least $${minBid.toFixed(2)}`,
      });
      return;
    }

    setIsPlacingBid(true);
    try {
      const success = await ProductService.placeBid(productId, user.id, amount);
      if (success) {
        toast({
          title: "Bid Placed Successfully!",
          description: `Your bid of $${amount.toFixed(2)} has been placed.`,
        });
        setBidAmount('');
        onBidPlaced?.();
      } else {
        toast({
          variant: "destructive",
          title: "Bid Failed",
          description: "Failed to place bid. Please try again.",
        });
      }
    } catch (error) {
      console.error('Error placing bid:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while placing your bid.",
      });
    } finally {
      setIsPlacingBid(false);
    }
  };

  const isAuctionEnded = endTime && new Date() > endTime;

  return (
    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
      <div className="flex items-center gap-2 mb-3">
        <Gavel className="h-5 w-5 text-[#3665f3]" />
        <h3 className="font-semibold text-[#3665f3]">Live Auction</h3>
        {isAuctionEnded && (
          <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded">
            ENDED
          </span>
        )}
      </div>
      
      <div className="mb-3">
        <div className="text-sm text-gray-600">Current bid:</div>
        <div className="text-2xl font-bold text-[#3665f3]">
          ${currentBid.toFixed(2)}
        </div>
        <div className="text-xs text-gray-500">
          [{bidCount} {bidCount === 1 ? 'bid' : 'bids'}]
        </div>
      </div>

      {endTime && (
        <div className="mb-3 text-sm text-gray-600 flex items-center gap-1">
          <Clock className="h-4 w-4" />
          {isAuctionEnded ? (
            'Auction ended'
          ) : (
            `Ends ${formatDistanceToNow(endTime, { addSuffix: true })}`
          )}
        </div>
      )}

      {!isAuctionEnded && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder={`Min $${minBid.toFixed(2)}`}
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              min={minBid}
              step="0.01"
              className="text-sm"
            />
            <Button 
              onClick={handlePlaceBid}
              disabled={isPlacingBid || !bidAmount}
              className="bg-[#3665f3] hover:bg-[#3665f3]/90"
            >
              {isPlacingBid ? 'Bidding...' : 'Place Bid'}
            </Button>
          </div>
          <div className="text-xs text-gray-500">
            Enter ${minBid.toFixed(2)} or more
          </div>
        </div>
      )}
    </div>
  );
};

export default BiddingInterface;
