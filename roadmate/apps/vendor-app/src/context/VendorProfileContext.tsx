import React, { createContext, useContext, useState, useEffect } from 'react';

export interface VendorProfile {
  vendorId: string;
  businessId: string;
  businessName: string;
  ownerName: string;
  businessEmail: string;
  mobileNumber: string;
  whatsAppNumber: string;
  password?: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  location: string; // GPS location placeholder
  yearsOfExperience: string;
  businessDescription: string;
  mainCategory: string;
  subcategory: string;
  startingPrice: string;
  inspectionCharges: string;
  visitingCharges?: string;
  emergencyCharges?: string;
  verificationStatus: 'Pending Verification' | 'Verified' | 'Rejected' | 'Documents Expired';
  documents: {
    businessRegistration?: string;
    udyamRegistration?: string;
    gstCertificate?: string;
    shopActLicense?: string;
    businessPan?: string;
    governmentId?: string;
  };
  logo?: string;
  ownerPhoto?: string;
  coverImage?: string;
  gallery: string[];
  certificates: string[];
}

interface VendorProfileContextType {
  profile: VendorProfile | null;
  profiles: { [email: string]: VendorProfile };
  login: (email: string) => Promise<boolean>;
  signup: (details: Partial<VendorProfile>) => Promise<void>;
  updateProfile: (updates: Partial<VendorProfile>) => Promise<void>;
  uploadDocument: (key: keyof VendorProfile['documents'], fileName: string) => Promise<void>;
  deleteDocument: (key: keyof VendorProfile['documents']) => Promise<void>;
  uploadPhoto: (key: 'logo' | 'ownerPhoto' | 'coverImage', fileName: string) => Promise<void>;
  uploadGalleryImage: (fileName: string) => Promise<void>;
  deleteGalleryImage: (index: number) => Promise<void>;
  simulateAdminApproval: () => void;
  getCompletionPercentage: () => number;
  getMissingFields: () => string[];
  logout: () => void;
}

const preSavedProfiles: { [email: string]: VendorProfile } = {
  'speedauto@gmail.com': {
    vendorId: 'VND-3011',
    businessId: 'BIZ-8910',
    businessName: 'Speed Auto Garage',
    ownerName: 'Rushikesh Patil',
    businessEmail: 'speedauto@gmail.com',
    mobileNumber: '9876543210',
    whatsAppNumber: '9876543210',
    address: 'Plot 12, MIDC Phase 2, near Ajanta Road',
    city: 'Jalgaon',
    state: 'Maharashtra',
    pinCode: '425001',
    location: '19.8765, 75.3421',
    yearsOfExperience: '5',
    businessDescription: 'We provide complete two-wheeler servicing, engine repair, washing, insurance assistance and roadside support.',
    mainCategory: 'Garage',
    subcategory: 'General Repair',
    startingPrice: '199',
    inspectionCharges: '99',
    visitingCharges: '149',
    emergencyCharges: '299',
    verificationStatus: 'Verified',
    documents: {
      businessRegistration: 'registration_cert.pdf',
      udyamRegistration: 'udyam_cert.pdf',
      shopActLicense: 'shop_act_license.pdf',
      businessPan: 'pan_card.jpg',
      governmentId: 'aadhaar_proof.pdf',
    },
    logo: 'https://images.unsplash.com/photo-1619642e1cd6c?w=150',
    ownerPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    coverImage: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=800',
    gallery: [
      'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=400',
      'https://images.unsplash.com/photo-1619642e1cd6c?w=400',
    ],
    certificates: [],
  },
  'crystalwash@gmail.com': {
    vendorId: 'VND-4091',
    businessId: 'BIZ-2041',
    businessName: 'Crystal Detail Wash',
    ownerName: 'Sameer Patil',
    businessEmail: 'crystalwash@gmail.com',
    mobileNumber: '8876543211',
    whatsAppNumber: '8876543211',
    address: 'Near Old Highway Naka, opposite petrol pump',
    city: 'Jalgaon',
    state: 'Maharashtra',
    pinCode: '425002',
    location: '19.8790, 75.3450',
    yearsOfExperience: '3',
    businessDescription: 'Professional car washing, interior detailing, foam wash, vacuum cleaner deep cleaning, and polishing.',
    mainCategory: 'Car Wash',
    subcategory: 'Exterior Wash',
    startingPrice: '299',
    inspectionCharges: '0',
    visitingCharges: '0',
    emergencyCharges: '0',
    verificationStatus: 'Verified',
    documents: {
      businessRegistration: 'registration_cert.pdf',
      udyamRegistration: 'udyam_cert.pdf',
      shopActLicense: 'shop_act_license.pdf',
      businessPan: 'pan_card.jpg',
      governmentId: 'aadhaar_proof.pdf',
    },
    logo: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=150',
    ownerPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    coverImage: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=800',
    gallery: [],
    certificates: [],
  },
  'rescue247@gmail.com': {
    vendorId: 'VND-9921',
    businessId: 'BIZ-1083',
    businessName: 'Rescue 24/7 Towing',
    ownerName: 'Amit Kulkarni',
    businessEmail: 'rescue247@gmail.com',
    mobileNumber: '7776543212',
    whatsAppNumber: '7776543212',
    address: 'Shop 4, Highway Plaza, bypass corner',
    city: 'Jalgaon',
    state: 'Maharashtra',
    pinCode: '425003',
    location: '19.8805, 75.3490',
    yearsOfExperience: '8',
    businessDescription: 'Quick hydraulic flatbed towing service. 24/7 support for breakdown, accident recovery, and long-distance transport.',
    mainCategory: 'Towing',
    subcategory: 'Flatbed Towing',
    startingPrice: '499',
    inspectionCharges: '199',
    visitingCharges: '249',
    emergencyCharges: '499',
    verificationStatus: 'Verified',
    documents: {
      businessRegistration: 'registration_cert.pdf',
      udyamRegistration: 'udyam_cert.pdf',
      shopActLicense: 'shop_act_license.pdf',
      businessPan: 'pan_card.jpg',
      governmentId: 'aadhaar_proof.pdf',
    },
    logo: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=150',
    ownerPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    coverImage: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
    gallery: [],
    certificates: [],
  },
};

const VendorProfileContext = createContext<VendorProfileContextType | undefined>(undefined);

export const VendorProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<VendorProfile | null>(null);
  const [profiles, setProfiles] = useState<{ [email: string]: VendorProfile }>(preSavedProfiles);

  const login = async (email: string): Promise<boolean> => {
    const cleanEmail = email.trim().toLowerCase();
    if (profiles[cleanEmail]) {
      setProfile(profiles[cleanEmail]);
      return true;
    }
    return false;
  };

  const signup = async (details: Partial<VendorProfile>) => {
    const cleanEmail = details.businessEmail?.trim().toLowerCase() || '';
    const newProfile: VendorProfile = {
      vendorId: `VND-${Math.floor(1000 + Math.random() * 9000)}`,
      businessId: `BIZ-${Math.floor(1000 + Math.random() * 9000)}`,
      businessName: details.businessName || '',
      ownerName: details.ownerName || '',
      businessEmail: cleanEmail,
      mobileNumber: details.mobileNumber || '',
      whatsAppNumber: details.whatsAppNumber || details.mobileNumber || '',
      password: details.password || '',
      address: details.address || '',
      city: details.city || 'Jalgaon',
      state: details.state || 'Maharashtra',
      pinCode: details.pinCode || '',
      location: details.location || '📍 GPS Coordinates (Set)',
      yearsOfExperience: details.yearsOfExperience || '1',
      businessDescription: details.businessDescription || '',
      mainCategory: details.mainCategory || 'Garage',
      subcategory: details.subcategory || '',
      startingPrice: details.startingPrice || '',
      inspectionCharges: details.inspectionCharges || '',
      visitingCharges: details.visitingCharges || '',
      emergencyCharges: details.emergencyCharges || '',
      verificationStatus: 'Pending Verification',
      documents: details.documents || {},
      logo: details.logo || '',
      ownerPhoto: details.ownerPhoto || '',
      coverImage: details.coverImage || '',
      gallery: details.gallery || [],
      certificates: details.certificates || [],
    };

    setProfiles((prev) => ({ ...prev, [cleanEmail]: newProfile }));
    setProfile(newProfile);
  };

  const updateProfile = async (updates: Partial<VendorProfile>) => {
    if (!profile) return;
    const updated = { ...profile, ...updates };
    setProfile(updated);
    setProfiles((prev) => ({ ...prev, [profile.businessEmail.toLowerCase()]: updated }));
  };

  const uploadDocument = async (key: keyof VendorProfile['documents'], fileName: string) => {
    if (!profile) return;
    const updatedDocs = { ...profile.documents, [key]: fileName };
    updateProfile({ documents: updatedDocs });
  };

  const deleteDocument = async (key: keyof VendorProfile['documents']) => {
    if (!profile) return;
    const updatedDocs = { ...profile.documents };
    delete updatedDocs[key];
    updateProfile({ documents: updatedDocs });
  };

  const uploadPhoto = async (key: 'logo' | 'ownerPhoto' | 'coverImage', fileName: string) => {
    updateProfile({ [key]: fileName });
  };

  const uploadGalleryImage = async (fileName: string) => {
    if (!profile) return;
    updateProfile({ gallery: [...profile.gallery, fileName] });
  };

  const deleteGalleryImage = async (index: number) => {
    if (!profile) return;
    const nextGallery = [...profile.gallery];
    nextGallery.splice(index, 1);
    updateProfile({ gallery: nextGallery });
  };

  const simulateAdminApproval = () => {
    if (!profile) return;
    updateProfile({ verificationStatus: 'Verified' });
  };

  const getMissingFields = (): string[] => {
    if (!profile) return [];
    const missing: string[] = [];
    if (!profile.businessName) missing.push('Business Name');
    if (!profile.address) missing.push('Business Address');
    if (!profile.pinCode) missing.push('PIN Code');
    if (!profile.businessDescription || profile.businessDescription.length < 50) missing.push('Detailed Description (min 50 chars)');
    if (!profile.startingPrice) missing.push('Starting Price');
    if (!profile.inspectionCharges) missing.push('Inspection Charges');
    if (!profile.subcategory) missing.push('Business Subcategory');
    if (!profile.logo) missing.push('Business Logo');
    if (!profile.ownerPhoto) missing.push('Owner Photo');
    if (!profile.coverImage) missing.push('Cover Image');
    
    // Mandatory docs
    const mandatoryDocs: (keyof VendorProfile['documents'])[] = [
      'businessRegistration',
      'udyamRegistration',
      'shopActLicense',
      'businessPan',
      'governmentId',
    ];
    mandatoryDocs.forEach((docKey) => {
      if (!profile.documents[docKey]) {
        const docLabel = docKey.replace(/([A-Z])/g, ' $1');
        missing.push(`Document: ${docLabel.charAt(0).toUpperCase() + docLabel.slice(1)}`);
      }
    });

    return missing;
  };

  const getCompletionPercentage = (): number => {
    if (!profile) return 0;
    
    let score = 0;
    
    // 1. Basics (Owner, Email, Mobile, Main Category): 25% (always filled at signup)
    if (profile.ownerName && profile.businessEmail && profile.mobileNumber && profile.mainCategory) {
      score += 25;
    }

    // 2. Business Details (Business Name, Address, City, State, Experience, WhatsApp): 15%
    let detailsCount = 0;
    if (profile.businessName) detailsCount++;
    if (profile.address) detailsCount++;
    if (profile.whatsAppNumber) detailsCount++;
    if (profile.yearsOfExperience) detailsCount++;
    if (profile.pinCode) detailsCount++;
    score += Math.round((detailsCount / 5) * 15);

    // 3. Description (min 50 chars): 10%
    if (profile.businessDescription && profile.businessDescription.length >= 50) {
      score += 10;
    }

    // 4. Base Pricing (Starting Service Price & Inspection Charges): 15%
    let pricingCount = 0;
    if (profile.startingPrice) pricingCount++;
    if (profile.inspectionCharges) pricingCount++;
    score += Math.round((pricingCount / 2) * 15);

    // 5. Profile Photos (Logo, Owner Photo, Cover Image): 15%
    let photosCount = 0;
    if (profile.logo) photosCount++;
    if (profile.ownerPhoto) photosCount++;
    if (profile.coverImage) photosCount++;
    score += Math.round((photosCount / 3) * 15);

    // 6. Mandatory Documents: 20%
    let docsCount = 0;
    const mandatoryDocs: (keyof VendorProfile['documents'])[] = [
      'businessRegistration',
      'udyamRegistration',
      'shopActLicense',
      'businessPan',
      'governmentId',
    ];
    mandatoryDocs.forEach((docKey) => {
      if (profile.documents[docKey]) docsCount++;
    });
    score += Math.round((docsCount / mandatoryDocs.length) * 20);

    return Math.min(score, 100);
  };

  const logout = () => {
    setProfile(null);
  };

  return (
    <VendorProfileContext.Provider
      value={{
        profile,
        profiles,
        login,
        signup,
        updateProfile,
        uploadDocument,
        deleteDocument,
        uploadPhoto,
        uploadGalleryImage,
        deleteGalleryImage,
        simulateAdminApproval,
        getCompletionPercentage,
        getMissingFields,
        logout,
      }}
    >
      {children}
    </VendorProfileContext.Provider>
  );
};

export const useVendorProfile = () => {
  const context = useContext(VendorProfileContext);
  if (context === undefined) {
    throw new Error('useVendorProfile must be used within a VendorProfileProvider');
  }
  return context;
};
