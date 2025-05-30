
import { useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ProductDetails from "./pages/ProductDetails";
import SearchResults from "./pages/SearchResults";
import SellerProfile from "./pages/SellerProfile";
import Wishlist from "./pages/Wishlist";
import Groups from "./pages/Groups";
import GroupDetail from "./pages/GroupDetail";
import Bidding from "./pages/Bidding";
import Messages from "./pages/Messages";
import DailyDeals from "./pages/DailyDeals";
import { MongoAuthProvider } from "./context/MongoAuthContext";
import { initializeTestData } from "./utils/testData";

const App = () => {
  useEffect(() => {
    // Initialize test data on app start
    initializeTestData();
  }, []);

  return (
    <TooltipProvider>
      <MongoAuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/product/:productId" element={<ProductDetails />} />
            <Route path="/seller/:sellerId" element={<SellerProfile />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/groups" element={<Groups />} />
            <Route path="/groups/:groupId" element={<GroupDetail />} />
            <Route path="/bidding" element={<Bidding />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/daily-deals" element={<DailyDeals />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </MongoAuthProvider>
    </TooltipProvider>
  );
};

export default App;
