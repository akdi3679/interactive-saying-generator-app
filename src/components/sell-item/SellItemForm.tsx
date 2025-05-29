import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { ProductService } from '@/services/ProductService';
import { DialogFooter } from '@/components/ui/dialog';
import { ProductCategory } from '@/models/types';
import { useAuth } from '@/context/AuthContext';
import { ImageUpload } from './ImageUpload';
import { GroupService } from '@/services/GroupService';
import { Group } from '@/models/group.types';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  sellItemFormSchema,
  SellItemFormValues,
  defaultFormValues,
  categories
} from './schema';

interface SellItemFormProps {
  onSuccess: () => void;
  initialGroupId?: string;
}

export const SellItemForm = ({ onSuccess, initialGroupId }: SellItemFormProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [images, setImages] = useState<string[]>([]);
  const [userGroups, setUserGroups] = useState<Group[]>([]);

  const form = useForm<SellItemFormValues>({
    resolver: zodResolver(sellItemFormSchema),
    defaultValues: {
      ...defaultFormValues,
      groupId: initialGroupId || 'no-group',
    },
  });

  useEffect(() => {
    if (user) {
      fetchUserGroups();
    }
  }, [user]);

  const fetchUserGroups = async () => {
    if (!user) return;
    const groups = await GroupService.getUserGroups(user.id);
    setUserGroups(groups);
  };

  const onSubmit = async (values: SellItemFormValues) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please sign in to list items.",
      });
      return;
    }
    
    if (images.length === 0) {
      toast({
        variant: "destructive",
        title: "Images Required",
        description: "Please upload at least one image for your listing.",
      });
      return;
    }
    
    try {
      const productData = {
        title: values.title,
        description: values.description,
        price: parseFloat(values.price),
        category: values.category as ProductCategory,
        images: images,
        seller_id: user.id,
        location: values.location,
        condition: values.condition,
        is_archived: false,
        is_auction: false,
        shipping_cost: values.freeShipping ? 0 : parseFloat(values.shippingCost || '0'),
        free_shipping: values.freeShipping,
        expedited_available: values.expeditedAvailable,
        returns_accepted: values.returnsAccepted,
        returns_period_days: values.returnsAccepted ? parseInt(values.returnsPeriod || '14') : undefined,
        group_id: values.groupId === 'no-group' ? null : values.groupId,
        visibility: values.visibility,
      };
      
      const productId = await ProductService.createProduct(productData);
      
      if (productId) {
        toast({
          title: "Listing Created",
          description: "Your item has been listed successfully.",
        });
        onSuccess();
        form.reset();
        setImages([]);
      } else {
        throw new Error('Failed to create product');
      }
    } catch (error) {
      console.error('Error creating product:', error);
      toast({
        variant: "destructive",
        title: "Error Creating Listing",
        description: "There was a problem creating your listing. Please try again.",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter item title" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <ImageUpload images={images} setImages={setImages} userId={user?.id} />
        
        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">$</span>
                    <Input {...field} className="pl-6" placeholder="0.00" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="condition"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Condition</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="New">New</SelectItem>
                    <SelectItem value="Like New">Like New</SelectItem>
                    <SelectItem value="Good">Good</SelectItem>
                    <SelectItem value="Fair">Fair</SelectItem>
                    <SelectItem value="Poor">Poor</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="border-t pt-4">
          <h3 className="font-medium mb-3">Group Options</h3>
          
          <FormField
            control={form.control}
            name="groupId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Post to Group (Optional)</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a group or leave public" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="no-group">Public (No Group)</SelectItem>
                    {userGroups.map((group) => (
                      <SelectItem key={group.id} value={group.id}>{group.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {form.watch('groupId') && form.watch('groupId') !== 'no-group' && (
            <FormField
              control={form.control}
              name="visibility"
              render={({ field }) => (
                <FormItem className="mt-3">
                  <FormLabel>Visibility</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="public">Public (Visible everywhere)</SelectItem>
                      <SelectItem value="group-only">Group Only (Only group members can see)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>
        
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input {...field} placeholder="City, State" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  placeholder="Describe your item" 
                  className="min-h-[120px]" 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="border-t pt-4">
          <h3 className="font-medium mb-3">Shipping Options</h3>
          
          <FormField
            control={form.control}
            name="freeShipping"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 mb-2">
                <FormControl>
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={field.onChange}
                    className="h-4 w-4 rounded"
                  />
                </FormControl>
                <FormLabel>Free Shipping</FormLabel>
              </FormItem>
            )}
          />
          
          {!form.watch('freeShipping') && (
            <FormField
              control={form.control}
              name="shippingCost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shipping Cost</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3">$</span>
                      <Input {...field} className="pl-6" placeholder="0.00" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          
          <FormField
            control={form.control}
            name="expeditedAvailable"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 mt-2">
                <FormControl>
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={field.onChange}
                    className="h-4 w-4 rounded"
                  />
                </FormControl>
                <FormLabel>Expedited Shipping Available</FormLabel>
              </FormItem>
            )}
          />
        </div>

        <div className="border-t pt-4">
          <h3 className="font-medium mb-3">Returns</h3>
          
          <FormField
            control={form.control}
            name="returnsAccepted"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 mb-2">
                <FormControl>
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={field.onChange}
                    className="h-4 w-4 rounded"
                  />
                </FormControl>
                <FormLabel>Accept Returns</FormLabel>
              </FormItem>
            )}
          />
          
          {form.watch('returnsAccepted') && (
            <FormField
              control={form.control}
              name="returnsPeriod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Return Period (days)</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" min="1" max="60" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <DialogFooter className="pt-4">
          <Button type="submit" className="bg-[#3665f3] hover:bg-[#3665f3]/90">
            List Item
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
