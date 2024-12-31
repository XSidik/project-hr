// Core dependencies
const express = require('express');
const http = require('http');
const path = require('path');

// Middleware
const bodyParser = require('body-parser');
const cors = require('cors');

// Database configuration
const sequelize = require('./config/database');

// Authentication and middleware
const authMiddleware = require('./middlewares/authMiddleware');

// Routes
const authRoutes = require('./routes/authentication');
const EmployeeRoutes = require('./routes/employee');
const SalaryRoutes = require('./routes/salary');
const WaRoutes = require('./routes/whatsapp');
const SendWaRoutes = require('./routes/send_wa');
const { Server } = require('socket.io');

// Server and Socket.io setup
const app = express();
const server = http.createServer(app);
// const io = require('socket.io')(server);
const io = new Server(server);

// Middleware setup
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files setup
// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Routes setup
app.use('/auth', authRoutes);
app.use('/employee', authMiddleware, EmployeeRoutes);
app.use('/salary', authMiddleware, SalaryRoutes);
// WhatsApp routes - Uncomment if authentication is needed
// app.use('/whatsapp', authMiddleware, WaRoutes(io));
app.use('/whatsapp', WaRoutes(io));
// app.use('/send_wa', authMiddleware, SendWaRoutes);
// app.use('/send_wa', SendWaRoutes);

// Server initialization
const PORT = process.env.PORT || 3000;
sequelize.sync().then(() => {
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
