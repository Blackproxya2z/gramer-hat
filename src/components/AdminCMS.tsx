import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Product, OrderStatus, ProductVariant, Category } from '../types';
import { processProductImage, ProcessedImageResult } from '../utils/imageProcessor';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Settings, 
  Plus, 
  TrendingUp, 
  AlertTriangle, 
  Users, 
  CheckCircle2, 
  Clock, 
  Truck, 
  Edit, 
  Trash2, 
  Printer, 
  ExternalLink,
  Shield,
  Smartphone,
  Check,
  Lock,
  Unlock,
  Key,
  LogOut,
  Camera,
  Upload,
  RefreshCw,
  Eye,
  EyeOff,
  Sparkles,
  Palette,
  Layers,
  Globe,
  Image as ImageIcon
} from 'lucide-react';

export const AdminCMS: React.FC = () => {
  const { 
    products, 
    orders, 
    updateOrderStatus, 
    addNewProduct, 
    updateProduct, 
    deleteProduct,
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    siteSettings, 
    updateSiteSettings,
    language, 
    t,
    setViewMode,
    showToast,
    adminAuth,
    loginAdmin,
    logoutAdmin
  } = useStore();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'customization' | 'products' | 'orders' | 'settings'>('dashboard');

  // Security Login Gate State (Email/Password or PIN)
  const [loginMode, setLoginMode] = useState<'credentials' | 'pin'>('credentials');
  const [loginEmail, setLoginEmail] = useState('masumbilla03627@gmail.com');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginRole, setLoginRole] = useState<'admin' | 'moderator'>('admin');
  const [loginPin, setLoginPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Active Role is derived from authenticated session
  const role = adminAuth.role || 'moderator';
  
  // Product Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Form states for product
  const [titleBn, setTitleBn] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [sku, setSku] = useState('');
  const [categoryId, setCategoryId] = useState('cat-1');
  const [regPrice, setRegPrice] = useState(500);
  const [salePrice, setSalePrice] = useState(450);
  const [stock, setStock] = useState(20);
  const [shortDescBn, setShortDescBn] = useState('');
  const [shortDescEn, setShortDescEn] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isBestseller, setIsBestseller] = useState(false);
  const [isPreorder, setIsPreorder] = useState(false);

  // Category Modal State
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [catNameBn, setCatNameBn] = useState('');
  const [catNameEn, setCatNameEn] = useState('');
  const [catImage, setCatImage] = useState('');
  const [catImageProcessing, setCatImageProcessing] = useState(false);

  // Website Customization States (Hero, Seasonal, Roots, Marquee)
  const [heroImage, setHeroImage] = useState(siteSettings.hero_image || '/assets/figma/harvest_table.jpeg');
  const [heroTitleBn, setHeroTitleBn] = useState(siteSettings.hero_title_bn || 'গ্রামের খাঁটি স্বাদ,\nএবার আপনার ঘরে।');
  const [heroTitleEn, setHeroTitleEn] = useState(siteSettings.hero_title_en || 'Honest food. From our roots to your table.');
  const [heroSubtitleBn, setHeroSubtitleBn] = useState(siteSettings.hero_subtitle_bn || '');
  const [heroSubtitleEn, setHeroSubtitleEn] = useState(siteSettings.hero_subtitle_en || '');
  const [heroBadgeEn, setHeroBadgeEn] = useState(siteSettings.hero_badge_en || 'Rooted in Nature · 100% Pure Harvest');
  const [heroBadgeBn, setHeroBadgeBn] = useState(siteSettings.hero_badge_bn || 'শতভাগ খাঁটি প্রাকৃতিক কৃষিপণ্য');
  const [heroNoteTitle, setHeroNoteTitle] = useState(siteSettings.hero_note_title || 'A taste of home.');
  const [heroNoteSubtitle, setHeroNoteSubtitle] = useState(siteSettings.hero_note_subtitle || 'চেনা স্বাদ, নতুন আস্থায়');
  const [tickerText, setTickerText] = useState(siteSettings.ticker_text || '');
  
  const [seasonalTag, setSeasonalTag] = useState(siteSettings.seasonal_tag || 'A LITTLE TASTE OF TRADITION');
  const [seasonalTitleBn, setSeasonalTitleBn] = useState(siteSettings.seasonal_title_bn || 'খেজুরের গুড়ে শীতের আমেজ');
  const [seasonalTitleEn, setSeasonalTitleEn] = useState(siteSettings.seasonal_title_en || 'Winter’s sweetest tradition.');
  const [seasonalDesc, setSeasonalDesc] = useState(siteSettings.seasonal_desc || '');
  const [seasonalImage, setSeasonalImage] = useState(siteSettings.seasonal_image || '/assets/figma/cat_jaggery.jpeg');
  const [seasonalCategoryId, setSeasonalCategoryId] = useState(siteSettings.seasonal_category_id || 'cat-5');

  const [rootsTag, setRootsTag] = useState(siteSettings.roots_tag || 'A LITTLE CLOSER TO OUR ROOTS');
  const [rootsTitleBn, setRootsTitleBn] = useState(siteSettings.roots_title_bn || 'শিকড়ের টানে, খাঁটি খাবারের সন্ধানে।');
  const [rootsTitleEn, setRootsTitleEn] = useState(siteSettings.roots_title_en || 'Good food begins with good roots.');
  const [rootsDesc, setRootsDesc] = useState(siteSettings.roots_desc || '');
  const [rootsImage, setRootsImage] = useState(siteSettings.roots_image || '/assets/figma/bangladesh_harvest.jpeg');

  const [heroImageProcessing, setHeroImageProcessing] = useState(false);
  const [seasonalImageProcessing, setSeasonalImageProcessing] = useState(false);
  const [rootsImageProcessing, setRootsImageProcessing] = useState(false);

  // Image Processing State for Products (Auto-Framing 1:1 & PNG-to-JPG Conversion)
  const [imageProcessing, setImageProcessing] = useState(false);
  const [imageConversionStats, setImageConversionStats] = useState<ProcessedImageResult | null>(null);
  const [manualUrlMode, setManualUrlMode] = useState(false);

  // Settings form states
  const [bkashNum, setBkashNum] = useState(siteSettings.bkash_number);
  const [nagadNum, setNagadNum] = useState(siteSettings.nagad_number);
  const [announcementBn, setAnnouncementBn] = useState(siteSettings.announcement_bn);
  const [announcementEn, setAnnouncementEn] = useState(siteSettings.announcement_en);
  const [freeShipThreshold, setFreeShipThreshold] = useState(siteSettings.free_shipping_threshold);
  const [storeWhatsapp, setStoreWhatsapp] = useState(siteSettings.store_whatsapp || '+880 1995-180029');
  const [adminPin, setAdminPin] = useState(siteSettings.admin_pin || 'admin123');
  const [moderatorPin, setModeratorPin] = useState(siteSettings.moderator_pin || 'mod123');

  // Analytics metrics
  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);
  const totalOrdersCount = orders.length;
  const lowStockCount = products.filter(p => p.stock_quantity <= p.low_stock_threshold).length;
  const pendingOrdersCount = orders.filter(o => o.order_status === 'pending').length;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (loginMode === 'credentials') {
      if (!loginEmail.trim() || !loginPassword.trim()) {
        setLoginError(language === 'bn' ? 'অনুগ্রহ করে অ্যাডমিন ইমেইল ও পাসওয়ার্ড প্রদান করুন' : 'Please enter admin email and password');
        return;
      }
      const res = loginAdmin({ email: loginEmail, password: loginPassword });
      if (!res.success) {
        setLoginError(res.message);
      } else {
        setLoginPassword('');
      }
    } else {
      if (!loginPin.trim()) {
        setLoginError(language === 'bn' ? 'অনুগ্রহ করে সিকিউরিটি পিন কোড দিন' : 'Please enter security PIN');
        return;
      }
      const res = loginAdmin({ pin: loginPin, role: loginRole });
      if (!res.success) {
        setLoginError(res.message);
      } else {
        setLoginPin('');
      }
    }
  };

  const handleHeroImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setHeroImageProcessing(true);
      const res = await processProductImage(file, 1200, 0.85);
      setHeroImage(res.dataUrl);
      showToast(language === 'bn' ? '✓ হিরো ব্যানার ছবি সফলভাবে অপ্টিমাইজ হয়েছে!' : '✓ Hero banner image optimized!');
    } catch {
      showToast('Error processing hero image');
    } finally {
      setHeroImageProcessing(false);
    }
  };

  const handleSeasonalImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setSeasonalImageProcessing(true);
      const res = await processProductImage(file, 1000, 0.85);
      setSeasonalImage(res.dataUrl);
      showToast(language === 'bn' ? '✓ সিজনাল ব্যানার ছবি অপ্টিমাইজ হয়েছে!' : '✓ Seasonal image optimized!');
    } catch {
      showToast('Error processing seasonal image');
    } finally {
      setSeasonalImageProcessing(false);
    }
  };

  const handleRootsImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setRootsImageProcessing(true);
      const res = await processProductImage(file, 1000, 0.85);
      setRootsImage(res.dataUrl);
      showToast(language === 'bn' ? '✓ ব্র্যান্ড স্টোরি ছবি অপ্টিমাইজ হয়েছে!' : '✓ Roots story image optimized!');
    } catch {
      showToast('Error processing image');
    } finally {
      setRootsImageProcessing(false);
    }
  };

  const handleCatImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setCatImageProcessing(true);
      const res = await processProductImage(file, 400, 0.85);
      setCatImage(res.dataUrl);
      showToast(language === 'bn' ? '✓ ক্যাটাগরি ছবি অপ্টিমাইজ হয়েছে!' : '✓ Category image optimized!');
    } catch {
      showToast('Error processing category image');
    } finally {
      setCatImageProcessing(false);
    }
  };

  const handleSaveCustomization = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteSettings({
      hero_image: heroImage,
      hero_title_bn: heroTitleBn,
      hero_title_en: heroTitleEn,
      hero_subtitle_bn: heroSubtitleBn,
      hero_subtitle_en: heroSubtitleEn,
      hero_badge_en: heroBadgeEn,
      hero_badge_bn: heroBadgeBn,
      hero_note_title: heroNoteTitle,
      hero_note_subtitle: heroNoteSubtitle,
      ticker_text: tickerText,
      seasonal_tag: seasonalTag,
      seasonal_title_bn: seasonalTitleBn,
      seasonal_title_en: seasonalTitleEn,
      seasonal_desc: seasonalDesc,
      seasonal_image: seasonalImage,
      seasonal_category_id: seasonalCategoryId,
      roots_tag: rootsTag,
      roots_title_bn: rootsTitleBn,
      roots_title_en: rootsTitleEn,
      roots_desc: rootsDesc,
      roots_image: rootsImage,
    });
    showToast(language === 'bn' ? '✓ ওয়েবসাইটের ব্যানার ও কাস্টমাইজেশন সফলভাবে সেভ হয়েছে!' : '✓ Website banners and customization saved successfully!');
  };

  const handleOpenCatModal = (cat?: Category) => {
    if (cat) {
      setEditingCat(cat);
      setCatNameBn(cat.name_bn);
      setCatNameEn(cat.name_en);
      setCatImage(cat.image);
    } else {
      setEditingCat(null);
      setCatNameBn('');
      setCatNameEn('');
      setCatImage('https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=400&q=80');
    }
    setIsCatModalOpen(true);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catNameBn.trim() || !catNameEn.trim()) return;

    if (editingCat) {
      updateCategory({
        ...editingCat,
        name_bn: catNameBn,
        name_en: catNameEn,
        image: catImage || editingCat.image,
      });
    } else {
      const newCat: Category = {
        id: `cat-${Date.now()}`,
        name_bn: catNameBn,
        name_en: catNameEn,
        slug: catNameEn.toLowerCase().replace(/\s+/g, '-'),
        icon: '',
        image: catImage || 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=400&q=80',
        product_count: 0,
      };
      addCategory(newCat);
    }
    setIsCatModalOpen(false);
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setImageProcessing(true);
      // Auto-frames to 1:1 square (800x800), fills white canvas for transparent PNG, converts to optimized JPEG
      const result = await processProductImage(file, 800, 0.85);
      setImageUrl(result.dataUrl);
      setImageConversionStats(result);
      showToast(
        language === 'bn'
          ? `✓ ছবি সফলভাবে ১:১ স্কয়ার ফ্রেমে ও JPG ফরম্যাটে রূপান্তর হয়েছে (${result.optimizedSizeKB} KB)`
          : `✓ Image framed 1:1 & converted to optimized JPG (${result.optimizedSizeKB} KB)`
      );
    } catch (err: any) {
      console.error('Image processing failed:', err);
      showToast(
        language === 'bn'
          ? 'ছবি প্রসেস করতে ব্যর্থ হয়েছে। সঠিক ছবি ফাইল নির্বাচন করুন।'
          : 'Failed to process image file. Please choose a valid image.'
      );
    } finally {
      setImageProcessing(false);
    }
  };

  const handleOpenAddModal = () => {
    setTitleBn('');
    setTitleEn('');
    setSku(`GH-${Date.now().toString().slice(-4)}`);
    setCategoryId('cat-1');
    setRegPrice(600);
    setSalePrice(500);
    setStock(30);
    setShortDescBn('');
    setShortDescEn('');
    setImageUrl('https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80');
    setImageConversionStats(null);
    setManualUrlMode(false);
    setIsBestseller(false);
    setIsPreorder(false);
    setEditingProduct(null);
    setIsAddModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const newProd: Product = {
      id: editingProduct ? editingProduct.id : `prod-${Date.now()}`,
      title_bn: titleBn || 'নতুন কৃষিপণ্য',
      title_en: titleEn || 'New Agro Product',
      slug: (titleEn || 'new-product').toLowerCase().replace(/\s+/g, '-'),
      sku: sku || `GH-SKU-${Math.floor(100 + Math.random() * 900)}`,
      category_id: categoryId,
      regular_price: Number(regPrice),
      sale_price: salePrice ? Number(salePrice) : undefined,
      stock_quantity: Number(stock),
      low_stock_threshold: 10,
      status: 'active',
      is_featured: true,
      is_bestseller: isBestseller,
      is_preorder: isPreorder,
      rating: 5.0,
      reviews_count: 1,
      short_description_bn: shortDescBn || titleBn,
      short_description_en: shortDescEn || titleEn,
      description_bn: shortDescBn || titleBn,
      description_en: shortDescEn || titleEn,
      images: [imageUrl || 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80'],
      variants: [
        { name: '500g', price: Number(salePrice || regPrice), stock: Number(stock), sku: `${sku}-500G` },
        { name: '1kg', price: Math.round(Number(salePrice || regPrice) * 1.9), stock: Math.round(Number(stock) / 2), sku: `${sku}-1KG` },
      ],
    };

    if (editingProduct) {
      updateProduct(newProd);
    } else {
      addNewProduct(newProd);
    }
    setIsAddModalOpen(false);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = storeWhatsapp.trim();
    const cleanDigits = cleanPhone.replace(/[^0-9]/g, '');
    updateSiteSettings({
      bkash_number: bkashNum,
      nagad_number: nagadNum,
      announcement_bn: announcementBn,
      announcement_en: announcementEn,
      free_shipping_threshold: Number(freeShipThreshold),
      store_whatsapp: cleanPhone,
      store_whatsapp_url: `https://wa.me/${cleanDigits}`,
      contact_phone: cleanPhone,
      admin_pin: adminPin,
      moderator_pin: moderatorPin,
    });
  };

  // If not authenticated, render the production security login gate
  if (!adminAuth.isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F7F4EC] flex flex-col justify-between p-4 sm:p-8">
        <div className="max-w-md w-full mx-auto my-auto py-8">
          
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-[#2D5F3F] text-white flex items-center justify-center font-black text-2xl mx-auto shadow-xl border-2 border-emerald-800 mb-4">
              GH
            </div>
            <h1 className="font-bengaliSerif font-bold text-2xl sm:text-3xl text-[#1A1A1A]">
              {siteSettings.site_name_bn}
            </h1>
            <p className="text-xs uppercase tracking-widest text-[#2D5F3F] font-bold mt-1">
              {siteSettings.site_name_en} · Headless CMS Security
            </p>
            <p className="text-xs text-gray-600 mt-2">
              {t(
                'সুরক্ষিত অ্যাডমিন সিস্টেমে প্রবেশ করতে আপনার পিন কোড প্রদান করুন',
                'Enter your security PIN to access the CMS management panel'
              )}
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8 space-y-5">
            
            {/* Login Mode Tabs: Main Email & Password vs Quick PIN */}
            <div className="grid grid-cols-2 gap-2 bg-gray-100 p-1.5 rounded-2xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setLoginMode('credentials')}
                className={`py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  loginMode === 'credentials'
                    ? 'bg-[#2D5F3F] text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Super Admin (Email)</span>
              </button>

              <button
                type="button"
                onClick={() => setLoginMode('pin')}
                className={`py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  loginMode === 'pin'
                    ? 'bg-[#2D5F3F] text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Key className="w-3.5 h-3.5" />
                <span>PIN Code Access</span>
              </button>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              
              {loginMode === 'credentials' ? (
                <>
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      {t('মেইন অ্যাডমিন ইমেইল *', 'Main Admin Email *')}
                    </label>
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="masumbilla03627@gmail.com"
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#2D5F3F]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      {t('অ্যাডমিন পাসওয়ার্ড *', 'Admin Password *')}
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••••••••"
                        className="w-full px-3.5 py-2.5 pr-10 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#2D5F3F]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Quick autofill helper */}
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-900 flex items-center justify-between">
                    <span className="font-semibold">{t('মেইন অ্যাডমিন ক্রেডেনশিয়াল:', 'Main Admin Credentials:')}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setLoginEmail('masumbilla03627@gmail.com');
                        setLoginPassword('Gramerhat099665511');
                      }}
                      className="px-2 py-0.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] cursor-pointer"
                    >
                      {t('অটোফিল করুন', 'Auto-Fill')}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1.5">
                      {t('অ্যাক্সেস রোল নির্বাচন করুন', 'Select Access Role')}
                    </label>
                    <div className="grid grid-cols-2 gap-2 bg-gray-100 p-1.5 rounded-xl text-xs font-bold">
                      <button
                        type="button"
                        onClick={() => setLoginRole('admin')}
                        className={`py-1.5 rounded-lg transition-all ${
                          loginRole === 'admin' ? 'bg-[#2D5F3F] text-white' : 'text-gray-600'
                        }`}
                      >
                        Super Admin
                      </button>
                      <button
                        type="button"
                        onClick={() => setLoginRole('moderator')}
                        className={`py-1.5 rounded-lg transition-all ${
                          loginRole === 'moderator' ? 'bg-[#2D5F3F] text-white' : 'text-gray-600'
                        }`}
                      >
                        Moderator
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      {t('পিন কোড *', 'PIN Code *')}
                    </label>
                    <div className="relative">
                      <input
                        type={showPin ? 'text' : 'password'}
                        value={loginPin}
                        onChange={(e) => setLoginPin(e.target.value)}
                        placeholder={loginRole === 'admin' ? 'admin123' : 'mod123'}
                        className="w-full px-3.5 py-2.5 pr-10 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono font-bold tracking-widest focus:outline-none focus:ring-2 focus:ring-[#2D5F3F]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPin(!showPin)}
                        className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 cursor-pointer"
                      >
                        {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-2 text-[10px] font-mono">
                    <button
                      type="button"
                      onClick={() => setLoginPin('admin123')}
                      className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold cursor-pointer"
                    >
                      Admin PIN: admin123
                    </button>
                    <button
                      type="button"
                      onClick={() => setLoginPin('mod123')}
                      className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold cursor-pointer"
                    >
                      Mod PIN: mod123
                    </button>
                  </div>
                </>
              )}

              {loginError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2 font-medium">
                  <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-[#2D5F3F] hover:bg-[#1e402a] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Unlock className="w-4 h-4" />
                <span>{t('সিএমএস প্যানেলে প্রবেশ করুন', 'Authenticate & Access CMS')}</span>
              </button>
            </form>

            {/* Back to storefront link */}
            <div className="pt-2 text-center">
              <button
                onClick={() => {
                  window.location.hash = '';
                  setViewMode('store');
                }}
                className="text-xs text-gray-500 hover:text-[#2D5F3F] font-semibold underline cursor-pointer"
              >
                ← {t('গ্রাহক স্টোরফ্রন্টে ফিরে যান', 'Return to Storefront')}
              </button>
            </div>

          </div>

          {/* Developer Attribution by SINI IT */}
          <div className="mt-8 text-center space-y-2">
            <a
              href="https://wa.me/8801647236359"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:bg-[#25D366] hover:text-white hover:border-[#25D366] transition-all shadow-sm"
            >
              <span>Development by: SINI IT</span>
              <ExternalLink className="w-3 h-3 opacity-70" />
            </a>
            <p className="text-[11px] text-gray-500 font-mono">
              Direct WhatsApp: +8801647236359
            </p>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      
      {/* Top Admin Bar */}
      <div className="bg-[#1e402a] text-white px-4 sm:px-8 py-3 border-b border-[#2D5F3F] flex flex-wrap items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#F4A261] flex items-center justify-center text-[#1A1A1A] font-black text-sm">
            GH
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-black flex items-center gap-2">
              <span>{t('গ্রামের হাট - হেডলেস সিএমএস অ্যাডমিন', 'Gramer Hat - Headless CMS Admin')}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                role === 'admin' ? 'bg-[#F4A261] text-[#1A1A1A]' : 'bg-emerald-500 text-white'
              }`}>
                {role === 'admin' ? 'Super Admin' : 'Moderator'}
              </span>
            </h1>
            <p className="text-[11px] text-emerald-200 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>PWA Ready Mobile & Desktop Backoffice · Secure Session</span>
            </p>
          </div>
        </div>

        {/* User Info & Actions */}
        <div className="flex items-center gap-2.5 text-xs">
          <button
            onClick={() => {
              window.location.hash = '';
              setViewMode('store');
            }}
            className="px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white font-bold transition-colors cursor-pointer"
          >
            {t('ওয়েবসাইট দেখুন →', 'View Storefront →')}
          </button>

          <button
            onClick={() => {
              logoutAdmin();
              window.location.hash = '';
              setViewMode('store');
            }}
            className="px-3 py-1.5 rounded-lg bg-red-500/80 hover:bg-red-600 text-white font-bold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
            title="Log out of CMS"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{t('লগআউট', 'Logout')}</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200 gap-2 sm:gap-4 overflow-x-auto pb-1 mb-6">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-[#2D5F3F] text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>{t('ড্যাশবোর্ড', 'Dashboard')}</span>
          </button>

          {role === 'admin' && (
            <button
              onClick={() => setActiveTab('customization')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
                activeTab === 'customization'
                  ? 'bg-[#2D5F3F] text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <Palette className="w-4 h-4 text-[#F4A261]" />
              <span>{t('ওয়েবসাইট ও ব্যানার', 'Website & Banners')}</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === 'products'
                ? 'bg-[#2D5F3F] text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>{t('পণ্য ব্যবস্থাপনা', 'Product Manager')}</span>
            <span className="px-1.5 py-0.2 rounded-full bg-black/15 text-[10px]">
              {products.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-[#2D5F3F] text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{t('অর্ডারসমূহ', 'Orders')}</span>
            {pendingOrdersCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-[#E76F51] text-white text-[10px] font-bold">
                {pendingOrdersCount}
              </span>
            )}
          </button>

          {role === 'admin' && (
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-[#2D5F3F] text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>{t('সাইট সেটিংস ও পেমেন্ট', 'Site & Payment Settings')}</span>
            </button>
          )}
        </div>

        {/* TAB 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    {t('মোট বিক্রয় আয়', 'Total Revenue')}
                  </span>
                  <h3 className="text-2xl font-black text-[#2D5F3F] mt-1">
                    ৳{totalRevenue.toLocaleString()}
                  </h3>
                  <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3.5 h-3.5" /> +18.4% this month
                  </span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-[#2D5F3F]/10 text-[#2D5F3F] flex items-center justify-center">
                  <span className="text-xl">💰</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    {t('সর্বমোট অর্ডার', 'Total Orders')}
                  </span>
                  <h3 className="text-2xl font-black text-gray-900 mt-1">
                    {totalOrdersCount}
                  </h3>
                  <span className="text-[11px] text-amber-600 font-semibold mt-1 block">
                    {pendingOrdersCount} {t('টি অপেক্ষমাণ', 'pending orders')}
                  </span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-[#F4A261]/20 text-[#F4A261] flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-[#1A1A1A]" />
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    {t('লো স্টক এলার্ট', 'Low Stock Alert')}
                  </span>
                  <h3 className="text-2xl font-black text-[#E76F51] mt-1">
                    {lowStockCount} {t('টি পণ্য', 'items')}
                  </h3>
                  <span className="text-[11px] text-gray-500 mt-1 block">
                    {t('স্টক < ১০ একক', 'Units < 10 threshold')}
                  </span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6" />
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    {t('সক্রিয় গ্রাহক', 'Total Customers')}
                  </span>
                  <h3 className="text-2xl font-black text-gray-900 mt-1">
                    128+
                  </h3>
                  <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
                    48% {t('পুনরায় অর্ডারকারী', 'repeat buyer rate')}
                  </span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
              </div>

            </div>

            {/* Sales Chart & Recent Orders Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Sales Chart Mock Graphic */}
              <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-[#1A1A1A]">
                      {t('গত ৩০ দিনের বিক্রয় রিপোর্ট', 'Last 30 Days Sales Analytics')}
                    </h3>
                    <p className="text-xs text-gray-400">
                      {t('দৈনিক অর্ডার ও আয় পরিসংখ্যান', 'Daily revenue trends')}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-[#2D5F3F] bg-[#2D5F3F]/10 px-2.5 py-1 rounded-lg">
                    Avg. ৳9,480 / day
                  </span>
                </div>

                {/* SVG Visual Graph */}
                <div className="h-48 w-full flex items-end gap-2 pt-6 pb-2 border-b border-gray-100">
                  {[45, 60, 35, 75, 90, 65, 80, 110, 95, 120, 140, 105, 130, 160].map((val, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
                      <div
                        style={{ height: `${val}px` }}
                        className="w-full bg-gradient-to-t from-[#2D5F3F] to-[#3d7c54] rounded-t-md group-hover:from-[#F4A261] group-hover:to-[#e0843a] transition-all relative"
                      >
                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 text-[10px] font-bold bg-black text-white px-1.5 py-0.5 rounded shadow pointer-events-none transition-opacity">
                          ৳{val * 150}
                        </span>
                      </div>
                      <span className="text-[9px] text-gray-400">{idx + 1}d</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
                  <span>Day 1</span>
                  <span>Day 15</span>
                  <span>Today (Day 30)</span>
                </div>
              </div>

              {/* Developer Attribution Card */}
              <div className="lg:col-span-5 bg-gradient-to-br from-[#1e402a] to-[#2D5F3F] text-white p-6 rounded-2xl shadow-md flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#F4A261]">
                      System Architecture
                    </span>
                    <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">
                      v2.4.0 Production
                    </span>
                  </div>

                  <h3 className="text-xl font-black mt-2 font-bengali">
                    গ্রামের হাট পূর্ণাঙ্গ ই-কমার্স প্ল্যাটফর্ম
                  </h3>

                  <p className="text-xs text-emerald-100 mt-2 leading-relaxed">
                    Designed for ultra-fast conversion, mobile PWA responsiveness, bKash & Nagad Send Money verification, and bilingual accessibility.
                  </p>

                  <div className="mt-4 p-3 rounded-xl bg-white/10 border border-white/20 space-y-1.5 text-xs">
                    <p className="font-bold flex items-center gap-1.5 text-[#F4A261]">
                      <span>🛠️ Development by:</span>
                      <strong className="text-white">SINI IT</strong>
                    </p>
                    <p className="text-[11px] text-gray-200">
                      WhatsApp: +8801647236359 (Click below to message)
                    </p>
                  </div>
                </div>

                <div className="pt-4">
                  <a
                    href="https://wa.me/8801647236359"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#1ebd5a] text-[#1A1A1A] font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
                  >
                    <span>Contact Developer on WhatsApp</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB: WEBSITE CUSTOMIZATION & BANNERS */}
        {activeTab === 'customization' && (
          <div className="space-y-8">
            
            {/* Header & Quick Save Bar */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-emerald-50 text-[#2D5F3F]">
                    <Palette className="w-5 h-5" />
                  </span>
                  <h3 className="font-bold text-lg text-[#1A1A1A]">
                    {t('ওয়েবসাইট কাস্টমাইজেশন ও ব্যানার কন্ট্রোল', 'Website Customization & Banner Control')}
                  </h3>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {t(
                    'হিরো ব্যানার, বিজ্ঞাপনী ছবি, ব্র্যান্ডের গল্প ও ক্যাটাগরি সরাসরি ফোন বা কম্পিউটার থেকে পরিবর্তন করুন।',
                    'Customize hero banners, promotional visuals, brand story, and categories live from your phone or PC.'
                  )}
                </p>
              </div>

              <button
                type="button"
                onClick={handleSaveCustomization}
                className="px-6 py-2.5 rounded-xl bg-[#2D5F3F] hover:bg-[#1e402a] text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0"
              >
                <Check className="w-4 h-4" />
                <span>{t('সব পরিবর্তন সংরক্ষণ করুন', 'Save All Customizations')}</span>
              </button>
            </div>

            <form onSubmit={handleSaveCustomization} className="space-y-8">
              
              {/* SECTION 1: HERO BANNER & PRESENTATION */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#2D5F3F]/10 text-[#2D5F3F] flex items-center justify-center font-bold text-sm">
                      1
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[#1A1A1A]">
                        {t('হিরো ব্যানার ও মূল শিরোনাম', 'Hero Banner & Main Headline')}
                      </h4>
                      <p className="text-[11px] text-gray-500">
                        {t('ওয়েবসাইটের প্রথম দৃশ্যমান ব্যানার ছবি, টেক্সট এবং রানিং নোটিশ', 'The topmost visual banner, headline, and announcement ticker')}
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full">
                    {t('প্রথম স্ক্রিন', 'Above the Fold')}
                  </span>
                </div>

                {/* Hero Banner Image Upload */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                      <Camera className="w-4 h-4 text-[#2D5F3F]" />
                      <span>{t('হিরো ব্যানার ছবি (ফোন ক্যামেরা / ফাইল আপলোড)', 'Hero Banner Image (Camera / File Upload)')}</span>
                    </label>
                    <span className="text-[11px] text-gray-500 font-mono">
                      Recommended: 1200×800 or 16:9 ratio
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    {/* Image Preview */}
                    <div className="md:col-span-5 relative h-48 rounded-2xl overflow-hidden border-2 border-dashed border-gray-200 bg-gray-50 group">
                      {heroImage ? (
                        <>
                          <img
                            src={heroImage}
                            alt="Hero Banner Preview"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <label
                              htmlFor="cms-hero-image-file"
                              className="px-3 py-1.5 rounded-xl bg-white text-gray-900 text-xs font-bold shadow-lg cursor-pointer hover:bg-gray-100 flex items-center gap-1.5"
                            >
                              <Upload className="w-3.5 h-3.5" />
                              <span>{t('পরিবর্তন করুন', 'Change')}</span>
                            </label>
                            <button
                              type="button"
                              onClick={() => setHeroImage('/assets/figma/harvest_table.jpeg')}
                              className="px-3 py-1.5 rounded-xl bg-red-600 text-white text-xs font-bold shadow-lg cursor-pointer hover:bg-red-700"
                            >
                              {t('রিসেট', 'Reset')}
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 p-4 text-center">
                          <ImageIcon className="w-8 h-8 mb-1" />
                          <span className="text-xs">{t('কোনো ছবি নেই', 'No image selected')}</span>
                        </div>
                      )}
                      {heroImageProcessing && (
                        <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex flex-col items-center justify-center gap-2">
                          <RefreshCw className="w-6 h-6 text-[#2D5F3F] animate-spin" />
                          <span className="text-xs font-bold text-[#2D5F3F]">
                            {t('ছবি প্রসেস হচ্ছে...', 'Optimizing & resizing...')}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Upload Controls */}
                    <div className="md:col-span-7 space-y-3">
                      <label
                        htmlFor="cms-hero-image-file"
                        className={`block border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all ${
                          heroImageProcessing
                            ? 'bg-emerald-50 border-emerald-400 animate-pulse'
                            : 'bg-gray-50 border-gray-300 hover:border-[#2D5F3F] hover:bg-emerald-50/40'
                        }`}
                      >
                        <input
                          id="cms-hero-image-file"
                          type="file"
                          accept="image/*"
                          capture="environment"
                          onChange={handleHeroImageChange}
                          disabled={heroImageProcessing}
                          className="hidden"
                        />
                        <div className="w-10 h-10 rounded-full bg-emerald-100 text-[#2D5F3F] flex items-center justify-center mx-auto mb-2">
                          <Upload className="w-5 h-5" />
                        </div>
                        <p className="font-bold text-xs text-gray-800">
                          {t('ফোন থেকে নতুন ছবি তুলুন বা গ্যালারি থেকে সিলেক্ট করুন', 'Take photo or choose banner from gallery')}
                        </p>
                        <p className="text-[10px] text-gray-500 mt-0.5">
                          {t('স্বয়ংক্রিয়ভাবে ১২০০ পিক্সেল ও উচ্চ মানের JPG তে কমপ্রেস হবে', 'Auto-optimizes to 1200px web JPG for instant loading')}
                        </p>
                      </label>

                      <div>
                        <label className="text-[11px] font-bold text-gray-600 block mb-1">
                          {t('অথবা সরাসরি ছবির URL দিন:', 'Or direct Image URL:')}
                        </label>
                        <input
                          type="text"
                          value={heroImage}
                          onChange={(e) => setHeroImage(e.target.value)}
                          placeholder="https://... বা /assets/figma/harvest_table.jpeg"
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hero Headlines & Text */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      {t('মূল শিরোনাম (বাংলা)', 'Main Headline (Bengali)')}
                    </label>
                    <textarea
                      rows={2}
                      value={heroTitleBn}
                      onChange={(e) => setHeroTitleBn(e.target.value)}
                      placeholder="গ্রামের খাঁটি স্বাদ,\nএবার আপনার ঘরে।"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bengaliSerif leading-snug"
                    />
                    <p className="text-[10px] text-gray-400 mt-0.5">{t('নতুন লাইন দিতে Enter চাপুন', 'Press Enter for newline')}</p>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      {t('মূল শিরোনাম (English)', 'Main Headline (English)')}
                    </label>
                    <textarea
                      rows={2}
                      value={heroTitleEn}
                      onChange={(e) => setHeroTitleEn(e.target.value)}
                      placeholder="Honest food. From our roots to your table."
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs leading-snug"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      {t('সাবটাইটেল / বিবরণ (বাংলা)', 'Subtitle / Description (Bengali)')}
                    </label>
                    <input
                      type="text"
                      value={heroSubtitleBn}
                      onChange={(e) => setHeroSubtitleBn(e.target.value)}
                      placeholder="গ্রামের বিশ্বস্ত কৃষকদের সরাসরি উৎপাদন..."
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      {t('সাবটাইটেল / বিবরণ (English)', 'Subtitle / Description (English)')}
                    </label>
                    <input
                      type="text"
                      value={heroSubtitleEn}
                      onChange={(e) => setHeroSubtitleEn(e.target.value)}
                      placeholder="Direct from heritage farmers..."
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      {t('শীর্ষ ব্যাজ টেক্সট (বাংলা)', 'Top Badge Text (Bengali)')}
                    </label>
                    <input
                      type="text"
                      value={heroBadgeBn}
                      onChange={(e) => setHeroBadgeBn(e.target.value)}
                      placeholder="শতভাগ খাঁটি প্রাকৃতিক কৃষিপণ্য"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      {t('শীর্ষ ব্যাজ টেক্সট (English)', 'Top Badge Text (English)')}
                    </label>
                    <input
                      type="text"
                      value={heroBadgeEn}
                      onChange={(e) => setHeroBadgeEn(e.target.value)}
                      placeholder="Rooted in Nature · 100% Pure Harvest"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                    />
                  </div>
                </div>

                {/* Floating Brand Promise Card Note */}
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
                  <h5 className="font-bold text-xs text-amber-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                    <span>{t('হিরো ব্যানারের ভাসমান ব্র্যান্ড কার্ড (Brand Promise Card)', 'Floating Hero Brand Card')}</span>
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-amber-800 block mb-1">
                        {t('কার্ড শিরোনাম (English/Title)', 'Card Title')}
                      </label>
                      <input
                        type="text"
                        value={heroNoteTitle}
                        onChange={(e) => setHeroNoteTitle(e.target.value)}
                        placeholder="A taste of home."
                        className="w-full px-3 py-1.5 bg-white border border-amber-300 rounded-xl text-xs font-serif"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-amber-800 block mb-1">
                        {t('কার্ড সাবটাইটেল (বাংলা/Subtitle)', 'Card Subtitle')}
                      </label>
                      <input
                        type="text"
                        value={heroNoteSubtitle}
                        onChange={(e) => setHeroNoteSubtitle(e.target.value)}
                        placeholder="চেনা স্বাদ, নতুন আস্থায়"
                        className="w-full px-3 py-1.5 bg-white border border-amber-300 rounded-xl text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Animated Marquee Ticker */}
                <div className="space-y-1.5 pt-2">
                  <label className="text-xs font-bold text-gray-700 block">
                    {t('রানিং নোটিশ বার / এনিমেটেড টিকার (Ticker Announcement Bar)', 'Running Marquee Ticker Bar')}
                  </label>
                  <input
                    type="text"
                    value={tickerText}
                    onChange={(e) => setTickerText(e.target.value)}
                    placeholder="খাঁটি সুন্দরবনের মধু · ঘানি ভাঙা সরিষার তেল · নতুন নলেন গুড় · দেশজুড়ে হোম ডেলিভারি"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium"
                  />
                  <p className="text-[10px] text-gray-400">
                    {t('প্রতিটি বিষয় আলাদা করতে মাঝে ডট ( · ) বা পাইপ ( | ) ব্যবহার করতে পারেন।', 'Separate points using dots ( · ) or pipes ( | ) for the animated scrolling ticker.')}
                  </p>
                </div>
              </div>

              {/* SECTION 2: SEASONAL PROMOTION BANNER */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#F4A261]/20 text-[#D97706] flex items-center justify-center font-bold text-sm">
                      2
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[#1A1A1A]">
                        {t('সিজনাল ব্যানার সেকশন (Seasonal Promotion Feature)', 'Seasonal Promotion Banner')}
                      </h4>
                      <p className="text-[11px] text-gray-500">
                        {t('ঋতুভিত্তিক বিশেষ ক্যাম্পেইন (যেমন: শীতের গুড় বা আমের সিজন)', 'Seasonal campaign spotlight (e.g. Winter Jaggery or Summer Mango)')}
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full">
                    {t('সিজনাল ফিচার', 'Seasonal Spotlight')}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  {/* Photo Upload & Preview */}
                  <div className="md:col-span-5 space-y-3">
                    <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                      <Camera className="w-4 h-4 text-[#2D5F3F]" />
                      <span>{t('সিজনাল ফিচার ছবি', 'Seasonal Feature Photo')}</span>
                    </label>

                    <div className="relative h-44 rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 group">
                      <img
                        src={seasonalImage}
                        alt="Seasonal Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <label
                          htmlFor="cms-seasonal-image-file"
                          className="px-3 py-1.5 rounded-xl bg-white text-gray-900 text-xs font-bold shadow-lg cursor-pointer hover:bg-gray-100 flex items-center gap-1.5"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>{t('ছবি আপলোড', 'Upload')}</span>
                        </label>
                      </div>
                      {seasonalImageProcessing && (
                        <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex flex-col items-center justify-center gap-2">
                          <RefreshCw className="w-6 h-6 text-[#2D5F3F] animate-spin" />
                          <span className="text-xs font-bold text-[#2D5F3F]">{t('ছবি অপ্টিমাইজ হচ্ছে...', 'Optimizing...')}</span>
                        </div>
                      )}
                    </div>

                    <label
                      htmlFor="cms-seasonal-image-file"
                      className="block w-full py-2 px-3 border border-gray-200 rounded-xl text-center text-xs font-bold text-gray-700 bg-gray-50 hover:bg-emerald-50 hover:border-[#2D5F3F] cursor-pointer transition-colors"
                    >
                      <input
                        id="cms-seasonal-image-file"
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handleSeasonalImageChange}
                        disabled={seasonalImageProcessing}
                        className="hidden"
                      />
                      {t('ফোন ক্যামেরা বা গ্যালারি থেকে সিলেক্ট করুন', 'Take photo or choose from gallery')}
                    </label>

                    <div>
                      <label className="text-[10px] font-bold text-gray-500 block mb-0.5">
                        {t('ছবির URL লিঙ্ক', 'Image URL')}
                      </label>
                      <input
                        type="text"
                        value={seasonalImage}
                        onChange={(e) => setSeasonalImage(e.target.value)}
                        className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono"
                      />
                    </div>
                  </div>

                  {/* Texts & Linked Category */}
                  <div className="md:col-span-7 space-y-3.5">
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">
                        {t('সিজনাল ট্যাগ / ব্যাজ (Tag)', 'Tag Badge')}
                      </label>
                      <input
                        type="text"
                        value={seasonalTag}
                        onChange={(e) => setSeasonalTag(e.target.value)}
                        placeholder="A LITTLE TASTE OF TRADITION"
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs uppercase tracking-wider font-bold"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-gray-700 block mb-1">
                          {t('শিরোনাম (বাংলা)', 'Title (Bengali)')}
                        </label>
                        <input
                          type="text"
                          value={seasonalTitleBn}
                          onChange={(e) => setSeasonalTitleBn(e.target.value)}
                          placeholder="খেজুরের গুড়ে শীতের আমেজ"
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold font-bengaliSerif"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-700 block mb-1">
                          {t('শিরোনাম (English)', 'Title (English)')}
                        </label>
                        <input
                          type="text"
                          value={seasonalTitleEn}
                          onChange={(e) => setSeasonalTitleEn(e.target.value)}
                          placeholder="Winter’s sweetest tradition."
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">
                        {t('বিবরণ / ক্যাম্পেইন বার্তা', 'Description / Message')}
                      </label>
                      <textarea
                        rows={2}
                        value={seasonalDesc}
                        onChange={(e) => setSeasonalDesc(e.target.value)}
                        placeholder="গাছিদের নিজ হাতে সংগ্রহ করা খেজুরের রসে তৈরি খাঁটি ঝোলা ও পাটালি গুড়..."
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs leading-relaxed"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">
                        {t('ক্লিক করলে কোন ক্যাটাগরিতে যাবে (Target Category)', 'Target Category on Button Click')}
                      </label>
                      <select
                        value={seasonalCategoryId}
                        onChange={(e) => setSeasonalCategoryId(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {language === 'bn' ? c.name_bn : c.name_en} ({c.id})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 3: OUR ROOTS & HERITAGE STORY */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-bold text-sm">
                      3
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[#1A1A1A]">
                        {t('আমাদের শিকড় ও ব্র্যান্ড স্টোরি (Our Roots & Story)', 'Our Roots & Heritage Story')}
                      </h4>
                      <p className="text-[11px] text-gray-500">
                        {t('হোমপেজের নিচের অংশের ব্র্যান্ড পরিচিতি ও বিশ্বস্ততার সেকশন', 'Brand ethos and farmer connection section near page footer')}
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full">
                    {t('ব্র্যান্ড পরিচিতি', 'Brand Ethos')}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  {/* Roots Image */}
                  <div className="md:col-span-5 space-y-3">
                    <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                      <Camera className="w-4 h-4 text-[#2D5F3F]" />
                      <span>{t('ব্র্যান্ড স্টোরির ছবি', 'Brand Story Photo')}</span>
                    </label>

                    <div className="relative h-44 rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 group">
                      <img
                        src={rootsImage}
                        alt="Roots Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <label
                          htmlFor="cms-roots-image-file"
                          className="px-3 py-1.5 rounded-xl bg-white text-gray-900 text-xs font-bold shadow-lg cursor-pointer hover:bg-gray-100 flex items-center gap-1.5"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>{t('ছবি পরিবর্তন', 'Change')}</span>
                        </label>
                      </div>
                      {rootsImageProcessing && (
                        <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex flex-col items-center justify-center gap-2">
                          <RefreshCw className="w-6 h-6 text-[#2D5F3F] animate-spin" />
                          <span className="text-xs font-bold text-[#2D5F3F]">{t('ছবি অপ্টিমাইজ হচ্ছে...', 'Optimizing...')}</span>
                        </div>
                      )}
                    </div>

                    <label
                      htmlFor="cms-roots-image-file"
                      className="block w-full py-2 px-3 border border-gray-200 rounded-xl text-center text-xs font-bold text-gray-700 bg-gray-50 hover:bg-emerald-50 hover:border-[#2D5F3F] cursor-pointer transition-colors"
                    >
                      <input
                        id="cms-roots-image-file"
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handleRootsImageChange}
                        disabled={rootsImageProcessing}
                        className="hidden"
                      />
                      {t('ফোন ক্যামেরা বা গ্যালারি থেকে ছবি নিন', 'Take photo or choose from gallery')}
                    </label>

                    <div>
                      <label className="text-[10px] font-bold text-gray-500 block mb-0.5">
                        {t('ছবির URL লিঙ্ক', 'Image URL')}
                      </label>
                      <input
                        type="text"
                        value={rootsImage}
                        onChange={(e) => setRootsImage(e.target.value)}
                        className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono"
                      />
                    </div>
                  </div>

                  {/* Roots Texts */}
                  <div className="md:col-span-7 space-y-3.5">
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">
                        {t('ট্যাগ ব্যাজ (Tag)', 'Tag Badge')}
                      </label>
                      <input
                        type="text"
                        value={rootsTag}
                        onChange={(e) => setRootsTag(e.target.value)}
                        placeholder="A LITTLE CLOSER TO OUR ROOTS"
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs uppercase tracking-wider font-bold"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-gray-700 block mb-1">
                          {t('শিরোনাম (বাংলা)', 'Title (Bengali)')}
                        </label>
                        <input
                          type="text"
                          value={rootsTitleBn}
                          onChange={(e) => setRootsTitleBn(e.target.value)}
                          placeholder="শিকড়ের টানে, খাঁটি খাবারের সন্ধানে।"
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold font-bengaliSerif"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-700 block mb-1">
                          {t('শিরোনাম (English)', 'Title (English)')}
                        </label>
                        <input
                          type="text"
                          value={rootsTitleEn}
                          onChange={(e) => setRootsTitleEn(e.target.value)}
                          placeholder="Good food begins with good roots."
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">
                        {t('আমাদের গল্প ও অঙ্গীকারের বর্ণনা', 'Story & Heritage Description')}
                      </label>
                      <textarea
                        rows={3}
                        value={rootsDesc}
                        onChange={(e) => setRootsDesc(e.target.value)}
                        placeholder="আমরা বিশ্বাস করি প্রকৃতির খাঁটি খাবারের কোনো বিকল্প নেই। প্রতিটি পণ্য সরাসরি সংগ্রহ করা হয় গ্রাম বাংলার বিশ্বস্ত কৃষক ও মৌয়ালদের থেকে..."
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs leading-relaxed"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 4: PRODUCT CATEGORIES MANAGEMENT */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm">
                      4
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[#1A1A1A]">
                        {t('ক্যাটাগরি ব্যবস্থাপনা (Product Categories & Photos)', 'Categories Management')}
                      </h4>
                      <p className="text-[11px] text-gray-500">
                        {t('ওয়েবসাইটের গোল ক্যাটাগরি আইকন, নাম ও ছবি নিয়ন্ত্রণ করুন', 'Manage circular category items, names, and photos')}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenCatModal()}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#2D5F3F] hover:bg-[#1e402a] text-white text-xs font-bold shadow-md transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{t('নতুন ক্যাটাগরি যোগ করুন', 'Add New Category')}</span>
                  </button>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.map((cat) => {
                    const count = products.filter(p => p.category_id === cat.id).length;
                    return (
                      <div
                        key={cat.id}
                        className="p-4 rounded-2xl border border-gray-200 bg-gray-50/50 hover:bg-white hover:border-[#2D5F3F] transition-all flex items-center justify-between gap-3 shadow-xs"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={cat.image}
                            alt={cat.name_en}
                            className="w-12 h-12 rounded-full object-cover border-2 border-[#2D5F3F]/30 shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-bold text-xs text-gray-900 truncate">
                              {cat.name_bn}
                            </p>
                            <p className="text-[11px] text-gray-500 truncate">
                              {cat.name_en}
                            </p>
                            <span className="text-[10px] text-emerald-800 font-semibold">
                              {count} {t('টি পণ্য', 'products')}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleOpenCatModal(cat)}
                            className="p-2 rounded-lg bg-gray-100 hover:bg-[#2D5F3F] hover:text-white text-gray-600 transition-colors cursor-pointer"
                            title={t('সম্পাদনা করুন', 'Edit Category')}
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(language === 'bn' ? `আপনি কি "${cat.name_bn}" ক্যাটাগরি মুছে ফেলতে চান?` : `Delete category "${cat.name_en}"?`)) {
                                deleteCategory(cat.id);
                                showToast(language === 'bn' ? '✓ ক্যাটাগরি সফলভাবে মুছে ফেলা হয়েছে!' : '✓ Category deleted successfully!');
                              }
                            }}
                            className="p-2 rounded-lg bg-gray-100 hover:bg-red-500 hover:text-white text-gray-400 transition-colors cursor-pointer"
                            title={t('মুছে ফেলুন', 'Delete')}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Sticky / Final Save Button */}
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                <div>
                  <p className="font-bold text-xs text-gray-800">
                    {t('সকল তথ্য হালনাগাদ প্রস্তুত?', 'Ready to publish changes?')}
                  </p>
                  <p className="text-[11px] text-gray-500">
                    {t('ক্লিক করার সাথে সাথে ওয়েবসাইটে তাৎক্ষণিক লাইভ আপডেট হবে।', 'Changes will immediately apply and persist across user visits.')}
                  </p>
                </div>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#2D5F3F] hover:bg-[#1e402a] text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>{t('ওয়েবসাইট কাস্টমাইজেশন সেভ করুন', 'Save Website Customizations')}</span>
                </button>
              </div>

            </form>
          </div>
        )}

        {/* TAB 2: PRODUCT MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-6 space-y-4">
            
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-gray-100">
              <div>
                <h3 className="font-bold text-base text-[#1A1A1A]">
                  {t('পণ্য তালিকা ও স্টক ব্যবস্থাপনা', 'Product Catalog & Inventory')}
                </h3>
                <p className="text-xs text-gray-500">
                  {t('নতুন পণ্য যোগ করুন, দাম পরিবর্তন ও স্টক হালনাগাদ করুন', 'Manage prices, variants, stock and pre-orders')}
                </p>
              </div>

              <button
                onClick={handleOpenAddModal}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2D5F3F] hover:bg-[#1e402a] text-white text-xs font-bold shadow-md transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>{t('নতুন পণ্য যুক্ত করুন', 'Add New Product')}</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-200">
                  <tr>
                    <th className="py-3 px-3">{t('ছবি ও নাম', 'Product')}</th>
                    <th className="py-3 px-3">SKU</th>
                    <th className="py-3 px-3">{t('ক্যাটাগরি', 'Category')}</th>
                    <th className="py-3 px-3">{t('মূল্য', 'Price')}</th>
                    <th className="py-3 px-3">{t('স্টক', 'Stock')}</th>
                    <th className="py-3 px-3">{t('স্ট্যাটাস', 'Status')}</th>
                    <th className="py-3 px-3 text-right">{t('অ্যাকশন', 'Actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map((p) => {
                    const cat = categories.find(c => c.id === p.category_id);
                    return (
                      <tr key={p.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="py-3 px-3 flex items-center gap-3">
                          <img
                            src={p.images[0]}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover border border-gray-200 shrink-0"
                          />
                          <div className="min-w-0 max-w-xs">
                            <p className="font-bold text-gray-900 truncate">
                              {language === 'bn' ? p.title_bn : p.title_en}
                            </p>
                            <span className="text-[10px] text-gray-400">
                              {p.variants.map(v => v.name).join(', ')}
                            </span>
                          </div>
                        </td>

                        <td className="py-3 px-3 font-mono font-semibold text-gray-600">
                          {p.sku}
                        </td>

                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-[11px]">
                            {cat ? (language === 'bn' ? cat.name_bn : cat.name_en) : 'Agro'}
                          </span>
                        </td>

                        <td className="py-3 px-3 font-bold text-gray-900">
                          ৳{p.sale_price || p.regular_price}
                        </td>

                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[11px] ${
                            p.stock_quantity <= p.low_stock_threshold
                              ? 'bg-red-100 text-red-700'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {p.stock_quantity} in stock
                          </span>
                        </td>

                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase">
                            {p.status}
                          </span>
                        </td>

                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setEditingProduct(p);
                                setTitleBn(p.title_bn);
                                setTitleEn(p.title_en);
                                setSku(p.sku);
                                setCategoryId(p.category_id);
                                setRegPrice(p.regular_price);
                                setSalePrice(p.sale_price || p.regular_price);
                                setStock(p.stock_quantity);
                                setShortDescBn(p.short_description_bn);
                                setShortDescEn(p.short_description_en);
                                setImageUrl(p.images[0]);
                                setImageConversionStats(null);
                                setManualUrlMode(false);
                                setIsBestseller(p.is_bestseller);
                                setIsPreorder(p.is_preorder);
                                setIsAddModalOpen(true);
                              }}
                              className="p-1.5 text-gray-500 hover:text-[#2D5F3F] hover:bg-gray-100 rounded-lg"
                              title="Edit"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>

                            {role === 'admin' && (
                              <button
                                onClick={() => deleteProduct(p.id)}
                                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* TAB 3: ORDER MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-6 space-y-4">
            
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-gray-100">
              <div>
                <h3 className="font-bold text-base text-[#1A1A1A]">
                  {t('গ্রাহকের অর্ডারসমূহ ও পেমেন্ট ভেরিফিকেশন', 'Customer Orders & Payment Verification')}
                </h3>
                <p className="text-xs text-gray-500">
                  {t('বিকাশ/নগদ TrxID যাচাই করুন এবং অর্ডার স্ট্যাটাস পরিবর্তন করুন', 'Verify bKash/Nagad transactions, dispatch couriers')}
                </p>
              </div>
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-200">
                  <tr>
                    <th className="py-3 px-3">{t('অর্ডার #', 'Order #')}</th>
                    <th className="py-3 px-3">{t('গ্রাহক ও মোবাইল', 'Customer')}</th>
                    <th className="py-3 px-3">{t('ঠিকানা', 'Destination')}</th>
                    <th className="py-3 px-3">{t('পেমেন্ট ও TrxID', 'Payment & TrxID')}</th>
                    <th className="py-3 px-3">{t('মোট', 'Total')}</th>
                    <th className="py-3 px-3">{t('বর্তমান অবস্থা', 'Status')}</th>
                    <th className="py-3 px-3 text-right">{t('স্ট্যাটাস পরিবর্তন', 'Update Status')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3.5 px-3 font-mono font-bold text-[#2D5F3F]">
                        {ord.order_number}
                        <span className="block text-[10px] text-gray-400 font-sans font-normal">
                          {ord.created_at}
                        </span>
                      </td>

                      <td className="py-3.5 px-3">
                        <strong className="text-gray-900 block">{ord.customer_name}</strong>
                        <span className="text-gray-500">{ord.customer_phone}</span>
                      </td>

                      <td className="py-3.5 px-3 max-w-xs">
                        <span className="font-semibold text-gray-800 block truncate">
                          {ord.shipping_address.district}
                        </span>
                        <span className="text-[11px] text-gray-500 truncate block">
                          {ord.shipping_address.address_line}
                        </span>
                      </td>

                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold uppercase">
                          {ord.payment_method.replace('_', ' ')}
                        </span>
                        {ord.payment_transaction_id ? (
                          <div className="mt-1 font-mono text-[11px] font-bold text-gray-800 bg-gray-100 px-1.5 py-0.5 rounded w-max">
                            Trx: {ord.payment_transaction_id}
                          </div>
                        ) : (
                          <span className="block text-[10px] text-gray-400 mt-0.5">No TrxID</span>
                        )}
                      </td>

                      <td className="py-3.5 px-3 font-black text-sm text-gray-900">
                        ৳{ord.total}
                      </td>

                      <td className="py-3.5 px-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          ord.order_status === 'delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ord.order_status === 'shipped'
                            ? 'bg-blue-100 text-blue-800'
                            : ord.order_status === 'processing'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {ord.order_status}
                        </span>
                      </td>

                      <td className="py-3.5 px-3 text-right">
                        <select
                          value={ord.order_status}
                          onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                          className="px-2.5 py-1 rounded-lg border border-gray-300 text-xs font-semibold bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#2D5F3F]"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* TAB 4: SETTINGS */}
        {activeTab === 'settings' && role === 'admin' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="font-bold text-base text-[#1A1A1A]">
                {t('সাইট সেটিংস ও মার্চেন্ট পেমেন্ট কনফিগারেশন', 'Site Settings & Payment Gateways')}
              </h3>
              <p className="text-xs text-gray-500">
                {t('বিকাশ, নগদ নম্বর ও নোটিস বার নিয়ন্ত্রণ করুন', 'Configure bKash, Nagad numbers, free shipping thresholds')}
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4 max-w-2xl">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    {t('মার্চেন্ট বিকাশ নম্বর (Send Money)', 'Merchant bKash Number')}
                  </label>
                  <input
                    type="text"
                    value={bkashNum}
                    onChange={(e) => setBkashNum(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    {t('মার্চেন্ট নগদ নম্বর (Send Money)', 'Merchant Nagad Number')}
                  </label>
                  <input
                    type="text"
                    value={nagadNum}
                    onChange={(e) => setNagadNum(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  {t('অ্যানাউন্সমেন্ট বার টেক্সট (বাংলা)', 'Top Announcement Banner (Bengali)')}
                </label>
                <input
                  type="text"
                  value={announcementBn}
                  onChange={(e) => setAnnouncementBn(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  {t('অ্যানাউন্সমেন্ট বার টেক্সট (English)', 'Top Announcement Banner (English)')}
                </label>
                <input
                  type="text"
                  value={announcementEn}
                  onChange={(e) => setAnnouncementEn(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  {t('ফ্রি ডেলিভারি থ্রেশহোল্ড (৳)', 'Free Shipping Threshold Amount (৳)')}
                </label>
                <input
                  type="number"
                  value={freeShipThreshold}
                  onChange={(e) => setFreeShipThreshold(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  {t('স্টোর কাস্টমার সার্ভিস হোয়াটসঅ্যাপ ও ফোন নম্বর', 'Store Customer Support WhatsApp & Phone')}
                </label>
                <input
                  type="text"
                  value={storeWhatsapp}
                  onChange={(e) => setStoreWhatsapp(e.target.value)}
                  placeholder="+880 1995-180029"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono font-bold"
                />
                <p className="text-[10px] text-gray-400 mt-0.5">
                  {t('গ্রাহকরা এই নম্বরে সরাসরি হোয়াটসঅ্যাপে যোগাযোগ করতে পারবেন (ডিফল্ট: +880 1995-180029)', 'Customers will connect to this WhatsApp number directly')}
                </p>
              </div>

              {/* CMS Security Access PINs */}
              <div className="pt-4 border-t border-gray-100">
                <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-[#2D5F3F]" />
                  <span>{t('সিএমএস সিকিউরিটি পিন পরিবর্তন', 'CMS Security Access PINs')}</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      {t('সুপার অ্যাডমিন পিন (Super Admin PIN)', 'Super Admin PIN')}
                    </label>
                    <input
                      type="text"
                      value={adminPin}
                      onChange={(e) => setAdminPin(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono font-bold"
                    />
                    <p className="text-[10px] text-gray-400 mt-1">
                      {t('ডিফল্ট: admin123 (সম্পূর্ণ সিস্টেম অ্যাক্সেস)', 'Default: admin123 (Full system control)')}
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      {t('মডারেটর পিন (Moderator PIN)', 'Moderator PIN')}
                    </label>
                    <input
                      type="text"
                      value={moderatorPin}
                      onChange={(e) => setModeratorPin(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono font-bold"
                    />
                    <p className="text-[10px] text-gray-400 mt-1">
                      {t('ডিফল্ট: mod123 (পণ্য ও অর্ডার প্রসেসিং)', 'Default: mod123 (Products & orders)')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#2D5F3F] hover:bg-[#1e402a] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  {t('সেটিংস সংরক্ষণ করুন', 'Save Settings')}
                </button>
              </div>

            </form>
          </div>
        )}

      </div>

      {/* Add / Edit Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-bold text-base text-gray-900">
                {editingProduct ? t('পণ্য সম্পাদনা করুন', 'Edit Product') : t('নতুন কৃষিপণ্য যুক্ত করুন', 'Add New Agro Product')}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">
                  {t('পণ্যের শিরোনাম (বাংলা) *', 'Title (Bengali) *')}
                </label>
                <input
                  type="text"
                  required
                  value={titleBn}
                  onChange={(e) => setTitleBn(e.target.value)}
                  placeholder="যেমন: সুন্দরবনের প্রাকৃতিক খলিসা মধু"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">
                  {t('পণ্যের শিরোনাম (English) *', 'Title (English) *')}
                </label>
                <input
                  type="text"
                  required
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  placeholder="e.g. Sundarbans Khalisa Raw Honey"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">SKU</label>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    {t('ক্যাটাগরি', 'Category')}
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{language === 'bn' ? c.name_bn : c.name_en}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    {t('নিয়মিত মূল্য (৳)', 'Regular Price')}
                  </label>
                  <input
                    type="number"
                    value={regPrice}
                    onChange={(e) => setRegPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    {t('অফার মূল্য (৳)', 'Sale Price')}
                  </label>
                  <input
                    type="number"
                    value={salePrice}
                    onChange={(e) => setSalePrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-[#2D5F3F]"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    {t('স্টক পরিমাণ', 'Stock Quantity')}
                  </label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold"
                  />
                </div>
              </div>

              {/* Product Image Upload & Automatic Resizing/Conversion */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-gray-700 flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-[#2D5F3F]" />
                    <span>{t('পণ্যের ছবি (ফোন ক্যামেরা / গ্যালারি)', 'Product Image (Camera / Gallery)')}</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setManualUrlMode(!manualUrlMode)}
                    className="text-[11px] text-[#2D5F3F] underline font-medium hover:text-[#1e402a] cursor-pointer"
                  >
                    {manualUrlMode
                      ? t('ক্যামেরা/ফাইল আপলোডে ফিরে যান', 'Switch to File/Camera')
                      : t('বা সরাসরি ছবির URL দিন', 'Or paste Image URL')}
                  </button>
                </div>

                {!manualUrlMode ? (
                  <div className="space-y-2.5">
                    {/* Upload drop/tap zone */}
                    <label
                      htmlFor="cms-product-image-file"
                      className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-4 transition-all cursor-pointer ${
                        imageProcessing
                          ? 'bg-emerald-50 border-emerald-400 animate-pulse'
                          : 'bg-gray-50 border-gray-300 hover:border-[#2D5F3F] hover:bg-emerald-50/30'
                      }`}
                    >
                      <input
                        id="cms-product-image-file"
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handleImageFileChange}
                        disabled={imageProcessing}
                        className="hidden"
                      />

                      {imageProcessing ? (
                        <div className="py-4 text-center space-y-2">
                          <RefreshCw className="w-6 h-6 text-[#2D5F3F] animate-spin mx-auto" />
                          <p className="text-xs font-bold text-[#2D5F3F]">
                            {t('ছবি ১:১ স্কয়ার ফ্রেমে সাইজ ও JPG তে রূপান্তর হচ্ছে...', 'Framing 1:1 square & converting to JPG...')}
                          </p>
                        </div>
                      ) : (
                        <div className="text-center py-2 space-y-1.5">
                          <div className="w-10 h-10 rounded-full bg-emerald-100 text-[#2D5F3F] flex items-center justify-center mx-auto">
                            <Upload className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="font-bold text-gray-800 text-xs">
                              {t('ছবি তুলতে বা সিলেক্ট করতে এখানে ক্লিক করুন', 'Tap to take photo or choose image from phone')}
                            </span>
                            <p className="text-[10px] text-gray-500 mt-0.5">
                              {t('PNG বা যেকোনো ফরম্যাট স্বয়ংক্রিয়ভাবে ৮০০×৮০০ স্কয়ার JPG-তে অপ্টিমাইজ হবে', 'Auto-crops to 1:1 (800x800) and converts PNG to optimized JPG')}
                            </p>
                          </div>
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#2D5F3F] text-[10px] font-bold">
                            <Sparkles className="w-3 h-3" /> Auto 1:1 Square Frame & JPEG Compression
                          </span>
                        </div>
                      )}
                    </label>

                    {/* Preview & Conversion Stats */}
                    {imageUrl && (
                      <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-center gap-3">
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-white shadow-sm shrink-0 bg-white">
                          <img
                            src={imageUrl}
                            alt="Framed preview"
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[8px] text-center font-mono py-0.5">
                            1:1 Square
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 text-[11px] space-y-0.5">
                          <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>{t('ছবি সফলভাবে প্রসেস হয়েছে!', 'Image ready & framed!')}</span>
                          </div>
                          {imageConversionStats ? (
                            <p className="text-[10px] text-emerald-800 font-mono">
                              {imageConversionStats.originalFormat.split('/')[1]?.toUpperCase()} ({imageConversionStats.originalSizeKB} KB) ➔ JPG ({imageConversionStats.optimizedSizeKB} KB) · 800×800
                            </p>
                          ) : (
                            <p className="text-[10px] text-gray-500">
                              Format: 800×800 Square JPEG
                            </p>
                          )}
                          <p className="text-[10px] text-gray-400 truncate">
                            {imageUrl.startsWith('data:') ? '✓ Base64 DataPayload Ready' : imageUrl}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setImageUrl('');
                            setImageConversionStats(null);
                          }}
                          className="p-1 rounded-lg hover:bg-emerald-100 text-gray-500 hover:text-red-600 transition-colors cursor-pointer"
                          title="Remove image"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://example.com/product-image.jpg"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                    />
                    {imageUrl && (
                      <div className="mt-2 w-14 h-14 rounded-lg overflow-hidden border border-gray-200">
                        <img src={imageUrl} alt="" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isBestseller}
                    onChange={(e) => setIsBestseller(e.target.checked)}
                    className="accent-[#2D5F3F]"
                  />
                  <span>{t('বেস্টসেলার ট্যাগ', 'Best Seller Tag')}</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPreorder}
                    onChange={(e) => setIsPreorder(e.target.checked)}
                    className="accent-[#E76F51]"
                  />
                  <span>{t('প্রি-অর্ডার পণ্য', 'Pre-Order Item')}</span>
                </label>
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold"
                >
                  {t('বাতিল', 'Cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#2D5F3F] hover:bg-[#1e402a] text-white font-bold"
                >
                  {t('সংরক্ষণ করুন', 'Save Product')}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Add / Edit Category Modal */}
      {isCatModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-8 space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-bold text-base text-gray-900">
                {editingCat ? t('ক্যাটাগরি সম্পাদনা করুন', 'Edit Category') : t('নতুন ক্যাটাগরি যুক্ত করুন', 'Add New Category')}
              </h3>
              <button
                type="button"
                onClick={() => setIsCatModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">
                  {t('ক্যাটাগরির নাম (বাংলা) *', 'Category Name (Bengali) *')}
                </label>
                <input
                  type="text"
                  required
                  value={catNameBn}
                  onChange={(e) => setCatNameBn(e.target.value)}
                  placeholder="যেমন: খাঁটি মধু ও গুড়"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold font-bengaliSerif"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">
                  {t('ক্যাটাগরির নাম (English) *', 'Category Name (English) *')}
                </label>
                <input
                  type="text"
                  required
                  value={catNameEn}
                  onChange={(e) => setCatNameEn(e.target.value)}
                  placeholder="e.g. Raw Honey & Jaggery"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold"
                />
              </div>

              {/* Category Image upload & preview */}
              <div className="space-y-2">
                <label className="font-bold text-gray-700 flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-[#2D5F3F]" />
                  <span>{t('ক্যাটাগরি ছবি (গোল আইকন)', 'Category Circular Photo')}</span>
                </label>

                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-2xl border border-gray-200">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#2D5F3F] bg-white shrink-0 shadow-sm">
                    {catImage ? (
                      <img src={catImage} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                    )}
                    {catImageProcessing && (
                      <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                        <RefreshCw className="w-4 h-4 text-[#2D5F3F] animate-spin" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1 space-y-1.5">
                    <label
                      htmlFor="cms-cat-image-file"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-gray-300 hover:border-[#2D5F3F] text-gray-800 text-[11px] font-bold shadow-xs cursor-pointer transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5 text-[#2D5F3F]" />
                      <span>{t('ছবি তুলুন / আপলোড করুন', 'Take / Upload Photo')}</span>
                    </label>
                    <input
                      id="cms-cat-image-file"
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleCatImageChange}
                      disabled={catImageProcessing}
                      className="hidden"
                    />
                    <p className="text-[10px] text-gray-500">
                      {t('স্বয়ংক্রিয়ভাবে ৪০০×৪০০ গোল ফ্রেম ও JPG তে কনভার্ট হবে', 'Auto-optimizes to 400x400 circular JPG')}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-500 block mb-0.5">
                    {t('অথবা সরাসরি ছবির URL দিন:', 'Or direct Image URL:')}
                  </label>
                  <input
                    type="text"
                    value={catImage}
                    onChange={(e) => setCatImage(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCatModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold cursor-pointer"
                >
                  {t('বাতিল', 'Cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#2D5F3F] hover:bg-[#1e402a] text-white font-bold cursor-pointer shadow-sm"
                >
                  {t('ক্যাটাগরি সংরক্ষণ করুন', 'Save Category')}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
