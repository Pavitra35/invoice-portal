import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import StatusBadge from '../components/StatusBadge';

const InvoiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentData, setPaymentData] = useState({ amount: '', payment_date: '', payment_method: 'Bank Transfer' });

  const fetchInvoice = async () => {
    try {
      const res = await api.get(`/invoices/${id}`);
      setInvoice(res.data);
    } catch (err) {
      console.error(err);
      navigate('/invoices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoice();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    try {
      await api.put(`/invoices/${id}/status`, { status: newStatus });
      fetchInvoice();
    } catch (err) {
      console.error(err);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    try {
      await api.post('/invoices/payment', {
        invoice_id: id,
        ...paymentData
      });
      setShowPaymentModal(false);
      setPaymentData({ amount: '', payment_date: '', payment_method: 'Bank Transfer' });
      fetchInvoice();
    } catch (err) {
      console.error(err);
      alert('Error recording payment');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!invoice) return <div>Invoice not found</div>;

  const totalPaid = invoice.payments ? invoice.payments.reduce((sum, p) => sum + parseFloat(p.amount), 0) : 0;
  const balance = invoice.grand_total - totalPaid;

  return (
    <div>
      <div className="page-header">
        <h2>Invoice {invoice.invoice_number}</h2>
        <div className="action-btns">
          {invoice.status !== 'Paid' && invoice.status !== 'Cancelled' && (
            <button className="btn btn-primary" onClick={() => setShowPaymentModal(true)}>Record Payment</button>
          )}
          <select className="btn" style={{ border: '1px solid var(--border)', backgroundColor: 'white' }} value={invoice.status} onChange={(e) => handleStatusChange(e.target.value)}>
            <option value="Draft">Draft</option>
            <option value="Sent">Sent</option>
            <option value="Paid">Paid</option>
            <option value="Overdue">Overdue</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div>
            <h3 style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Billed To</h3>
            <p style={{ fontWeight: '600', fontSize: '1.125rem' }}>{invoice.client_name}</p>
            <p>{invoice.client_email}</p>
            <p>{invoice.client_address}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <h3 style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Invoice Details</h3>
            <p><strong>Status:</strong> <StatusBadge status={invoice.status} /></p>
            <p><strong>Issue Date:</strong> {new Date(invoice.issue_date).toLocaleDateString()}</p>
            <p><strong>Due Date:</strong> {new Date(invoice.due_date).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="table-container" style={{ marginBottom: '2rem' }}>
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items && invoice.items.map(item => (
                <tr key={item.id}>
                  <td>{item.description}</td>
                  <td>{item.quantity}</td>
                  <td>₹{parseFloat(item.unit_price).toFixed(2)}</td>
                  <td>₹{parseFloat(item.subtotal).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ width: '300px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>Subtotal:</span>
              <span>₹{parseFloat(invoice.subtotal).toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>Tax ({invoice.tax_rate}%):</span>
              <span>₹{parseFloat(invoice.tax_amount).toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '1rem', fontSize: '1.25rem', marginBottom: '0.5rem' }}>
              <strong>Grand Total:</strong>
              <strong>₹{parseFloat(invoice.grand_total).toFixed(2)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--secondary)' }}>
              <span>Amount Paid:</span>
              <span>₹{totalPaid.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: balance > 0 ? 'var(--danger)' : 'var(--text-main)', fontWeight: 'bold', marginTop: '0.5rem' }}>
              <span>Balance Due:</span>
              <span>₹{balance.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '1.5rem' }}>Payment History</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Method</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.payments && invoice.payments.map(payment => (
                <tr key={payment.id}>
                  <td>{new Date(payment.payment_date).toLocaleDateString()}</td>
                  <td>{payment.payment_method}</td>
                  <td>₹{parseFloat(payment.amount).toFixed(2)}</td>
                </tr>
              ))}
              {(!invoice.payments || invoice.payments.length === 0) && (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center' }}>No payments recorded yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showPaymentModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card" style={{ width: '400px', maxWidth: '90%' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Record Payment</h3>
            <form onSubmit={handlePayment}>
              <div className="form-group">
                <label>Amount</label>
                <input type="number" step="0.01" max={balance} required value={paymentData.amount} onChange={(e) => setPaymentData({...paymentData, amount: e.target.value})} />
                <small style={{ color: 'var(--text-muted)' }}>Max: ₹{balance.toFixed(2)}</small>
              </div>
              <div className="form-group">
                <label>Date</label>
                <input type="date" required value={paymentData.payment_date} onChange={(e) => setPaymentData({...paymentData, payment_date: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Method</label>
                <select value={paymentData.payment_method} onChange={(e) => setPaymentData({...paymentData, payment_method: e.target.value})}>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Cash">Cash</option>
                  <option value="Check">Check</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save</button>
                <button type="button" className="btn btn-danger" style={{ flex: 1 }} onClick={() => setShowPaymentModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceDetail;
