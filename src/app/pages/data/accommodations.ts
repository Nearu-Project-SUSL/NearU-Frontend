export type AccommodationType = "Boarding" | "Annex" | "Apartment";

export interface Accommodation {
    id: string;
    title: string;
    type: AccommodationType;
    image: string;
    location: string;
    distanceKm: number;
    rating: number;
    reviews: number;
    description: string;
    amenities: string[];
    monthlyRent: number;
    availableBeds: number;
    contactPhone: string;
}

export const accommodations: Accommodation[] = [
    {
        id: "sunrise-annex",
        title: "Sunrise Student Annex",
        type: "Annex",
        image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1400&q=80",
        location: "Colombo 6",
        distanceKm: 1.4,
        rating: 4.7,
        reviews: 126,
        description:
            "Secure student annex with study-friendly common areas, high-speed Wi-Fi, and easy transport access to campus.",
        amenities: ["Wi-Fi", "Laundry", "Study Room", "CCTV", "Kitchen Access"],
        monthlyRent: 38000,
        availableBeds: 6,
        contactPhone: "+94771234567",
    },
    {
        id: "lakeview-boarding",
        title: "Lakeview Boarding House",
        type: "Boarding",
        image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80",
        location: "Nugegoda",
        distanceKm: 2.1,
        rating: 4.5,
        reviews: 89,
        description:
            "Affordable boarding option with meals, weekly cleaning, and a quiet neighborhood ideal for student living.",
        amenities: ["Meals Included", "Cleaning", "Wi-Fi", "Parking", "24/7 Water"],
        monthlyRent: 32000,
        availableBeds: 4,
        contactPhone: "+94772345678",
    },
    {
        id: "city-park-apartment",
        title: "City Park Apartment",
        type: "Apartment",
        image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1400&q=80",
        location: "Rajagiriya",
        distanceKm: 3.3,
        rating: 4.8,
        reviews: 64,
        description:
            "Modern shared apartment with spacious rooms, backup power, and all utilities included in one student package.",
        amenities: ["A/C", "Backup Power", "Gym Access", "Hot Water", "Wi-Fi"],
        monthlyRent: 52000,
        availableBeds: 3,
        contactPhone: "+94773456789",
    },
];
