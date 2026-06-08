import React from 'react';

export default function PublicResellerBlogPage() {
  return (
    <div className="w-full min-h-screen bg-white" style={{ margin: 0, padding: 0 }}>
      <iframe
        src="/reseller-blog.html"
        className="w-full min-h-screen border-none"
        style={{ display: 'block' }}
        title="Reseller Blog"
      />
    </div>
  );
}
