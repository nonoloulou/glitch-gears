export type Product = {
  id: string;
  name: string;
  type: string;
  price: number;
  discount_price: number | null;
  quantity: number;
  tags: string[];
  image_url: string | null;
  created_at: string;
};

export type Promotion = {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  active: boolean;
  created_at?: string;
};

export type ProductFormData = {
  name: string;
  type: string;
  price: number;
  discount_price: number | null;
  quantity: number;
  tags: string[];
  image_url: string | null;
};

export type PromotionFormData = {
  title: string;
  description: string;
  image_url: string | null;
  active: boolean;
};
