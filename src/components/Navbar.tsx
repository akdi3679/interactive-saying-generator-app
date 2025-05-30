
import { useState } from 'react';
import { Bell, Menu, X, MapPin, MessageSquare, Heart, Gavel, Bookmark, Users, ChevronDown } from 'lucide-react';
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
  const [showCategories, setShowCategories] = useState(false);
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

  const categories = ['Electronics', 'Fashion', 'Furniture', 'Sports', 'Books', 'Toys', 'Home & Garden', 'Automotive'];

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
            {/* Primary Navigation with Icons */}
            <div className="flex items-center space-x-1 bg-[#3665f3]/5 rounded-lg p-1">
              <a
                href="/"
                className={`px-3 py-2 rounded-md font-medium transition-colors flex items-center gap-2 ${
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
                <Heart className="h-4 w-4" />
                <span className="hidden lg:inline">For You</span>
              </a>
              <a
                href="/bidding"
                className={`px-3 py-2 rounded-md font-medium transition-colors flex items-center gap-2 ${
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
                <Gavel className="h-4 w-4" />
                <span className="hidden lg:inline">Bidding</span>
              </a>
              <a
                href="/wishlist"
                className={`px-3 py-2 rounded-md font-medium transition-colors flex items-center gap-2 ${
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
                <Bookmark className="h-4 w-4" />
                <span className="hidden lg:inline">Saved</span>
              </a>
              <a
                href="/groups"
                className={`px-3 py-2 rounded-md font-medium transition-colors flex items-center gap-2 ${
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
                <Users className="h-4 w-4" />
                <span className="hidden lg:inline">Groups</span>
              </a>
              <a
                href="/messages"
                className={`px-3 py-2 rounded-md font-medium transition-colors flex items-center gap-2 ${
                  activeTab === 'messages' 
                    ? 'bg-[#3665f3] text-white' 
                    : 'text-gray-700 hover:bg-white hover:text-[#3665f3]'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/messages');
                  return false;
                }}
              >
                <MessageSquare className="h-4 w-4" />
                <span className="hidden lg:inline">Messages</span>
              </a>
            </div>

            {/* Categories - Closer to main navigation */}
            <div className="relative ml-4">
              <div 
                className="flex items-center space-x-4 text-sm bg-gray-50 rounded-lg px-4 py-2 cursor-pointer hover:bg-gray-100"
                onMouseEnter={() => setShowCategories(true)}
                onMouseLeave={() => setShowCategories(false)}
              >
                <span className="text-gray-600">Categories</span>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </div>
              
              {showCategories && (
                <div 
                  className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-2 min-w-[200px] z-50"
                  onMouseEnter={() => setShowCategories(true)}
                  onMouseLeave={() => setShowCategories(false)}
                >
                  {categories.map((category) => (
                    <a
                      key={category}
                      href={`/search?category=${category}`}
                      className="block px-3 py-2 text-sm text-gray-600 hover:text-[#3665f3] hover:bg-gray-50 rounded transition-colors"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(`/search?category=${category}`);
                        setShowCategories(false);
                        return false;
                      }}
                    >
                      {category}
                    </a>
                  ))}
                </div>
              )}
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
                  <a href="/" className={`flex items-center gap-2 py-2 font-medium ${activeTab === 'foryou' ? 'text-[#3665f3]' : 'text-gray-700'}`}>
                    <Heart className="h-4 w-4" />
                    For You
                  </a>
                </li>
                <li>
                  <a href="/bidding" className={`flex items-center gap-2 py-2 ${activeTab === 'bidding' ? 'text-[#3665f3] font-medium' : 'text-gray-700'}`} onClick={(e) => {
                    e.preventDefault();
                    navigate('/bidding');
                    setIsMenuOpen(false);
                    return false;
                  }}>
                    <Gavel className="h-4 w-4" />
                    Bidding
                  </a>
                </li>
                <li>
                  <a href="/groups" className={`flex items-center gap-2 py-2 ${activeTab === 'groups' ? 'text-[#3665f3] font-medium' : 'text-gray-700'}`} onClick={(e) => {
                    e.preventDefault();
                    navigate('/groups');
                    setIsMenuOpen(false);
                    return false;
                  }}>
                    <Users className="h-4 w-4" />
                    Groups
                  </a>
                </li>
                <li>
                  <a href="/wishlist" className={`flex items-center gap-2 py-2 ${activeTab === 'saved' ? 'text-[#3665f3] font-medium' : 'text-gray-700'}`} onClick={(e) => {
                    e.preventDefault();
                    navigate('/wishlist');
                    setIsMenuOpen(false);
                    return false;
                  }}>
                    <Bookmark className="h-4 w-4" />
                    Saved
                  </a>
                </li>
                <li>
                  <a href="/messages" className={`flex items-center gap-2 py-2 ${activeTab === 'messages' ? 'text-[#3665f3] font-medium' : 'text-gray-700'}`} onClick={(e) => {
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
