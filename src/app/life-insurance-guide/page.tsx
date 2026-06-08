import React from 'react';

export default function PublicLifeInsuranceGuidePage() {
  return (
    <div className="w-full min-h-screen bg-white" style={{ margin: 0, padding: 0 }}>
      <iframe
        src="/life-insurance-guide.html"
        className="w-full min-h-screen border-none"
        style={{ display: 'block', width: '100%', height: '100vh' }}
        title="Life Insurance Guide"
      />
    </div>
  );
}
