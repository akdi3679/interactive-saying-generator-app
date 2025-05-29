
import { useState } from 'react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from './ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from './ui/tabs';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useToast } from '@/components/ui/use-toast';
import { User } from 'lucide-react';
import { useDatabase } from '../hooks/useDatabase';

// Export the getAuthState function so it can be imported elsewhere
export const getAuthState = () => {
  const { user, loading } = useDatabase();
  
  return {
    isLoggedIn: !!user,
    user: user ? {
      id: user.id,
      name: user?.user_metadata?.name || user.email?.split('@')[0] || 'User',
      email: user.email || '',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`,
      createdAt: new Date()
    } : null,
    isLoading: loading
  };
};

export const AuthButtons = () => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const { user, signIn, signUp, signOut } = useDatabase();

  const handleSignIn = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "Sign In Failed",
        description: "Please provide both email and password.",
      });
      return;
    }
    
    const { error } = await signIn(email, password);
    
    if (!error) {
      setIsOpen(false);
      setEmail('');
      setPassword('');
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    
    if (!email || !password || !name) {
      toast({
        variant: "destructive",
        title: "Sign Up Failed",
        description: "Please fill in all required fields.",
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Sign Up Failed",
        description: "Passwords do not match.",
      });
      return;
    }
    
    const { error } = await signUp(email, password, name);
    
    if (!error) {
      setIsOpen(false);
      setEmail('');
      setPassword('');
      setName('');
      setConfirmPassword('');
    }
  };

  if (user) {
    return (
      <Button
        variant="outline"
        className="flex items-center gap-2 border-[#3665f3] text-[#3665f3] hover:text-[#3665f3]/90 hover:bg-[#3665f3]/10"
        onClick={signOut}
      >
        <User className="h-4 w-4" />
        <span>Logout</span>
      </Button>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 border-[#3665f3] text-[#3665f3] hover:text-[#3665f3]/90 hover:bg-[#3665f3]/10">
          <User className="h-4 w-4" />
          <span>Sign in</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Account Access</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="signin" className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <form onSubmit={handleSignIn} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email">Email</Label>
                <Input
                  id="signin-email"
                  type="email"
                  placeholder="your.email@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signin-password">Password</Label>
                <Input
                  id="signin-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full bg-[#3665f3] hover:bg-[#3665f3]/90">Sign In</Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={handleSignUp} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name">Full Name</Label>
                <Input
                  id="signup-name"
                  placeholder="John Doe"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="your.email@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-confirm">Confirm Password</Label>
                <Input
                  id="signup-confirm"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full bg-[#3665f3] hover:bg-[#3665f3]/90">Create Account</Button>
            </form>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex flex-col space-y-2 mt-4">
          <div className="text-center text-sm text-muted-foreground">
            Sign in required to access all features
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AuthButtons;
