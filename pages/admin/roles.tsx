// pages/admin/roles.tsx
import React from 'react';
import Protected from '../../components/Protected';

export default function Roles() {
  return (
    <div>
      <Protected role={3}>
        <p>This content is only visible to users with the role 3.</p>
      </Protected>
      <Protected role={4}>
        <p>This content is only visible to users with the role 4.</p>
      </Protected>
    </div>
  );
}
