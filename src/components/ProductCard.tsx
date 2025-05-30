
import { Product } from '../models/types';
import { formatDistanceToNow } from 'date-fns';
import WishlistButton from './WishlistButton';
import { useNavigate } from 'react-router-dom';
import { Tag, Truck, RotateCcw } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/product/${product.id}`);
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
        <div className="absolute top-2 right-2" onClick={e => e.stopPropagation()}>
          <WishlistButton productId={product.id} />
        </div>
        {product.isArchived && (
          <div className="absolute bottom-2 left-2 bg-gray-800/80 text-white text-xs py-1 px-2 rounded">
            Archived
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-medium text-sm leading-tight line-clamp-2 h-10">{product.title}</h3>
        
        {/* Description */}
        <p className="text-xs text-gray-600 mt-2 line-clamp-2">
          {product.description}
        </p>
        
        <div className="mt-2">
          {hasAuction && (
            <div className="flex items-center text-xs text-gray-500">
              <span>Current bid:</span>
              <span className="font-bold text-base ml-1 text-[#3665f3]">
                ${product.bidding?.currentBid?.toFixed(2)}
              </span>
            </div>
          )}
          
          {hasBuyNow && (
            <div className="flex items-center text-xs text-gray-500">
              <span>{hasAuction ? "Buy it now:" : "Price:"}</span>
              <span className="font-bold text-base ml-1 text-black">
                ${product.buyNowPrice?.toFixed(2)}
              </span>
            </div>
          )}
          
          {!hasAuction && !hasBuyNow && (
            <div className="font-bold text-base text-black">
              ${product.price.toFixed(2)}
            </div>
          )}
        </div>
        
        <div className="flex items-center mt-1 text-xs text-gray-500">
          <Tag className="h-3 w-3 mr-1" />
          <span>{product.condition}</span>
        </div>
        
        {/* Shipping Info */}
        {product.shipping && (
          <div className="flex items-center mt-1 text-xs text-gray-600">
            <Truck className="h-3 w-3 mr-1" />
            <span>
              {product.shipping.freeShipping ? 'Free shipping' : `$${product.shipping.cost.toFixed(2)} shipping`}
            </span>
          </div>
        )}
        
        {/* Return Info */}
        {product.returns && (
          <div className="flex items-center mt-1 text-xs text-gray-600">
            <RotateCcw className="h-3 w-3 mr-1" />
            <span>
              {product.returns.accepted ? `${product.returns.periodDays || 30} day returns` : 'No returns'}
            </span>
          </div>
        )}
        
        <div className="mt-2 flex justify-between items-center text-xs text-gray-500">
          <a 
            href={`/seller/${product.seller.id}`}
            className="truncate max-w-[70%] hover:text-[#3665f3] hover:underline"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/seller/${product.seller.id}`);
              return false;
            }}
          >
            {product.location}
          </a>
          <span>
            {formatDistanceToNow(new Date(product.createdAt), { addSuffix: true })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
