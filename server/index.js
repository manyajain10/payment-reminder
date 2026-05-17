const express = require('express');
const cors = require('cors');
require('dotenv').config();

const invoiceRoutes = require('./routes/invoices');
const dashboardRoutes = require('./routes/dashboard');
const reminderRoutes = require('./routes/reminders');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/invoices', invoiceRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/reminders', reminderRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
