const express = require('express');
const router = express.Router();
const db = require('../db');

const markOverdue = () => {
  const today = new Date().toISOString().split('T')[0];
  db.prepare(`
    UPDATE invoices SET status = 'overdue'
    WHERE due_date < ? AND status = 'pending'
  `).run(today);
};

router.get('/', (req, res) => {
  markOverdue();
  const total = db.prepare('SELECT COUNT(*) as count FROM invoices').get();
  const unpaid = db.prepare(`SELECT SUM(amount) as total FROM invoices WHERE status != 'paid'`).get();
  const overdue = db.prepare(`SELECT COUNT(*) as count FROM invoices WHERE status = 'overdue'`).get();
  const paid = db.prepare(`SELECT COUNT(*) as count FROM invoices WHERE status = 'paid'`).get();
  res.json({
    totalInvoices: total.count,
    unpaidAmount: unpaid.total || 0,
    overdueCount: overdue.count,
    paidCount: paid.count,
  });
});

module.exports = router;
