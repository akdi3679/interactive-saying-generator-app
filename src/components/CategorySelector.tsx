
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { mockProducts } from '../utils/mockData';
import { Link } from 'react-router-dom';
import { ProductCategory } from '@/models/types';

// Get unique categories from products
const getCategories = (): ProductCategory[] => {
  const categories = new Set<ProductCategory>();
  mockProducts.forEach(product => categories.add(product.category));
  return Array.from(categories);
};

const CategorySelector = () => {
  const categories = getCategories();

  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex space-x-4 pb-4">
        {categories.map(category => (
          <Link to={`/search?category=${category}`} key={category}>
            <div className="flex flex-col items-center space-y-2">
              <div className="rounded-full overflow-hidden bg-[#F8F8F8] border border-gray-200 w-20 h-20 flex items-center justify-center">
                <img
                  src={`https://picsum.photos/200?random=${category}`}
                  alt={category}
                  className="h-12 w-12 object-cover"
                />
              </div>
              <span className="text-sm font-medium text-center">{category}</span>
            </div>
          </Link>
        ))}
      </div>
    </ScrollArea>
  );
};

export default CategorySelector;
