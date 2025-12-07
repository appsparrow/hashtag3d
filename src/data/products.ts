export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: "standard" | "customizable";
  customizationType?: string;
  image: string;
  likes: number;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Custom Name Keychain",
    description: "Personalized keychain with your name or text. Perfect for gifts!",
    price: 8.99,
    category: "customizable",
    customizationType: "Text engraving",
    image: "https://images.unsplash.com/photo-1623998021446-45cd9b269056?w=400&h=400&fit=crop",
    likes: 42,
  },
  {
    id: "2",
    name: "Christmas Tree Ornament",
    description: "Beautiful snowflake-patterned ornament for your holiday tree.",
    price: 12.99,
    category: "customizable",
    customizationType: "Color & year",
    image: "https://images.unsplash.com/photo-1512389142860-9c449e58a814?w=400&h=400&fit=crop",
    likes: 89,
  },
  {
    id: "3",
    name: "Geometric Planter",
    description: "Modern low-poly planter for succulents and small plants.",
    price: 24.99,
    category: "standard",
    image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=400&fit=crop",
    likes: 156,
  },
  {
    id: "4",
    name: "Phone Stand",
    description: "Adjustable phone stand with cable management.",
    price: 15.99,
    category: "standard",
    image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=400&fit=crop",
    likes: 73,
  },
  {
    id: "5",
    name: "Custom Pet Tag",
    description: "Personalized pet ID tag with name and phone number.",
    price: 6.99,
    category: "customizable",
    customizationType: "Pet name & contact",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=400&fit=crop",
    likes: 201,
  },
  {
    id: "6",
    name: "Desk Organizer",
    description: "Multi-compartment organizer for pens, clips, and office supplies.",
    price: 19.99,
    category: "standard",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&h=400&fit=crop",
    likes: 67,
  },
  {
    id: "7",
    name: "Custom Wedding Cake Topper",
    description: "Personalized cake topper with names and date.",
    price: 29.99,
    category: "customizable",
    customizationType: "Names & date",
    image: "https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=400&h=400&fit=crop",
    likes: 134,
  },
  {
    id: "8",
    name: "Headphone Holder",
    description: "Sleek wall-mounted or desk headphone stand.",
    price: 14.99,
    category: "standard",
    image: "https://images.unsplash.com/photo-1545127398-14699f92334b?w=400&h=400&fit=crop",
    likes: 95,
  },
];

export const categories = [
  { id: "all", label: "All Items", icon: "Grid3X3" },
  { id: "standard", label: "Standard", icon: "Package" },
  { id: "customizable", label: "Customizable", icon: "Paintbrush" },
] as const;
