export type ProductSize = {
  id: string;
  size: string;
  price: number;
};

export type ProductWithSizes = {
  id: string;
  name: string;
  description: string | null;
  isFavorite: boolean;
  imageUrl: string | null;
  category: {
    id: string;
    name: string;
  };
  sizes: ProductSize[];
};

export type PromotionData = {
  id: string;
  name: string;
  description: string | null;
  label: string | null;
  price: number;
  imageUrl: string | null;
};

export type LocationData = {
  id: string;
  name: string;
  whatsappNumber: string;
  mapsEmbedUrl: string | null;
};

export type SettingsMap = Record<string, string>;

export type CartItem = {
  cartItemId: string;
  product: ProductWithSizes;
  size?: string;
  quantity: number;
  subtotal: number;
};
