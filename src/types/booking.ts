export interface Package {
    id: string;
    description: string;
    quantity: number;
    category: string;
    weight: number;
    sender_userId: string;
    reservationId: string;
    imageFile: string | null;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface BookingDetails {
    id: string;
    userId: string;
    additionalInfo: string;
    shippingDate: string;
    status: 'PENDING' | 'CONFIRMED' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';
    createdAt: string;
    updatedAt: string;
    departureLocation: {
      city: string;
      district: string;
      preciseLocation: string;
    };
    arrivalLocation: {
      city: string;
      district: string;
      preciseLocation: string;
    };
    senderContact: {
      fullName: string;
      phoneNumber: string;
    };
    receiverContact: {
      fullName: string;
      phoneNumber: string;
    };
    packages: Package[];
  }
  