# Laptop Inventory App
A full-featured web application for managing company laptop inventory, built for a technical assessment.

## Features
- **List Laptops**: Display laptops in a table with MUI DataGrid, supporting server-side sorting, filtering, and pagination.
  - **View**: Click the "eye" icon to view detailed information about a laptop.
  - **Edit**: Click the "edit" icon to modify laptop details.
  - **Update Status**: Click the "status" icon to update the status (e.g., active, decommissioned).
  - **Delete**: Click the "trash" icon to delete a laptop from the inventory.
- **Export Report**: Download the current list of laptops as a CSV file, with the ability to export either the filtered data (respects current filter/sort) or the entire list of laptops.
- **Add Laptop**: Add a new laptop


## Tech Stack
- **Front-End**: React (Vite), MUI (Material-UI)
- **Back-End**: Node.js, Express
- **Storage**: JSON file (simulated DB)

## Installation
1. Clone the repo: `git clone <repo-url>`
2. Install back-end: `cd server && npm install`
3. Install front-end: `cd ../client && npm install`
4. Start back-end: `cd ../server && node server.js`
5. Start front-end: `cd ../client && npm run dev`
6. Open `http://localhost:5173`.

## Usage
- Add laptops via the form (required fields validated).
- Sort/filter the list using dropdowns.
- Click "View" for details, "Decommission" to retire a laptop, or "Export to CSV" for a report.
- Edit existing laptops by modifying form data (future enhancement: add an "Edit" button).

## Notes
- Sandbox data included in `server/data/laptops.json`.