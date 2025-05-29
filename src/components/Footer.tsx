
import { Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">All For You</h3>
            <p className="text-ios-gray">
              Marketplace for buying and selling products and services
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-ios-gray hover:text-ios-blue">Electronics</a></li>
              <li><a href="#" className="text-ios-gray hover:text-ios-blue">Fashion</a></li>
              <li><a href="#" className="text-ios-gray hover:text-ios-blue">Furniture</a></li>
              <li><a href="#" className="text-ios-gray hover:text-ios-blue">Vehicles</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Help</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-ios-gray hover:text-ios-blue">FAQ</a></li>
              <li><a href="#" className="text-ios-gray hover:text-ios-blue">Contact Us</a></li>
              <li><a href="#" className="text-ios-gray hover:text-ios-blue">Privacy Policy</a></li>
              <li><a href="#" className="text-ios-gray hover:text-ios-blue">Terms of Service</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">About</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-ios-gray hover:text-ios-blue">About Us</a></li>
              <li><a href="#" className="text-ios-gray hover:text-ios-blue">Careers</a></li>
              <li><a href="#" className="text-ios-gray hover:text-ios-blue">Blog</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-6 text-center text-ios-gray">
          <p className="flex items-center justify-center">
            Made with <Heart className="h-4 w-4 mx-1 text-red-500 fill-red-500" /> in 2025
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
