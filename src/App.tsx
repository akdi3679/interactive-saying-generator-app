
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import SearchResults from './pages/SearchResults';
import ProductDetails from './pages/ProductDetails';
import Bidding from './pages/Bidding';
import Wishlist from './pages/Wishlist';
import Groups from './pages/Groups';
import GroupDetail from './pages/GroupDetail';
import Messages from './pages/Messages';
import SellerProfile from './pages/SellerProfile';
import SignIn from './pages/SignIn';
import UserProfile from './pages/UserProfile';
import DailyDeals from './pages/DailyDeals';
import NotFound from './pages/NotFound';
import { Toaster } from './components/ui/toaster';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/product/:productId" element={<ProductDetails />} />
          <Route path="/bidding" element={<Bidding />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/group/:groupId" element={<GroupDetail />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/seller/:sellerId" element={<SellerProfile />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/daily-deals" element={<DailyDeals />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
