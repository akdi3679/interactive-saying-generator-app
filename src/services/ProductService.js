
import { testProducts, initializeTestData } from '../utils/testData';

export class ProductService {
  static async getProducts() {
    if (!localStorage.getItem('testProducts')) {
      initializeTestData();
    }
    
    try {
      const products = JSON.parse(localStorage.getItem('testProducts') || '[]');
      return products.map((product) => ({
        ...product,
        createdAt: new Date(product.createdAt),
        seller: {
          ...product.seller,
          createdAt: new Date(product.seller.createdAt)
        },
        bidding: product.bidding ? {
          ...product.bidding,
          endTime: product.bidding.endTime ? new Date(product.bidding.endTime) : undefined
        } : undefined
      }));
    } catch (error) {
      console.error('Error loading products:', error);
      return testProducts;
    }
  }

  static async getProductById(id) {
    const products = await this.getProducts();
    return products.find(product => product.id === id) || null;
  }

  static async getProductsByCategory(category) {
    const products = await this.getProducts();
    return products.filter(product => product.category === category);
  }

  static async searchProducts(query) {
    const products = await this.getProducts();
    const lowercaseQuery = query.toLowerCase();
    
    return products.filter(product =>
      product.title.toLowerCase().includes(lowercaseQuery) ||
      product.description.toLowerCase().includes(lowercaseQuery) ||
      product.category.toLowerCase().includes(lowercaseQuery)
    );
  }

  static async createProduct(productData) {
    try {
      const products = await this.getProducts();
      
      const newProduct = {
        id: Date.now().toString(),
        title: productData.title || 'New Product',
        description: productData.description || '',
        price: productData.price || 0,
        category: productData.category || 'Other',
        images: productData.images || [],
        seller: productData.seller || {
          id: 'user1',
          name: 'Current User',
          email: 'user@example.com',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1',
          createdAt: new Date(),
          rating: 4.5,
          totalRatings: 10
        },
        location: productData.location || 'Unknown',
        condition: productData.condition || 'Good',
        createdAt: new Date(),
        isArchived: false,
        visibility: productData.visibility || 'public',
        bidding: productData.bidding,
        buyNowPrice: productData.buyNowPrice,
        shipping: productData.shipping,
        returns: productData.returns,
        groupId: productData.groupId
      };
      
      products.push(newProduct);
      localStorage.setItem('testProducts', JSON.stringify(products));
      
      return newProduct;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  static async placeBid(productId, userId, amount) {
    try {
      const products = await this.getProducts();
      const productIndex = products.findIndex(p => p.id === productId);
      
      if (productIndex === -1) return false;
      
      const product = products[productIndex];
      if (!product.bidding?.isAuction) return false;
      if (amount <= (product.bidding.currentBid || 0)) return false;
      
      products[productIndex].bidding.currentBid = amount;
      products[productIndex].bidding.bidCount = (product.bidding.bidCount || 0) + 1;
      
      localStorage.setItem('testProducts', JSON.stringify(products));
      
      const biddingData = JSON.parse(localStorage.getItem('biddingData') || '{}');
      if (!biddingData[productId]) biddingData[productId] = [];
      
      biddingData[productId].push({
        userId,
        amount,
        timestamp: new Date()
      });
      
      localStorage.setItem('biddingData', JSON.stringify(biddingData));
      
      return true;
    } catch (error) {
      console.error('Error placing bid:', error);
      return false;
    }
  }

  static async getBidHistory(productId) {
    try {
      const biddingData = JSON.parse(localStorage.getItem('biddingData') || '{}');
      return biddingData[productId] || [];
    } catch (error) {
      console.error('Error getting bid history:', error);
      return [];
    }
  }
}
