# Laptop Inventory App
A full-featured web application for managing company laptop inventory, built for a technical assessment.

## Features
- **List Laptops**: MUI DataGrid with server-side sorting, filtering, and pagination.
- **View Details**: Modal popup with full laptop info.
- **Add/Update**: Modal form for adding or editing laptops with validation.
- **Decommission**: Soft-delete laptops by setting status to "Decommissioned."
- **Export Report**: Download the current list as a CSV file.

## Tech Stack
- **Front-End**: React (Vite), Tailwind CSS, MUI (Material-UI)
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
- Built in ~8 hours with a focus on modularity, UX, and full CRUD functionality.
- Sandbox data included in `server/data/laptops.json`.