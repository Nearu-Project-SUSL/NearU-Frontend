import axios from "./axios";
import type { Accommodation } from "../app/pages/data/accommodations";

const ACCOMMODATIONS_ENDPOINT = `/accommodations`;

interface ApiWrapper<T> {
    data?: T;
    message?: string;
    success?: boolean;
}

export interface AccommodationItem {
    id: string;
    name: string;
    description: string;
    price: number;
    isAvailable: boolean;
}

function unwrapResponse<T>(payload: unknown): T {
    const wrapped = payload as ApiWrapper<T> | T;

    if (wrapped && typeof wrapped === "object" && "data" in (wrapped as ApiWrapper<T>)) {
        return (wrapped as ApiWrapper<T>).data as T;
    }

    return wrapped as T;
}

function toAccommodationType(type: unknown): Accommodation["type"] {
    const value = String(type ?? "").toLowerCase();

    if (value === "boarding") {
        return "Boarding";
    }

    if (value === "annex") {
        return "Annex";
    }

    return "Apartment";
}

function mapAccommodation(raw: Record<string, unknown>, index: number): Accommodation {
    // Backend returns amenities as a List<string> array
    const amenitiesRaw = raw.amenities;
    const amenities = Array.isArray(amenitiesRaw)
        ? amenitiesRaw.map((item) => String(item)).filter((item) => item.length > 0)
        : [];

    const imagesRaw = raw.images;
    const imageFromArray = Array.isArray(imagesRaw) ? imagesRaw.find((img) => typeof img === "string") : undefined;

    // Backend uses `address` for location
    const locationParts = [raw.location, raw.address, raw.city].filter((item) => typeof item === "string").map(String);

    return {
        id: String(raw.id ?? raw.accommodationId ?? raw._id ?? `accommodation-${index}`),
        title: String(raw.title ?? raw.name ?? "Untitled Accommodation"),
        type: toAccommodationType(raw.type ?? raw.category),
        image: String(
            raw.photoUrl ??
                raw.image ??
                raw.imageUrl ??
                imageFromArray ??
                "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1400&q=80"
        ),
        location: locationParts.length > 0 ? locationParts.join(", ") : "Location not specified",
        distanceKm: Number(raw.distanceKm ?? raw.distance ?? 0),
        rating: Number(raw.rating ?? raw.averageRating ?? 0),
        reviews: Number(raw.reviews ?? raw.reviewCount ?? 0),
        description: String(raw.description ?? "No description available."),
        amenities,
        monthlyRent: Number(raw.monthlyRent ?? raw.rent ?? raw.price ?? 0),
        availableBeds: Number(raw.availableBeds ?? raw.bedsAvailable ?? 0),
        // Backend stores as phoneNumber (camelCase in JSON)
        contactPhone: String(raw.phoneNumber ?? raw.contactPhone ?? raw.phone ?? raw.ownerPhone ?? ""),
    };
}

function mapAccommodationItem(raw: Record<string, unknown>, index: number): AccommodationItem {
    return {
        id: String(raw.id ?? raw.itemId ?? raw._id ?? `item-${index}`),
        name: String(raw.name ?? raw.title ?? "Item"),
        description: String(raw.description ?? ""),
        price: Number(raw.price ?? raw.amount ?? 0),
        isAvailable: Boolean(raw.isAvailable ?? raw.available ?? true),
    };
}

export const fetchAccommodations = async (): Promise<Accommodation[]> => {
    const response = await axios.get<unknown>(ACCOMMODATIONS_ENDPOINT);
    const payload = unwrapResponse<unknown>(response.data);
    const rows = Array.isArray(payload) ? payload : [];

    return rows.map((row, index) => mapAccommodation(row as Record<string, unknown>, index));
};

export const getAccommodationById = async (id: string): Promise<Accommodation> => {
    const response = await axios.get<unknown>(`${ACCOMMODATIONS_ENDPOINT}/${encodeURIComponent(id)}`);
    const payload = unwrapResponse<Record<string, unknown>>(response.data);
    return mapAccommodation(payload, 0);
};

export const createAccommodation = async (data: FormData): Promise<Accommodation> => {
    const response = await axios.post<unknown>(ACCOMMODATIONS_ENDPOINT, data);
    const payload = unwrapResponse<Record<string, unknown>>(response.data);
    return mapAccommodation(payload, 0);
};

export const updateAccommodation = async (id: string, data: FormData): Promise<Accommodation> => {
    const response = await axios.put<unknown>(`${ACCOMMODATIONS_ENDPOINT}/${encodeURIComponent(id)}`, data);
    const payload = unwrapResponse<Record<string, unknown>>(response.data);
    return mapAccommodation(payload, 0);
};

export const deleteAccommodation = async (id: string): Promise<void> => {
    await axios.delete(`${ACCOMMODATIONS_ENDPOINT}/${encodeURIComponent(id)}`);
};

export const fetchAccommodationItems = async (accommodationId: string): Promise<AccommodationItem[]> => {
    const endpoint = `${ACCOMMODATIONS_ENDPOINT}/${encodeURIComponent(accommodationId)}/items`;
    const response = await axios.get<unknown>(endpoint);
    const payload = unwrapResponse<unknown>(response.data);
    const rows = Array.isArray(payload) ? payload : [];

    return rows.map((row, index) => mapAccommodationItem(row as Record<string, unknown>, index));
};

export const getAccommodationItemById = async (accommodationId: string, itemId: string): Promise<AccommodationItem> => {
    const endpoint = `${ACCOMMODATIONS_ENDPOINT}/${encodeURIComponent(accommodationId)}/items/${encodeURIComponent(itemId)}`;
    const response = await axios.get<unknown>(endpoint);
    const payload = unwrapResponse<Record<string, unknown>>(response.data);
    return mapAccommodationItem(payload, 0);
};

export const createAccommodationItem = async (accommodationId: string, data: FormData): Promise<AccommodationItem> => {
    const endpoint = `${ACCOMMODATIONS_ENDPOINT}/${encodeURIComponent(accommodationId)}/items`;
    const response = await axios.post<unknown>(endpoint, data);
    const payload = unwrapResponse<Record<string, unknown>>(response.data);
    return mapAccommodationItem(payload, 0);
};

export const updateAccommodationItem = async (accommodationId: string, itemId: string, data: FormData): Promise<AccommodationItem> => {
    const endpoint = `${ACCOMMODATIONS_ENDPOINT}/${encodeURIComponent(accommodationId)}/items/${encodeURIComponent(itemId)}`;
    const response = await axios.put<unknown>(endpoint, data);
    const payload = unwrapResponse<Record<string, unknown>>(response.data);
    return mapAccommodationItem(payload, 0);
};

export const deleteAccommodationItem = async (accommodationId: string, itemId: string): Promise<void> => {
    const endpoint = `${ACCOMMODATIONS_ENDPOINT}/${encodeURIComponent(accommodationId)}/items/${encodeURIComponent(itemId)}`;
    await axios.delete(endpoint);
};

const accommodationService = {
    fetchAccommodations,
    getAccommodationById,
    createAccommodation,
    updateAccommodation,
    deleteAccommodation,
    fetchAccommodationItems,
    getAccommodationItemById,
    createAccommodationItem,
    updateAccommodationItem,
    deleteAccommodationItem,
};

export default accommodationService;
