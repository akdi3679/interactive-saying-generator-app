
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Heart, MessageSquare, Users, Gavel, User, LogIn, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { AuthService, User as AuthUser } from '../services/AuthService';
import LocationSelector from './LocationSelector';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedLocation, setSelectedLocation] = useState({
    lat: 40.7128,
    lng: -74.0060,
    address: 'New York, NY',
    range: 25
  });
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setCurrentUser(AuthService.getCurrentUser());
  }, []);

  const handleLocationChange = (location: any) => {
    setSelectedLocation(location);
  };

  const handleLogin = async () => {
    const { user, error } = await AuthService.signIn(email, password);
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error,
      });
      return;
    }

    if (user) {
      setCurrentUser(user);
      setIsLoginOpen(false);
      setEmail('');
      setPassword('');
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
    }
  };

  const handleLogout = () => {
    AuthService.signOut();
    setCurrentUser(null);
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
  };

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', icon: Heart, label: 'For You' },
    { path: '/messages', icon: MessageSquare, label: 'Messages' },
    { path: '/wishlist', icon: Heart, label: 'Saved' },
    { path: '/groups', icon: Users, label: 'Groups' },
    { path: '/bidding', icon: Gavel, label: 'Bidding' },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-6">
            <Link to="/" className="text-2xl font-bold text-[#3665f3]">
              eBay
            </Link>
            
            <LocationSelector 
              selectedLocation={selectedLocation}
              onLocationChange={handleLocationChange}
            />
          </div>

          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search for anything"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3665f3] focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center space-x-1">
            {navItems.map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                  isActive(path)
                    ? 'bg-[#3665f3] text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-4 w-4" />
              </Link>
            ))}
            
            {currentUser ? (
              <div className="flex items-center space-x-2 ml-4">
                <div className="flex items-center space-x-2">
                  <img 
                    src={currentUser.avatar} 
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-sm font-medium">{currentUser.name}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="ml-4">
                    <LogIn className="h-4 w-4 mr-2" />
                    Login
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Login to eBay</DialogTitle>
                  </DialogHeader>
                  
                  <div className="space-y-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Email</label>
                      <Input
                        type="email"
                        placeholder="test@test.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Password</label>
                      <Input
                        type="password"
                        placeholder="0000"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      Test credentials: test@test.com / 0000
                    </div>
                    
                    <Button onClick={handleLogin} className="w-full">
                      Login
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
