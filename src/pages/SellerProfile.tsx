
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import StarRating from '../components/StarRating';
import { testUsers } from '../utils/testData';
import { ProductService } from '../services/ProductService';
import { Mail, MessageSquare, User, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Product } from '../models/types';

const SellerProfile = () => {
  const { sellerId } = useParams();
  const { toast } = useToast();
  const [message, setMessage] = useState('');
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [sellerProducts, setSellerProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  
  const seller = testUsers.find(user => user.id === sellerId);
  
  useEffect(() => {
    const fetchSellerProducts = async () => {
      try {
        const allProducts = await ProductService.getProducts();
        const products = allProducts.filter(product => product.seller.id === sellerId);
        setSellerProducts(products);
      } catch (error) {
        console.error('Error fetching seller products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSellerProducts();
  }, [sellerId]);
  
  const filteredProducts = sellerProducts.filter(product => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'active') return !product.isArchived;
    if (activeFilter === 'archived') return product.isArchived;
    if (activeFilter === 'auction') return product.bidding?.isAuction;
    if (activeFilter === 'buynow') return !product.bidding?.isAuction;
    return true;
  });
  
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
  
  const badges = [
    { name: 'Top Seller', icon: '🏆', description: 'High sales volume' },
    { name: 'Fast Shipper', icon: '⚡', description: 'Quick delivery' },
    { name: 'Quality Products', icon: '⭐', description: 'High-rated items' },
    { name: 'Verified Seller', icon: '✅', description: 'Identity verified' }
  ];
  
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
        
        {/* Badges Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <Award className="h-5 w-5 mr-2" />
            Badges Owned
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {badges.map((badge, index) => (
              <div key={index} className="flex flex-col items-center p-4 border border-gray-200 rounded-lg">
                <div className="text-2xl mb-2">{badge.icon}</div>
                <div className="font-medium text-sm text-center">{badge.name}</div>
                <div className="text-xs text-gray-500 text-center mt-1">{badge.description}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="space-y-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Listed Products</h2>
            
            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2 mb-6">
              <Button 
                variant={activeFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveFilter('all')}
              >
                All ({sellerProducts.length})
              </Button>
              <Button 
                variant={activeFilter === 'active' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveFilter('active')}
              >
                Active ({sellerProducts.filter(p => !p.isArchived).length})
              </Button>
              <Button 
                variant={activeFilter === 'archived' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveFilter('archived')}
              >
                Archived ({sellerProducts.filter(p => p.isArchived).length})
              </Button>
              <Button 
                variant={activeFilter === 'auction' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveFilter('auction')}
              >
                Auctions ({sellerProducts.filter(p => p.bidding?.isAuction).length})
              </Button>
              <Button 
                variant={activeFilter === 'buynow' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveFilter('buynow')}
              >
                Buy Now ({sellerProducts.filter(p => !p.bidding?.isAuction).length})
              </Button>
            </div>
            
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Loading products...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No products found for this filter.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SellerProfile;
