import React from 'react';

export default function LifeInsuranceGuidePage() {
  return (
    <div className="flex-1 w-full h-full min-h-screen bg-white">
      <iframe
        src="/life-insurance-guide.html"
        className="w-full h-full min-h-[calc(100vh-4rem)] border-none"
        title="Life Insurance Guide"
      />
    </div>
  );
}
