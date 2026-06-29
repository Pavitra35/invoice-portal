const express = require('express');
const { createInvoice, getInvoices, getInvoice, updateStatus, recordPayment, deleteInvoice } = require('../controllers/invoiceController');
const router = express.Router();

router.post('/', createInvoice);
router.get('/', getInvoices);
router.get('/:id', getInvoice);
router.put('/:id/status', updateStatus);
router.post('/payment', recordPayment);
router.delete('/:id', deleteInvoice);

module.exports = router;
