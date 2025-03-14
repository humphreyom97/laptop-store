/**
 * @file Pagination.tsx
 * @description A reusable pagination component with page size selection and navigation buttons.
 */

import Pagination from '@mui/material/Pagination'; // Note: Unused in this implementation
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { SelectChangeEvent } from '@mui/material/Select'; // Import MUI's SelectChangeEvent
import { JSX, ReactNode } from 'react';

// Define the props interface for PaginationComponent
interface PaginationComponentProps {
  currentPage: number; // Current page number (0-based index)
  handlePageChange: (newPage: number) => void; // Callback to change the page
  pageSize: number; // Number of rows per page
  handlePageSizeChange: (event: SelectChangeEvent<number>, child: ReactNode) => void; // Updated to MUI's type
  rowCount: number; // Total number of rows
}

/**
 * PaginationComponent renders a custom pagination UI with page size selection and navigation buttons.
 * @param {PaginationComponentProps} props - Component props
 * @returns {JSX.Element} The pagination UI
 */
function PaginationComponent({
  currentPage,
  handlePageChange,
  pageSize,
  handlePageSizeChange,
  rowCount,
}: PaginationComponentProps): JSX.Element {
  const totalPages = Math.ceil(rowCount / pageSize);

  return (
    <Box
      sx={{
        mt: 2,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        bgcolor: 'grey.50',
        p: 2,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        boxShadow: 1,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Rows per page:
        </Typography>
        <Select
          value={pageSize}
          onChange={handlePageSizeChange}
          size="small"
          sx={{
            minWidth: 65,
            '& .MuiSelect-select': {
              py: 0.5,
            },
          }}
        >
          <MenuItem value={5}>5</MenuItem>
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={20}>20</MenuItem>
        </Select>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          variant="contained"
          size="small"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 0}
        >
          Previous
        </Button>
        <Typography variant="body2" color="text.secondary">
          Page {currentPage + 1} of {totalPages}
        </Typography>
        <Button
          variant="contained"
          size="small"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages - 1}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
}

export default PaginationComponent;