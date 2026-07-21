import { Platform } from 'react-native';

let memoryVehicles: any[] = [];
let memoryDocuments: any[] = [];

export async function saveVehiclesToStorage(vehicles: any[]): Promise<void> {
  memoryVehicles = [...vehicles];
  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.setItem('roadmate_vehicles', JSON.stringify(vehicles));
    } catch (e) {
      console.warn('Failed to save to localStorage', e);
    }
  }
}

export async function loadVehiclesFromStorage(defaultVehicles: any[]): Promise<any[]> {
  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
    try {
      const data = window.localStorage.getItem('roadmate_vehicles');
      if (data) {
        memoryVehicles = JSON.parse(data);
        return memoryVehicles;
      }
    } catch (e) {
      console.warn('Failed to load from localStorage', e);
    }
  }
  if (memoryVehicles.length === 0) {
    memoryVehicles = [...defaultVehicles];
  }
  return memoryVehicles;
}

export async function saveDocumentsToStorage(documents: any[]): Promise<void> {
  memoryDocuments = [...documents];
  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.setItem('roadmate_documents', JSON.stringify(documents));
    } catch (e) {
      console.warn('Failed to save documents to localStorage', e);
    }
  }
}

export async function loadDocumentsFromStorage(defaultDocs: any[]): Promise<any[]> {
  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
    try {
      const data = window.localStorage.getItem('roadmate_documents');
      if (data) {
        memoryDocuments = JSON.parse(data);
        return memoryDocuments;
      }
    } catch (e) {
      console.warn('Failed to load documents from localStorage', e);
    }
  }
  if (memoryDocuments.length === 0) {
    memoryDocuments = [...defaultDocs];
  }
  return memoryDocuments;
}
