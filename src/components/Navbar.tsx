
import { useState } from 'react';
import { Bell, Menu, X, MapPin, MessageSquare, Heart, Gavel, Bookmark, Users, ChevronDown, Plus, User, ShoppingBag, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import SearchBar from './SearchBar';
import LocationSelector from './LocationSelector';
import { TestAuthService } from '../services/TestAuthService';
import { Button } from './ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

const Navbar = () => {
  const currentUser = TestAuthService.getCurrentUser();
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

  const categories = ['Electronics', 'Sport', 'Fashion', 'Toy'];
  const allCategories = ['Electronics', 'Sport', 'Fashion', 'Toy', 'Books', 'Home & Garden', 'Automotive', 'Health & Beauty'];

  const handleSignOut = () => {
    TestAuthService.signOut();
    navigate('/');
    toast({
      title: "Signed Out",
      description: "You have been successfully signed out.",
    });
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col gap-3">
          {/* Top Row - Logo, Search, Location */}
          <div className="flex items-center gap-3">
            {/* Logo - positioned higher */}
            <div className="flex items-center -mt-1">
              <a href="/" className="text-2xl font-bold text-[#3665f3]">
                eBay Clone
              </a>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl">
              <SearchBar />
            </div>

            {/* Location Selector */}
            <LocationSelector 
              selectedLocation={selectedLocation}
              onLocationChange={handleLocationChange}
            />

            {/* Profile or Sign In */}
            {currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex flex-col space-y-1 p-2">
                    <p className="text-sm font-medium leading-none">{currentUser.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {currentUser.email}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/my-listings')}>
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    <span>My Listings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/analytics')}>
                    <TrendingUp className="mr-2 h-4 w-4" />
                    <span>Analytics</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                variant="outline" 
                className="border-[#3665f3] text-[#3665f3] hover:bg-[#3665f3]/10"
                onClick={() => navigate('/signin')}
              >
                <User className="h-4 w-4 mr-2" />
                Sign In
              </Button>
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

          {/* Navigation Row */}
          <div className="hidden md:flex items-center justify-between">
            {/* Main Navigation with Icons */}
            <div className="flex items-center space-x-1">
              <a
                href="/"
                className={`px-3 py-2 rounded-md font-medium transition-colors flex items-center gap-2 ${
                  activeTab === 'foryou' 
                    ? 'bg-[#3665f3] text-white' 
                    : 'text-gray-700 hover:bg-[#3665f3]/10 hover:text-[#3665f3]'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/');
                  return false;
                }}
              >
                <Heart className="h-4 w-4" />
              </a>
              <a
                href="/bidding"
                className={`px-3 py-2 rounded-md font-medium transition-colors flex items-center gap-2 ${
                  activeTab === 'bidding' 
                    ? 'bg-[#3665f3] text-white' 
                    : 'text-gray-700 hover:bg-[#3665f3]/10 hover:text-[#3665f3]'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/bidding');
                  return false;
                }}
              >
                <Gavel className="h-4 w-4" />
              </a>
              <a
                href="/wishlist"
                className={`px-3 py-2 rounded-md font-medium transition-colors flex items-center gap-2 ${
                  activeTab === 'saved' 
                    ? 'bg-[#3665f3] text-white' 
                    : 'text-gray-700 hover:bg-[#3665f3]/10 hover:text-[#3665f3]'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/wishlist');
                  return false;
                }}
              >
                <Bookmark className="h-4 w-4" />
              </a>
              <a
                href="/groups"
                className={`px-3 py-2 rounded-md font-medium transition-colors flex items-center gap-2 ${
                  activeTab === 'groups' 
                    ? 'bg-[#3665f3] text-white' 
                    : 'text-gray-700 hover:bg-[#3665f3]/10 hover:text-[#3665f3]'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/groups');
                  return false;
                }}
              >
                <Users className="h-4 w-4" />
              </a>
              <a
                href="/messages"
                className={`px-3 py-2 rounded-md font-medium transition-colors flex items-center gap-2 ${
                  activeTab === 'messages' 
                    ? 'bg-[#3665f3] text-white' 
                    : 'text-gray-700 hover:bg-[#3665f3]/10 hover:text-[#3665f3]'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/messages');
                  return false;
                }}
              >
                <MessageSquare className="h-4 w-4" />
              </a>

              {/* Categories - Electronics, Sport, Fashion, Toy */}
              <div className="flex items-center space-x-1 ml-4">
                {categories.map((category) => (
                  <a
                    key={category}
                    href={`/search?category=${category}`}
                    className="px-3 py-2 text-sm text-gray-600 hover:text-[#3665f3] hover:bg-[#3665f3]/10 rounded transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(`/search?category=${category}`);
                      return false;
                    }}
                  >
                    {category}
                  </a>
                ))}
                
                {/* More Categories Dropdown */}
                <div className="relative">
                  <div 
                    className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:text-[#3665f3] hover:bg-[#3665f3]/10 rounded cursor-pointer transition-colors"
                    onMouseEnter={() => setShowCategories(true)}
                    onMouseLeave={() => setShowCategories(false)}
                  >
                    <span>Categories</span>
                    <ChevronDown className="h-3 w-3" />
                  </div>
                  
                  {showCategories && (
                    <div 
                      className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-2 min-w-[200px] z-50"
                      onMouseEnter={() => setShowCategories(true)}
                      onMouseLeave={() => setShowCategories(false)}
                    >
                      {allCategories.map((category) => (
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

            {/* Sell Button - Bottom Right */}
            <div className="flex items-center gap-2">
              <Button 
                variant="outline"
                className="border-[#3665f3] text-[#3665f3] hover:bg-[#3665f3]/10 flex items-center gap-2"
                onClick={() => navigate('/bidding')}
              >
                <Gavel className="h-4 w-4" />
                Bid
              </Button>
              <Button 
                className="bg-[#3665f3] hover:bg-[#3665f3]/90 flex items-center gap-2"
                onClick={() => {
                  if (currentUser) {
                    // Open sell dialog or navigate to sell page
                    toast({
                      title: "Sell Feature",
                      description: "Sell functionality would open here.",
                    });
                  } else {
                    navigate('/signin');
                  }
                }}
              >
                <Plus className="h-4 w-4" />
                Sell
              </Button>
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
                    <Button 
                      variant="outline" 
                      className="w-full border-[#3665f3] text-[#3665f3]"
                      onClick={() => {
                        navigate('/signin');
                        setIsMenuOpen(false);
                      }}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Sign In
                    </Button>
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
                <li>
                  <Button className="w-full bg-[#3665f3] hover:bg-[#3665f3]/90 flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Sell
                  </Button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
