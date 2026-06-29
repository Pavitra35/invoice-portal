const db = require('../config/db');

exports.getDashboardStats = async (req, res) => {
    try {

        const [[revenueResult]] = await db.query(`
            SELECT COALESCE(SUM(amount),0) AS totalRevenue
            FROM payments
        `);

        const [[clientResult]] = await db.query(`
            SELECT COUNT(*) AS totalClients
            FROM clients
        `);

        const [[invoiceResult]] = await db.query(`
            SELECT COUNT(*) AS overdueInvoices
            FROM invoices
            WHERE status = 'Overdue'
        `);

        const [[pendingResult]] = await db.query(`
            SELECT COALESCE(
                SUM(grand_total),
                0
            ) AS pendingPayments
            FROM invoices
            WHERE status <> 'Paid'
        `);

        const [recentInvoices] = await db.query(`
            SELECT
                invoices.*,
                clients.name AS client_name
            FROM invoices
            LEFT JOIN clients
                ON invoices.client_id = clients.id
            ORDER BY invoices.id DESC
            LIMIT 5
        `);

        res.status(200).json({
            totalRevenue: revenueResult.totalRevenue,
            pendingPayments: pendingResult.pendingPayments,
            overdueInvoices: invoiceResult.overdueInvoices,
            totalClients: clientResult.totalClients,
            recentInvoices
        });

    } catch (err) {
        console.error('DASHBOARD ERROR:', err);

        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};