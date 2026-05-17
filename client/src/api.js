import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:3001' });

export const getInvoices = (search, status) =>
  API.get('/invoices', { params: { search, status } });

export const createInvoice = (data) => API.post('/invoices', data);

export const updateInvoice = (id, status) =>
  API.put(`/invoices/${id}`, { status });

export const deleteInvoice = (id) => API.delete(`/invoices/${id}`);

export const sendReminder = (id) => API.post(`/invoices/${id}/remind`);

export const getDashboard = () => API.get('/dashboard');

export const getReminders = () => API.get('/reminders');

