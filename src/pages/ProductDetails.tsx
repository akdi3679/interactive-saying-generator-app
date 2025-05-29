
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { mockProducts } from '../utils/mockData';
import { formatDistanceToNow } from 'date-fns';
import WishlistButton from '../components/WishlistButton';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Share2, Flag, Tag, Truck, ArrowLeft, MessageSquare } from 'lucide-react';
import ContactSellerDialog from '../components/ContactSellerDialog';

const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const product = mockProducts.find(p => p.id === productId);
  
  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8 flex justify-center items-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
            <p className="mb-6">The product you are looking for does not exist.</p>
            <Button onClick={() => navigate('/')}>Return to Home</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleBuyNow = () => {
    toast({
      title: "Purchase Initiated",
      description: "In a real app, this would take you to the checkout flow.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-4">
          <Button variant="ghost" onClick={() => navigate(-1)} className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to results
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative bg-gray-100 rounded-md overflow-hidden h-[400px]">
              <img 
                src={product.images[0]} 
                alt={product.title}
                className="w-full h-full object-contain"
              />
            </div>
            
            {product.images.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {product.images.map((image, index) => (
                  <div key={index} className="bg-gray-100 rounded-md overflow-hidden cursor-pointer h-[80px]">
                    <img src={image} alt={`${product.title} - Image ${index+1}`} className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
              <div className="flex items-center space-x-2">
                <div className="flex items-center text-sm text-gray-500">
                  <Tag className="h-3 w-3 mr-1" />
                  <span>Condition: {product.condition}</span>
                </div>
              </div>
            </div>
            
            <div>
              {product.bidding?.isAuction ? (
                <div>
                  <div className="mb-2">
                    <span className="text-sm text-gray-500">Current bid:</span>
                    <div className="text-2xl font-bold text-[#3665f3]">
                      ${product.bidding.currentBid?.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500">
                      [{product.bidding.bidCount} {product.bidding.bidCount === 1 ? 'bid' : 'bids'}]
                    </div>
                  </div>
                  
                  {product.bidding.endTime && (
                    <div className="text-sm text-gray-600">
                      Time left: {formatDistanceToNow(new Date(product.bidding.endTime))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="mb-2">
                  <span className="text-sm text-gray-500">Price:</span>
                  <div className="text-2xl font-bold">
                    ${product.price.toFixed(2)}
                  </div>
                </div>
              )}
              
              {product.shipping && (
                <div className="flex items-center text-sm space-x-1">
                  <Truck className="h-4 w-4" />
                  <span>
                    {product.shipping.freeShipping ? 'Free shipping' : `$${product.shipping.cost.toFixed(2)} shipping`}
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex flex-col space-y-3">
              <Button onClick={handleBuyNow} className="bg-[#3665f3] hover:bg-[#3665f3]/90">
                <ShoppingCart className="h-4 w-4 mr-2" />
                {product.bidding?.isAuction ? 'Place Bid' : 'Buy Now'}
              </Button>
              
              <div className="flex space-x-2">
                <div className="flex-1">
                  <ContactSellerDialog seller={product.seller} product={product} />
                </div>
                <div>
                  <WishlistButton productId={product.id} initialState={false} />
                </div>
                <Button variant="outline" className="aspect-square p-0 w-10">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center space-x-2 mb-2">
                <span className="font-medium">Seller:</span>
                <a href={`/seller/${product.seller.id}`} className="text-[#3665f3] hover:underline">
                  {product.seller.name}
                </a>
              </div>
              <div className="text-sm text-gray-500">
                Member since {new Date(product.seller.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          <Tabs defaultValue="description">
            <TabsList className="w-full">
              <TabsTrigger value="description" className="flex-1">Description</TabsTrigger>
              <TabsTrigger value="shipping" className="flex-1">Shipping</TabsTrigger>
              <TabsTrigger value="returns" className="flex-1">Returns</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-4">
              <div className="prose max-w-none">
                <p>{product.description}</p>
              </div>
            </TabsContent>
            
            <TabsContent value="shipping" className="mt-4">
              {product.shipping ? (
                <div className="space-y-2">
                  <p><strong>Cost:</strong> {product.shipping.freeShipping ? 'Free' : `$${product.shipping.cost.toFixed(2)}`}</p>
                  <p><strong>Expedited:</strong> {product.shipping.expeditedAvailable ? 'Available' : 'Not Available'}</p>
                  <p><strong>Location:</strong> {product.location}</p>
                </div>
              ) : (
                <p>No shipping information available.</p>
              )}
            </TabsContent>
            
            <TabsContent value="returns" className="mt-4">
              {product.returns ? (
                <div className="space-y-2">
                  <p><strong>Returns:</strong> {product.returns.accepted ? 'Accepted' : 'Not Accepted'}</p>
                  {product.returns.periodDays && (
                    <p><strong>Return Period:</strong> {product.returns.periodDays} days</p>
                  )}
                </div>
              ) : (
                <p>No return information available.</p>
              )}
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Similar Items</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {mockProducts
              .filter(p => p.category === product.category && p.id !== product.id)
              .slice(0, 6)
              .map(p => (
                <div key={p.id} className="border border-gray-200 rounded-md overflow-hidden cursor-pointer"
                      onClick={() => navigate(`/product/${p.id}`)}>
                  <div className="h-36 bg-gray-100">
                    <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-2">
                    <h3 className="text-sm line-clamp-2">{p.title}</h3>
                    <p className="text-sm font-bold mt-1">${p.price.toFixed(2)}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductDetails;
