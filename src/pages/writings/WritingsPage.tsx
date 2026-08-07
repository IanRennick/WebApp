// src/pages/writings/WritingsPage.tsx
import React from 'react';
import { Writings } from '../../components/writings/Writings';

const WritingsPage: React.FC = () => {
  return (
    <div className="writings_page_container" style={{ width: '100%' }}>
      <Writings />
    </div>
  );
};

export default WritingsPage;