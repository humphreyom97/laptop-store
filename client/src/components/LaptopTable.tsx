/**
 * @file LaptopTable.tsx
 * @description A reusable DataGrid component for displaying and managing laptop data.
 */

import {
  DataGrid,
  GridOverlay,
  GridColDef,
  GridRenderCellParams,
  GridSortModel,
  GridFilterModel,
  GridPaginationModel,
} from '@mui/x-data-grid';
import { IconButton, Stack, Typography } from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  RemoveCircleOutline as RemoveCircleOutlineIcon,
  AddCircleOutline as AddCircleOutlineIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { JSX, MouseEvent } from 'react';
import { Laptop } from '../types';

interface LaptopTableProps {
  laptops: Laptop[];
  onViewDetails: (laptop: Laptop) => void;
  onEditLaptop: (laptop: Laptop) => void;
  handleDecommission: (id: string) => void;
  handleDelete: (id: string) => void;
  page: number;
  pageSize: number;
  onPaginationModelChange: (model: GridPaginationModel) => void;
  rowCount: number;
  onSortModelChange: (model: GridSortModel) => void;
  onFilterModelChange: (model: GridFilterModel) => void;
  loading: boolean;
}

interface LaptopRow extends Laptop {
  onViewDetails: (laptop: Laptop) => void;
  onEditLaptop: (laptop: Laptop) => void;
  handleDecommission: (id: string) => void;
  handleDelete: (id: string) => void;
}

/**
 * Custom overlay component for when no rows are present in the DataGrid.
 * @returns {JSX.Element} The no rows overlay UI
 */
function CustomNoRowsOverlay(): JSX.Element {
  return (
    <GridOverlay>
      <Typography variant="h6" color="black" sx={{ fontWeight: 500 }}>
        No laptops found
      </Typography>
    </GridOverlay>
  );
}

// Define DataGrid columns with TypeScript types
const columns: GridColDef<LaptopRow>[] = [
  {
    field: 'serialNumber',
    headerName: 'Serial Number',
    sortable: true,
    flex: 1,
    minWidth: 150,
    renderCell: (params) => (
      <div title={params.value as string} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {params.value as string}
      </div>
    ),
  },
  {
    field: 'brand',
    headerName: 'Brand',
    sortable: true,
    flex: 1,
    minWidth: 100,
    renderCell: (params) => (
      <div title={params.value as string} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {params.value as string}
      </div>
    ),
  },
  {
    field: 'model',
    headerName: 'Model',
    sortable: true,
    flex: 1,
    minWidth: 120,
    renderCell: (params) => (
      <div title={params.value as string | undefined} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {params.value || 'N/A'}
      </div>
    ),
  },
  {
    field: 'assignedStaff',
    headerName: 'Assigned Staff',
    sortable: true,
    flex: 1,
    minWidth: 150,
    valueGetter: (params: any) => {
      return params?.name ?? 'Unassigned';
    },
    renderCell: (params) => (
      <div title={params.value as string} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {params.value as string}
      </div>
    ),
  },
  {
    field: 'status',
    headerName: 'Status',
    sortable: true,
    filterable: true,
    type: 'singleSelect',
    valueOptions: ['Active', 'Decommissioned'],
    flex: 1,
    minWidth: 120,
    renderCell: (params) => (
      <div title={params.value as string | undefined} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {params.value || 'N/A'}
      </div>
    ),
  },
  {
    field: 'location',
    headerName: 'Location',
    sortable: true,
    flex: 1,
    minWidth: 150,
    renderCell: (params) => (
      <div title={params.value as string | undefined} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {params.value || 'N/A'}
      </div>
    ),
  },
  {
    field: 'warrantyExpiration',
    headerName: 'Warranty Expiration',
    sortable: true,
    flex: 1,
    minWidth: 180,
    headerAlign: 'left',
    renderCell: (params) => (
      <div title={params.value as string | undefined} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {params.value || 'N/A'}
      </div>
    ),
  },
  {
    field: 'actions',
    headerName: 'Actions',
    sortable: false,
    filterable: false,
    width: 180,
    align: 'center',
    headerAlign: 'center',
    renderCell: (params: GridRenderCellParams<any, LaptopRow>) => {
      const handleViewDetails = () => params.row.onViewDetails(params.row);
      const handleEdit = (event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        params.row.onEditLaptop(params.row);
      };
      const handleDecommission = (event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        params.row.handleDecommission(params.row.id ?? '');
      };
      const handleDelete = (event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        params.row.handleDelete(params.row.id ?? '');
      };

      return (
        <Stack direction="row" justifyContent="center" alignItems="center" height="100%">
          <IconButton
            onClick={handleViewDetails}
            sx={{ color: 'primary.light' }}
            title="View Details"
            size="small"
            aria-label="View Details"
          >
            <VisibilityIcon />
          </IconButton>
          <IconButton
            onClick={handleEdit}
            sx={{ color: 'primary.dark' }}
            title="Edit Laptop"
            size="small"
            aria-label="Edit Laptop"
          >
            <EditIcon />
          </IconButton>
          <IconButton
            onClick={handleDecommission}
            color={params.row.status === 'Decommissioned' ? 'success' : 'warning'}
            title={params.row.status === 'Decommissioned' ? 'Reactivate' : 'Decommission'}
            size="small"
            aria-label={params.row.status === 'Decommissioned' ? 'Reactivate Laptop' : 'Decommission Laptop'}
          >
            {params.row.status === 'Decommissioned' ? <AddCircleOutlineIcon /> : <RemoveCircleOutlineIcon />}
          </IconButton>
          <IconButton
            onClick={handleDelete}
            color="error"
            title="Delete Permanently"
            size="small"
            aria-label="Delete Laptop Permanently"
          >
            <DeleteIcon />
          </IconButton>
        </Stack>
      );
    },
  },
];

// Define DataGrid styles separately
const dataGridStyles = {
  height: 400,
  width: '100%',
  '& .MuiDataGrid-columnHeader': {
    bgcolor: 'primary.main',
    color: 'white',
    fontSize: '1rem',
    fontWeight: 600,
  },
  '& .MuiDataGrid-cell': {
    borderBottom: '1px solid',
    borderColor: 'grey.200',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  '& .MuiDataGrid-cell:focus': {
    outline: 'none',
  },
  '& .MuiDataGrid-cell:focus-within': {
    outline: 'none',
  },
  '& .MuiDataGrid-cell[data-field="actions"]': {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  '& .MuiDataGrid-row:hover': {
    bgcolor: 'grey.50',
  },
  '& .MuiDataGrid-footerContainer': {
    borderTop: '1px solid',
    borderColor: 'grey.200',
  },
  '& .MuiDataGrid-sortIcon': {
    color: 'white !important',
  },
  '& .MuiDataGrid-filterIcon': {
    color: 'white !important',
  },
  '& .MuiDataGrid-menuIconButton': {
    color: 'white !important',
  },
};

/**
 * LaptopTable component renders a DataGrid with laptop data and action buttons.
 * @param {LaptopTableProps} props - Component props
 * @returns {JSX.Element} The DataGrid UI
 */
function LaptopTable({
  laptops,
  onViewDetails,
  onEditLaptop,
  handleDecommission,
  handleDelete,
  page,
  pageSize,
  onPaginationModelChange,
  rowCount,
  onSortModelChange,
  onFilterModelChange,
  loading,
}: LaptopTableProps): JSX.Element {

  const rows: LaptopRow[] = laptops
    .filter((laptop): laptop is Laptop => laptop !== null && laptop !== undefined && laptop.serialNumber !== undefined && laptop.brand !== undefined) // Strict filtering
    .map((laptop) => ({
      ...laptop,
      onViewDetails,
      onEditLaptop,
      handleDecommission,
      handleDelete,
    }));

  return (
    <DataGrid
      rows={rows}
      columns={columns}
      pageSizeOptions={[5, 10, 20]}
      paginationModel={{ page, pageSize }}
      onPaginationModelChange={onPaginationModelChange}
      rowCount={rowCount}
      pagination
      paginationMode="server"
      sortingMode="server"
      filterMode="server"
      onSortModelChange={onSortModelChange}
      onFilterModelChange={onFilterModelChange}
      disableRowSelectionOnClick
      loading={loading}
      slots={{ noRowsOverlay: CustomNoRowsOverlay }}
      sx={dataGridStyles}
    />
  );
}

export default LaptopTable;