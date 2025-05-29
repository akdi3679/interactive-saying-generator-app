
import { createUser, validateUser } from '../lib/mongodb';
import { useToast } from '@/components/ui/use-toast';

export const useMongoAuth = () => {
  const { toast } = useToast();

  const signUp = async (email, password, name) => {
    const { data, error } = await createUser(email, password, name);

    if (error) {
      toast({
        variant: "destructive",
        title: "Sign Up Failed",
        description: error,
      });
      return { error, data: null };
    }

    toast({
      title: "Sign Up Successful",
      description: "Your account has been created successfully.",
    });

    return { data, error: null };
  };

  const signIn = async (email, password) => {
    const { data, error } = await validateUser(email, password);

    if (error) {
      toast({
        variant: "destructive",
        title: "Sign In Failed",
        description: error,
      });
      return { error, data: null };
    }

    toast({
      title: "Sign In Successful",
      description: "You have been signed in successfully.",
    });

    return { data, error: null };
  };

  return {
    signUp,
    signIn,
  };
};
