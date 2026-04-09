// All mock data for food section

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;           // in LKR
  photoUrl: string;
}

export interface FoodShop {
  id: string;
  name: string;
  description: string;
  address: string;
  phoneNumber: string;
  openingHours: string;
  isOpen: boolean;
  photoUrl: string;        // cover photo
  createdAt: string;
  isNew?: boolean;
  category: string;        // e.g. "Rice & Curry", "Cafe", "Kottu"
  menuItems: MenuItem[];
}

export const foodShopsData: FoodShop[] = [
  {
    id: 'shop-1',
    name: "Amma's Kitchen",
    description: 'Authentic homestyle Sri Lankan rice and curry. Prepared fresh daily with love. Best lunch packets near the university gate.',
    address: 'No. 12, Belihuloya Main Road, Near University Gate',
    phoneNumber: '+94 77 123 4567',
    openingHours: '7:00 AM - 9:00 PM',
    isOpen: true,
    photoUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&auto=format&fit=crop',
    createdAt: '2026-04-02T08:00:00Z',
    isNew: true,
    category: 'Rice & Curry',
    menuItems: [
      {
        id: 'item-1-1',
        name: 'Rice & Curry Plate',
        description: 'Steamed rice with 4 curries, papadam, and sambol. A complete Sri Lankan meal.',
        price: 280,
        photoUrl: 'https://images.unsplash.com/photo-1567337710282-00832b415979?w=400&auto=format&fit=crop',
      },
      {
        id: 'item-1-2',
        name: 'Egg Hoppers',
        description: 'Crispy bowl-shaped hoppers with a perfectly cooked egg in the center. Served with coconut sambol.',
        price: 80,
        photoUrl: 'https://images.unsplash.com/photo-1574653853027-5382a3d23a15?w=400&auto=format&fit=crop',
      },
      {
        id: 'item-1-3',
        name: 'Pol Sambol',
        description: 'Freshly grated coconut mixed with red chili, lime, and onion. A classic Sri Lankan condiment.',
        price: 60,
        photoUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&auto=format&fit=crop',
      },
      {
        id: 'item-1-4',
        name: 'String Hoppers',
        description: 'Steamed rice noodle nests served with coconut milk curry and lentil dhal.',
        price: 120,
        photoUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&auto=format&fit=crop',
      },
    ],
  },
  {
    id: 'shop-2',
    name: 'Brew & Bite Cafe',
    description: 'Your favourite campus hangout. Specialty coffee, fresh sandwiches, and pastries. Perfect for study sessions.',
    address: 'Junction Road, Pambahinna, Near Faculty of Computing',
    phoneNumber: '+94 71 987 6543',
    openingHours: '6:30 AM - 10:00 PM',
    isOpen: true,
    photoUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop',
    createdAt: '2026-04-02T06:00:00Z',
    isNew: true,
    category: 'Cafe',
    menuItems: [
      {
        id: 'item-2-1',
        name: 'Iced Caramel Latte',
        description: 'Smooth espresso with caramel syrup, milk, and ice. Your perfect study companion.',
        price: 450,
        photoUrl: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=400&auto=format&fit=crop',
      },
      {
        id: 'item-2-2',
        name: 'Club Sandwich',
        description: 'Triple-layered toasted sandwich with chicken, lettuce, tomato, and cheese.',
        price: 380,
        photoUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&auto=format&fit=crop',
      },
      {
        id: 'item-2-3',
        name: 'Chocolate Brownie',
        description: 'Rich, fudgy brownie baked fresh every morning. Served warm with vanilla ice cream.',
        price: 220,
        photoUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&auto=format&fit=crop',
      },
    ],
  },
  {
    id: 'shop-3',
    name: 'Kottu King',
    description: 'The original kottu spot near university. Crispy roti, fresh vegetables, and your choice of protein. Best kottu in Belihuloya guaranteed.',
    address: '45, Old Colombo Road, Belihuloya Town',
    phoneNumber: '+94 76 555 0199',
    openingHours: '11:00 AM - 11:00 PM',
    isOpen: false,
    photoUrl: 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=800&auto=format&fit=crop',
    createdAt: '2026-03-30T10:00:00Z',
    isNew: false,
    category: 'Kottu',
    menuItems: [
      {
        id: 'item-3-1',
        name: 'Chicken Kottu',
        description: 'Shredded roti stir-fried with chicken, vegetables, egg, and kottu spice mix.',
        price: 320,
        photoUrl: 'https://images.unsplash.com/photo-1512058533999-a09bf877b6db?w=400&auto=format&fit=crop',
      },
      {
        id: 'item-3-2',
        name: 'Egg Kottu',
        description: 'Classic egg kottu with shredded roti, fresh vegetables, and three eggs.',
        price: 250,
        photoUrl: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&auto=format&fit=crop',
      },
      {
        id: 'item-3-3',
        name: 'Cheese Kottu',
        description: 'Melted cheese mixed into classic kottu for a rich, creamy twist.',
        price: 380,
        photoUrl: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400&auto=format&fit=crop',
      },
    ],
  },
  {
    id: 'shop-4',
    name: 'Noodle House',
    description: 'Chinese-inspired noodles and fried rice. Quick meals for hungry students between lectures.',
    address: 'Market Road, Belihuloya, Opposite the bus stand',
    phoneNumber: '+94 45 228 0011',
    openingHours: '10:00 AM - 8:00 PM',
    isOpen: true,
    photoUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&auto=format&fit=crop',
    createdAt: '2026-03-28T10:00:00Z',
    isNew: false,
    category: 'Chinese',
    menuItems: [
      {
        id: 'item-4-1',
        name: 'Chicken Fried Rice',
        description: 'Wok-fried rice with chicken, egg, vegetables, and soy sauce.',
        price: 300,
        photoUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&auto=format&fit=crop',
      },
      {
        id: 'item-4-2',
        name: 'Noodle Soup',
        description: 'Soft noodles in a rich chicken broth with vegetables and soft-boiled egg.',
        price: 280,
        photoUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&auto=format&fit=crop',
      },
    ],
  },
  {
    id: 'shop-5',
    name: 'Sunrise Bakery',
    description: 'Fresh baked goods every morning. Bread, buns, pastries, and short eats. Open before your 8am lecture.',
    address: 'Temple Road, Belihuloya, Near the Post Office',
    phoneNumber: '+94 77 444 3322',
    openingHours: '5:30 AM - 7:00 PM',
    isOpen: true,
    photoUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&auto=format&fit=crop',
    createdAt: '2026-03-25T05:00:00Z',
    isNew: false,
    category: 'Bakery',
    menuItems: [
      {
        id: 'item-5-1',
        name: 'Butter Croissant',
        description: 'Flaky, buttery croissant baked fresh each morning. Perfect with your morning tea.',
        price: 120,
        photoUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&auto=format&fit=crop',
      },
      {
        id: 'item-5-2',
        name: 'Vegetable Short Eats Pack',
        description: '6 pieces assorted vegetable short eats — patties, rolls, and cutlets.',
        price: 180,
        photoUrl: 'https://images.unsplash.com/photo-1564834744159-ff0ea41ba4b9?w=400&auto=format&fit=crop',
      },
    ],
  },
];