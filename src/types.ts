export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export interface Donor {
  id: string;
  fullName: string;
  phoneNumber: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: BloodGroup;
  district: string;
  city: string;
  lastDonationDate: string; // ISO string
  isAvailable: boolean;
  location?: {
    lat: number;
    lng: number;
  };
}

export interface BloodRequest {
  id: string;
  patientName: string;
  phoneNumber: string;
  bloodGroup: BloodGroup;
  hospitalName: string;
  location: string;
  unitsRequired: number;
  isEmergency: boolean;
  timestamp: string;
  status: 'pending' | 'accepted' | 'completed';
  requesterType: 'Hospital' | 'Patient';
  acceptedBy?: string; // donorName
  distance?: number; // in KM
}
