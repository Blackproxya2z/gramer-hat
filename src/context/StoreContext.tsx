import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Language, 
  Product, 
  Category, 
  CartItem, 
  ProductVariant, 
  Order, 
  OrderStatus, 
  SiteSettings 
} from '../types';
import { 
  initialCategories, 
  initialProducts, 
  initialOrders, 
  initialSiteSettings 
} from '../data/mockData';

interface StoreContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (bn: string, en: string) => string;
  
  viewMode: 'store' | 'admin';
  setViewMode: (mode: 'store' | 'admin') => void;
  isMobileFrame: boolean;
  setIsMobileFrame: (val: boolean) => void;
  
  categories: Category[];
  products: Product[];
  activeCategory: string;
  setActiveCategory: (catId: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  cart: CartItem[];
  addToCart: (product: Product, variant: ProductVariant, quantity?: number) => void;
  updateCartQuantity: (productId: string, variantName: string, delta: number) => void;
  removeFromCart: (productId: string, variantName: string) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartCount: number;
  
  appliedCoupon: string | null;
  discount: number;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isTrackingOpen: boolean;
  setIsTrackingOpen: (open: boolean) => void;
  
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  lastPlacedOrder: Order | null;
  setLastPlacedOrder: (order: Order | null) => void;
  
  orders: Order[];
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  placeOrder: (orderData: Omit<Order, 'id' | 'order_number' | 'created_at' | 'timeline'>) => Order;
  
  siteSettings: SiteSettings;
  updateSiteSettings: (settings: Partial<SiteSettings>) => void;
  addNewProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;

  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('bn');
  const [viewMode, setViewMode] = useState<'store' | 'admin'>('store');
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(false);
  
  const [categories] = useState<Category[]>(initialCategories);
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('gh_products');
    return saved ? JSON.parse(saved) : initialProducts;
  });
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('gh_cart');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discount, setDiscount] = useState<number>(0);
  
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState<boolean>(false);
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);
  
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('gh_orders');
    return saved ? JSON.parse(saved) : initialOrders;
  });
  
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem('gh_settings');
    return saved ? JSON.parse(saved) : initialSiteSettings;
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  useEffect(() => {
    localStorage.setItem('gh_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('gh_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('gh_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('gh_settings', JSON.stringify(siteSettings));
  }, [siteSettings]);

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'bn' ? 'en' : 'bn'));
  };

  const t = (bn: string, en: string) => (language === 'bn' ? bn : en);

  const addToCart = (product: Product, variant: ProductVariant, quantity = 1) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(
        item => item.product.id === product.id && item.selected_variant.name === variant.name
      );
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
        };
        return next;
      }
      return [...prev, { product, selected_variant: variant, quantity }];
    });
    showToast(
      language === 'bn'
        ? `🛒 ${product.title_bn} (${variant.name}) কার্টে যুক্ত হয়েছে!`
        : `🛒 ${product.title_en} (${variant.name}) added to cart!`
    );
  };

  const updateCartQuantity = (productId: string, variantName: string, delta: number) => {
    setCart(prev => {
      return prev
        .map(item => {
          if (item.product.id === productId && item.selected_variant.name === variantName) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const removeFromCart = (productId: string, variantName: string) => {
    setCart(prev =>
      prev.filter(
        item => !(item.product.id === productId && item.selected_variant.name === variantName)
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
    setDiscount(0);
  };

  const cartSubtotal = cart.reduce(
    (acc, item) => acc + item.selected_variant.price * item.quantity,
    0
  );

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const applyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'GRAMER10' || clean === 'GH10') {
      const calcDiscount = Math.round(cartSubtotal * 0.1);
      setAppliedCoupon(clean);
      setDiscount(calcDiscount);
      return { 
        success: true, 
        message: language === 'bn' ? '১০% ছাড় সফলভাবে যোগ হয়েছে!' : '10% discount applied!' 
      };
    } else if (clean === 'FREESHIP') {
      setAppliedCoupon('FREESHIP');
      setDiscount(60);
      return { 
        success: true, 
        message: language === 'bn' ? 'ফ্রি ডেলিভারি কুপন প্রযোজ্য হয়েছে!' : 'Free delivery coupon applied!' 
      };
    }
    return { 
      success: false, 
      message: language === 'bn' ? 'দুঃখিত, কুপন কোডটি সঠিক নয়।' : 'Invalid coupon code.' 
    };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setDiscount(0);
  };

  const placeOrder = (orderData: Omit<Order, 'id' | 'order_number' | 'created_at' | 'timeline'>): Order => {
    const randNum = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `GH-2026-00${randNum}`;
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      order_number: orderNumber,
      created_at: new Date().toLocaleString(),
      timeline: [
        {
          title_bn: 'অর্ডার দাখিল করা হয়েছে',
          title_en: 'Order Placed',
          time: 'Just now',
          completed: true,
        },
        {
          title_bn: orderData.payment_method === 'cod' ? 'ক্যাশ অন ডেলিভারি নিশ্চিতকরণ' : 'পেমেন্ট যাচাইকরণ',
          title_en: orderData.payment_method === 'cod' ? 'COD Confirmation' : 'Payment Verification',
          time: 'In Progress',
          completed: orderData.payment_status === 'paid' || orderData.payment_status === 'verified',
        },
        {
          title_bn: 'পণ্য প্রক্রিয়াজাতকরণ ও প্যাকিং',
          title_en: 'Packaging & Processing',
          time: 'Pending',
          completed: false,
        },
        {
          title_bn: 'কুরিয়ারে হস্তান্তর',
          title_en: 'Handed to Courier',
          time: 'Pending',
          completed: false,
        },
        {
          title_bn: 'সফলভাবে ডেলিভারি সম্পন্ন',
          title_en: 'Delivered',
          time: 'Pending',
          completed: false,
        },
      ],
    };

    setOrders(prev => [newOrder, ...prev]);
    setLastPlacedOrder(newOrder);
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev =>
      prev.map(ord => {
        if (ord.id === orderId) {
          const updatedTimeline = ord.timeline.map((step, idx) => {
            if (status === 'processing' && idx <= 2) return { ...step, completed: true };
            if (status === 'shipped' && idx <= 3) return { ...step, completed: true };
            if (status === 'delivered') return { ...step, completed: true };
            return step;
          });
          return {
            ...ord,
            order_status: status,
            timeline: updatedTimeline,
            payment_status: status === 'delivered' ? 'paid' : ord.payment_status,
          };
        }
        return ord;
      })
    );
    showToast(language === 'bn' ? 'অর্ডার স্ট্যাটাস আপডেট হয়েছে!' : 'Order status updated!');
  };

  const updateSiteSettings = (newSettings: Partial<SiteSettings>) => {
    setSiteSettings(prev => ({ ...prev, ...newSettings }));
    showToast(language === 'bn' ? 'সেটিংস সংরক্ষিত হয়েছে!' : 'Settings saved successfully!');
  };

  const addNewProduct = (product: Product) => {
    setProducts(prev => [product, ...prev]);
    showToast(language === 'bn' ? 'নতুন পণ্য সফলভাবে যোগ হয়েছে!' : 'New product added!');
  };

  const updateProduct = (updated: Product) => {
    setProducts(prev => prev.map(p => (p.id === updated.id ? updated : p)));
    showToast(language === 'bn' ? 'পণ্য আপডেট সম্পন্ন!' : 'Product updated successfully!');
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    showToast(language === 'bn' ? 'পণ্য মুছে ফেলা হয়েছে!' : 'Product deleted!');
  };

  return (
    <StoreContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
        viewMode,
        setViewMode,
        isMobileFrame,
        setIsMobileFrame,
        categories,
        products,
        activeCategory,
        setActiveCategory,
        searchQuery,
        setSearchQuery,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartSubtotal,
        cartCount,
        appliedCoupon,
        discount,
        applyCoupon,
        removeCoupon,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isTrackingOpen,
        setIsTrackingOpen,
        selectedProduct,
        setSelectedProduct,
        lastPlacedOrder,
        setLastPlacedOrder,
        orders,
        updateOrderStatus,
        placeOrder,
        siteSettings,
        updateSiteSettings,
        addNewProduct,
        updateProduct,
        deleteProduct,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within StoreProvider');
  }
  return context;
};
