import React from 'react';

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem('user')) || { name: 'User' };

  return (
    <div className="navbar">
      <div></div>
      <div className="user-info">
        <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
          {user.name.charAt(0).toUpperCase()}
        </div>
        <span>{user.name}</span>
      </div>
    </div>
  );
};

export default Navbar;
