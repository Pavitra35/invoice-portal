const db = require('../config/db');

// Create Invoice
exports.createInvoice = async (req, res) => {
    try {
        const {
            client_id,
            issue_date,
            due_date,
            subtotal,
            tax_rate,
            tax_amount,
            grand_total,
            items = []
        } = req.body;

        if (!client_id) {
            return res.status(400).json({
                success: false,
                message: 'Client is required'
            });
        }

        const invoice_number = `INV-${Date.now()}`;

        const [result] = await db.query(
            `INSERT INTO invoices
            (
                invoice_number,
                client_id,
                issue_date,
                due_date,
                subtotal,
                tax_rate,
                tax_amount,
                grand_total,
                status
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                invoice_number,
                client_id,
                issue_date || null,
                due_date || null,
                subtotal || 0,
                tax_rate || 0,
                tax_amount || 0,
                grand_total || 0,
                'Sent'
            ]
        );

        const invoice_id = result.insertId;

        if (Array.isArray(items)) {
            for (const item of items) {
                await db.query(
                    `INSERT INTO invoice_items
                    (
                        invoice_id,
                        description,
                        quantity,
                        unit_price,
                        subtotal
                    )
                    VALUES (?, ?, ?, ?, ?)`,
                    [
                        invoice_id,
                        item.description || '',
                        item.quantity || 1,
                        item.unit_price || 0,
                        item.subtotal || 0
                    ]
                );
            }
        }

        return res.status(201).json({
            success: true,
            message: 'Invoice created successfully',
            invoice_id,
            invoice_number
        });

    } catch (err) {
        console.error('CREATE INVOICE ERROR:', err);

        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

// Get All Invoices
exports.getInvoices = async (req, res) => {
    try {
        const [invoices] = await db.query(`
            SELECT
                invoices.*,
                clients.name AS client_name
            FROM invoices
            JOIN clients
                ON invoices.client_id = clients.id
            ORDER BY invoices.created_at DESC
        `);

        res.status(200).json(invoices);

    } catch (err) {
        console.error('GET INVOICES ERROR:', err);

        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

// Get Single Invoice
exports.getInvoice = async (req, res) => {
    try {
        const { id } = req.params;

        const [invoices] = await db.query(
            `
            SELECT
                invoices.*,
                clients.name AS client_name,
                clients.email AS client_email,
                clients.address AS client_address
            FROM invoices
            JOIN clients
                ON invoices.client_id = clients.id
            WHERE invoices.id = ?
            `,
            [id]
        );

        if (invoices.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Invoice not found'
            });
        }

        const [items] = await db.query(
            'SELECT * FROM invoice_items WHERE invoice_id = ?',
            [id]
        );

        const [payments] = await db.query(
            'SELECT * FROM payments WHERE invoice_id = ?',
            [id]
        );

        res.status(200).json({
            ...invoices[0],
            items,
            payments
        });

    } catch (err) {
        console.error('GET INVOICE ERROR:', err);

        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

// Update Invoice Status
exports.updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        await db.query(
            'UPDATE invoices SET status = ? WHERE id = ?',
            [status, id]
        );

        res.status(200).json({
            success: true,
            message: 'Status updated successfully'
        });

    } catch (err) {
        console.error('UPDATE STATUS ERROR:', err);

        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

// Delete Invoice
exports.deleteInvoice = async (req, res) => {
    try {
        const { id } = req.params;

        await db.query(
            'DELETE FROM invoices WHERE id = ?',
            [id]
        );

        res.status(200).json({
            success: true,
            message: 'Invoice deleted successfully'
        });

    } catch (err) {
        console.error('DELETE INVOICE ERROR:', err);

        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

// Record Payment
exports.recordPayment = async (req, res) => {
    try {
        const {
            invoice_id,
            amount,
            payment_date,
            payment_method
        } = req.body;

        await db.query(
            `INSERT INTO payments
            (
                invoice_id,
                amount,
                payment_date,
                payment_method
            )
            VALUES (?, ?, ?, ?)`,
            [
                invoice_id,
                amount,
                payment_date,
                payment_method
            ]
        );

        const [[invoice]] = await db.query(
            'SELECT grand_total FROM invoices WHERE id = ?',
            [invoice_id]
        );

        const [[paymentInfo]] = await db.query(
            'SELECT COALESCE(SUM(amount),0) AS total_paid FROM payments WHERE invoice_id = ?',
            [invoice_id]
        );

        if (paymentInfo.total_paid >= invoice.grand_total) {
            await db.query(
                'UPDATE invoices SET status = ? WHERE id = ?',
                ['Paid', invoice_id]
            );
        }

        res.status(201).json({
            success: true,
            message: 'Payment recorded successfully'
        });

    } catch (err) {
        console.error('PAYMENT ERROR:', err);

        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};