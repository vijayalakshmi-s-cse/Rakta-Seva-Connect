import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Database
  let mockDonors: any[] = [
    { id: '1', name: 'Arjun Mehra', bloodGroup: 'O+', lat: 12.9716, lng: 77.5946, isAvailable: true, distance: 2.1, lastDonatedAt: '2025-01-10T10:00:00Z' }, 
    { id: '2', name: 'Lata Mangeshkar', bloodGroup: 'A+', lat: 12.9352, lng: 77.6245, isAvailable: true, distance: 5.4, lastDonatedAt: null },
    { id: '3', name: 'Rajesh Khanna', bloodGroup: 'B+', lat: 12.9562, lng: 77.7011, isAvailable: true, distance: 3.8, lastDonatedAt: '2026-05-01T10:00:00Z' }, // Recent donation (within 90 days)
    { id: '4', name: 'Amitabh Bachchan', bloodGroup: 'O-', lat: 12.9279, lng: 77.6271, isAvailable: true, distance: 6.2, lastDonatedAt: null },
    { id: '5', name: 'Deepika Padukone', bloodGroup: 'AB+', lat: 12.9902, lng: 77.5844, isAvailable: true, distance: 1.5, lastDonatedAt: null },
    { id: '6', name: 'Shah Rukh Khan', bloodGroup: 'A-', lat: 12.9611, lng: 77.6412, isAvailable: true, distance: 4.1, lastDonatedAt: null },
    { id: '7', name: 'Priyanka Chopra', bloodGroup: 'B-', lat: 13.0122, lng: 77.5511, isAvailable: true, distance: 8.9, lastDonatedAt: null },
    { id: '8', name: 'Ranbir Kapoor', bloodGroup: 'O+', lat: 12.9144, lng: 77.6101, isAvailable: true, distance: 7.3, lastDonatedAt: '2026-04-15T10:00:00Z' }, // Recent donation
    { id: '9', name: 'Alia Bhatt', bloodGroup: 'AB-', lat: 12.9788, lng: 77.6355, isAvailable: true, distance: 3.2, lastDonatedAt: null },
    { id: '10', name: 'Salman Khan', bloodGroup: 'B+', lat: 12.9400, lng: 77.5400, isAvailable: true, distance: 5.0, lastDonatedAt: null },
    { id: '11', name: 'Kareena Kapoor', bloodGroup: 'A+', lat: 12.9800, lng: 77.6700, isAvailable: true, distance: 2.8, lastDonatedAt: null },
    { id: '12', name: 'Virat Kohli', bloodGroup: 'O+', lat: 12.9000, lng: 77.5000, isAvailable: true, distance: 12.4, lastDonatedAt: null },
    { id: '13', name: 'Mahendra Singh Dhoni', bloodGroup: 'B+', lat: 13.0500, lng: 77.6000, isAvailable: true, distance: 9.6, lastDonatedAt: null },
    { id: '14', name: 'Sachin Tendulkar', bloodGroup: 'A-', lat: 12.9500, lng: 77.5500, isAvailable: true, distance: 4.5, lastDonatedAt: null },
    { id: '15', name: 'Mithali Raj', bloodGroup: 'AB+', lat: 12.9300, lng: 77.6000, isAvailable: true, distance: 5.1, lastDonatedAt: null },
    { id: '16', name: 'Saina Nehwal', bloodGroup: 'O+', lat: 12.9200, lng: 77.6500, isAvailable: true, distance: 6.8, lastDonatedAt: null },
    { id: '17', name: 'Rohit Sharma', bloodGroup: 'B-', lat: 12.9900, lng: 77.7200, isAvailable: true, distance: 9.2, lastDonatedAt: null },
    { id: '18', name: 'P.V. Sindhu', bloodGroup: 'O-', lat: 13.0300, lng: 77.5800, isAvailable: true, distance: 7.5, lastDonatedAt: null },
    { id: '19', name: 'Sunil Chhetri', bloodGroup: 'A+', lat: 12.9400, lng: 77.6100, isAvailable: true, distance: 3.9, lastDonatedAt: null },
    { id: '20', name: 'Neeraj Chopra', bloodGroup: 'O+', lat: 12.9600, lng: 77.5700, isAvailable: true, distance: 2.4, lastDonatedAt: null },
    { id: '21', name: 'Mirabai Chanu', bloodGroup: 'B+', lat: 12.9800, lng: 77.5200, isAvailable: true, distance: 11.1, lastDonatedAt: null },
    { id: '22', name: 'Mary Kom', bloodGroup: 'A-', lat: 13.0000, lng: 77.6800, isAvailable: true, distance: 10.5, lastDonatedAt: null },
  ];

  let mockRequests: any[] = [
    { id: 'r1', patientName: 'Rahul Sharma', phoneNumber: '9876543210', bloodGroup: 'O+', hospitalName: 'Apollo Hospital', location: 'Bannerghatta Road', distance: 1.2, timestamp: new Date(Date.now() - 600000).toISOString(), isEmergency: true, requesterType: 'Hospital', units: 2 },
    { id: 'r2', patientName: 'Priya Patel', phoneNumber: '9876543211', bloodGroup: 'AB-', hospitalName: 'Manipal Hospital', location: 'Old Airport Road', distance: 3.5, timestamp: new Date(Date.now() - 1500000).toISOString(), isEmergency: true, requesterType: 'Patient', units: 1 },
    { id: 'r3', patientName: 'Amit Kumar', phoneNumber: '9876543212', bloodGroup: 'B+', hospitalName: 'Fortis Hospital', location: 'Cunningham Road', distance: 2.8, timestamp: new Date(Date.now() - 2400000).toISOString(), isEmergency: true, requesterType: 'Hospital', units: 3 },
    { id: 'r4', patientName: 'Sneha Gupta', phoneNumber: '9876543213', bloodGroup: 'A-', hospitalName: 'St. Johns Hospital', location: 'Koramangala', distance: 4.2, timestamp: new Date(Date.now() - 3600000).toISOString(), isEmergency: true, requesterType: 'Patient', units: 2 },
    { id: 'r5', patientName: 'Vikram Singh', phoneNumber: '9876543214', bloodGroup: 'O-', hospitalName: 'Aster CMI', location: 'Hebbal', distance: 8.1, timestamp: new Date(Date.now() - 4800000).toISOString(), isEmergency: false, requesterType: 'Hospital', units: 1 },
    { id: 'r6', patientName: 'Ananya Rao', phoneNumber: '9876543215', bloodGroup: 'B-', hospitalName: 'Columbia Asia', location: 'Whitefield', distance: 12.5, timestamp: new Date(Date.now() - 7200000).toISOString(), isEmergency: false, requesterType: 'Hospital', units: 4 },
    { id: 'r7', patientName: 'Karthik M', phoneNumber: '9876543216', bloodGroup: 'A+', hospitalName: 'Narayana Health', location: 'Electronic City', distance: 15.2, timestamp: new Date(Date.now() - 10800000).toISOString(), isEmergency: false, requesterType: 'Patient', units: 2 },
    { id: 'r8', patientName: 'Sanjay Dutt', phoneNumber: '9876543217', bloodGroup: 'AB+', hospitalName: 'Cloudnine Hospital', location: 'Jayanagar', distance: 5.4, timestamp: new Date(Date.now() - 14400000).toISOString(), isEmergency: false, requesterType: 'Hospital', units: 1 },
    { id: 'r9', patientName: 'Meera Bai', phoneNumber: '9876543218', bloodGroup: 'O+', hospitalName: 'Sakra World', location: 'Marathahalli', distance: 9.8, timestamp: new Date(Date.now() - 18000000).toISOString(), isEmergency: false, requesterType: 'Patient', units: 3 },
    { id: 'r10', patientName: 'Kabir Khan', phoneNumber: '9876543219', bloodGroup: 'B+', hospitalName: 'Baptist Hospital', location: 'Hebbal', distance: 7.6, timestamp: new Date(Date.now() - 21600000).toISOString(), isEmergency: false, requesterType: 'Hospital', units: 2 },
  ];

  app.get("/api/donors", (req, res) => {
    // Hide donors who donated within last 90 days
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const availableDonors = mockDonors.filter(donor => {
      if (!donor.lastDonatedAt) return true;
      const lastDonated = new Date(donor.lastDonatedAt);
      return lastDonated < ninetyDaysAgo;
    });

    res.json(availableDonors);
  });

  app.post("/api/donors", (req, res) => {
    const newDonor = {
      ...req.body,
      id: Math.random().toString(36).substr(2, 9),
      lat: req.body.lat || 12.9716,
      lng: req.body.lng || 77.5946
    };
    mockDonors.push(newDonor);
    res.status(201).json(newDonor);
  });

  // Helper for distance calculation (Haversine)
  function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  app.post("/api/requests", (req, res) => {
    const newRequest = {
      ...req.body,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      status: 'pending'
    };

    mockRequests.push(newRequest);

    // Filter matching donors within 10KM
    const matchingDonors = mockDonors.filter(donor => {
      const isBloodMatch = donor.bloodGroup === newRequest.bloodGroup;
      if (!isBloodMatch) return false;

      // Distance check
      const dist = getDistance(newRequest.lat || 12.97, newRequest.lng || 77.59, donor.lat, donor.lng);
      return dist <= 10;
    });

    // Simulate FCM Send
    console.log(`[FCM] Sending notifications for ${newRequest.isEmergency ? 'EMERGENCY' : 'Standard'} Request to ${matchingDonors.length} donors.`);
    matchingDonors.forEach(donor => {
      console.log(`[FCM] Sent to ${donor.name} (Token: ${donor.token}) - Msg: ${newRequest.bloodGroup} needed at ${newRequest.hospitalName}`);
    });

    res.status(201).json({ 
      request: newRequest, 
      notifiedDonorsCount: matchingDonors.length 
    });
  });

  app.get("/api/requests", (req, res) => {
    res.json(mockRequests);
  });
  
  app.post("/api/requests/:id/accept", (req, res) => {
    const { id } = req.params;
    const { donorName } = req.body;
    
    const request = mockRequests.find(r => r.id === id);
    if (!request) return res.status(404).json({ error: 'Request not found' });
    
    request.status = 'accepted';
    request.acceptedBy = donorName;
    
    // Simulate Alert to Requester
    console.log(`[ALERT] Sending SMS to Requester (${request.phoneNumber}): Donor ${donorName} has accepted your request for ${request.bloodGroup} at ${request.hospitalName}. Help is on the way!`);
    
    // Also find the donor and set their lastDonatedAt to now
    const donor = mockDonors.find(d => d.name === donorName);
    if (donor) {
      donor.lastDonatedAt = new Date().toISOString();
      donor.isAvailable = false;
    }
    
    res.json({ success: true, request });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
