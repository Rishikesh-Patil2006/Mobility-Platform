// roadmate/apps/customer-app/src/services/serviceMockData.js

export const categories = [
  { id: 'Garage', name: 'Garage', emoji: '🔧', accent: '#2563EB', bg: '#EFF6FF', count: 12, image: require('../../assets/services_images/garage.jpg') },
  { id: 'Car Wash', name: 'Car Wash', emoji: '🫧', accent: '#06B6D4', bg: '#ECFEFF', count: 5, image: require('../../assets/services_images/car_wash.jpg') },
  { id: 'Towing', name: 'Towing', emoji: '🛻', accent: '#F97316', bg: '#FFF7ED', count: 8, image: require('../../assets/services_images/towing.jpg') },
  { id: 'PUC Center', name: 'PUC Center', emoji: '💨', accent: '#22C55E', bg: '#F0FDF4', count: 4, image: require('../../assets/services_images/puc center.jpg') },
  { id: 'Denting & Painting', name: 'Denting & Painting', emoji: '🎨', accent: '#EC4899', bg: '#FDF2F8', count: 3, image: require('../../assets/services_images/denting_painting.jpg') },
  { id: 'Service Center', name: 'Service Center', emoji: '🏬', accent: '#6366F1', bg: '#EEF2FF', count: 6, image: require('../../assets/services_images/service center.jpg') },
  { id: 'Driving Classes', name: 'Driving Classes', emoji: '🚗', accent: '#3B82F6', bg: '#EFF6FF', count: 3, image: require('../../assets/services_images/service center.jpg') },
  { id: 'RTO Agents', name: 'RTO Agents', emoji: '📝', accent: '#EC4899', bg: '#FDF2F8', count: 6, image: require('../../assets/services_images/denting_painting.jpg') },
  { id: 'Two Wheelers', name: 'Two Wheelers', emoji: '🏍️', accent: '#8B5CF6', bg: '#F5F3FF', count: 4, image: require('../../assets/vehicle_placeholder.png') },
  { id: 'Four Wheelers', name: 'Four Wheelers', emoji: '🚘', accent: '#EF4444', bg: '#FEF2F2', count: 2, image: require('../../assets/vehicle_placeholder.png') },
  // Fallbacks for missing assets
  { id: 'Tyre Shop', name: 'Tyre Shop', emoji: '🛞', accent: '#3B82F6', bg: '#EFF6FF', count: 4, image: require('../../assets/vehicle_placeholder.png') },
  { id: 'Fuel Station', name: 'Fuel Station', emoji: '⛽', accent: '#10B981', bg: '#E6FBF7', count: 3, image: require('../../assets/vehicle_placeholder.png') },
  { id: 'Battery Shop', name: 'Battery Shop', emoji: '🔋', accent: '#F59E0B', bg: '#FEF3C7', count: 5, image: require('../../assets/vehicle_placeholder.png') },
  { id: 'EV Charging', name: 'EV Charging', emoji: '⚡', accent: '#8B5CF6', bg: '#F5F3FF', count: 2, image: require('../../assets/vehicle_placeholder.png') },
];

export const providers = [
  // GARAGES
  {
    id: 'g1',
    name: 'Speed Auto Garage',
    category: 'Garage',
    availability: 'Available',
    rating: 4.8,
    reviews: 312,
    distance: 0.8, // in km
    address: 'Near Civil Hospital, Jalgaon',
    open: true,
    hours: '9 AM – 8 PM',
    phone: '+91 98765 43210',
    verified: true,
    offer: 'Free General Checkup',
    price: 199,
    duration: '30 mins',
    services: [
      { name: 'Engine Overhaul', price: 8500 },
      { name: 'Brake Service', price: 499 },
      { name: 'AC Repair & Refill', price: 1200 },
      { name: 'Wheel Alignment', price: 350 },
      { name: 'Oil Change', price: 1599 },
      { name: 'Battery Replacement', price: 3500 },
    ],
    reviewsList: [
      { name: 'Rahul S.', date: '2 days ago', rating: 5, comment: 'Excellent service! Very professional and on time.' },
      { name: 'Priya M.', date: '1 week ago', rating: 4, comment: 'Good work, fair pricing. Will visit again.' },
      { name: 'Karan J.', date: '3 weeks ago', rating: 5, comment: 'Engine feels brand new. Speed Auto Garage is highly recommended!' },
    ],
    description: 'Speed Auto Garage is one of the most reliable and premium garage services in Jalgaon, offering expert repair services and mechanical diagnostics with state-of-the-art tools.',
  },
  {
    id: 'g2',
    name: 'Patil Motors & Garage',
    category: 'Garage',
    availability: 'Busy',
    rating: 4.6,
    reviews: 218,
    distance: 1.4,
    address: 'Station Road, Jalgaon',
    open: true,
    hours: '8 AM – 9 PM',
    phone: '+91 98765 43211',
    verified: true,
    offer: '15% OFF on Brake Service',
    price: 399,
    duration: '45 mins',
    services: [
      { name: 'Brake Service', price: 349 },
      { name: 'AC Repair', price: 1099 },
      { name: 'Oil Change', price: 1499 },
      { name: 'Battery Diagnostics', price: 199 },
    ],
    reviewsList: [
      { name: 'Varun K.', date: '3 days ago', rating: 5, comment: 'Quick service for my Honda City. Helpful mechanics.' },
    ],
    description: 'Patil Motors provides efficient mechanic options and multi-brand car repairs near the station area. Open early and late to fit your schedule.',
  },
  {
    id: 'g3',
    name: 'Royal Garage Center',
    category: 'Garage',
    availability: 'Unavailable',
    rating: 4.5,
    reviews: 184,
    distance: 2.1,
    address: 'Navi Peth, Jalgaon',
    open: false,
    hours: '9 AM – 7 PM',
    phone: '+91 98765 43212',
    verified: false,
    offer: null,
    price: 299,
    duration: '40 mins',
    services: [
      { name: 'Engine Tune-up', price: 1999 },
      { name: 'Wheel Alignment & Balancing', price: 499 },
      { name: 'AC Filter Cleaning', price: 299 },
    ],
    reviewsList: [
      { name: 'Amit D.', date: '1 month ago', rating: 4, comment: 'Nice staff but wait times can be long during weekends.' },
    ],
    description: 'Located in the heart of Navi Peth, Royal Garage offers premium tune-up services for hatchback and sedan segments.',
  },
  {
    id: 'g4',
    name: 'Expert Auto Works',
    category: 'Garage',
    availability: 'Available',
    rating: 4.3,
    reviews: 156,
    distance: 2.8,
    address: 'Ajintha Road, Jalgaon',
    open: true,
    hours: '8 AM – 8 PM',
    phone: '+91 98765 43213',
    verified: false,
    offer: 'Free Pick & Drop',
    price: 499,
    duration: '60 mins',
    services: [
      { name: 'Suspension Check', price: 699 },
      { name: 'Oil & Filter Replacement', price: 1850 },
      { name: 'Car Inspection', price: 499 },
    ],
    reviewsList: [],
    description: 'Expert Auto Works is your go-to center for complex mechanical and electrical problems. Affordable rates.',
  },

  // CAR WASHES
  {
    id: 'w1',
    name: 'Crystal Car Wash',
    category: 'Car Wash',
    rating: 4.7,
    reviews: 245,
    distance: 1.2,
    address: 'MG Road, Jalgaon',
    open: true,
    hours: '7 AM – 9 PM',
    phone: '+91 98765 44210',
    verified: true,
    offer: 'Free Interior Vacuuming',
    price: 299,
    duration: '20 mins',
    services: [
      { name: 'Exterior Foam Wash', price: 299 },
      { name: 'Interior Deep Cleaning', price: 999 },
      { name: 'Premium Waxing & Polishing', price: 1499 },
      { name: 'Engine Bay Detailing', price: 499 },
      { name: 'Ceramic Coating', price: 9999 },
    ],
    reviewsList: [
      { name: 'Rohan G.', date: 'Yesterday', rating: 5, comment: 'Car looks absolutely sparkling clean! Very professional crew.' },
    ],
    description: 'Crystal Car Wash provides quick, high-quality automatic and manual foam washing solutions with eco-friendly cleaning formulas.',
  },
  {
    id: 'w2',
    name: 'Shine Auto Spa',
    category: 'Car Wash',
    rating: 4.5,
    reviews: 189,
    distance: 1.8,
    address: 'Khandesh Plaza, Jalgaon',
    open: true,
    hours: '8 AM – 8 PM',
    phone: '+91 98765 44211',
    verified: true,
    offer: '10% OFF on Full Detailing',
    price: 450,
    duration: '35 mins',
    services: [
      { name: 'Foam Wash & Underbody Clean', price: 450 },
      { name: 'Dashboard Polishing', price: 199 },
      { name: 'Odor Neutralizer Treatment', price: 250 },
    ],
    reviewsList: [],
    description: 'Experience professional detailing at Shine Auto Spa. Conveniently situated in Khandesh Plaza with ample parking spaces.',
  },

  // TOWING
  {
    id: 't1',
    name: 'Rescue Towing 24x7',
    category: 'Towing',
    rating: 4.9,
    reviews: 189,
    distance: 1.0,
    address: 'Mumbai Highway, Jalgaon',
    open: true,
    hours: '24 Hours',
    phone: '+91 98765 55210',
    verified: true,
    offer: 'Emergency Guarantee',
    isEmergency: true,
    price: 999,
    duration: '15 mins',
    services: [
      { name: 'Flatbed Towing', price: 1999 },
      { name: 'Hydraulic Underlift Towing', price: 999 },
      { name: 'Two-Wheeler Towing', price: 499 },
      { name: 'Accident Recovery Tow', price: 2999 },
    ],
    reviewsList: [
      { name: 'Sanjay P.', date: '4 days ago', rating: 5, comment: 'Broke down at midnight. They arrived in exactly 15 mins. Lifesavers!' },
    ],
    description: 'Rescue Towing provides rapid response emergency towing across all major roads and highways connecting to Jalgaon, active 24x7.',
  },
  {
    id: 't2',
    name: 'Highway Help Towing',
    category: 'Towing',
    rating: 4.7,
    reviews: 156,
    distance: 1.6,
    address: 'Pune Road, Jalgaon',
    open: true,
    hours: '24 Hours',
    phone: '+91 98765 55211',
    verified: true,
    offer: '24x7 Helpdesk Available',
    isEmergency: true,
    price: 899,
    duration: '20 mins',
    services: [
      { name: 'Standard Towing', price: 899 },
      { name: 'Long Distance Towing', price: 3500 },
    ],
    reviewsList: [],
    description: 'Specialists in heavy-duty and light vehicle towing on Pune highway channels. Professional crew with robust safety chains.',
  },

  // PUC CENTERS
  {
    id: 'p1',
    name: 'Jalgaon PUC Center',
    category: 'PUC Center',
    rating: 4.6,
    reviews: 312,
    distance: 2.1,
    address: 'NH-6, Near Toll Plaza, Jalgaon',
    open: true,
    hours: '9 AM – 7 PM',
    phone: '+91 98765 66210',
    verified: true,
    offer: 'Instant Online Sync',
    price: 99,
    duration: '10 mins',
    services: [
      { name: 'Petrol / CNG Emission Test', price: 99 },
      { name: 'Diesel PUC Testing', price: 120 },
      { name: 'HSRP Plate Booking Helper', price: 150 },
      { name: 'DigiLocker Upload Assistance', price: 50 },
    ],
    reviewsList: [
      { name: 'Tejas W.', date: '2 weeks ago', rating: 5, comment: 'Very quick. They tested the emission and updated the parivahan database instantly.' },
    ],
    description: 'Government-authorized emission testing center equipped with digital gas analyzers. Fast and reliable certification.',
  },

  // DENTING & PAINTING
  {
    id: 'd1',
    name: 'Royal Paint & Dent Lab',
    category: 'Denting & Painting',
    rating: 4.8,
    reviews: 142,
    distance: 1.5,
    address: 'MIDC Sector 2, Jalgaon',
    open: true,
    hours: '9 AM – 7 PM',
    phone: '+91 98765 77210',
    verified: true,
    offer: 'Up to 20% OFF on Full Body Paint',
    price: 1500,
    duration: '2 hrs',
    services: [
      { name: 'Bumper Scratch Removal', price: 1500 },
      { name: 'Panel Paint Match', price: 3200 },
      { name: 'Dent Pulling (Paintless)', price: 800 },
      { name: 'Full Car Ceramic Finish Paint', price: 22000 },
    ],
    reviewsList: [
      { name: 'Nikhil R.', date: '1 month ago', rating: 5, comment: 'Dents are completely gone. Color match is perfect.' },
    ],
    description: 'Expert auto-body specialists with state-of-the-art paint booths and computerized shade match software. Clear coat guarantee.',
  },

  // SERVICE CENTERS
  {
    id: 's1',
    name: 'Multi-Brand Care Center',
    category: 'Service Center',
    rating: 4.7,
    reviews: 198,
    distance: 1.1,
    address: 'Ring Road Chowk, Jalgaon',
    open: true,
    hours: '8:30 AM – 8:30 PM',
    phone: '+91 98765 88210',
    verified: true,
    offer: 'Free 50-Point Inspection',
    price: 1999,
    duration: '3 hrs',
    services: [
      { name: 'Full Periodic Service (Basic)', price: 1999 },
      { name: 'Comprehensive Periodic Service', price: 3499 },
      { name: 'Automatic Transmission Flush', price: 2500 },
      { name: 'Suspension Overhaul Pack', price: 8900 },
    ],
    reviewsList: [
      { name: 'Shruti K.', date: '1 week ago', rating: 4, comment: 'Very professional reception and digital service status updates.' },
    ],
    description: 'Authorized service experience without high dealership pricing. Fully computerized engine scanners and genuine spare parts.',
  },

  // DRIVING CLASSES
  {
    id: 'dc1',
    name: 'Sai Driving School',
    category: 'Driving Classes',
    rating: 4.8,
    reviews: 94,
    distance: 1.2,
    address: 'Ring Road, Near Multiplex, Jalgaon',
    open: true,
    hours: '7 AM – 7 PM',
    phone: '+91 98765 99100',
    verified: true,
    offer: 'Includes RTO License Service',
    price: 3500,
    duration: '15 Days',
    services: [
      { name: 'Four Wheeler Course (15 Days)', price: 3500 },
      { name: 'Two Wheeler Driving Lessons', price: 1500 },
      { name: 'Refresher Driving Course (5 Days)', price: 1500 },
      { name: 'Simulator Driving Sessions', price: 500 },
    ],
    reviewsList: [
      { name: 'Vijay P.', date: '3 days ago', rating: 5, comment: 'Very patient instructors. Cleared my license test in the first go!' }
    ],
    description: 'Professional driving school offering customizable courses, simulator learning, and experienced trainers for personal and commercial vehicles.',
  },
  {
    id: 'dc2',
    name: 'Maruti Suzuki Driving School',
    category: 'Driving Classes',
    rating: 4.9,
    reviews: 145,
    distance: 2.5,
    address: 'MIDC Crossroad, Jalgaon',
    open: true,
    hours: '8 AM – 8 PM',
    phone: '+91 98765 99101',
    verified: true,
    offer: 'Free Theory Classes',
    price: 4999,
    duration: '21 Days',
    services: [
      { name: 'Standard Driving Program', price: 4999 },
      { name: 'Advanced Driving Program', price: 6500 },
    ],
    reviewsList: [],
    description: 'Authorized Maruti Suzuki driving experience using advanced simulator controls and comprehensive certified course syllabus.',
  },

  // RTO AGENTS
  {
    id: 'ra1',
    name: 'Quick RTO Consultants',
    category: 'RTO Agents',
    rating: 4.7,
    reviews: 165,
    distance: 0.9,
    address: 'Opposite RTO Office, Jalgaon',
    open: true,
    hours: '10 AM – 6 PM',
    phone: '+91 98765 99200',
    verified: true,
    offer: 'Doorstep Document Collection',
    price: 499,
    duration: '3-5 Days',
    services: [
      { name: 'Driving License Application Assistance', price: 999 },
      { name: 'Vehicle Transfer & NOC Registration', price: 1499 },
      { name: 'Re-registration (Vehicle Ageing)', price: 1999 },
      { name: 'Address Change in RC', price: 499 },
    ],
    reviewsList: [
      { name: 'Dinesh B.', date: '1 week ago', rating: 5, comment: 'Super quick documentation. Transferred my RC without any hassle.' }
    ],
    description: 'Leading consultancy for RTO documents, registrations, address shifts, and license renewal services with transparent fee listings.',
  },
  {
    id: 'ra2',
    name: 'Apex RTO Services',
    category: 'RTO Agents',
    rating: 4.5,
    reviews: 87,
    distance: 1.8,
    address: 'Shahu Maharaj Complex, Jalgaon',
    open: true,
    hours: '10 AM – 6:30 PM',
    phone: '+91 98765 99201',
    verified: false,
    offer: null,
    price: 399,
    duration: '5-7 Days',
    services: [
      { name: 'New Vehicle Registration Help', price: 799 },
      { name: 'Hypothecation Termination (HP Endorsement)', price: 599 },
    ],
    reviewsList: [],
    description: 'Reliable agents providing support for motor registration deeds, duplicate RC issuances, and commercial vehicle documentation.',
  },

  // TWO WHEELER SHOWROOMS
  {
    id: 'tw1',
    name: 'Sai Honda Showroom & EV',
    category: 'Two Wheelers',
    rating: 4.6,
    reviews: 280,
    distance: 2.0,
    address: 'Near Stadium Chowk, Jalgaon',
    open: true,
    hours: '9:30 AM – 8:30 PM',
    phone: '+91 98765 99300',
    verified: true,
    offer: 'Free Helmet & Accessories Kit',
    price: 78000,
    duration: '1 hr',
    services: [
      { name: 'Honda Activa 6G Booking', price: 82000 },
      { name: 'Honda Shine 125 Booking', price: 88000 },
      { name: 'Honda Hornet 2.0 Test Ride', price: 0 },
      { name: 'Book EV Scooters (Honda EM1 e:)', price: 120000 },
    ],
    reviewsList: [
      { name: 'Mahesh K.', date: '2 weeks ago', rating: 5, comment: 'Helpful staff, delivered my Activa on the same day as booking.' }
    ],
    description: 'Exclusive multi-brand authorized dealership showroom offering the latest Two-Wheeler specs, test drives, and immediate finance schemes.',
  },
  {
    id: 'tw2',
    name: 'Hero MotoCorp Showroom',
    category: 'Two Wheelers',
    rating: 4.5,
    reviews: 198,
    distance: 3.1,
    address: 'Court Road, Jalgaon',
    open: true,
    hours: '9:30 AM – 8 PM',
    phone: '+91 98765 99301',
    verified: true,
    offer: '₹2000 Exchange Bonus',
    price: 65000,
    duration: '2 hrs',
    services: [
      { name: 'Hero Splendor Plus Booking', price: 75000 },
      { name: 'Hero Xpulse 200 Test Ride', price: 0 },
    ],
    reviewsList: [],
    description: 'Wide collections of commuter bikes and sports touring variants. In-house finance and instant vehicle insurance services.',
  },

  // FOUR WHEELER SHOWROOMS
  {
    id: 'fw1',
    name: 'Maruti Suzuki Arena (Jalgaon Motors)',
    category: 'Four Wheelers',
    rating: 4.7,
    reviews: 412,
    distance: 1.5,
    address: 'MIDC Main Road, Jalgaon',
    open: true,
    hours: '9 AM – 8 PM',
    phone: '+91 98765 99400',
    verified: true,
    offer: 'Free Comprehensive Insurance on Booking',
    price: 399000,
    duration: '2 hrs',
    services: [
      { name: 'Swift 2026 Test Drive & Booking', price: 670000 },
      { name: 'Ertiga CNG Booking', price: 980000 },
      { name: 'Brezza Smart Hybrid Test Drive', price: 0 },
    ],
    reviewsList: [
      { name: 'Aniket P.', date: '3 days ago', rating: 5, comment: 'Amazing showroom experience. Customer relations are top notch.' }
    ],
    description: 'Spacious authorized dealership for Maruti Suzuki hatchbacks, sedans, and SUVs. Best-in-class pricing options and exchange offers.',
  },
  {
    id: 'fw2',
    name: 'Tata Motors Showroom (Highway Care)',
    category: 'Four Wheelers',
    rating: 4.8,
    reviews: 354,
    distance: 2.2,
    address: 'National Highway 6, Jalgaon',
    open: true,
    hours: '9 AM – 8:30 PM',
    phone: '+91 98765 99401',
    verified: true,
    offer: 'Government EV Subsidies Assistance',
    price: 799000,
    duration: '2 hrs',
    services: [
      { name: 'Tata Nexon EV Booking', price: 1450000 },
      { name: 'Tata Punch Booking', price: 612000 },
      { name: 'Tata Curvv EV Test Ride', price: 0 },
    ],
    reviewsList: [],
    description: 'Premier destination for high-safety passenger cars and advanced electric vehicle offerings. Quick financing approvals available.',
  },
];

export const getCategoryTheme = (categoryId) => {
  const matched = categories.find(c => c.id === categoryId);
  return {
    icon: matched?.emoji || '🔧',
    color: matched?.accent || '#2563EB',
    bg: matched?.bg || '#EFF6FF',
    image: matched?.image || require('../../assets/vehicle_placeholder.png')
  };
};

// ── Real-Time Availability Architecture ──
// Subscriptions to simulate vendor-controlled garage availability changes.
const availabilityListeners = [];

export const subscribeToAvailability = (listener) => {
  availabilityListeners.push(listener);
  return () => {
    const idx = availabilityListeners.indexOf(listener);
    if (idx > -1) availabilityListeners.splice(idx, 1);
  };
};

export const updateVendorAvailability = (providerId, newStatus) => {
  const provider = providers.find(p => p.id === providerId);
  if (provider) {
    provider.availability = newStatus;
    availabilityListeners.forEach(listener => {
      try {
        listener(providerId, newStatus);
      } catch (e) {
        console.error('Error in availability listener:', e);
      }
    });
  }
};

// Periodic simulator loop to update garage status every 20 seconds.
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const garageIds = ['g1', 'g2', 'g3', 'g4'];
    const statuses = ['Available', 'Busy', 'Unavailable'];
    const randomGarageId = garageIds[Math.floor(Math.random() * garageIds.length)];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    updateVendorAvailability(randomGarageId, randomStatus);
  }, 20000);
}

