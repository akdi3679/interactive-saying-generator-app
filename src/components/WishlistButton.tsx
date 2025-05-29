
import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { useAuth } from '../context/MongoAuthContext';

interface WishlistButtonProps {
  productId: string;
  initialState?: boolean;
}

const WishlistButton = ({ productId, initialState }: WishlistButtonProps) => {
  const { user } = useAuth();
  const [isWishlisted, setIsWishlisted] = useState(initialState || false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkWishlist = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        // Check localStorage for wishlist items
        const wishlist = JSON.parse(localStorage.getItem(`wishlist_${user.id}`) || '[]');
        setIsWishlisted(wishlist.includes(productId));
      } catch (error) {
        console.error('Error checking wishlist:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkWishlist();
  }, [productId, user]);

  const toggleWishlist = async () => {
    if (!user) {
      toast.error('Please sign in to save items to your wishlist');
      return;
    }

    try {
      const wishlist = JSON.parse(localStorage.getItem(`wishlist_${user.id}`) || '[]');
      
      if (isWishlisted) {
        // Remove from wishlist
        const updatedWishlist = wishlist.filter((id: string) => id !== productId);
        localStorage.setItem(`wishlist_${user.id}`, JSON.stringify(updatedWishlist));
        setIsWishlisted(false);
        toast.info('Removed from your wishlist');
      } else {
        // Add to wishlist
        const updatedWishlist = [...wishlist, productId];
        localStorage.setItem(`wishlist_${user.id}`, JSON.stringify(updatedWishlist));
        setIsWishlisted(true);
        toast.success('Added to your wishlist');
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
      toast.error('Failed to update wishlist');
    }
  };

  if (isLoading) {
    return (
      <button
        className="rounded-full p-2 transition-colors hover:bg-gray-100 active:bg-gray-200"
        aria-label="Loading wishlist status"
        disabled
      >
        <Heart className="h-5 w-5 text-gray-300" />
      </button>
    );
  }

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        toggleWishlist();
      }}
      className="rounded-full p-2 transition-colors hover:bg-gray-100 active:bg-gray-200"
      aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
    >
      {isWishlisted ? (
        <Heart className="h-5 w-5 fill-red-500 text-red-500" />
      ) : (
        <Heart className="h-5 w-5 text-gray-500" />
      )}
    </button>
  );
};

export default WishlistButton;
