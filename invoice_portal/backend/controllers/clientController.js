const db = require('../config/db');

exports.getClients = async (req, res) => {
    try {
        const [clients] = await db.query('SELECT * FROM clients ORDER BY created_at DESC');
        res.json(clients);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.addClient = async (req, res) => {
    const { name, email, phone, company, address } = req.body;
    try {
        const [result] = await db.query('INSERT INTO clients (name, email, phone, company, address) VALUES (?, ?, ?, ?, ?)', [name, email, phone, company, address]);
        res.status(201).json({ id: result.insertId, name, email, phone, company, address });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateClient = async (req, res) => {
    const { id } = req.params;
    const { name, email, phone, company, address } = req.body;
    try {
        await db.query('UPDATE clients SET name=?, email=?, phone=?, company=?, address=? WHERE id=?', [name, email, phone, company, address, id]);
        res.json({ id, name, email, phone, company, address });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteClient = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM clients WHERE id=?', [id]);
        res.json({ message: 'Client deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
