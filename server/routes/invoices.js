const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const { sendReminderEmail } = require('../mailer');

const markOverdue = () => {
  const today = new Date().toISOString().split('T')[0];
  db.prepare(`
    UPDATE invoices SET status = 'overdue'
    WHERE due_date < ? AND status = 'pending'
  `).run(today);
};

router.get('/', (req, res) => {
  markOverdue();
  const { search, status } = req.query;
  let query = 'SELECT * FROM invoices WHERE 1=1';
  const params = [];
  if (search) {
    query += ' AND (client_name LIKE ? OR client_email LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }
  if (status && status !== 'all') {
    query += ' AND status = ?';
    params.push(status);
  }
  query += ' ORDER BY created_at DESC';
  const invoices = db.prepare(query).all(...params);
  res.json(invoices);
});

router.post('/', (req, res) => {
  const { client_name, client_email, amount, due_date, description } = req.body;
  if (!client_name || !client_email || !amount || !due_date) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  const id = uuidv4();
  db.prepare(`
    INSERT INTO invoices (id, client_name, client_email, amount, due_date, description)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(id, client_name, client_email, amount, due_date, description);
  res.json({ message: 'Invoice created', id });
});

router.put('/:id', (req, res) => {
  const { status } = req.body;
  db.prepare('UPDATE invoices SET status = ? WHERE id = ?')
    .run(status, req.params.id);
  res.json({ message: 'Status updated' });
});

router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM invoices WHERE id = ?').run(req.params.id);
  res.json({ message: 'Invoice deleted' });
});

router.post('/:id/remind', async (req, res) => {
  const invoice = db.prepare('SELECT * FROM invoices WHERE id = ?')
    .get(req.params.id);
  if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
  try {
    await sendReminderEmail(invoice);
    const reminderId = uuidv4();
    db.prepare(`INSERT INTO reminders (id, invoice_id, note) VALUES (?, ?, ?)`)
      .run(reminderId, invoice.id, 'Reminder email sent');
    res.json({ message: 'Reminder sent!' });
  } catch (err) {
    console.error('EMAIL ERROR:', err);
    res.status(500).json({ error: 'Failed to send email: ' + err.message });
  }
});

module.exports = router;
