import React from 'react';

const StatusBadge = ({ status }) => {
  const statusClass = status ? status.toLowerCase() : '';
  return (
    <span className={`badge ${statusClass}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
