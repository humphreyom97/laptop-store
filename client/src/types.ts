export interface Laptop {
  id: string; 
  serialNumber: string; 
  brand: string; 
  model?: string;
  assignedStaff?: { name: string; employeeId: string }
  status?: 'Active' | 'Decommissioned';
  purchaseDate?: string;
  warrantyExpiration?: string;
  location?: string;
  hardwareSpecs?: string;
  softwareSpecs?: string;
  purchasePrice?: number;
  notes?: string;
}