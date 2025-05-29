
import * as z from 'zod';

export const sellItemFormSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
    message: 'Price must be a positive number',
  }),
  category: z.string(),
  condition: z.enum(['New', 'Like New', 'Good', 'Fair', 'Poor']),
  location: z.string().min(2, 'Please enter a valid location'),
  freeShipping: z.boolean().default(false),
  shippingCost: z.string().optional(),
  expeditedAvailable: z.boolean().default(false),
  returnsAccepted: z.boolean().default(false),
  returnsPeriod: z.string().optional(),
  groupId: z.string().optional(),
  visibility: z.enum(['public', 'group-only']).default('public'),
});

export type SellItemFormValues = z.infer<typeof sellItemFormSchema>;

export const defaultFormValues: SellItemFormValues = {
  title: '',
  description: '',
  price: '',
  category: '',
  condition: 'New',
  location: '',
  freeShipping: false,
  shippingCost: '0',
  expeditedAvailable: false,
  returnsAccepted: false,
  returnsPeriod: '14',
  groupId: 'no-group',
  visibility: 'public',
};

export const categories = [
  'Electronics',
  'Fashion',
  'Furniture',
  'Household',
  'Vehicles',
  'Property',
  'Collectibles',
  'Sports',
  'Toys',
  'Business & Industrial',
  'Jewelry',
  'Other'
] as const;
