import Navbar from '../components/Navbar';
import CategorySelector from '../components/CategorySelector';
import ForYouSection from '../components/ForYouSection';
import FeaturedProducts from '../components/FeaturedProducts';
import Footer from '../components/Footer';
import { ArrowRight, Search, ShoppingBag, Zap, Shield, Heart, Tag, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SellItemButton from '@/components/SellItemButton';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Banner */}
        <section className="bg-[#F8F8F8] py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-8 md:mb-0">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                  Welcome to <span className="text-[#3665f3]">eBay</span> Clone
                </h1>
                <p className="text-lg text-gray-600 mb-6">
                  The marketplace where you can buy and sell almost anything.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button className="bg-[#3665f3] hover:bg-[#3665f3]/90">
                    Shop Now
                  </Button>
                  <SellItemButton />
                </div>
              </div>
              <div className="md:w-1/2">
                <img 
                  src="https://images.unsplash.com/photo-1607082350899-7e105aa886ae?q=80&w=2070" 
                  alt="Marketplace" 
                  className="rounded-lg shadow-md object-cover h-64 md:h-80 w-full"
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* For You Section - Primary */}
        <section className="py-8 bg-white">
          <div className="container mx-auto px-4">
            <ForYouSection />
          </div>
        </section>
        
        {/* Daily Deals */}
        <section className="py-8 bg-[#F8F8F8]">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Daily Deals</h2>
              <Button variant="link" className="text-[#3665f3] flex items-center">
                See all <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="border border-gray-200 rounded-md overflow-hidden hover:shadow-md transition-shadow duration-200 bg-white">
                  <div className="relative pt-[100%]">
                    <img
                      src={`https://picsum.photos/200/200?random=${i+10}`}
                      alt="Deal item"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute top-0 left-0 bg-red-500 text-white text-xs py-1 px-2">
                      DEAL
                    </div>
                  </div>
                  <div className="p-2">
                    <p className="text-sm font-medium line-clamp-1">Special Deal Item {i+1}</p>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-sm font-bold">$19.99</span>
                      <span className="text-xs text-gray-500 line-through">$29.99</span>
                    </div>
                    <p className="text-xs text-green-600 mt-1">33% OFF</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Browse Categories */}
        <section className="py-8 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Shop by Category</h2>
              <Button variant="link" className="text-[#3665f3] flex items-center">
                See all categories <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            
            <CategorySelector />
          </div>
        </section>
        
        {/* Featured Products */}
        <section className="py-8 bg-[#F8F8F8]">
          <div className="container mx-auto px-4">
            <FeaturedProducts />
          </div>
        </section>
        
        {/* eBay Benefits */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-10">Why eBay Clone?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm text-center border">
                <div className="mx-auto bg-[#3665f3]/10 rounded-full p-4 w-16 h-16 mb-4 flex items-center justify-center">
                  <Tag className="h-8 w-8 text-[#3665f3]" />
                </div>
                <h3 className="font-bold text-xl mb-2">Great Deals</h3>
                <p className="text-gray-600">Find amazing prices on the brands you love.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm text-center border">
                <div className="mx-auto bg-[#3665f3]/10 rounded-full p-4 w-16 h-16 mb-4 flex items-center justify-center">
                  <Shield className="h-8 w-8 text-[#3665f3]" />
                </div>
                <h3 className="font-bold text-xl mb-2">Buyer Protection</h3>
                <p className="text-gray-600">Shop confidently with our money back guarantee.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm text-center border">
                <div className="mx-auto bg-[#3665f3]/10 rounded-full p-4 w-16 h-16 mb-4 flex items-center justify-center">
                  <Zap className="h-8 w-8 text-[#3665f3]" />
                </div>
                <h3 className="font-bold text-xl mb-2">Fast Shipping</h3>
                <p className="text-gray-600">Get your items fast with trusted shipping carriers.</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-12 bg-[#3665f3] text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to start selling?</h2>
            <p className="text-lg max-w-2xl mx-auto mb-8 opacity-90">
              Join millions of sellers who grow their business on eBay Clone.
              List your first item in minutes.
            </p>
            <SellItemButton />
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
