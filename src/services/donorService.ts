import { Donor, BloodRequest } from '../types';

// Mock collections
let donors: Donor[] = [];
let requests: BloodRequest[] = [];

export const donorService = {
  async registerDonor(donor: Omit<Donor, 'id'>): Promise<Donor> {
    try {
      const response = await fetch('/api/donors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(donor)
      });
      return await response.json();
    } catch (error) {
      console.error('Failed to register donor:', error);
      throw error;
    }
  },

  async getNearbyDonors(): Promise<Donor[]> {
    try {
      const response = await fetch('/api/donors');
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch donors:', error);
      return [];
    }
  },

  async createRequest(request: any): Promise<any> {
    try {
      const response = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...request,
          lat: 12.9716, // Default to Bangalore for simulation
          lng: 77.5946
        })
      });
      return await response.json();
    } catch (error) {
      console.error('Failed to create request:', error);
      throw error;
    }
  },

  async getRequests(): Promise<BloodRequest[]> {
    try {
      const response = await fetch('/api/requests');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to fetch requests:', error);
      return [];
    }
  }
};
