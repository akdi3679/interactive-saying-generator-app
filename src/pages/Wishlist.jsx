
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { useDatabase } from '../hooks/useDatabase';
import { ProductService } from '../services/ProductService';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';

const Wishlist = () => {
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useDatabase();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchWishlist = async () => {
      setLoading(true);
      
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        const wishlist = JSON.parse(localStorage.getItem(`wishlist_${user.id}`) || '[]');
        
        if (wishlist.length === 0) {
          setWishlistProducts([]);
          setLoading(false);
          return;
        }
        
        const allProducts = await ProductService.getProducts();
        const wishlistProducts = allProducts.filter(product => wishlist.includes(product.id));
        
        setWishlistProducts(wishlistProducts);
      } catch (error) {
        console.error('Error fetching wishlist:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchWishlist();
  }, [user]);
  
  const handleSignIn = () => {
    document.querySelector('button[aria-label="Sign in"]')?.click();
  };
  
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-1 container mx-auto px-4 py-8 flex flex-col items-center justify-center">
          <div className="text-center max-w-md">
            <h1 className="text-2xl font-bold mb-4">Sign in to view your wishlist</h1>
            <p className="text-gray-600 mb-6">
              Save items you love and keep track of them in your wishlist.
            </p>
            <Button onClick={handleSignIn} className="bg-[#3665f3] hover:bg-[#3665f3]/90">
              Sign in
            </Button>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Your Wishlist</h1>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="border border-gray-200 rounded-md overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <div className="p-3">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : wishlistProducts.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-gray-300 rounded-md">
            <h2 className="text-xl font-medium text-gray-600 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-4">Add items to your wishlist to save them for later.</p>
            <Button 
              onClick={() => navigate('/')}
              className="bg-[#3665f3] hover:bg-[#3665f3]/90"
            >
              Browse products
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {wishlistProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Wishlist;
