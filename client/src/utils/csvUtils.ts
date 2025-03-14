/**
 * @file csvUtils.ts
 * @description Utilities for exporting laptop inventory data to CSV format.
 */

import { Laptop } from '../types'; // Adjust path based on your structure

/**
 * Mapping of CSV header names to object property paths.
 * Used to transform data keys to human-readable headers and handle nested properties.
 */
const FIELD_MAPPING: Record<string, keyof Laptop | 'assignedStaff.name' | 'assignedStaff.employeeId'> = {
  'Serial Number': 'serialNumber',
  'Brand': 'brand',
  'Model': 'model',
  'Staff Name': 'assignedStaff.name',
  'Employee ID': 'assignedStaff.employeeId',
  'Status': 'status',
  'Purchase Date': 'purchaseDate',
  'Warranty Expiration': 'warrantyExpiration',
  'Location': 'location',
  'Hardware Specs': 'hardwareSpecs',
  'Software Specs': 'softwareSpecs',
  'Purchase Price': 'purchasePrice',
  'Notes': 'notes',
};

/**
 * Escapes a string for CSV by wrapping it in quotes and escaping internal quotes.
 * @param value - The value to escape.
 * @returns The escaped CSV value.
 */
const escapeCsvValue = (value: string | number | null | undefined): string => {
  if (value === undefined || value === null) return '""';
  const strValue = String(value);
  return `"${strValue.replace(/"/g, '""')}"`;
};

/**
 * Exports an array of data to a CSV file and triggers a download.
 * @param data - The data to export.
 * @param filename - The name of the file to download.
 * @param headers - Custom headers; defaults to FIELD_MAPPING keys.
 * @throws {Error} If data is not an array or Blob/URL creation fails.
 */
export const exportToCSV = (data: Laptop[], filename: string, headers?: string[]): void => {
  // Check if data is an array
  if (!Array.isArray(data)) {
    console.error('exportToCSV: Expected an array but received:', data);
    throw new Error('Invalid data format: Data must be an array');
  }

  // Use provided headers or default to FIELD_MAPPING keys
  const csvHeaders = headers || Object.keys(FIELD_MAPPING);

  // Transform data into CSV rows
  const csvRows = data.map((item) => {
    return csvHeaders.map((header) => {
      const key = FIELD_MAPPING[header];
      if (!key) {
        console.warn(`No mapping found for header: ${header}`);
        return escapeCsvValue('');
      }

      // Handle nested properties explicitly with optional chaining
      if (key === 'assignedStaff.name') {
        return escapeCsvValue(item.assignedStaff?.name);
      }
      if (key === 'assignedStaff.employeeId') {
        return escapeCsvValue(item.assignedStaff?.employeeId);
      }

      // Handle top-level properties (exclude assignedStaff object)
      const topLevelKey = key as keyof Omit<Laptop, 'assignedStaff'>;
      return escapeCsvValue(item[topLevelKey]);
    });
  });

  // Combine headers and rows into CSV string
  const csvContent = [csvHeaders, ...csvRows]
    .map((row) => row.join(','))
    .join('\n');

  try {
    // Create and trigger file download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link); // Append to body for Firefox compatibility
    link.click();
    document.body.removeChild(link); // Clean up
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to create or download CSV:', error);
    throw new Error('CSV export failed');
  }
};

/**
 * Fetches all data from an API and exports it to CSV.
 * @param apiUrl - The base API URL to fetch data from.
 * @param filename - The name of the file to download.
 * @param headers - The CSV headers to use.
 * @param sortField - Optional field to sort by.
 * @param sortOrder - Optional sort order ('asc' or 'desc').
 * @returns {Promise<void>}
 * @throws {Error} If fetch or export fails.
 */
export const exportAllToCSV = async (
  apiUrl: string,
  filename: string,
  headers: string[],
  sortField: string | null,
  sortOrder: 'asc' | 'desc' | null
): Promise<void> => {
  try {
    // Build query parameters
    const queryParams = new URLSearchParams();
    queryParams.set('getAll', 'true');
    if (sortField && sortOrder) {
      queryParams.set('sortField', sortField);
      queryParams.set('sortOrder', sortOrder);
    }

    const response = await fetch(`${apiUrl}?${queryParams.toString()}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
    }

    const data: { rows?: Laptop[] } = await response.json();
    const rows = Array.isArray(data.rows) ? data.rows : [];
    exportToCSV(rows, filename, headers);
  } catch (error) {
    console.error('Failed to export all data to CSV:', error);
    throw new Error(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};