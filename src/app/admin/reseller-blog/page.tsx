import React from 'react';

export default function ResellerBlogPage() {
  return (
    <div className="flex-1 w-full h-full min-h-screen bg-white">
      <iframe
        src="/reseller-blog.html"
        className="w-full h-full min-h-[calc(100vh-4rem)] border-none"
        title="Reseller Blog"
      />
    </div>
  );
}
