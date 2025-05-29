
import React, { useState, useEffect } from 'react';
import { Product } from '../models/types';
import { Button } from './ui/button';
import { ArrowRight, ChevronLeft, ChevronRight, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ProductService } from '../services/ProductService';
import { Skeleton } from './ui/skeleton';

const DailyDeals = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchDailyDeals = async () => {
      try {
        setLoading(true);
        const fetchedProducts = await ProductService.getProducts();
        // Mock daily deals - filter products with discounts
        const dealsProducts = fetchedProducts
          .filter(product => !product.isArchived)
          .slice(0, 12); // Limit to 12 products for deals
        setProducts(dealsProducts);
      } catch (error) {
        console.error('Error fetching daily deals:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDailyDeals();
  }, []);
  
  const handleSeeAll = () => {
    navigate('/search?deals=daily');
  };

  const scrollLeft = () => {
    const container = document.getElementById('deals-container');
    if (container) {
      container.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    const container = document.getElementById('deals-container');
    if (container) {
      container.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Tag className="h-6 w-6 text-red-500" />
          <h2 className="text-2xl font-bold">Daily Deals</h2>
          <div className="bg-red-500/10 text-red-500 text-xs px-2 py-1 rounded-full">
            Limited Time
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={scrollLeft}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={scrollRight}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="link" className="text-[#3665f3] flex items-center ml-2" onClick={handleSeeAll}>
            See all <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
      
      {loading ? (
        <div className="flex gap-4 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-48 border border-gray-200 rounded-md overflow-hidden">
              <Skeleton className="h-32 w-full" />
              <div className="p-3">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length > 0 ? (
        <div 
          id="deals-container"
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map(product => (
            <div 
              key={product.id}
              className="flex-shrink-0 w-48 border border-gray-200 rounded-md overflow-hidden hover:shadow-md transition-shadow duration-200 bg-white cursor-pointer"
              onClick={() => navigate(`/product/${product.id}`)}
            >
              <div className="relative">
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="h-32 w-full object-cover"
                />
                <div className="absolute top-2 left-2 bg-red-500 text-white text-xs py-1 px-2 rounded">
                  DEAL
                </div>
                {/* Mock discount percentage */}
                <div className="absolute top-2 right-2 bg-green-500 text-white text-xs py-1 px-2 rounded">
                  -{Math.floor(Math.random() * 30 + 10)}%
                </div>
              </div>
              <div className="p-3">
                <h3 className="font-medium text-sm leading-tight line-clamp-2 h-8 mb-2">{product.title}</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-bold text-red-600">
                    ${(product.price * 0.8).toFixed(2)}
                  </span>
                  <span className="text-xs text-gray-500 line-through">
                    ${product.price.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center mt-1 text-xs text-gray-500">
                  <span className="truncate">{product.location}</span>
                </div>
                {product.shipping?.freeShipping && (
                  <div className="mt-1 text-xs font-medium text-green-600">
                    Free shipping
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border border-dashed border-gray-300 rounded-md">
          <Tag className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">No deals available</h3>
          <p className="text-gray-500 mb-4">Check back later for amazing deals!</p>
        </div>
      )}
    </div>
  );
};

export default DailyDeals;
