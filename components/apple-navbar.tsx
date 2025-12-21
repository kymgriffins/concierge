import React from 'react';

const AppleNavbar = () => {
  return (
    <header className="fixed top-0 z-50 w-full h-header-height backdrop-blur-sm shadow-navbar bg-apple-white/80">
      <nav className="flex items-center justify-between px-header-padding-x h-full">
        {/* Apple Logo */}
        <div className="flex items-center">
          <svg className="w-5 h-5 text-apple-black" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
          </svg>
        </div>

        {/* Navigation Items */}
        <ul className="flex items-center gap-navbar-item-gap">
          <li>
            <a href="#" className="text-apple-black text-navbar-item-size font-medium hover:text-accent-blue transition-colors duration-200">
              Store
            </a>
          </li>
          <li>
            <a href="#" className="text-apple-black text-navbar-item-size font-medium hover:text-accent-blue transition-colors duration-200">
              Mac
            </a>
          </li>
          <li>
            <a href="#" className="text-apple-black text-navbar-item-size font-medium hover:text-accent-blue transition-colors duration-200">
              iPad
            </a>
          </li>
          <li>
            <a href="#" className="text-apple-black text-navbar-item-size font-medium hover:text-accent-blue transition-colors duration-200">
              iPhone
            </a>
          </li>
          <li>
            <a href="#" className="text-apple-black text-navbar-item-size font-medium hover:text-accent-blue transition-colors duration-200">
              Watch
            </a>
          </li>
          <li>
            <a href="#" className="text-apple-black text-navbar-item-size font-medium hover:text-accent-blue transition-colors duration-200">
              Vision
            </a>
          </li>
          <li>
            <a href="#" className="text-apple-black text-navbar-item-size font-medium hover:text-accent-blue transition-colors duration-200">
              AirPods
            </a>
          </li>
          <li>
            <a href="#" className="text-apple-black text-navbar-item-size font-medium hover:text-accent-blue transition-colors duration-200">
              TV & Home
            </a>
          </li>
          <li>
            <a href="#" className="text-apple-black text-navbar-item-size font-medium hover:text-accent-blue transition-colors duration-200">
              Entertainment
            </a>
          </li>
          <li>
            <a href="#" className="text-apple-black text-navbar-item-size font-medium hover:text-accent-blue transition-colors duration-200">
              Accessories
            </a>
          </li>
          <li>
            <a href="#" className="text-apple-black text-navbar-item-size font-medium hover:text-accent-blue transition-colors duration-200">
              Support
            </a>
          </li>
        </ul>

        {/* Search and Bag Icons */}
        <div className="flex items-center gap-4">
          <button className="p-2 text-apple-black hover:text-accent-blue transition-colors duration-200">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <button className="relative p-2 text-apple-black hover:text-accent-blue transition-colors duration-200">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {/* Bag Badge */}
            <span className="absolute -top-1 -right-1 bg-accent-red text-apple-white text-bag-badge-size rounded-full w-4 h-4 flex items-center justify-center font-medium">
              1
            </span>
          </button>
        </div>
      </nav>
    </header>
  );
};

export default AppleNavbar;
