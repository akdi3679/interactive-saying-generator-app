
import Navbar from '../components/Navbar';
import ForYouSection from '../components/ForYouSection';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import SellItemButton from '@/components/SellItemButton';
import DailyDeals from '@/components/DailyDeals';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Daily Deals Section - Top */}
        <section className="py-8 bg-white">
          <div className="container mx-auto px-4">
            <DailyDeals />
          </div>
        </section>
        
        {/* For You Section - Infinite Scroll Products */}
        <section className="py-8 bg-[#F8F8F8]">
          <div className="container mx-auto px-4">
            <ForYouSection />
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
