
import { useState } from 'react';
import { Bell, Menu, Search, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';
import AuthButtons, { getAuthState } from './AuthButtons';
import SellItemButton from './SellItemButton';
import GroupsDropdown from './GroupsDropdown';

const Navbar = () => {
  const auth = getAuthState();
  const currentUser = auth.isLoggedIn ? auth.user : null;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

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
                    <GroupsDropdown />
                    <a
                      href="/wishlist"
                      className="text-gray-700 hover:text-[#3665f3] transition-colors"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate('/wishlist');
                        return false;
                      }}
                    >
                      Watchlist
                    </a>
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
                  <GroupsDropdown />
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

          {/* Second Row - Search */}
          <div className="flex items-center">
            <div className="w-full">
              <SearchBar />
            </div>
          </div>

          {/* Third Row - Categories */}
          <div className="hidden md:flex items-center space-x-6 text-sm pt-1 overflow-x-auto">
            <a
              href="/"
              className="text-gray-700 hover:text-[#3665f3] transition-colors whitespace-nowrap"
              onClick={(e) => {
                e.preventDefault();
                navigate('/');
                return false;
              }}
            >
              Home
            </a>
            <a
              href="/groups"
              className="text-gray-700 hover:text-[#3665f3] transition-colors whitespace-nowrap"
              onClick={(e) => {
                e.preventDefault();
                navigate('/groups');
                return false;
              }}
            >
              Groups
            </a>
            <a
              href="/wishlist"
              className="text-gray-700 hover:text-[#3665f3] transition-colors whitespace-nowrap"
              onClick={(e) => {
                e.preventDefault();
                navigate('/wishlist');
                return false;
              }}
            >
              Saved
            </a>
            <a
              href="/search?category=Electronics"
              className="text-gray-700 hover:text-[#3665f3] transition-colors whitespace-nowrap"
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
              className="text-gray-700 hover:text-[#3665f3] transition-colors whitespace-nowrap"
              onClick={(e) => {
                e.preventDefault();
                navigate('/search?category=Fashion');
                return false;
              }}
            >
              Fashion
            </a>
            <a
              href="/search?category=Household"
              className="text-gray-700 hover:text-[#3665f3] transition-colors whitespace-nowrap"
              onClick={(e) => {
                e.preventDefault();
                navigate('/search?category=Household');
                return false;
              }}
            >
              Home & Garden
            </a>
            <a
              href="/search?category=Sports"
              className="text-gray-700 hover:text-[#3665f3] transition-colors whitespace-nowrap"
              onClick={(e) => {
                e.preventDefault();
                navigate('/search?category=Sports');
                return false;
              }}
            >
              Sports
            </a>
            <a
              href="/search?category=Collectibles"
              className="text-gray-700 hover:text-[#3665f3] transition-colors whitespace-nowrap"
              onClick={(e) => {
                e.preventDefault();
                navigate('/search?category=Collectibles');
                return false;
              }}
            >
              Collectibles
            </a>
            <a
              href="/search?category=Business & Industrial"
              className="text-gray-700 hover:text-[#3665f3] transition-colors whitespace-nowrap"
              onClick={(e) => {
                e.preventDefault();
                navigate('/search?category=Business & Industrial');
                return false;
              }}
            >
              Industrial
            </a>
            <a
              href="/search?category=Vehicles"
              className="text-gray-700 hover:text-[#3665f3] transition-colors whitespace-nowrap"
              onClick={(e) => {
                e.preventDefault();
                navigate('/search?category=Vehicles');
                return false;
              }}
            >
              Motors
            </a>
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
                  <a href="/" className="block py-2 text-gray-700">
                    Home
                  </a>
                </li>
                <li>
                  <a href="/groups" className="block py-2 text-gray-700" onClick={(e) => {
                    e.preventDefault();
                    navigate('/groups');
                    setIsMenuOpen(false);
                    return false;
                  }}>
                    Groups
                  </a>
                </li>
                <li>
                  <a href="/wishlist" className="block py-2 text-gray-700" onClick={(e) => {
                    e.preventDefault();
                    navigate('/wishlist');
                    setIsMenuOpen(false);
                    return false;
                  }}>
                    Watchlist
                  </a>
                </li>
                <li>
                  <a href="/search?category=Electronics" className="block py-2 text-gray-700" onClick={(e) => {
                    e.preventDefault();
                    navigate('/search?category=Electronics');
                    setIsMenuOpen(false);
                    return false;
                  }}>
                    Electronics
                  </a>
                </li>
                <li>
                  <a href="/search?category=Fashion" className="block py-2 text-gray-700" onClick={(e) => {
                    e.preventDefault();
                    navigate('/search?category=Fashion');
                    setIsMenuOpen(false);
                    return false;
                  }}>
                    Fashion
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
