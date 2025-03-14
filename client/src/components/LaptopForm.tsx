import { useState, useEffect, ChangeEvent } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, MenuItem
} from '@mui/material';
import { updateLaptop } from '../services/api';
import { Laptop } from '../types'; // Import the existing Laptop interface

// Define only the additional interfaces we need
interface FormErrors {
  brand: string;
  serialNumber: string;
}

interface LaptopFormProps {
  open: boolean;
  mode: 'add' | 'edit' | 'view';
  laptopData?: Laptop;
  onAddLaptop: (laptop: Laptop) => void;
  onUpdateLaptop: (laptop: Laptop) => void;
  onClose: () => void;
}

function LaptopForm({ open, mode, laptopData, onAddLaptop, onUpdateLaptop, onClose }: LaptopFormProps) {
  const [formData, setFormData] = useState<Laptop>({
    id: '',
    serialNumber: '',
    brand: '',
    model: '',
    assignedStaff: { name: '', employeeId: '' }, // Default to empty strings
    status: 'Active',
    purchaseDate: '',
    warrantyExpiration: '',
    location: '',
    hardwareSpecs: '',
    softwareSpecs: '',
    purchasePrice: 0,
    notes: ''
  });
  const [errors, setErrors] = useState<FormErrors>({ brand: '', serialNumber: '' });

  useEffect(() => {
    if (laptopData) {
      setFormData({
        ...laptopData,
        assignedStaff: laptopData.assignedStaff || { name: '', employeeId: '' },
      });
      setErrors({ brand: '', serialNumber: '' });
    } else {
      setFormData({
        id: '',
        serialNumber: '',
        brand: '',
        model: '',
        assignedStaff: { name: '', employeeId: '' },
        status: 'Active',
        purchaseDate: '',
        warrantyExpiration: '',
        location: '',
        hardwareSpecs: '',
        softwareSpecs: '',
        purchasePrice: 0,
        notes: ''
      });
      setErrors({ brand: '', serialNumber: '' });
    }
  }, [laptopData]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (mode === 'view') return;
    const { name, value } = e.target;

    if (name === 'assignedStaff.name' || name === 'assignedStaff.employeeId') {
      const field = name.split('.')[1]; // 'name' or 'employeeId'
      setFormData(prev => ({
        ...prev,
        assignedStaff: {
          name: field === 'name' ? value : (prev.assignedStaff?.name || ''),
          employeeId: field === 'employeeId' ? value : (prev.assignedStaff?.employeeId || '')
        }
      }));
    } else if (name === 'purchasePrice') {
      setFormData(prev => ({ ...prev, [name]: value === '' ? 0 : Number(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    if (name === 'brand' && value.trim()) {
      setErrors(prev => ({ ...prev, brand: '' }));
    }
    if (name === 'serialNumber' && value.trim()) {
      setErrors(prev => ({ ...prev, serialNumber: '' }));
    }
  };

  const handleSubmit = async () => {
    let newErrors: FormErrors = { brand: '', serialNumber: '' };
    if (!formData.brand.trim()) {
      newErrors.brand = 'Brand is required';
    }
    if (!formData.serialNumber.trim()) {
      newErrors.serialNumber = 'Serial Number is required';
    }
    if (newErrors.brand || newErrors.serialNumber) {
      setErrors(newErrors);
      return;
    }

    try {
      if (mode === 'edit' && laptopData?.id) {
        const updatedLaptop = await updateLaptop(laptopData.id, formData);
        onUpdateLaptop(updatedLaptop);
      } else {
        const response = await fetch('http://localhost:3001/api/laptops', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (!response.ok) throw new Error('Failed to add laptop');
        const newLaptop: Laptop = await response.json();
        onAddLaptop(newLaptop);
      }
      onClose();
    } catch (err) {
      console.error('Error in handleSubmit:', err);
    }
  };

  const isReadOnly = mode === 'view';

  const textFieldSx = {
    '& .MuiInputBase-input.Mui-disabled': {
      color: 'black',
      WebkitTextFillColor: 'black',
    },
    '& .MuiInputLabel-root': {
      color: 'rgba(0, 0, 0, 0.87)',
    },
    '& .MuiInputLabel-root.Mui-disabled': {
      color: 'rgba(0, 0, 0, 0.87)',
    },
    '& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline': {
      borderColor: 'rgba(0, 0, 0, 0.23)',
    },
    '& .MuiInputBase-root.Mui-disabled': {
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
      cursor: 'default',
    },
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {mode === 'add' ? 'Add Laptop' : mode === 'edit' ? 'Edit Laptop' : 'View Laptop Details'}
      </DialogTitle>
      <DialogContent>
        <TextField
          label="Serial Number"
          name="serialNumber"
          value={formData.serialNumber}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          disabled={isReadOnly}
          error={!!errors.serialNumber}
          helperText={errors.serialNumber}
          sx={textFieldSx}
        />
        <TextField
          label="Brand"
          name="brand"
          value={formData.brand}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          disabled={isReadOnly}
          error={!!errors.brand}
          helperText={errors.brand}
          sx={textFieldSx}
        />
        <TextField
          label="Model"
          name="model"
          value={formData.model || ''}
          onChange={handleChange}
          fullWidth
          margin="normal"
          disabled={isReadOnly}
          sx={textFieldSx}
        />
        <TextField
          label="Staff Name"
          name="assignedStaff.name"
          value={formData.assignedStaff?.name || ''}
          onChange={handleChange}
          fullWidth
          margin="normal"
          disabled={isReadOnly}
          sx={textFieldSx}
        />
        <TextField
          label="Employee ID"
          name="assignedStaff.employeeId"
          value={formData.assignedStaff?.employeeId || ''}
          onChange={handleChange}
          fullWidth
          margin="normal"
          disabled={isReadOnly}
          sx={textFieldSx}
        />
        <TextField
          select
          label="Status"
          name="status"
          value={formData.status || ''}
          onChange={handleChange}
          fullWidth
          margin="normal"
          disabled={isReadOnly}
          sx={textFieldSx}
        >
          <MenuItem value="Active">Active</MenuItem>
          <MenuItem value="Decommissioned">Decommissioned</MenuItem>
        </TextField>
        <TextField
          label="Purchase Date"
          name="purchaseDate"
          type="date"
          value={formData.purchaseDate || ''}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          disabled={isReadOnly}
          sx={textFieldSx}
        />
        <TextField
          label="Warranty Expiration"
          name="warrantyExpiration"
          type="date"
          value={formData.warrantyExpiration || ''}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          disabled={isReadOnly}
          sx={textFieldSx}
        />
        <TextField
          label="Location"
          name="location"
          value={formData.location || ''}
          onChange={handleChange}
          fullWidth
          margin="normal"
          disabled={isReadOnly}
          sx={textFieldSx}
        />
        <TextField
          label="Hardware Specs"
          name="hardwareSpecs"
          value={formData.hardwareSpecs || ''}
          onChange={handleChange}
          fullWidth
          margin="normal"
          disabled={isReadOnly}
          sx={textFieldSx}
        />
        <TextField
          label="Software Specs"
          name="softwareSpecs"
          value={formData.softwareSpecs || ''}
          onChange={handleChange}
          fullWidth
          margin="normal"
          disabled={isReadOnly}
          sx={textFieldSx}
        />
        <TextField
          label="Purchase Price (€)"
          name="purchasePrice"
          type="number"
          value={formData.purchasePrice ?? ''} // Handle undefined with empty string
          onChange={handleChange}
          fullWidth
          margin="normal"
          disabled={isReadOnly}
          sx={textFieldSx}
        />
        <TextField
          label="Notes"
          name="notes"
          value={formData.notes || ''}
          onChange={handleChange}
          fullWidth
          margin="normal"
          multiline
          rows={3}
          disabled={isReadOnly}
          sx={textFieldSx}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          {mode === 'view' ? 'Close' : 'Cancel'}
        </Button>
        {mode !== 'view' && (
          <Button onClick={handleSubmit} variant="contained">
            Save
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default LaptopForm;