# Expense Tracker

A full-stack financial management application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) to help users track their income and expenses efficiently.

![Expense Tracker](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)

## Features

- 📊 **Dashboard Analytics**: Visualize your financial data with interactive charts
- 💰 **Income Tracking**: Record and categorize your income sources
- 💸 **Expense Management**: Track and categorize your expenses
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 🔐 **Secure Authentication**: Protected routes and secure user authentication
- 📈 **Data Visualization**: Interactive charts for financial insights
- 📎 **File Uploads**: Attach receipts and documents to transactions
- 🔄 **Real-time Updates**: Instant reflection of financial changes

## Tech Stack

### Frontend
- React.js
- Vite
- Context API for state management
- CSS Modules
- Chart.js for data visualization
- Custom Hooks

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose ODM
- Passport.js for authentication
- Multer for file uploads
- Express-session for session management

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/expense-tracker.git
cd expense-tracker
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend/expence-tracker
npm install
```

4. Create environment variables:
   - Create `.env` file in the backend directory:
   ```
   MONGO_URI=your_mongodb_connection_string
   SESSION_SECRET=your_session_secret
   CLIENT_URL=http://localhost:5173
   PORT=5000
   ```
   
   - Create `.env` file in the frontend directory:
   ```
   VITE_API_URL=http://localhost:5000
   ```

5. Start the development servers:
   - Backend:
   ```bash
   cd backend
   npm run dev
   ```
   
   - Frontend:
   ```bash
   cd frontend/expence-tracker
   npm run dev
   ```

## Project Structure

```
expense-tracker/
├── backend/
│   ├── config/         # Configuration files
│   ├── controllers/    # Route controllers
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── middlewares/    # Custom middlewares
│   ├── utils/          # Utility functions
│   └── server.js       # Entry point
│
└── frontend/
    └── expence-tracker/
        ├── src/
        │   ├── components/  # Reusable components
        │   ├── context/     # Context providers
        │   ├── hooks/       # Custom hooks
        │   ├── pages/       # Page components
        │   └── utils/       # Utility functions
        └── public/          # Static assets
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout

### Income
- `GET /api/v1/income` - Get all income records
- `POST /api/v1/income` - Create new income record
- `PUT /api/v1/income/:id` - Update income record
- `DELETE /api/v1/income/:id` - Delete income record

### Expense
- `GET /api/v1/expense` - Get all expense records
- `POST /api/v1/expense` - Create new expense record
- `PUT /api/v1/expense/:id` - Update expense record
- `DELETE /api/v1/expense/:id` - Delete expense record

### Dashboard
- `GET /api/v1/dashboard` - Get dashboard analytics

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [React](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Express.js](https://expressjs.com/)
- [Chart.js](https://www.chartjs.org/)

## Contact

<!-- Your Name - [@yourtwitter](https://twitter.com/yourtwitter) -->

Project Link: [https://github.com/tejasdetroja15/Expense-trackerr](https://github.com/tejasdetroja15/Expense-tracker) 