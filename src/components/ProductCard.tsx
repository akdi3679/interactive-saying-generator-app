
import { Product } from '../models/types';
import { useNavigate } from 'react-router-dom';
import { MapPin, Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/product/${product.id}`);
  };
  
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
        {product.bidding?.isAuction && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
            Auction
          </div>
        )}
      </div>
      
      <div className="p-3">
        <h3 className="font-medium text-sm leading-tight line-clamp-2 h-10 mb-2">{product.title}</h3>
        
        <div className="font-bold text-lg text-black mb-2">
          ${product.price.toFixed(2)}
        </div>
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center">
            <MapPin className="h-3 w-3 mr-1" />
            <span>{product.location}</span>
          </div>
          {product.seller.rating && (
            <div className="flex items-center">
              <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
              <span>{product.seller.rating.toFixed(1)}</span>
            </div>
          )}
        </div>
        
        <div className="text-xs text-gray-400 mt-1">
          {product.condition}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
