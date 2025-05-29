
import React, { useState, useEffect, useCallback } from 'react';
import { Product } from '../models/types';
import ProductCard from './ProductCard';
import { Button } from './ui/button';
import { ArrowRight, Heart, TrendingUp, Target, Gavel } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ProductService } from '../services/ProductService';
import { Skeleton } from './ui/skeleton';

const ForYouSection = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate();
  
  const loadProducts = useCallback(async (pageNum: number, append = false) => {
    try {
      if (pageNum === 1) setLoading(true);
      else setLoadingMore(true);
      
      const fetchedProducts = await ProductService.getProducts();
      const activeProducts = fetchedProducts.filter(product => !product.isArchived);
      
      // Simulate pagination
      const itemsPerPage = 12;
      const startIndex = (pageNum - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const pageProducts = activeProducts.slice(startIndex, endIndex);
      
      if (append) {
        setProducts(prev => [...prev, ...pageProducts]);
      } else {
        setProducts(pageProducts);
      }
      
      setHasMore(endIndex < activeProducts.length);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);
  
  useEffect(() => {
    loadProducts(1);
  }, [loadProducts]);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || loadingMore || !hasMore) {
        return;
      }
      
      const nextPage = page + 1;
      setPage(nextPage);
      loadProducts(nextPage, true);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [page, loadingMore, hasMore, loadProducts]);
  
  const handleSeeAll = () => {
    navigate('/search?tab=foryou');
  };

  // Mock ad component
  const AdComponent = ({ index }: { index: number }) => (
    <div className="border border-blue-200 rounded-md overflow-hidden bg-gradient-to-r from-blue-50 to-purple-50 p-4">
      <div className="text-center">
        <Target className="h-8 w-8 mx-auto text-blue-500 mb-2" />
        <h3 className="font-bold text-blue-600 mb-1">Sponsored</h3>
        <p className="text-sm text-gray-600 mb-2">Discover amazing deals</p>
        <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
          Learn More
        </Button>
      </div>
    </div>
  );

  // Mock hot bid suggestion
  const HotBidSuggestion = () => (
    <div className="col-span-full my-6">
      <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Gavel className="h-6 w-6 text-orange-500" />
            <div>
              <h3 className="font-bold text-orange-700">Hot Bidding Now!</h3>
              <p className="text-sm text-orange-600">Don't miss these ending soon</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="border-orange-300 text-orange-600 hover:bg-orange-100"
            onClick={() => navigate('/bidding')}
          >
            View Hot Bids
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4">
          {products.filter(p => p.bidding?.isAuction).slice(0, 3).map(product => (
            <div key={product.id} className="text-center">
              <img src={product.images[0]} alt={product.title} className="h-16 w-16 object-cover rounded mx-auto mb-1" />
              <p className="text-xs text-gray-600 truncate">{product.title}</p>
              <p className="text-xs font-bold text-orange-600">${product.bidding?.currentBid}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Heart className="h-6 w-6 text-[#3665f3]" />
          <h2 className="text-2xl font-bold">Recommended for You</h2>
          <div className="bg-[#3665f3]/10 text-[#3665f3] text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            Personalized
          </div>
        </div>
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
          {products.map((product, index) => (
            <React.Fragment key={product.id}>
              <ProductCard product={product} />
              
              {/* Insert ads every 8 products */}
              {(index + 1) % 8 === 0 && <AdComponent index={index} />}
              
              {/* Insert hot bid suggestion every 16 products */}
              {(index + 1) % 16 === 0 && <HotBidSuggestion />}
            </React.Fragment>
          ))}
          
          {/* Loading more indicator */}
          {loadingMore && (
            <>
              {[...Array(4)].map((_, i) => (
                <div key={`loading-${i}`} className="border border-gray-200 rounded-md overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <div className="p-3">
                    <Skeleton className="h-5 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-2" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                </div>
              ))}
            </>
          )}
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
      
      {!loading && !loadingMore && hasMore && (
        <div className="text-center mt-8">
          <p className="text-gray-500">Scroll down to load more products...</p>
        </div>
      )}
    </div>
  );
};

export default ForYouSection;
