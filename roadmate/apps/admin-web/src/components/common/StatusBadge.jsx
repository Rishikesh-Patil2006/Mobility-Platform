import React from 'react';
import { Tag } from 'antd';

export default function StatusBadge({ status }) {
  const normalized = status ? status.toLowerCase() : '';

  let color = 'default';
  let text = status || 'Unknown';

  if (normalized === 'active' || normalized === 'valid' || normalized === 'approved') {
    color = 'success';
    text = normalized === 'valid' ? 'Valid' : normalized === 'approved' ? 'Approved' : 'Active';
  } else if (normalized === 'pending' || normalized === 'pending_approval') {
    color = 'warning';
    text = normalized === 'pending_approval' ? 'Pending Approval' : 'Pending';
  } else if (normalized === 'suspended' || normalized === 'rejected' || normalized === 'expired') {
    color = 'error';
    text = normalized === 'expired' ? 'Expired' : normalized === 'rejected' ? 'Rejected' : 'Suspended';
  } else if (normalized === 'draft') {
    color = 'default';
    text = 'Draft';
  }

  return (
    <Tag 
      color={color} 
      className="px-3 py-1 rounded-full text-xs font-bold font-sans uppercase tracking-wider border-0"
      style={{
        margin: 0
      }}
    >
      {text}
    </Tag>
  );
}
