import { useState, useRef, SyntheticEvent } from 'react';
import LaptopList from './components/LaptopList';
import LaptopForm from './components/LaptopForm';
import ErrorMessage from './components/ErrorMessage';
import { Snackbar, Alert, AppBar, Toolbar, Typography, Container, Box, SnackbarCloseReason } from '@mui/material';
import { Laptop } from './types'; // Adjust path if needed

interface Toast {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
}

function App() {
  const [laptops, setLaptops] = useState<Laptop[]>([]);
  const [formMode, setFormMode] = useState<'add' | 'edit' | 'view' | null>(null);
  const [formData, setFormData] = useState<Laptop | undefined>(undefined); // Changed from null to undefined
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  const [toast, setToast] = useState<Toast>({ open: false, message: '', severity: 'success' });
  const addButtonRef = useRef<HTMLButtonElement | null>(null);

  const handleAddLaptop = (newLaptop: Laptop): void => {
    setIsFormOpen(false);
    setFormMode(null);
    setFormData(undefined); // Changed from null to undefined
    setRefreshTrigger(prev => prev + 1);
    setError('');
    setToast({ open: true, message: 'Laptop added successfully!', severity: 'success' });
    addButtonRef.current?.focus();
  };

  const handleUpdateLaptop = (updatedLaptop: Laptop): void => {
    setIsFormOpen(false);
    setFormMode(null);
    setFormData(undefined); // Changed from null to undefined
    setRefreshTrigger(prev => prev + 1);
    setError('');
    setToast({ open: true, message: 'Laptop updated successfully!', severity: 'success' });
    addButtonRef.current?.focus();
  };

  const handleDecommissionLaptop = (newStatus: 'Active' | 'Decommissioned'): void => {
    setRefreshTrigger(prev => prev + 1);
    setError('');
    setToast({
      open: true,
      message: newStatus === 'Decommissioned' ? 'Laptop decommissioned successfully!' : 'Laptop reactivated successfully!',
      severity: 'success',
    });
    addButtonRef.current?.focus();
  };

  const handleDeleteLaptop = (): void => {
    setRefreshTrigger(prev => prev + 1);
    setError('');
    setToast({ open: true, message: 'Laptop deleted successfully!', severity: 'success' });
    addButtonRef.current?.focus();
  };

  const handleOpenForm = (mode: 'add' | 'edit' | 'view', laptop: Laptop | null = null): void => {
    setFormMode(mode);
    setFormData(laptop || undefined); // Convert null to undefined
    setIsFormOpen(true);
  };

  const handleCloseForm = (): void => {
    setIsFormOpen(false);
    setFormMode(null);
    setFormData(undefined); // Changed from null to undefined
    addButtonRef.current?.focus();
  };

  const handleToastClose = (event: SyntheticEvent | Event, reason?: SnackbarCloseReason): void => {
    if (reason === 'clickaway') return; // Only applies to Snackbar
    setToast(prev => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      <AppBar position="static" sx={{ background: 'linear-gradient(to right, #1f2937, #312e81, #1f2937)', boxShadow: 'md' }}>
        <Toolbar sx={{ justifyContent: 'center', py: 2 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h5" component="h1" sx={{ color: 'white', fontWeight: 600, letterSpacing: 1 }}>
              Staff Laptop Inventory Management
            </Typography>
            <Typography variant="subtitle2" sx={{ color: 'grey.300', fontWeight: 500, textTransform: 'uppercase', letterSpacing: 2, mt: 0.5 }}>
              IT Helpdesk Solution
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <ErrorMessage message={error} />
        <LaptopList
          laptops={laptops}
          setLaptops={setLaptops}
          onViewDetails={(laptop: Laptop) => handleOpenForm('view', laptop)}
          onEditLaptop={(laptop: Laptop) => handleOpenForm('edit', laptop)}
          onAddLaptop={() => handleOpenForm('add')}
          onDecommissionLaptop={handleDecommissionLaptop}
          onDeleteLaptop={handleDeleteLaptop}
          refreshTrigger={refreshTrigger}
          addButtonRef={addButtonRef}
        />
        {isFormOpen && formMode && (
          <LaptopForm
            open={isFormOpen}
            mode={formMode as 'add' | 'edit' | 'view'}
            laptopData={formData}
            onAddLaptop={handleAddLaptop}
            onUpdateLaptop={handleUpdateLaptop}
            onClose={handleCloseForm}
          />
        )}
        <Snackbar
          open={toast.open}
          autoHideDuration={6000}
          onClose={handleToastClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert
            onClose={handleToastClose}
            severity={toast.severity}
            variant="filled"
            sx={{
              width: '100%',
              bgcolor: toast.severity === 'success' ? '#2e7d32' : '#d32f2f',
              color: '#fff',
              fontWeight: 500,
              borderRadius: 1,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
              '& .MuiAlert-icon': { color: '#fff' },
            }}
          >
            {toast.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}

export default App;