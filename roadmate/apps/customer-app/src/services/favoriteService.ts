// roadmate/apps/customer-app/src/services/favoriteService.ts

export interface FavoriteItem {
  id: string;
  providerId: string;
  providerName: string;
  category: string;
  subcategory?: string;
  address?: string;
  rating?: number;
  phone?: string;
  savedAt: string; // ISO date
}

// Mock in-memory favorites database
let localFavorites: FavoriteItem[] = [
  {
    id: 'fav-001',
    providerId: 'p-101',
    providerName: 'Nayara Fuel Station, Jalgaon',
    category: 'Fuel Station',
    subcategory: 'Petrol & Diesel',
    address: 'NH-6, Jalgaon, Maharashtra',
    rating: 4.5,
    phone: '+91 99001 12345',
    savedAt: '2026-07-01'
  },
  {
    id: 'fav-002',
    providerId: 'p-202',
    providerName: 'Honda Authorized Service Center',
    category: 'Garage',
    subcategory: 'Authorized Service',
    address: 'Station Road, Jalgaon',
    rating: 4.8,
    phone: '+91 98765 00001',
    savedAt: '2026-06-15'
  },
  {
    id: 'fav-003',
    providerId: 'p-303',
    providerName: 'National Auto Spares',
    category: 'Accessories',
    subcategory: 'Auto Parts',
    address: 'MIDC Road, Jalgaon',
    rating: 4.3,
    phone: '+91 90000 23456',
    savedAt: '2026-05-20'
  },
  {
    id: 'fav-004',
    providerId: 'p-404',
    providerName: 'Hyundai Showroom Jalgaon',
    category: 'Vehicle Dealer',
    subcategory: 'New & Pre-owned Cars',
    address: 'Bypass Road, Jalgaon',
    rating: 4.6,
    phone: '+91 88000 99991',
    savedAt: '2026-04-10'
  }
];

/**
 * Returns all saved favorites.
 */
export const getFavorites = async (): Promise<FavoriteItem[]> => {
  return new Promise(resolve => {
    setTimeout(() => resolve([...localFavorites].sort(
      (a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
    )), 100);
  });
};

/**
 * Adds a provider to favorites.
 */
export const addFavorite = async (data: Omit<FavoriteItem, 'id' | 'savedAt'>): Promise<FavoriteItem> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const exists = localFavorites.find(f => f.providerId === data.providerId);
      if (exists) { resolve(exists); return; }
      const newFav: FavoriteItem = {
        id: 'fav-' + Date.now().toString(36).toUpperCase(),
        savedAt: new Date().toISOString().substring(0, 10),
        ...data
      };
      localFavorites.push(newFav);
      resolve(newFav);
    }, 100);
  });
};

/**
 * Removes a provider from favorites.
 */
export const removeFavorite = async (providerId: string): Promise<boolean> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const before = localFavorites.length;
      localFavorites = localFavorites.filter(f => f.providerId !== providerId);
      resolve(localFavorites.length < before);
    }, 100);
  });
};

/**
 * Checks if a provider is saved.
 */
export const isFavorite = async (providerId: string): Promise<boolean> => {
  return new Promise(resolve => {
    setTimeout(() => resolve(localFavorites.some(f => f.providerId === providerId)), 50);
  });
};

/**
 * Sort favorites by category.
 */
export const sortFavorites = (favorites: FavoriteItem[], by: 'date' | 'category' | 'rating'): FavoriteItem[] => {
  const sorted = [...favorites];
  if (by === 'date') return sorted.sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime());
  if (by === 'category') return sorted.sort((a, b) => a.category.localeCompare(b.category));
  if (by === 'rating') return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  return sorted;
};
