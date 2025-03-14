/**
 * @file LaptopList.tsx
 * @description Component for displaying and managing a list of laptops with CRUD operations and CSV export.
 * Integrates with a table for data display and a confirmation dialog for status changes and deletions.
 */

import { useState, useEffect, useCallback, RefObject, Dispatch, SetStateAction, JSX } from 'react';
import { Box, Button, Paper, Stack, Typography, Menu, MenuItem } from '@mui/material';
import { Add as AddIcon, Download as DownloadIcon } from '@mui/icons-material';
import LaptopTable from './LaptopTable';
import ConfirmationDialog from './ConfirmationDialog';
import { exportToCSV, exportAllToCSV } from '../utils/csvUtils';
import { fetchLaptops, decommissionLaptop, fetchAllLaptops, deleteLaptop } from '../services/api';
import { API_BASE_URL, DEFAULT_PAGE_SIZE, DEFAULT_SORT_ORDER, CSV_HEADERS } from '../config';
import { Laptop } from '../types';
import { GridSortModel, GridFilterModel, GridPaginationModel } from '@mui/x-data-grid';

// Define props interface for LaptopList
interface LaptopListProps {
  laptops: Laptop[];
  setLaptops: Dispatch<SetStateAction<Laptop[]>>;
  onViewDetails: (laptop: Laptop) => void;
  onEditLaptop: (laptop: Laptop) => void;
  onAddLaptop: () => void;
  onDecommissionLaptop?: (newStatus: 'Active' | 'Decommissioned') => void;
  onDeleteLaptop?: () => void;
  refreshTrigger: number;
  addButtonRef: RefObject<HTMLButtonElement | null>;
}

function LaptopList({
  laptops,
  setLaptops,
  onViewDetails,
  onEditLaptop,
  onAddLaptop,
  onDecommissionLaptop,
  onDeleteLaptop,
  refreshTrigger,
  addButtonRef,
}: LaptopListProps): JSX.Element {
  const [rowCount, setRowCount] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(DEFAULT_SORT_ORDER as 'asc' | 'desc');
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    id: string | null;
    title: string;
    bodyText: string;
    confirmColor: 'primary' | 'error' | 'success' | 'warning' | 'info' | 'secondary';
    actionType: 'status' | 'delete' | '';
    newStatus: 'Active' | 'Decommissioned' | '';
  }>({
    open: false,
    id: null,
    title: '',
    bodyText: '',
    confirmColor: 'primary',
    actionType: '',
    newStatus: '',
  });

  // Fetch laptops when pagination, sorting, filtering, or refreshTrigger changes
  const fetchLaptopsCallback = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchLaptops(page, pageSize, sortField, sortOrder, filters);
      setLaptops(data.rows || []);
      setRowCount(data.totalRows || 0);
    } catch (err) {
      setLaptops([]);
      setRowCount(0);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, sortField, sortOrder, filters, setLaptops]);

  useEffect(() => {
    fetchLaptopsCallback();
  }, [fetchLaptopsCallback, refreshTrigger]);

  const handleDecommission = useCallback((id: string) => {
    const laptop = laptops.find((l) => l.id === id);
    if (!laptop) return;

    const newStatus = laptop.status === 'Decommissioned' ? 'Active' : 'Decommissioned';
    const action = newStatus === 'Decommissioned' ? 'Decommission' : 'Reactivate';
    setConfirmDialog({
      open: true,
      id,
      title: `Confirm ${action}`,
      bodyText: `Are you sure you want to ${action.toLowerCase()} this laptop?`,
      confirmColor: 'primary',
      actionType: 'status',
      newStatus,
    });
  }, [laptops]);

  const handleDelete = useCallback((id: string) => {
    setConfirmDialog({
      open: true,
      id,
      title: 'Confirm Delete',
      bodyText: 'Are you sure you want to delete this laptop permanently? This action cannot be undone.',
      confirmColor: 'error',
      actionType: 'delete',
      newStatus: '',
    });
  }, []);

  const handleConfirmAction = useCallback(async () => {
    try {
      if (confirmDialog.actionType === 'status' && confirmDialog.id) {
        await decommissionLaptop(confirmDialog.id, confirmDialog.newStatus as 'Active' | 'Decommissioned');
        fetchLaptopsCallback();
        if (onDecommissionLaptop) onDecommissionLaptop(confirmDialog.newStatus as 'Active' | 'Decommissioned');
      } else if (confirmDialog.actionType === 'delete' && confirmDialog.id) {
        await deleteLaptop(confirmDialog.id);
        fetchLaptopsCallback();
        if (onDeleteLaptop) onDeleteLaptop();
      }
    } catch (err) {
      console.error('Action failed:', err);
    } finally {
      setConfirmDialog({ open: false, id: null, title: '', bodyText: '', confirmColor: 'primary', actionType: '', newStatus: '' });
    }
  }, [confirmDialog, fetchLaptopsCallback, onDecommissionLaptop, onDeleteLaptop]);

  const handleCancelAction = useCallback(() => {
    setConfirmDialog({ open: false, id: null, title: '', bodyText: '', confirmColor: 'primary', actionType: '', newStatus: '' });
  }, []);

  const handleExportClick = (event: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget);
  const handleExportClose = () => setAnchorEl(null);

  const handleExportCurrent = useCallback(async () => {
    try {
      const data = await fetchAllLaptops(sortField, sortOrder, filters);
      exportToCSV(data || [], 'laptop_inventory_filtered.csv', CSV_HEADERS);
    } catch (err) {
      console.error('Export filtered failed:', err);
    } finally {
      setAnchorEl(null);
    }
  }, [filters, sortField, sortOrder]);

  const handleExportAll = useCallback(async () => {
    try {
      await exportAllToCSV(API_BASE_URL, 'laptop_inventory_all.csv', CSV_HEADERS, sortField, sortOrder);
    } catch (err) {
      console.error('Export all failed:', err);
    } finally {
      setAnchorEl(null);
    }
  }, [sortField, sortOrder]);

  const handleSortModelChange = useCallback((model: GridSortModel) => {
    if (model.length > 0) {
      setSortField(model[0].field);
      setSortOrder(model[0].sort || null);
    } else {
      setSortField(null);
      setSortOrder(null);
    }
  }, []);

  const handleFilterModelChange = useCallback((model: GridFilterModel) => {
    const newFilters: Record<string, string> = {};
    model.items.forEach((item) => {
      if (item.value && item.field) {
        newFilters[item.field === 'assignedStaff' ? 'assignedStaff.name' : item.field] = item.value as string;
      }
    });
    setFilters(newFilters);
    setPage(0);
  }, []);

  const handlePaginationModelChange = useCallback((newModel: GridPaginationModel) => {
    setPage(newModel.page);
    setPageSize(newModel.pageSize);
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2, backgroundColor: '#fff', border: '1px solid', borderColor: 'grey.200' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 600, color: 'grey.800' }}>
            Laptop Inventory
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              color="success"
              startIcon={<AddIcon />}
              onClick={onAddLaptop}
              aria-label="Add a new laptop"
              ref={addButtonRef}
              sx={{
                px: 3,
                py: 1,
                fontSize: '1rem',
                fontWeight: 500,
                textTransform: 'none',
                borderRadius: 1,
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                '&:hover': { boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)' },
              }}
            >
              Add Laptop
            </Button>
            <Button
              variant="outlined"
              sx={{
                px: 3,
                py: 1,
                fontSize: '1rem',
                fontWeight: 500,
                textTransform: 'none',
                borderRadius: 1,
                borderColor: 'grey.600',
                color: 'grey.800',
                '&:hover': { borderColor: 'grey.800', backgroundColor: 'grey.100' },
              }}
              startIcon={<DownloadIcon />}
              onClick={handleExportClick}
              aria-label="Export laptops as CSV"
            >
              Export
            </Button>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleExportClose}>
              <MenuItem onClick={handleExportCurrent}>Export Filtered</MenuItem>
              <MenuItem onClick={handleExportAll}>Export All Laptops</MenuItem>
            </Menu>
          </Stack>
        </Stack>
      </Paper>
      <Paper sx={{ border: '1px solid', borderColor: 'grey.200' }}>
        <LaptopTable
          laptops={laptops}
          onViewDetails={onViewDetails}
          onEditLaptop={onEditLaptop}
          handleDecommission={handleDecommission}
          handleDelete={handleDelete}
          page={page}
          pageSize={pageSize}
          onPaginationModelChange={handlePaginationModelChange}
          rowCount={rowCount}
          onSortModelChange={handleSortModelChange}
          onFilterModelChange={handleFilterModelChange}
          loading={loading}
        />
      </Paper>
      {confirmDialog.open && (
        <ConfirmationDialog
          open={confirmDialog.open}
          title={confirmDialog.title}
          bodyText={confirmDialog.bodyText}
          confirmColor={confirmDialog.confirmColor}
          onConfirm={handleConfirmAction}
          onCancel={handleCancelAction}
        />
      )}
    </Box>
  );
}

export default LaptopList;