import type { Stay } from '@/types'

export const mockStays: Stay[] = [
  {
    id: 's1', title: 'Greenleaf PG for Women', area: 'Koramangala', city: 'Bengaluru', type: 'PG', genderPolicy: 'Women',
    rent: 11500, rating: 4.6, reviewCount: 128, verified: true,
    amenities: ['Wi-Fi', 'Meals included', 'Laundry', 'Power backup', 'CCTV', 'Housekeeping'],
    distanceNote: '12 min walk to Forum Mall, 5 min to bus stop',
    description: 'A quiet, well-managed women-only PG in the heart of Koramangala with home-style meals and 24x7 security.',
    roomTypes: [
      { id: 's1r1', name: 'Single occupancy', occupancy: 1, rent: 16000 },
      { id: 's1r2', name: 'Double sharing', occupancy: 2, rent: 11500 },
      { id: 's1r3', name: 'Triple sharing', occupancy: 3, rent: 9000 },
    ],
  },
  {
    id: 's2', title: 'The Nest Co-living', area: 'Indiranagar', city: 'Bengaluru', type: 'Co-living', genderPolicy: 'Unisex',
    rent: 17500, rating: 4.4, reviewCount: 96, verified: true,
    amenities: ['Wi-Fi', 'Gym', 'Common kitchen', 'Weekly cleaning', 'Community events', 'Power backup'],
    distanceNote: '8 min walk to Indiranagar metro',
    description: 'Furnished co-living with a community feel: shared kitchen, rooftop lounge and flexible monthly terms.',
    roomTypes: [
      { id: 's2r1', name: 'Private room', occupancy: 1, rent: 24000 },
      { id: 's2r2', name: 'Twin sharing', occupancy: 2, rent: 17500 },
    ],
  },
  {
    id: 's3', title: 'Scholars Hostel', area: 'Gachibowli', city: 'Hyderabad', type: 'Hostel', genderPolicy: 'Men',
    rent: 6500, rating: 4.1, reviewCount: 212, verified: true,
    amenities: ['Wi-Fi', 'Meals included', 'Study room', 'Laundry', 'Hot water'],
    distanceNote: '10 min to IIIT Hyderabad, 15 min to DLF Cyber City',
    description: 'Budget-friendly hostel close to campuses and tech parks, with a dedicated study room and mess.',
    roomTypes: [
      { id: 's3r1', name: 'Double sharing', occupancy: 2, rent: 7500 },
      { id: 's3r2', name: 'Four-bed dorm', occupancy: 4, rent: 6500 },
    ],
  },
  {
    id: 's4', title: 'Lakeview 2BHK Flat', area: 'Madhapur', city: 'Hyderabad', type: 'Flat', genderPolicy: 'Unisex',
    rent: 26000, rating: 4.5, reviewCount: 31, verified: true,
    amenities: ['Wi-Fi ready', 'Modular kitchen', 'Parking', 'Lift', 'Balcony', 'Security'],
    distanceNote: '6 min to HITEC City, close to Durgam Cheruvu',
    description: 'Semi-furnished 2BHK with a lake-facing balcony. Ideal for two professionals sharing rent.',
    roomTypes: [{ id: 's4r1', name: 'Entire flat (2 BHK)', occupancy: 2, rent: 26000 }],
  },
  {
    id: 's5', title: 'Hinjewadi Shared Rooms', area: 'Hinjewadi Phase 1', city: 'Pune', type: 'Shared room', genderPolicy: 'Men',
    rent: 7000, rating: 4.0, reviewCount: 87, verified: false,
    amenities: ['Wi-Fi', 'Laundry', 'Power backup', 'Housekeeping'],
    distanceNote: '5 min to IT park shuttle point',
    description: 'Clean and affordable shared rooms for working professionals right next to the IT park.',
    roomTypes: [
      { id: 's5r1', name: 'Double sharing', occupancy: 2, rent: 8000 },
      { id: 's5r2', name: 'Triple sharing', occupancy: 3, rent: 7000 },
    ],
  },
  {
    id: 's6', title: 'Powai Private Studio', area: 'Powai', city: 'Mumbai', type: 'Private room', genderPolicy: 'Unisex',
    rent: 22000, rating: 4.3, reviewCount: 44, verified: true,
    amenities: ['Wi-Fi', 'AC', 'Attached bath', 'Housekeeping', 'Lift', 'CCTV'],
    distanceNote: '7 min to Hiranandani, 20 min to Andheri',
    description: 'A private furnished room with an attached bath in a gated society overlooking Powai Lake.',
    roomTypes: [{ id: 's6r1', name: 'Private room', occupancy: 1, rent: 22000 }],
  },
  {
    id: 's7', title: 'Sector 62 Women’s PG', area: 'Sector 62, Noida', city: 'Delhi NCR', type: 'PG', genderPolicy: 'Women',
    rent: 9500, rating: 4.4, reviewCount: 156, verified: true,
    amenities: ['Wi-Fi', 'Meals included', 'AC rooms', 'Laundry', 'CCTV', 'Biometric entry'],
    distanceNote: '4 min to Noida Sector 62 metro',
    description: 'Safe and comfortable PG with biometric entry and home-cooked meals, near the Sector 62 metro.',
    roomTypes: [
      { id: 's7r1', name: 'Single occupancy', occupancy: 1, rent: 14000 },
      { id: 's7r2', name: 'Double sharing', occupancy: 2, rent: 9500 },
    ],
  },
  {
    id: 's8', title: 'OMR Co-living Hub', area: 'Perungudi, OMR', city: 'Chennai', type: 'Co-living', genderPolicy: 'Unisex',
    rent: 12500, rating: 4.2, reviewCount: 63, verified: false,
    amenities: ['Wi-Fi', 'Gym', 'Common kitchen', 'Housekeeping', 'Power backup'],
    distanceNote: '10 min to Tidel Park, bus stop at the gate',
    description: 'Modern co-living along OMR for professionals and students with flexible rental terms.',
    roomTypes: [
      { id: 's8r1', name: 'Private room', occupancy: 1, rent: 17000 },
      { id: 's8r2', name: 'Twin sharing', occupancy: 2, rent: 12500 },
    ],
  },
]
