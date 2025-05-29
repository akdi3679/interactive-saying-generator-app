
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
import { MongoAuthProvider } from "./context/MongoAuthContext";
import { DATABASE_CONFIG } from "./config/database";

const App = () => (
  <TooltipProvider>
    {DATABASE_CONFIG.provider === 'mongodb' ? (
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
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </MongoAuthProvider>
    ) : (
      <div>Please configure MongoDB in src/config/database.ts</div>
    )}
  </TooltipProvider>
);

export default App;
