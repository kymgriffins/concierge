import React from 'react';

const AppleDesignDemo = () => {
  return (
    <div className="min-h-screen bg-apple-white">
      {/* Hero Section */}
      <section className="min-h-hero flex items-center justify-center bg-gradient-hero text-apple-white">
        <div className="text-center px-section-x">
          <h1 className="text-hero font-display font-semibold leading-tight mb-6">
            Think Different
          </h1>
          <p className="text-body font-body leading-normal max-w-2xl mx-auto">
            Experience the precision and elegance of Apple's design system, now available in your Tailwind CSS project.
          </p>
        </div>
      </section>

      {/* Typography Section */}
      <section className="py-section-y px-section-x">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-h1 font-display font-semibold mb-12 text-apple-black">Typography</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-h2 font-display font-semibold mb-6 text-apple-black">SF Pro Display</h3>
              <p className="text-hero font-display leading-tight text-apple-gray-200 mb-4">Hero Text</p>
              <p className="text-h1 font-display leading-tight text-apple-black mb-4">Heading 1</p>
              <p className="text-h2 font-display leading-tight text-apple-black mb-4">Heading 2</p>
            </div>

            <div>
              <h3 className="text-h2 font-display font-semibold mb-6 text-apple-black">SF Pro Text</h3>
              <p className="text-body font-body leading-normal text-apple-black mb-4">
                Body text using SF Pro Text with normal line height. This is the standard reading font used throughout Apple's ecosystem.
              </p>
              <p className="text-caption font-body leading-normal text-apple-gray-200">
                Caption text for secondary information and metadata.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Colors Section */}
      <section className="py-section-y px-section-x bg-apple-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-h1 font-display font-semibold mb-12 text-apple-black">Colors</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto rounded-lg bg-apple-black mb-3"></div>
              <p className="text-caption font-body text-apple-black">Apple Black</p>
              <p className="text-caption font-body text-apple-gray-200">#1D1D1F</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 mx-auto rounded-lg bg-apple-white border border-apple-gray-100 mb-3"></div>
              <p className="text-caption font-body text-apple-black">Apple White</p>
              <p className="text-caption font-body text-apple-gray-200">#F5F5F7</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 mx-auto rounded-lg bg-apple-gray-200 mb-3"></div>
              <p className="text-caption font-body text-apple-black">Apple Gray 200</p>
              <p className="text-caption font-body text-apple-gray-200">Subtle Blue Tint</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 mx-auto rounded-lg bg-accent-blue mb-3"></div>
              <p className="text-caption font-body text-apple-black">Accent Blue</p>
              <p className="text-caption font-body text-apple-gray-200">Link Hover</p>
            </div>
          </div>
        </div>
      </section>

      {/* Spacing & Layout Section */}
      <section className="py-section-y px-section-x">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-h1 font-display font-semibold mb-12 text-apple-black">Spacing & Layout</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-product-card-gap">
            <div className="bg-apple-white p-8 rounded-lg shadow-product border border-apple-gray-100">
              <h3 className="text-h2 font-display font-semibold mb-4 text-apple-black">Section Padding</h3>
              <p className="text-body font-body leading-normal text-apple-gray-200 mb-4">
                Generous vertical rhythm with responsive horizontal padding.
              </p>
              <code className="text-caption font-mono bg-apple-gray-50 px-2 py-1 rounded">
                py-section-y px-section-x
              </code>
            </div>

            <div className="bg-apple-white p-8 rounded-lg shadow-product border border-apple-gray-100">
              <h3 className="text-h2 font-display font-semibold mb-4 text-apple-black">Product Cards</h3>
              <p className="text-body font-body leading-normal text-apple-gray-200 mb-4">
                Subtle shadows and consistent spacing for product showcases.
              </p>
              <code className="text-caption font-mono bg-apple-gray-50 px-2 py-1 rounded">
                shadow-product gap-product-card-gap
              </code>
            </div>

            <div className="bg-apple-white p-8 rounded-lg shadow-product border border-apple-gray-100">
              <h3 className="text-h2 font-display font-semibold mb-4 text-apple-black">Navigation</h3>
              <p className="text-body font-body leading-normal text-apple-gray-200 mb-4">
                Fixed header with precise 44px height matching macOS standards.
              </p>
              <code className="text-caption font-mono bg-apple-gray-50 px-2 py-1 rounded">
                h-header-height shadow-navbar
              </code>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Preview */}
      <footer className="py-footer-padding-y px-section-x bg-apple-black text-apple-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-footer-column-gap mb-8">
            <div>
              <h4 className="text-body font-display font-semibold mb-4">Shop and Learn</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-caption font-body text-apple-gray-200 hover:text-apple-white transition-colors">Store</a></li>
                <li><a href="#" className="text-caption font-body text-apple-gray-200 hover:text-apple-white transition-colors">Mac</a></li>
                <li><a href="#" className="text-caption font-body text-apple-gray-200 hover:text-apple-white transition-colors">iPad</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-body font-display font-semibold mb-4">Apple Values</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-caption font-body text-apple-gray-200 hover:text-apple-white transition-colors">Accessibility</a></li>
                <li><a href="#" className="text-caption font-body text-apple-gray-200 hover:text-apple-white transition-colors">Privacy</a></li>
                <li><a href="#" className="text-caption font-body text-apple-gray-200 hover:text-apple-white transition-colors">Environment</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-body font-display font-semibold mb-4">About Apple</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-caption font-body text-apple-gray-200 hover:text-apple-white transition-colors">Newsroom</a></li>
                <li><a href="#" className="text-caption font-body text-apple-gray-200 hover:text-apple-white transition-colors">Leadership</a></li>
                <li><a href="#" className="text-caption font-body text-apple-gray-200 hover:text-apple-white transition-colors">Career Opportunities</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-body font-display font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-caption font-body text-apple-gray-200 hover:text-apple-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="text-caption font-body text-apple-gray-200 hover:text-apple-white transition-colors">User Guides</a></li>
                <li><a href="#" className="text-caption font-body text-apple-gray-200 hover:text-apple-white transition-colors">Warranty</a></li>
              </ul>
            </div>
          </div>

          <hr className="border-footer-divider mb-6" />

          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-copyright-size font-body text-apple-gray-200 mb-4 md:mb-0">
              Copyright © 2024 Apple Inc. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-6">
              <a href="#" className="text-copyright-size font-body text-apple-gray-200 hover:text-apple-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-copyright-size font-body text-apple-gray-200 hover:text-apple-white transition-colors">Terms of Use</a>
              <a href="#" className="text-copyright-size font-body text-apple-gray-200 hover:text-apple-white transition-colors">Sales and Refunds</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AppleDesignDemo;
