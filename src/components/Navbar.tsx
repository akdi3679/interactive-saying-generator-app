
import { useState } from 'react';
import { Bell, Menu, Search, X, MapPin, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import SearchBar from './SearchBar';
import AuthButtons, { getAuthState } from './AuthButtons';
import SellItemButton from './SellItemButton';
import LocationSelector from './LocationSelector';

const Navbar = () => {
  const auth = getAuthState();
  const currentUser = auth.isLoggedIn ? auth.user : null;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState({
    lat: 40.7128,
    lng: -74.0060,
    address: 'New York, NY',
    range: 25
  });
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLocationChange = (location: typeof selectedLocation) => {
    setSelectedLocation(location);
    console.log('Location changed:', location);
  };

  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/') return 'foryou';
    if (path === '/bidding') return 'bidding';
    if (path === '/wishlist') return 'saved';
    if (path === '/groups') return 'groups';
    if (path === '/messages') return 'messages';
    return '';
  };

  const activeTab = getActiveTab();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col gap-3">
          {/* Top Row - Logo, Auth, Sell */}
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <a href="/" className="text-2xl font-bold text-[#3665f3]">
                eBay Clone
              </a>
            </div>

            {/* Right Side - Auth & Sell */}
            <div className="flex items-center space-x-3">
              {currentUser ? (
                <>
                  <div className="hidden md:flex items-center space-x-3">
                    <SellItemButton />
                    <button className="p-2 rounded-full hover:bg-gray-100">
                      <Bell className="h-5 w-5 text-gray-700" />
                    </button>
                  </div>
                  <div className="relative cursor-pointer">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  </div>
                </>
              ) : (
                <div className="hidden md:flex items-center space-x-3">
                  <AuthButtons />
                  <SellItemButton />
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button className="md:hidden p-1" onClick={toggleMenu}>
                {isMenuOpen ? (
                  <X className="h-6 w-6 text-gray-700" />
                ) : (
                  <Menu className="h-6 w-6 text-gray-700" />
                )}
              </button>
            </div>
          </div>

          {/* Second Row - Search and Location */}
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <SearchBar />
            </div>
            <LocationSelector 
              selectedLocation={selectedLocation}
              onLocationChange={handleLocationChange}
            />
          </div>

          {/* Third Row - Main Navigation */}
          <div className="hidden md:flex items-center justify-between">
            {/* Primary Navigation with Background */}
            <div className="flex items-center space-x-1 bg-[#3665f3]/5 rounded-lg p-1">
              <a
                href="/"
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === 'foryou' 
                    ? 'bg-[#3665f3] text-white' 
                    : 'text-gray-700 hover:bg-white hover:text-[#3665f3]'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/');
                  return false;
                }}
              >
                For You
              </a>
              <a
                href="/bidding"
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === 'bidding' 
                    ? 'bg-[#3665f3] text-white' 
                    : 'text-gray-700 hover:bg-white hover:text-[#3665f3]'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/bidding');
                  return false;
                }}
              >
                Bidding
              </a>
              <a
                href="/wishlist"
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === 'saved' 
                    ? 'bg-[#3665f3] text-white' 
                    : 'text-gray-700 hover:bg-white hover:text-[#3665f3]'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/wishlist');
                  return false;
                }}
              >
                Saved
              </a>
              <a
                href="/groups"
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === 'groups' 
                    ? 'bg-[#3665f3] text-white' 
                    : 'text-gray-700 hover:bg-white hover:text-[#3665f3]'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/groups');
                  return false;
                }}
              >
                Groups
              </a>
              <a
                href="/messages"
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === 'messages' 
                    ? 'bg-[#3665f3] text-white' 
                    : 'text-gray-700 hover:bg-white hover:text-[#3665f3]'
                } flex items-center gap-2`}
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/messages');
                  return false;
                }}
              >
                <MessageSquare className="h-4 w-4" />
                Messages
              </a>
            </div>

            {/* Categories - Closer to main navigation */}
            <div className="flex items-center space-x-4 text-sm bg-gray-50 rounded-lg px-4 py-2 ml-4">
              <a
                href="/search?category=Electronics"
                className="text-gray-600 hover:text-[#3665f3] transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/search?category=Electronics');
                  return false;
                }}
              >
                Electronics
              </a>
              <a
                href="/search?category=Fashion"
                className="text-gray-600 hover:text-[#3665f3] transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/search?category=Fashion');
                  return false;
                }}
              >
                Fashion
              </a>
              <a
                href="/search?category=Furniture"
                className="text-gray-600 hover:text-[#3665f3] transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/search?category=Furniture');
                  return false;
                }}
              >
                Furniture
              </a>
              <a
                href="/search?category=Sports"
                className="text-gray-600 hover:text-[#3665f3] transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/search?category=Sports');
                  return false;
                }}
              >
                Sports
              </a>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-lg md:hidden">
            <nav className="container mx-auto px-4 py-3">
              <ul className="space-y-4">
                {!currentUser && (
                  <li className="py-2">
                    <div className="flex flex-col space-y-2">
                      <AuthButtons />
                      <SellItemButton />
                    </div>
                  </li>
                )}
                <li>
                  <a href="/" className={`block py-2 font-medium ${activeTab === 'foryou' ? 'text-[#3665f3]' : 'text-gray-700'}`}>
                    For You
                  </a>
                </li>
                <li>
                  <a href="/bidding" className={`block py-2 ${activeTab === 'bidding' ? 'text-[#3665f3] font-medium' : 'text-gray-700'}`} onClick={(e) => {
                    e.preventDefault();
                    navigate('/bidding');
                    setIsMenuOpen(false);
                    return false;
                  }}>
                    Bidding
                  </a>
                </li>
                <li>
                  <a href="/groups" className={`block py-2 ${activeTab === 'groups' ? 'text-[#3665f3] font-medium' : 'text-gray-700'}`} onClick={(e) => {
                    e.preventDefault();
                    navigate('/groups');
                    setIsMenuOpen(false);
                    return false;
                  }}>
                    Groups
                  </a>
                </li>
                <li>
                  <a href="/wishlist" className={`block py-2 ${activeTab === 'saved' ? 'text-[#3665f3] font-medium' : 'text-gray-700'}`} onClick={(e) => {
                    e.preventDefault();
                    navigate('/wishlist');
                    setIsMenuOpen(false);
                    return false;
                  }}>
                    Saved
                  </a>
                </li>
                <li>
                  <a href="/messages" className={`block py-2 ${activeTab === 'messages' ? 'text-[#3665f3] font-medium' : 'text-gray-700'} flex items-center gap-2`} onClick={(e) => {
                    e.preventDefault();
                    navigate('/messages');
                    setIsMenuOpen(false);
                    return false;
                  }}>
                    <MessageSquare className="h-4 w-4" />
                    Messages
                  </a>
                </li>
                {currentUser && (
                  <li>
                    <SellItemButton />
                  </li>
                )}
              </ul>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
