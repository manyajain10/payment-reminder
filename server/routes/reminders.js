const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  const reminders = db.prepare(`
    SELECT r.*, i.client_name, i.client_email, i.amount
    FROM reminders r
    JOIN invoices i ON r.invoice_id = i.id
    ORDER BY r.sent_at DESC
  `).all();
  res.json(reminders);
});

module.exports = router;
