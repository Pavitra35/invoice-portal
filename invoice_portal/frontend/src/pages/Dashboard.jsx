import React, { useEffect, useState } from 'react';
import { IndianRupee, Clock, AlertCircle, Users } from 'lucide-react';
import api from '../services/api';
import StatusBadge from '../components/StatusBadge';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/dashboard');
        setStats(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!stats) return <div>Error loading dashboard</div>;

  return (
    <div>
      <div className="page-header">
        <h2>Dashboard</h2>
      </div>

      <div className="stats-grid">
        <div className="card stat-card">
          <div className="stat-icon revenue"><IndianRupee size={24} /></div>
          <div className="stat-content">
            <h3>Total Revenue</h3>
            <p>₹{parseFloat(stats.totalRevenue).toFixed(2)}</p>
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-icon pending"><Clock size={24} /></div>
          <div className="stat-content">
            <h3>Pending Payments</h3>
            <p>₹{parseFloat(stats.pendingPayments).toFixed(2)}</p>
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-icon overdue"><AlertCircle size={24} /></div>
          <div className="stat-content">
            <h3>Overdue Invoices</h3>
            <p>{stats.overdueInvoices}</p>
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-icon clients"><Users size={24} /></div>
          <div className="stat-content">
            <h3>Total Clients</h3>
            <p>{stats.totalClients}</p>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '1.5rem' }}>Recent Invoices</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Client</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentInvoices.map(inv => (
                <tr key={inv.id}>
                  <td>{inv.invoice_number}</td>
                  <td>{inv.client_name}</td>
                  <td>₹{parseFloat(inv.grand_total).toFixed(2)}</td>
                  <td><StatusBadge status={inv.status} /></td>
                  <td>
                    <Link to={`/invoices/${inv.id}`} className="btn btn-primary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}>View</Link>
                  </td>
                </tr>
              ))}
              {stats.recentInvoices.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center' }}>No recent invoices found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
