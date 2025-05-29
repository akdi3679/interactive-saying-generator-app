
import { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';

interface ImageUploadProps {
  images: string[];
  setImages: (images: string[]) => void;
  userId: string | undefined;
}

export const ImageUpload = ({ images, setImages, userId }: ImageUploadProps) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files.length) return;
    if (!userId) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please sign in to upload images."
      });
      return;
    }

    const file = e.target.files[0];
    const fileSize = file.size / 1024 / 1024; // in MB
    
    if (fileSize > 5) {
      toast({
        variant: "destructive",
        title: "File Too Large",
        description: "Maximum file size is 5MB."
      });
      return;
    }

    setUploading(true);

    try {
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = `product-images/${userId}/${fileName}`;
      
      const { error } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);
        
      if (error) throw error;
      
      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);
        
      setImages([...images, data.publicUrl]);
      
      toast({
        title: "Image Uploaded",
        description: "Your image has been uploaded successfully."
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: "Failed to upload image. Please try again."
      });
    } finally {
      setUploading(false);
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  return (
    <div>
      <h3 className="text-sm font-medium mb-2">Images</h3>
      <div className="grid grid-cols-4 gap-2 mb-2">
        {images.map((image, index) => (
          <div key={index} className="relative rounded-md overflow-hidden h-20">
            <img src={image} alt={`Product ${index + 1}`} className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-1 right-1 bg-black bg-opacity-50 rounded-full p-1"
            >
              <X className="h-3 w-3 text-white" />
            </button>
          </div>
        ))}
        {images.length < 4 && (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="h-20 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50"
          >
            <Upload className="h-5 w-5 text-gray-400" />
            <span className="text-xs text-gray-500 mt-1">Upload</span>
          </div>
        )}
      </div>
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*"
        onChange={handleImageUpload}
        disabled={uploading}
      />
      <p className="text-xs text-gray-500">Upload up to 4 images (max 5MB each)</p>
    </div>
  );
};
