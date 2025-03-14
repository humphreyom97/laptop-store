/**
 * @file laptopUtils.js
 * @description Utility functions for managing laptop data.
 */

const filterLaptops = (laptops, filters) => {
    if (!Array.isArray(laptops)) throw new Error('Laptops must be an array');
    return laptops.filter((laptop) =>
      Object.entries(filters).every(([key, value]) => {
        if (!value || value.trim() === '') return true;
        if (key === 'assignedStaff.name') {
          return (
            laptop.assignedStaff?.name?.toLowerCase().includes(value.toLowerCase()) || false
          );
        }
        const fieldValue = laptop[key];
        return (
          fieldValue?.toString().toLowerCase().includes(value.toLowerCase()) || false
        );
      })
    );
  };
  
  const sortLaptops = (laptops, sortField, sortOrder) => {
    if (!Array.isArray(laptops)) throw new Error('Laptops must be an array');
    if (!sortField || !sortOrder) return laptops;
    if (!['asc', 'desc'].includes(sortOrder)) throw new Error('Invalid sortOrder');
    return [...laptops].sort((a, b) => {
      const aValue =
        sortField === 'assignedStaff'
          ? a.assignedStaff?.name || 'Unassigned'
          : a[sortField] || '';
      const bValue =
        sortField === 'assignedStaff'
          ? b.assignedStaff?.name || 'Unassigned'
          : b[sortField] || '';
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });
  };
  
  const paginateLaptops = (laptops, page, pageSize) => {
    if (!Array.isArray(laptops)) throw new Error('Laptops must be an array');
    if (page < 1 || !Number.isInteger(page)) throw new Error('Page must be a positive integer');
    if (pageSize < 0 || !Number.isInteger(pageSize)) throw new Error('PageSize must be non-negative');
    const start = (page - 1) * pageSize;
    return laptops.slice(start, Math.min(start + pageSize, laptops.length));
  };
  
  module.exports = { filterLaptops, sortLaptops, paginateLaptops };