export type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string; // base64 data URL o URL externa
  description: string;
  available: boolean;
  createdAt: number;
};
