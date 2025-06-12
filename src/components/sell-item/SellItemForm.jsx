
import { useState, useEffect } from 'react';
import { useToast } from '../ui/use-toast';
import { Button } from '../ui/button';
import { ProductService } from '../../services/ProductService';
import { DialogFooter } from '../ui/dialog';
import { useDatabase } from '../../hooks/useDatabase';
import { GroupService } from '../../services/GroupService';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select';

const categories = [
  'Electronics',
  'Fashion',
  'Home & Garden',
  'Sports',
  'Automotive',
  'Books',
  'Toys',
  'Health & Beauty',
  'Collectibles',
  'Other'
];

export const SellItemForm = ({ onSuccess, initialGroupId }) => {
  const { toast } = useToast();
  const { user } = useDatabase();
  const [userGroups, setUserGroups] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    location: '',
    condition: 'Good',
    groupId: initialGroupId || 'no-group',
    visibility: 'public',
    freeShipping: false,
    shippingCost: '',
    expeditedAvailable: false,
    returnsAccepted: false,
    returnsPeriod: '14'
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

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please sign in to list items.",
      });
      return;
    }
    
    if (!formData.title || !formData.price || !formData.category) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in all required fields.",
      });
      return;
    }
    
    try {
      const productData = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        images: ['https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop'], // Default image
        seller_id: user.id,
        location: formData.location,
        condition: formData.condition,
        is_archived: false,
        is_auction: false,
        shipping_cost: formData.freeShipping ? 0 : parseFloat(formData.shippingCost || '0'),
        free_shipping: formData.freeShipping,
        expedited_available: formData.expeditedAvailable,
        returns_accepted: formData.returnsAccepted,
        returns_period_days: formData.returnsAccepted ? parseInt(formData.returnsPeriod || '14') : undefined,
        group_id: formData.groupId === 'no-group' ? null : formData.groupId,
        visibility: formData.visibility,
      };
      
      const productId = await ProductService.createProduct(productData);
      
      if (productId) {
        toast({
          title: "Listing Created",
          description: "Your item has been listed successfully.",
        });
        onSuccess();
        setFormData({
          title: '',
          description: '',
          price: '',
          category: '',
          location: '',
          condition: 'Good',
          groupId: 'no-group',
          visibility: 'public',
          freeShipping: false,
          shippingCost: '',
          expeditedAvailable: false,
          returnsAccepted: false,
          returnsPeriod: '14'
        });
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
    <form onSubmit={onSubmit} className="space-y-4 mt-4">
      <div>
        <label className="block text-sm font-medium mb-2">Title *</label>
        <Input 
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          placeholder="Enter item title" 
          required
        />
      </div>
      
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-2">Price *</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">$</span>
            <Input 
              className="pl-6" 
              placeholder="0.00"
              value={formData.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
              required
            />
          </div>
        </div>
        
        <div className="flex-1">
          <label className="block text-sm font-medium mb-2">Condition</label>
          <Select value={formData.condition} onValueChange={(value) => handleInputChange('condition', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select condition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="New">New</SelectItem>
              <SelectItem value="Like New">Like New</SelectItem>
              <SelectItem value="Good">Good</SelectItem>
              <SelectItem value="Fair">Fair</SelectItem>
              <SelectItem value="Poor">Poor</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Category *</label>
        <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="border-t pt-4">
        <h3 className="font-medium mb-3">Group Options</h3>
        
        <div>
          <label className="block text-sm font-medium mb-2">Post to Group (Optional)</label>
          <Select value={formData.groupId} onValueChange={(value) => handleInputChange('groupId', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a group or leave public" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="no-group">Public (No Group)</SelectItem>
              {userGroups.map((group) => (
                <SelectItem key={group.id} value={group.id}>{group.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {formData.groupId && formData.groupId !== 'no-group' && (
          <div className="mt-3">
            <label className="block text-sm font-medium mb-2">Visibility</label>
            <Select value={formData.visibility} onValueChange={(value) => handleInputChange('visibility', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public (Visible everywhere)</SelectItem>
                <SelectItem value="group-only">Group Only (Only group members can see)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Location</label>
        <Input 
          value={formData.location}
          onChange={(e) => handleInputChange('location', e.target.value)}
          placeholder="City, State" 
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <Textarea 
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Describe your item" 
          className="min-h-[120px]" 
        />
      </div>

      <div className="border-t pt-4">
        <h3 className="font-medium mb-3">Shipping Options</h3>
        
        <div className="flex items-center space-x-3 mb-2">
          <input
            type="checkbox"
            id="freeShipping"
            checked={formData.freeShipping}
            onChange={(e) => handleInputChange('freeShipping', e.target.checked)}
            className="h-4 w-4 rounded"
          />
          <label htmlFor="freeShipping" className="text-sm font-medium">Free Shipping</label>
        </div>
        
        {!formData.freeShipping && (
          <div>
            <label className="block text-sm font-medium mb-2">Shipping Cost</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">$</span>
              <Input 
                className="pl-6" 
                placeholder="0.00"
                value={formData.shippingCost}
                onChange={(e) => handleInputChange('shippingCost', e.target.value)}
              />
            </div>
          </div>
        )}
        
        <div className="flex items-center space-x-3 mt-2">
          <input
            type="checkbox"
            id="expeditedAvailable"
            checked={formData.expeditedAvailable}
            onChange={(e) => handleInputChange('expeditedAvailable', e.target.checked)}
            className="h-4 w-4 rounded"
          />
          <label htmlFor="expeditedAvailable" className="text-sm font-medium">Expedited Shipping Available</label>
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="font-medium mb-3">Returns</h3>
        
        <div className="flex items-center space-x-3 mb-2">
          <input
            type="checkbox"
            id="returnsAccepted"
            checked={formData.returnsAccepted}
            onChange={(e) => handleInputChange('returnsAccepted', e.target.checked)}
            className="h-4 w-4 rounded"
          />
          <label htmlFor="returnsAccepted" className="text-sm font-medium">Accept Returns</label>
        </div>
        
        {formData.returnsAccepted && (
          <div>
            <label className="block text-sm font-medium mb-2">Return Period (days)</label>
            <Input 
              type="number" 
              min="1" 
              max="60"
              value={formData.returnsPeriod}
              onChange={(e) => handleInputChange('returnsPeriod', e.target.value)}
            />
          </div>
        )}
      </div>

      <DialogFooter className="pt-4">
        <Button type="submit" className="bg-[#3665f3] hover:bg-[#3665f3]/90">
          List Item
        </Button>
      </DialogFooter>
    </form>
  );
};
