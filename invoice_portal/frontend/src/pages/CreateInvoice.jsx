import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Plus, Trash2 } from 'lucide-react';

const CreateInvoice = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [formData, setFormData] = useState({
    client_id: '',
    issue_date: '',
    due_date: '',
    tax_rate: 0
  });
  const [items, setItems] = useState([
    { description: '', quantity: 1, unit_price: 0, subtotal: 0 }
  ]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await api.get('/clients');
        setClients(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchClients();
  }, []);

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    if (field === 'quantity' || field === 'unit_price') {
      newItems[index].subtotal = newItems[index].quantity * newItems[index].unit_price;
    }
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { description: '', quantity: 1, unit_price: 0, subtotal: 0 }]);
  };

  const removeItem = (index) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  const tax_amount = subtotal * (formData.tax_rate / 100);
  const grand_total = subtotal + tax_amount;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.client_id) return alert('Please select a client');

    const payload = {
      ...formData,
      subtotal,
      tax_amount,
      grand_total,
      items
    };

    try {
      await api.post('/invoices', payload);
      navigate('/invoices');
    } catch (err) {
      console.error(err);
      alert('Error creating invoice');
    }
  };

  return (
    <div>
      <div className="page-header">
        <h2>Create Invoice</h2>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
            <div className="form-group">
              <label>Client</label>
              <select required value={formData.client_id} onChange={(e) => setFormData({...formData, client_id: e.target.value})}>
                <option value="">Select Client</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Issue Date</label>
              <input type="date" required value={formData.issue_date} onChange={(e) => setFormData({...formData, issue_date: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Due Date</label>
              <input type="date" required value={formData.due_date} onChange={(e) => setFormData({...formData, due_date: e.target.value})} />
            </div>
          </div>

          <h3 style={{ marginBottom: '1rem' }}>Line Items</h3>
          <div className="table-container" style={{ marginBottom: '1.5rem' }}>
            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th style={{ width: '100px' }}>Qty</th>
                  <th style={{ width: '150px' }}>Price</th>
                  <th style={{ width: '150px' }}>Total</th>
                  <th style={{ width: '80px' }}></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <input style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--border)', borderRadius: '0.25rem' }} required value={item.description} onChange={(e) => handleItemChange(index, 'description', e.target.value)} placeholder="Item description" />
                    </td>
                    <td>
                      <input type="number" min="1" style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--border)', borderRadius: '0.25rem' }} required value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value))} />
                    </td>
                    <td>
                      <input type="number" min="0" step="0.01" style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--border)', borderRadius: '0.25rem' }} required value={item.unit_price} onChange={(e) => handleItemChange(index, 'unit_price', parseFloat(e.target.value))} />
                    </td>
                    <td>₹{item.subtotal.toFixed(2)}</td>
                    <td>
                      <button type="button" className="btn btn-danger" style={{ padding: '0.5rem' }} onClick={() => removeItem(index)}>
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button type="button" className="btn btn-primary" onClick={addItem} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
            <Plus size={16} /> Add Item
          </button>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ width: '300px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Subtotal:</span>
                <strong>₹{subtotal.toFixed(2)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span>Tax Rate (%):</span>
                <input type="number" min="0" max="100" style={{ width: '80px', padding: '0.25rem', border: '1px solid var(--border)', borderRadius: '0.25rem' }} value={formData.tax_rate} onChange={(e) => setFormData({...formData, tax_rate: parseFloat(e.target.value) || 0})} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span>Tax Amount:</span>
                <strong>₹{tax_amount.toFixed(2)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '1rem', fontSize: '1.25rem' }}>
                <strong>Grand Total:</strong>
                <strong>₹{grand_total.toFixed(2)}</strong>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <button type="button" className="btn" style={{ backgroundColor: 'var(--border)' }} onClick={() => navigate('/invoices')}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Invoice</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateInvoice;
