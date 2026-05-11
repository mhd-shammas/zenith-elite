export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  location: string;
  latitude?: number;
  longitude?: number;
  image: string;
  type: 'Sedan' | 'SUV' | 'Coupe' | 'Truck' | 'Lux';
  transmission: 'Automatic' | 'Manual';
  fuelType: 'Gas' | 'Electric' | 'Hybrid';
  description?: string;
  vin?: string;
  status: 'Available' | 'Sold' | 'Pending';
  sellerName: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  carId?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  verified: boolean;
  plan: 'Basic' | 'Diamond';
  role: 'Customer' | 'Admin';
}

export interface ListingRequest {
  id: string;
  carId: string;
  sellerId: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  timestamp: string;
  type: 'Sell' | 'VerifyAccount';
}
