
import { Product } from '../models/types';
import { useNavigate } from 'react-router-dom';

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
        {product.isArchived && (
          <div className="absolute bottom-2 left-2 bg-gray-800/80 text-white text-xs py-1 px-2 rounded">
            Archived
          </div>
        )}
      </div>
      
      <div className="p-3">
        <h3 className="font-medium text-sm leading-tight line-clamp-2 h-10 mb-2">{product.title}</h3>
        
        <div className="font-bold text-lg text-black">
          ${product.price.toFixed(2)}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
