// roadmate/apps/customer-app/src/services/maintenanceService.ts

export interface MaintenanceCategory {
  id: string;
  title: string;
  icon: string;
  description: string;
  articleCount: number;
  featuredArticle: {
    title: string;
    readTime: string;
    summary: string;
  };
}

const mockMaintenanceCategories: MaintenanceCategory[] = [
  {
    id: 'veh-care',
    title: 'Vehicle Care',
    icon: '🚗',
    description: 'General chassis, fluid checks, and routine inspection guidelines for longevity.',
    articleCount: 12,
    featuredArticle: {
      title: 'Top 10 Daily Vehicle Maintenance Checklists',
      readTime: '3 min read',
      summary: 'Essential daily habits to inspect coolant levels, lights, brake response, and tire pressure.'
    }
  },
  {
    id: 'engine-care',
    title: 'Engine Care',
    icon: '⚙️',
    description: 'Engine oil health, spark plug cleaning, air filter replacement, and overheating prevention.',
    articleCount: 8,
    featuredArticle: {
      title: 'How Engine Oil Grades Affect Fuel Efficiency & Life',
      readTime: '4 min read',
      summary: 'Learn when to switch between synthetic and mineral oils based on mileage and weather.'
    }
  },
  {
    id: 'battery',
    title: 'Battery',
    icon: '🔋',
    description: 'Terminal cleaning, electrolyte water levels, voltage testing, and jump-start guides.',
    articleCount: 6,
    featuredArticle: {
      title: 'Extending Car & Scooter Battery Life in Extreme Climates',
      readTime: '3 min read',
      summary: 'Prevent battery drain during monsoon and winter with proper terminal grease and voltage maintenance.'
    }
  },
  {
    id: 'tyres',
    title: 'Tyres',
    icon: '🛞',
    description: 'PSI pressure checks, wheel alignment, tread wear indicators, and puncture repair tips.',
    articleCount: 9,
    featuredArticle: {
      title: 'Wheel Alignment & Balancing: When & Why It Matters',
      readTime: '5 min read',
      summary: 'Avoid uneven tyre tread wear and steering vibration with regular 5,000 km alignment checks.'
    }
  },
  {
    id: 'cleaning',
    title: 'Cleaning',
    icon: '🧼',
    description: 'Interior sanitization, foam washing, ceramic coating, paint protection, and microfiber care.',
    articleCount: 7,
    featuredArticle: {
      title: 'Monsoon Car Wash & Anti-Rust Underbody Coating',
      readTime: '3 min read',
      summary: 'Protect chassis metal from mud, salt, and water corrosion using Teflon and rubberized undercoating.'
    }
  },
  {
    id: 'emergency',
    title: 'Emergency',
    icon: '🚨',
    description: 'Breakdown protocols, emergency kit checklists, towing procedures, and roadside assistance.',
    articleCount: 5,
    featuredArticle: {
      title: 'Step-by-Step Guide: What To Do During an Engine Overheat',
      readTime: '2 min read',
      summary: 'Safely pull over, let steam dissipate, check coolant reserve, and request Roadmate SOS breakdown support.'
    }
  },
  {
    id: 'gov-rules',
    title: 'Government Rules',
    icon: '📜',
    description: 'Latest RTO rules, PUC compliance penalties, FASTag regulations, and traffic fine structures.',
    articleCount: 14,
    featuredArticle: {
      title: 'New RTO Penalty Guidelines & Mandatory Vehicle Certificates',
      readTime: '4 min read',
      summary: 'Stay compliant with updated Motor Vehicle Act rules for high-security registration plates (HSRP).'
    }
  },
  {
    id: 'seasonal',
    title: 'Seasonal Maintenance',
    icon: '🌦️',
    description: 'Summer AC cooling, monsoon wiper blade changes, fog light maintenance, and winter care.',
    articleCount: 10,
    featuredArticle: {
      title: 'Monsoon Preparation: Wiper Blades, Defogger & Brakes',
      readTime: '4 min read',
      summary: 'Replace worn wiper rubbers, inspect brake pads for wet slippage, and clear water drain channels.'
    }
  }
];

export async function getMaintenanceCategories(): Promise<MaintenanceCategory[]> {
  await new Promise(res => setTimeout(res, 150));
  return [...mockMaintenanceCategories];
}

export async function getMaintenanceCategoryById(id: string): Promise<MaintenanceCategory | null> {
  await new Promise(res => setTimeout(res, 100));
  return mockMaintenanceCategories.find(c => c.id === id) || null;
}
