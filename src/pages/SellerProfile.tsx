
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { mockUsers, mockProducts } from '../utils/mockData';
import { Mail, MessageSquare, Star, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const SellerProfile = () => {
  const { sellerId } = useParams();
  const { toast } = useToast();
  const [message, setMessage] = useState('');
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  
  const seller = mockUsers.find(user => user.id === sellerId);
  const sellerProducts = mockProducts.filter(product => product.seller.id === sellerId);
  
  const activeProducts = sellerProducts.filter(p => !p.isArchived);
  const archivedProducts = sellerProducts.filter(p => p.isArchived);
  
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
              
              <div className="flex flex-col md:flex-row items-center gap-2 mb-4">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1 text-gray-500" />
                  <span className="text-sm text-gray-500">
                    Member since {new Date(seller.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="hidden md:block text-gray-300 mx-1">|</div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 mr-1 text-yellow-500" />
                  <span className="text-sm">Top Rated Seller</span>
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
          <Tabs defaultValue="active" className="w-full">
            <TabsList>
              <TabsTrigger value="active">Active Listings ({activeProducts.length})</TabsTrigger>
              <TabsTrigger value="archived">Archived ({archivedProducts.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="active" className="mt-6">
              {activeProducts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">This seller has no active listings.</p>
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
                  <p className="text-gray-500">This seller has no archived listings.</p>
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
