const { filterLaptops, sortLaptops, paginateLaptops } = require('../../utils/laptopUtils');

describe('Laptop Utility Functions', () => {
  const laptops = [
    { id: '1', brand: 'Dell', status: 'Active', assignedStaff: { name: 'Alice' } },
    { id: '2', brand: 'HP', status: 'Decommissioned', assignedStaff: { name: 'Bob' } },
  ];

  describe('filterLaptops', () => {
    it('filters by brand', () => {
      const result = filterLaptops(laptops, { brand: 'Dell' });
      expect(result).toHaveLength(1);
      expect(result[0].brand).toBe('Dell');
    });

    it('filters by assigned staff name', () => {
      const result = filterLaptops(laptops, { 'assignedStaff.name': 'Alice' });
      expect(result).toHaveLength(1);
      expect(result[0].assignedStaff.name).toBe('Alice');
    });

    it('throws error for invalid input', () => {
      expect(() => filterLaptops(null, {})).toThrow('Laptops must be an array');
    });
  });

  describe('sortLaptops', () => {
    it('sorts by brand ascending', () => {
      const result = sortLaptops(laptops, 'brand', 'asc');
      expect(result[0].brand).toBe('Dell');
      expect(result[1].brand).toBe('HP');
    });

    it('sorts by assignedStaff descending', () => {
      const result = sortLaptops(laptops, 'assignedStaff', 'desc');
      expect(result[0].assignedStaff.name).toBe('Bob');
      expect(result[1].assignedStaff.name).toBe('Alice');
    });

    it('throws error for invalid sortOrder', () => {
      expect(() => sortLaptops(laptops, 'brand', 'invalid')).toThrow('Invalid sortOrder');
    });
  });

  describe('paginateLaptops', () => {
    it('paginates correctly', () => {
      const result = paginateLaptops(laptops, 1, 1);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
    });

    it('throws error for negative page', () => {
      expect(() => paginateLaptops(laptops, -1, 1)).toThrow('Page must be a positive integer');
    });
  });
});