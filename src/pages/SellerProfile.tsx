
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import StarRating from '../components/StarRating';
import { testUsers } from '../utils/testData';
import { ProductService } from '../services/ProductService';
import { Mail, MessageSquare, User, Award, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Product } from '../models/types';

const SellerProfile = () => {
  const { sellerId } = useParams();
  const { toast } = useToast();
  const [message, setMessage] = useState('');
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [sellerProducts, setSellerProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [conditionFilter, setConditionFilter] = useState('all');
  
  const seller = testUsers.find(user => user.id === sellerId);
  
  const badges = [
    { name: 'Top Seller', color: 'bg-yellow-500', icon: '🏆' },
    { name: 'Fast Shipper', color: 'bg-blue-500', icon: '🚚' },
    { name: 'Quality Items', color: 'bg-green-500', icon: '⭐' },
    { name: 'Trusted Seller', color: 'bg-purple-500', icon: '🛡️' }
  ];
  
  useEffect(() => {
    const fetchSellerProducts = async () => {
      try {
        const allProducts = await ProductService.getProducts();
        const products = allProducts.filter(product => product.seller.id === sellerId);
        setSellerProducts(products);
        setFilteredProducts(products);
      } catch (error) {
        console.error('Error fetching seller products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSellerProducts();
  }, [sellerId]);
  
  useEffect(() => {
    let filtered = sellerProducts;
    
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(p => p.category === categoryFilter);
    }
    
    if (conditionFilter !== 'all') {
      filtered = filtered.filter(p => p.condition === conditionFilter);
    }
    
    setFilteredProducts(filtered);
  }, [categoryFilter, conditionFilter, sellerProducts]);
  
  const activeProducts = filteredProducts.filter(p => !p.isArchived);
  const archivedProducts = filteredProducts.filter(p => p.isArchived);
  
  const categories = [...new Set(sellerProducts.map(p => p.category))];
  const conditions = [...new Set(sellerProducts.map(p => p.condition))];
  
  if (!seller) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8 flex justify-center items-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Seller Not Found</h1>
            <p className="mb-6">The seller you are looking for does not exist.</p>
            <Button onClick={() => window.history.back()}>Go Back</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  const handleSendMessage = () => {
    if (message.trim() === '') return;
    
    toast({
      title: 'Message Sent',
      description: `Your message has been sent to ${seller.name}.`,
    });
    
    setMessage('');
    setIsMessageDialogOpen(false);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden">
              <img 
                src={seller.avatar} 
                alt={seller.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-bold mb-2">{seller.name}</h1>
              
              <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1 text-gray-500" />
                  <span className="text-sm text-gray-500">
                    Member since {new Date(seller.createdAt).getFullYear()}
                  </span>
                </div>
                {seller.rating && (
                  <div className="flex items-center">
                    <StarRating 
                      rating={seller.rating} 
                      totalRatings={seller.totalRatings}
                      size="sm"
                    />
                  </div>
                )}
              </div>
              
              {/* Badges Owned Section */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Badges Owned
                </h3>
                <div className="flex flex-wrap gap-2">
                  {badges.map((badge, index) => (
                    <div key={index} className={`${badge.color} text-white px-3 py-1 rounded-full text-sm flex items-center gap-1`}>
                      <span>{badge.icon}</span>
                      <span>{badge.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <p className="text-gray-600 mb-6">
                Welcome to my eBay store! I specialize in quality products with fast shipping and excellent customer service.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Contact
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Send Message to {seller.name}</DialogTitle>
                    </DialogHeader>
                    
                    <div className="mt-4">
                      <Textarea
                        placeholder="Write your message here..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="min-h-[120px]"
                      />
                    </div>
                    
                    <DialogFooter className="mt-4">
                      <Button variant="outline" onClick={() => setIsMessageDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSendMessage}>
                        Send Message
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                
                <Button variant="outline" onClick={() => window.location.href = `mailto:${seller.email}`}>
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-8">
          {/* Filters */}
          <div className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span className="font-medium">Filters:</span>
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={conditionFilter} onValueChange={setConditionFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Conditions</SelectItem>
                {conditions.map(condition => (
                  <SelectItem key={condition} value={condition}>{condition}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Tabs defaultValue="active" className="w-full">
            <TabsList>
              <TabsTrigger value="active">Active Listings ({activeProducts.length})</TabsTrigger>
              <TabsTrigger value="archived">Archived ({archivedProducts.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="active" className="mt-6">
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">Loading products...</p>
                </div>
              ) : activeProducts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No active listings found with current filters.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {activeProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="archived" className="mt-6">
              {archivedProducts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No archived listings found with current filters.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {archivedProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SellerProfile;
