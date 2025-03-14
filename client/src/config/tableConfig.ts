// tableConfig.ts
import { Laptop } from '../types'; // Adjust the import path based on your project structure

// Define an interface for the table header configuration
interface TableHeader {
  label: string;
  field: keyof Laptop | 'actions'; // 'actions' is not in Laptop, so we union it
  sortable?: boolean; // Optional, since not all headers have it
}

// Export the typed array of table headers
export const laptopTableHeaders: TableHeader[] = [
  { label: 'Serial Number', field: 'serialNumber' },
  { label: 'Brand', field: 'brand' },
  { label: 'Model', field: 'model' },
  { label: 'Assigned Staff', field: 'assignedStaff' },
  { label: 'Status', field: 'status' },
  { label: 'Location', field: 'location' },
  { label: 'Warranty Exp.', field: 'warrantyExpiration' },
  { label: 'Actions', field: 'actions', sortable: false },
];