import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Product, OrderStatus, ProductVariant } from '../types';
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
    siteSettings, 
    updateSiteSettings,
    language, 
    t,
    setViewMode,
    categories,
    showToast
  } = useStore();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'settings'>('dashboard');
  const [role, setRole] = useState<'admin' | 'moderator'>('admin');
  
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

  // Settings form states
  const [bkashNum, setBkashNum] = useState(siteSettings.bkash_number);
  const [nagadNum, setNagadNum] = useState(siteSettings.nagad_number);
  const [announcementBn, setAnnouncementBn] = useState(siteSettings.announcement_bn);
  const [announcementEn, setAnnouncementEn] = useState(siteSettings.announcement_en);
  const [freeShipThreshold, setFreeShipThreshold] = useState(siteSettings.free_shipping_threshold);

  // Analytics metrics
  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);
  const totalOrdersCount = orders.length;
  const lowStockCount = products.filter(p => p.stock_quantity <= p.low_stock_threshold).length;
  const pendingOrdersCount = orders.filter(o => o.order_status === 'pending').length;

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
    updateSiteSettings({
      bkash_number: bkashNum,
      nagad_number: nagadNum,
      announcement_bn: announcementBn,
      announcement_en: announcementEn,
      free_shipping_threshold: Number(freeShipThreshold),
    });
  };

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
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F4A261] text-[#1A1A1A] font-bold uppercase">
                {role === 'admin' ? 'Super Admin' : 'Moderator'}
              </span>
            </h1>
            <p className="text-[11px] text-emerald-200">
              PWA Ready Mobile & Desktop Backoffice Control
            </p>
          </div>
        </div>

        {/* Role switcher & Back to store */}
        <div className="flex items-center gap-2 text-xs">
          <div className="bg-white/10 p-0.5 rounded-lg flex items-center">
            <button
              onClick={() => setRole('admin')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                role === 'admin' ? 'bg-[#F4A261] text-[#1A1A1A]' : 'text-gray-300 hover:text-white'
              }`}
            >
              Super Admin
            </button>
            <button
              onClick={() => setRole('moderator')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                role === 'moderator' ? 'bg-[#F4A261] text-[#1A1A1A]' : 'text-gray-300 hover:text-white'
              }`}
            >
              Moderator
            </button>
          </div>

          <button
            onClick={() => setViewMode('store')}
            className="px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white font-bold transition-colors"
          >
            {t('স্টোরফ্রন্টে যান →', 'View Storefront →')}
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200 gap-2 sm:gap-4 overflow-x-auto pb-1 mb-6">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
              activeTab === 'dashboard'
                ? 'bg-[#2D5F3F] text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>{t('ড্যাশবোর্ড', 'Dashboard')}</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
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
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
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
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
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

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#2D5F3F] hover:bg-[#1e402a] text-white font-bold text-xs shadow-md transition-all"
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

              <div>
                <label className="font-bold text-gray-700 block mb-1">
                  {t('ছবির URL', 'Image URL')}
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                />
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

    </div>
  );
};
