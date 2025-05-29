
import React, { createContext, useContext, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { createUser, validateUser } from '../lib/mongodb';

const MongoAuthContext = createContext(undefined);

export const MongoAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const signIn = async (email, password) => {
    setLoading(true);
    const { data, error } = await validateUser(email, password);

    if (error) {
      toast({
        variant: "destructive",
        title: "Sign In Failed",
        description: error,
      });
      setLoading(false);
      return { error, data: null };
    }

    setUser(data);
    localStorage.setItem('currentUser', JSON.stringify(data));
    toast({
      title: "Sign In Successful",
      description: "You have been signed in successfully.",
    });
    setLoading(false);
    return { data, error: null };
  };

  const signUp = async (email, password, name) => {
    setLoading(true);
    const { data, error } = await createUser(email, password, name);

    if (error) {
      toast({
        variant: "destructive",
        title: "Sign Up Failed",
        description: error,
      });
      setLoading(false);
      return { error, data: null };
    }

    toast({
      title: "Sign Up Successful",
      description: "Your account has been created successfully.",
    });
    setLoading(false);
    return { data, error: null };
  };

  const signOut = async () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
  };

  const getProfile = async () => {
    return user;
  };

  // Load user from localStorage on component mount
  React.useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  return (
    <MongoAuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        getProfile,
        session: user ? { user } : null,
      }}
    >
      {children}
    </MongoAuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(MongoAuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a MongoAuthProvider');
  }
  return context;
};
