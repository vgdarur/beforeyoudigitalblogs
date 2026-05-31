import React from 'react';

export default function ImportExportGuidePage() {
  return (
    <div className="flex-1 w-full h-full min-h-screen bg-white">
      <iframe
        src="/import-export-guide.html"
        className="w-full h-full min-h-[calc(100vh-4rem)] border-none"
        title="Import & Export Guide"
      />
    </div>
  );
}
