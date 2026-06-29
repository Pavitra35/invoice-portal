import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, LogOut } from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <FileText size={24} color="var(--primary)" />
        InvoicePortal
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/" className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}>
          <LayoutDashboard size={20} />
          Dashboard
        </NavLink>
        <NavLink to="/clients" className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}>
          <Users size={20} />
          Clients
        </NavLink>
        <NavLink to="/invoices" className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}>
          <FileText size={20} />
          Invoices
        </NavLink>
      </nav>
      <div className="sidebar-logout" onClick={handleLogout}>
        <LogOut size={20} />
        Logout
      </div>
    </div>
  );
};

export default Sidebar;
