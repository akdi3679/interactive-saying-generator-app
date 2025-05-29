
import { useEffect, useState } from 'react';
import { Product } from '../models/types';
import ProductCard from './ProductCard';
import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ProductService } from '../services/ProductService';
import { Skeleton } from './ui/skeleton';

const FeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const fetchedProducts = await ProductService.getProducts();
        // Filter out archived products for featured display
        const activeProducts = fetchedProducts.filter(product => !product.isArchived);
        setProducts(activeProducts.slice(0, 8)); // Limit to 8 products for featured section
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);
  
  const handleSeeAll = () => {
    navigate('/search');
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Featured Listings</h2>
        <Button variant="link" className="text-[#3665f3] flex items-center" onClick={handleSeeAll}>
          See all <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
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
          <h3 className="text-lg font-medium text-gray-600 mb-2">No products available</h3>
          <p className="text-gray-500 mb-4">Be the first to list a product!</p>
          <Button 
            onClick={() => document.getElementById('sell-button')?.click()}
            className="bg-[#3665f3] hover:bg-[#3665f3]/90"
          >
            List an item
          </Button>
        </div>
      )}
    </div>
  );
};

export default FeaturedProducts;
