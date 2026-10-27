import React from 'react';

export default function PublicPaymentPrdPage() {
  return (
    <div style={{ width: '100%', minHeight: '100vh', backgroundColor: '#f8fafc', margin: 0, padding: 0 }}>
      <iframe
        src="/payment-module-requirements.html"
        style={{ width: '100%', height: '100vh', border: 'none', display: 'block' }}
        title="Zero-Interchange Merchant Payment PRD"
      />
    </div>
  );
}
