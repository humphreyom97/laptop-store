/**
 * @file api.ts
 * @description API service functions for interacting with the laptop inventory backend.
 */

import { API_BASE_URL } from "../config";
import { Laptop } from "../types"; // Adjust path based on your structure

// Define types for filters and API responses
interface Filters {
  [key: string]: string; // Generic key-value pairs for query filters
}

interface PaginatedResponse {
  rows: Laptop[];
  totalRows: number;
  page: number;
  pageSize: number;
}

// Helper function to filter out null/undefined values and ensure string values
const createQueryParams = (params: Record<string, string | number | null | undefined>): string => {
  const validParams: Record<string, string> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value !== null && value !== undefined) {
      validParams[key] = String(value);
    }
  }
  return new URLSearchParams(validParams).toString();
};

// Fetch laptops with pagination, sorting, and filtering
export const fetchLaptops = async (
  page: number,
  pageSize: number,
  sortField: string | null,
  sortOrder: 'asc' | 'desc' | null,
  filters: Filters
): Promise<PaginatedResponse> => {
  const backendPage = page + 1;
  const query = createQueryParams({
    page: backendPage,
    pageSize,
    sortField,
    sortOrder,
    ...filters,
  });

  try {
    const response = await fetch(`${API_BASE_URL}?${query}`);
    if (!response.ok) {
      throw new Error(
        `Unable to load laptop inventory due to server error (${response.status}).`
      );
    }
    return response.json() as Promise<PaginatedResponse>;
  } catch (err) {
    throw new Error(
      err instanceof Error && err.message.includes("fetch")
        ? "Unable to load laptop inventory. Please check your connection or try again later."
        : err instanceof Error
        ? err.message
        : "An unknown error occurred"
    );
  }
};

// Decommission or reactivate a laptop
export const decommissionLaptop = async (
  id: string,
  status: 'Active' | 'Decommissioned'
): Promise<Laptop> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) {
      throw new Error(
        `Unable to ${status === 'Decommissioned' ? 'decommission' : 'reactivate'} laptop. Please try again.`
      );
    }
    return response.json() as Promise<Laptop>;
  } catch (err) {
    throw new Error(
      err instanceof Error && err.message.includes("fetch")
        ? `Unable to ${status === 'Decommissioned' ? 'decommission' : 'reactivate'} laptop. Please check your connection or try again later.`
        : err instanceof Error
        ? err.message
        : "An unknown error occurred"
    );
  }
};

// Fetch all laptops without pagination
export const fetchAllLaptops = async (
  sortField: string | null,
  sortOrder: 'asc' | 'desc' | null,
  filters: Filters
): Promise<Laptop[]> => {
  const query = createQueryParams({
    getAll: "true",
    sortField,
    sortOrder,
    ...filters,
  });

  try {
    const response = await fetch(`${API_BASE_URL}?${query}`);
    if (!response.ok) {
      throw new Error(
        `Unable to load all laptops due to server error (${response.status}).`
      );
    }
    return response.json() as Promise<Laptop[]>;
  } catch (err) {
    throw new Error(
      err instanceof Error && err.message.includes("fetch")
        ? "Unable to load all laptops. Please check your connection or try again later."
        : err instanceof Error
        ? err.message
        : "An unknown error occurred"
    );
  }
};

// Update a laptop
export const updateLaptop = async (
  id: string,
  laptopData: Laptop
): Promise<Laptop> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(laptopData),
    });
    if (!response.ok) {
      throw new Error("Unable to update laptop. Please try again.");
    }
    return response.json() as Promise<Laptop>;
  } catch (err) {
    throw new Error(
      err instanceof Error && err.message.includes("fetch")
        ? "Unable to update laptop. Please check your connection or try again later."
        : err instanceof Error
        ? err.message
        : "An unknown error occurred"
    );
  }
};

// Delete a laptop
export const deleteLaptop = async (id: string): Promise<{ message: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Unable to delete laptop. Please try again.");
    }
    return response.json() as Promise<{ message: string }>;
  } catch (err) {
    throw new Error(
      err instanceof Error && err.message.includes("fetch")
        ? "Unable to delete laptop. Please check your connection or try again later."
        : err instanceof Error
        ? err.message
        : "An unknown error occurred"
    );
  }
};