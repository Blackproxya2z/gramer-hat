import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Language, 
  Product, 
  Category, 
  CartItem, 
  ProductVariant, 
  Order, 
  OrderStatus, 
  SiteSettings,
  AdminAuth
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

  addCategory: (category: Category) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;

  adminAuth: AdminAuth;
  loginAdmin: (
    credentials: { email?: string; password?: string; pin?: string; role?: 'admin' | 'moderator' } | string,
    requestedRole?: 'admin' | 'moderator'
  ) => { success: boolean; message: string };
  logoutAdmin: () => void;

  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('bn');
  const [viewMode, setViewMode] = useState<'store' | 'admin'>('store');
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(false);
  
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('gh_categories');
    return saved ? JSON.parse(saved) : initialCategories;
  });
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

  const [adminAuth, setAdminAuth] = useState<AdminAuth>(() => {
    try {
      const saved = sessionStorage.getItem('gh_admin_auth');
      if (saved) {
        const parsed: AdminAuth = JSON.parse(saved);
        if (parsed.loginTime && Date.now() - parsed.loginTime < 60 * 60 * 1000) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return { isAuthenticated: false, role: null, userName: '', loginTime: null };
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

  useEffect(() => {
    localStorage.setItem('gh_categories', JSON.stringify(categories));
  }, [categories]);

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

  const addCategory = (category: Category) => {
    setCategories(prev => [...prev, category]);
    showToast(language === 'bn' ? 'নতুন ক্যাটাগরি যুক্ত হয়েছে!' : 'New category added!');
  };

  const updateCategory = (category: Category) => {
    setCategories(prev => prev.map(c => (c.id === category.id ? category : c)));
    showToast(language === 'bn' ? 'ক্যাটাগরি সফলভাবে আপডেট হয়েছে!' : 'Category updated!');
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
    showToast(language === 'bn' ? 'ক্যাটাগরি মুছে ফেলা হয়েছে!' : 'Category deleted!');
  };

  const loginAdmin = (
    credentials: { email?: string; password?: string; pin?: string; role?: 'admin' | 'moderator' } | string,
    requestedRole: 'admin' | 'moderator' = 'admin'
  ) => {
    // Check lockout protection
    const lockoutUntil = Number(localStorage.getItem('gh_admin_lockout_until') || '0');
    if (lockoutUntil > Date.now()) {
      const remainingMinutes = Math.ceil((lockoutUntil - Date.now()) / (60 * 1000));
      return {
        success: false,
        message: language === 'bn'
          ? `অতিরিক্ত ভুল চেষ্টার কারণে এক্সেস লক করা হয়েছে। অনুগ্রহ করে ${remainingMinutes} মিনিট পর চেষ্টা করুন।`
          : `Access locked due to multiple failed attempts. Please try again in ${remainingMinutes} min.`
      };
    }

    const envEmail = (import.meta.env.VITE_ADMIN_EMAIL || 'masumbilla03627@gmail.com').trim().toLowerCase();
    const envPassword = (import.meta.env.VITE_ADMIN_PASSWORD || 'Gramerhat099665511').trim();

    let isAuthorized = false;
    let assignedRole: 'admin' | 'moderator' = requestedRole;
    let userName = 'Super Admin';
    let userEmail: string | undefined = undefined;

    if (typeof credentials === 'object') {
      const { email, password, pin, role } = credentials;
      if (email && password) {
        if (email.trim().toLowerCase() === envEmail && password.trim() === envPassword) {
          isAuthorized = true;
          assignedRole = 'admin';
          userName = 'Masum Billa (Main Admin)';
          userEmail = envEmail;
        }
      } else if (pin) {
        const cleanPin = pin.trim();
        const effectiveAdminPin = siteSettings.admin_pin || 'admin123';
        const effectiveModPin = siteSettings.moderator_pin || 'mod123';

        if (role === 'admin' && cleanPin === effectiveAdminPin) {
          isAuthorized = true;
          assignedRole = 'admin';
          userName = 'Super Admin';
        } else if (role === 'moderator' && (cleanPin === effectiveModPin || cleanPin === effectiveAdminPin)) {
          isAuthorized = true;
          assignedRole = 'moderator';
          userName = 'Content Moderator';
        } else if (!role && cleanPin === effectiveAdminPin) {
          isAuthorized = true;
          assignedRole = 'admin';
          userName = 'Super Admin';
        } else if (!role && cleanPin === effectiveModPin) {
          isAuthorized = true;
          assignedRole = 'moderator';
          userName = 'Content Moderator';
        }
      }
    } else {
      const cleanPin = (credentials || '').trim();
      const effectiveAdminPin = siteSettings.admin_pin || 'admin123';
      const effectiveModPin = siteSettings.moderator_pin || 'mod123';

      if (requestedRole === 'admin' && cleanPin === effectiveAdminPin) {
        isAuthorized = true;
        assignedRole = 'admin';
        userName = 'Super Admin';
      } else if (cleanPin === effectiveModPin || cleanPin === effectiveAdminPin) {
        isAuthorized = true;
        assignedRole = requestedRole;
        userName = requestedRole === 'admin' ? 'Super Admin' : 'Content Moderator';
      }
    }

    if (isAuthorized) {
      // Clear failed attempts upon successful login
      localStorage.removeItem('gh_admin_failed_attempts');
      localStorage.removeItem('gh_admin_lockout_until');

      const newAuth: AdminAuth = {
        isAuthenticated: true,
        role: assignedRole,
        userName,
        loginTime: Date.now(),
        email: userEmail,
      };
      setAdminAuth(newAuth);
      sessionStorage.setItem('gh_admin_auth', JSON.stringify(newAuth));
      showToast(
        language === 'bn'
          ? `স্বাগতম! ${newAuth.userName} হিসেবে লগইন সফল হয়েছে।`
          : `Welcome! Logged in as ${newAuth.userName}.`
      );
      return { success: true, message: 'Authorized' };
    }

    // Record failed attempt
    const currentAttempts = Number(localStorage.getItem('gh_admin_failed_attempts') || '0') + 1;
    localStorage.setItem('gh_admin_failed_attempts', String(currentAttempts));
    if (currentAttempts >= 5) {
      const lockTime = Date.now() + 5 * 60 * 1000;
      localStorage.setItem('gh_admin_lockout_until', String(lockTime));
      return {
        success: false,
        message: language === 'bn'
          ? '৫ বার ভুল চেষ্টা করা হয়েছে। নিরাপত্তার স্বার্থে সিএমএস ৫ মিনিটের জন্য লক করা হলো।'
          : '5 failed attempts reached. CMS locked for 5 minutes for security.'
      };
    }

    return {
      success: false,
      message:
        language === 'bn'
          ? `লগইন তথ্য সঠিক নয়! আর ${5 - currentAttempts} বার চেষ্টা করতে পারবেন।`
          : `Invalid login credentials! ${5 - currentAttempts} attempts remaining.`,
    };
  };

  const logoutAdmin = () => {
    setAdminAuth({ isAuthenticated: false, role: null, userName: '', loginTime: null });
    sessionStorage.removeItem('gh_admin_auth');
    showToast(language === 'bn' ? 'সিএমএস অ্যাডমিন প্যানেল থেকে লগআউট সম্পন্ন।' : 'Logged out of CMS Admin.');
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
        addCategory,
        updateCategory,
        deleteCategory,
        adminAuth,
        loginAdmin,
        logoutAdmin,
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
