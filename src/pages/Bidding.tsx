
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { mockProducts } from '../utils/mockData';
import { formatDistanceToNow } from 'date-fns';
import { Gavel, Clock, TrendingUp, Eye, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

const Bidding = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [bidAmount, setBidAmount] = useState<{[key: string]: string}>({});
  
  const auctionProducts = mockProducts.filter(p => p.bidding?.isAuction && !p.isArchived);
  const hotAuctions = auctionProducts.slice(0, 3);
  const endingSoon = auctionProducts.filter(p => {
    if (!p.bidding?.endTime) return false;
    const endTime = new Date(p.bidding.endTime);
    const now = new Date();
    const hoursLeft = (endTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    return hoursLeft <= 24 && hoursLeft > 0;
  });
  
  const handlePlaceBid = (productId: string, currentBid: number) => {
    const bidValue = parseFloat(bidAmount[productId] || '0');
    if (bidValue <= currentBid) {
      toast({
        title: 'Invalid Bid',
        description: `Your bid must be higher than $${currentBid.toFixed(2)}`,
        variant: 'destructive'
      });
      return;
    }
    
    toast({
      title: 'Bid Placed Successfully!',
      description: `Your bid of $${bidValue.toFixed(2)} has been placed.`,
    });
    
    setBidAmount(prev => ({ ...prev, [productId]: '' }));
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Gavel className="h-8 w-8 text-[#3665f3]" />
            <h1 className="text-3xl font-bold">Live Auctions</h1>
          </div>
          <p className="text-gray-600">Bid on exciting items and find great deals!</p>
        </div>
        
        {/* Hot Auctions Banner */}
        <section className="mb-8 bg-gradient-to-r from-[#3665f3]/10 to-purple-500/10 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-[#3665f3]" />
            <h2 className="text-xl font-bold">Hot Auctions</h2>
            <Badge variant="secondary" className="bg-red-100 text-red-700">Live</Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {hotAuctions.map(product => (
              <div key={product.id} className="bg-white rounded-lg p-4 border cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate(`/product/${product.id}`)}>
                <img src={product.images[0]} alt={product.title} className="w-full h-32 object-cover rounded mb-3" />
                <h3 className="font-medium text-sm mb-2 line-clamp-2">{product.title}</h3>
                <div className="text-lg font-bold text-[#3665f3] mb-1">
                  ${product.bidding?.currentBid?.toFixed(2)}
                </div>
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {product.bidding?.endTime && formatDistanceToNow(new Date(product.bidding.endTime), { addSuffix: true })}
                </div>
              </div>
            ))}
          </div>
        </section>
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Auctions ({auctionProducts.length})</TabsTrigger>
            <TabsTrigger value="ending">Ending Soon ({endingSoon.length})</TabsTrigger>
            <TabsTrigger value="watching">Watching (0)</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {auctionProducts.map(product => (
                <div key={product.id} className="border border-gray-200 rounded-lg overflow-hidden bg-white hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img 
                      src={product.images[0]} 
                      alt={product.title}
                      className="w-full h-48 object-cover cursor-pointer"
                      onClick={() => navigate(`/product/${product.id}`)}
                    />
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                      AUCTION
                    </div>
                    <div className="absolute top-2 left-2 flex gap-1">
                      <Badge variant="secondary" className="text-xs flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {Math.floor(Math.random() * 50) + 10}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-medium text-sm mb-2 line-clamp-2 cursor-pointer hover:text-[#3665f3]" onClick={() => navigate(`/product/${product.id}`)}>
                      {product.title}
                    </h3>
                    
                    <div className="mb-3">
                      <div className="text-sm text-gray-500">Current bid:</div>
                      <div className="text-xl font-bold text-[#3665f3]">
                        ${product.bidding?.currentBid?.toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {product.bidding?.bidCount} bids
                      </div>
                    </div>
                    
                    <div className="mb-3 text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {product.bidding?.endTime && formatDistanceToNow(new Date(product.bidding.endTime), { addSuffix: true })}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          placeholder={`Min $${(product.bidding?.currentBid || 0) + 1}`}
                          value={bidAmount[product.id] || ''}
                          onChange={(e) => setBidAmount(prev => ({ ...prev, [product.id]: e.target.value }))}
                          className="text-sm"
                        />
                        <Button 
                          onClick={() => handlePlaceBid(product.id, product.bidding?.currentBid || 0)}
                          className="bg-[#3665f3] hover:bg-[#3665f3]/90 text-xs"
                        >
                          Bid
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1 text-xs">
                          <Heart className="h-3 w-3 mr-1" />
                          Watch
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => navigate(`/product/${product.id}`)}>
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="ending" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {endingSoon.map(product => (
                <div key={product.id} className="border border-red-200 rounded-lg overflow-hidden bg-white hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img src={product.images[0]} alt={product.title} className="w-full h-48 object-cover" />
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded animate-pulse">
                      ENDING SOON
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-sm mb-2 line-clamp-2">{product.title}</h3>
                    <div className="text-xl font-bold text-[#3665f3] mb-3">
                      ${product.bidding?.currentBid?.toFixed(2)}
                    </div>
                    <Button className="w-full bg-red-500 hover:bg-red-600">
                      Bid Now - Ending Soon!
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="watching" className="mt-6">
            <div className="text-center py-12">
              <Gavel className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">No watched auctions</h3>
              <p className="text-gray-500">Start watching auctions to track them here!</p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default Bidding;
