
import React, { useState, useEffect } from 'react';
import { Product } from '../models/types';
import ProductCard from './ProductCard';
import { Button } from './ui/button';
import { ArrowRight, Heart, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ProductService } from '../services/ProductService';
import { Skeleton } from './ui/skeleton';

const ForYouSection = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchForYouProducts = async () => {
      try {
        setLoading(true);
        const fetchedProducts = await ProductService.getProducts();
        // Mock "For You" algorithm - mix of recent, popular, and relevant items
        const forYouProducts = fetchedProducts
          .filter(product => !product.isArchived)
          .sort(() => Math.random() - 0.5) // Random for demo
          .slice(0, 12);
        setProducts(forYouProducts);
      } catch (error) {
        console.error('Error fetching For You products:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchForYouProducts();
  }, []);
  
  const handleSeeAll = () => {
    navigate('/search?tab=foryou');
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Heart className="h-6 w-6 text-[#3665f3]" />
          <h2 className="text-2xl font-bold">For You</h2>
          <div className="bg-[#3665f3]/10 text-[#3665f3] text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            Recommended
          </div>
        </div>
        <Button variant="link" className="text-[#3665f3] flex items-center" onClick={handleSeeAll}>
          See all <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(12)].map((_, i) => (
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
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border border-dashed border-gray-300 rounded-md">
          <Heart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">No recommendations yet</h3>
          <p className="text-gray-500 mb-4">Browse some products to get personalized recommendations!</p>
          <Button 
            onClick={() => navigate('/search')}
            className="bg-[#3665f3] hover:bg-[#3665f3]/90"
          >
            Explore Products
          </Button>
        </div>
      )}
    </div>
  );
};

export default ForYouSection;
