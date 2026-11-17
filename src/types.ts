export type Language = 'bn' | 'en';

export interface ProductVariant {
  name: string; // e.g., "250g", "500g", "1kg", "5kg"
  price: number;
  stock: number;
  sku: string;
}

export interface Product {
  id: string;
  title_bn: string;
  title_en: string;
  slug: string;
  sku: string;
  category_id: string;
  regular_price: number;
  sale_price?: number;
  stock_quantity: number;
  low_stock_threshold: number;
  status: 'active' | 'draft' | 'out_of_stock';
  is_featured: boolean;
  is_bestseller: boolean;
  is_preorder: boolean;
  rating: number;
  reviews_count: number;
  short_description_bn: string;
  short_description_en: string;
  description_bn: string;
  description_en: string;
  ingredients_bn?: string;
  ingredients_en?: string;
  origin_bn?: string;
  origin_en?: string;
  images: string[];
  variants: ProductVariant[];
}

export interface Category {
  id: string;
  name_bn: string;
  name_en: string;
  slug: string;
  icon: string;
  image: string;
  product_count: number;
}

export interface CartItem {
  product: Product;
  selected_variant: ProductVariant;
  quantity: number;
}

export type PaymentMethod = 
  | 'cod' 
  | 'bkash_send_money' 
  | 'bkash_gateway' 
  | 'nagad_send_money' 
  | 'nagad_gateway' 
  | 'bank_transfer';

export type OrderStatus = 
  | 'pending' 
  | 'processing' 
  | 'shipped' 
  | 'delivered' 
  | 'cancelled';

export interface OrderItem {
  product_id: string;
  product_title: string;
  variant_name: string;
  unit_price: number;
  quantity: number;
  total_price: number;
  image: string;
}

export interface Order {
  id: string;
  order_number: string; // e.g. #GH-2026-001234
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  shipping_address: {
    district: string;
    thana: string;
    address_line: string;
    notes?: string;
  };
  delivery_method: 'standard' | 'express' | 'free';
  subtotal: number;
  shipping_cost: number;
  discount: number;
  total: number;
  payment_method: PaymentMethod;
  payment_status: 'pending' | 'verified' | 'paid' | 'failed';
  payment_transaction_id?: string;
  order_status: OrderStatus;
  tracking_number?: string;
  courier_name?: string;
  created_at: string;
  timeline: {
    title_bn: string;
    title_en: string;
    time: string;
    completed: boolean;
  }[];
}

export interface AdminAuth {
  isAuthenticated: boolean;
  role: 'admin' | 'moderator' | null;
  userName: string;
  loginTime: number | null;
}

export interface SiteSettings {
  site_name_bn: string;
  site_name_en: string;
  tagline_bn: string;
  tagline_en: string;
  announcement_bn: string;
  announcement_en: string;
  bkash_number: string;
  nagad_number: string;
  bank_info: string;
  contact_phone: string;
  contact_email: string;
  address: string;
  free_shipping_threshold: number;
  inside_dhaka_delivery: number;
  outside_dhaka_delivery: number;
  developer_name: string;
  developer_whatsapp: string;
  developer_whatsapp_url: string;
  admin_pin: string;
  moderator_pin: string;
}
