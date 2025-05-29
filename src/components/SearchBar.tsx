
import { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Search } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from './ui/select';
import { ProductCategory } from '../models/types';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

const categories: ProductCategory[] = [
  'Electronics',
  'Fashion',
  'Furniture',
  'Household',
  'Vehicles',
  'Property',
  'Collectibles',
  'Sports',
  'Toys',
  'Business & Industrial',
  'Jewelry',
  'Other'
];

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState<string>('');
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchTerm.trim()) return;

    toast({
      title: "Search Initiated",
      description: `Searching for "${searchTerm}" ${category && category !== 'all-categories' ? `in ${category}` : ''}`,
    });

    // In a real app, we would navigate to a search results page with query params
    navigate(`/search?q=${encodeURIComponent(searchTerm)}${category && category !== 'all-categories' ? `&category=${encodeURIComponent(category)}` : ''}`);
  };

  return (
    <form onSubmit={handleSearch} className="flex w-full max-w-3xl mx-auto">
      <div className="flex-1 flex">
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-[180px] rounded-l-md rounded-r-none border-r-0">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-categories">All Categories</SelectItem>
            {categories.map(cat => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          type="search"
          placeholder="Search for anything"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 rounded-none border-l-0"
        />
      </div>

      <Button
        type="submit"
        className="rounded-l-none bg-[#3665f3] hover:bg-[#3665f3]/90"
      >
        <Search className="h-4 w-4" />
      </Button>
    </form>
  );
};

export default SearchBar;
