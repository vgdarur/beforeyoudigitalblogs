import React from 'react';

export default function PaymentPrdPage() {
  return (
    <div style={{ width: '100%', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <iframe
        src="/payment-module-requirements.html"
        style={{ width: '100%', height: '100vh', border: 'none' }}
        title="Zero-Interchange Merchant Payment PRD"
      />
    </div>
  );
}
