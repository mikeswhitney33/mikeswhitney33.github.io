"use client"
import React from 'react';
import Link from 'next/link';
import { useState } from 'react';

const Navbar = () => {
    const [showMenu, setShowMenu] = useState<boolean>(false);
    return (
      <nav className="bg-navy-blue print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-light-blue font-bold text-xl">
                Mike Whitney
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  href="/"
                  className="text-powder-blue hover:bg-royal-blue hover:text-light-blue px-3 py-2 rounded-md text-sm font-medium"
                >
                  Home
                </Link>
                <Link
                  href="/projects"
                  className="text-powder-blue hover:bg-royal-blue hover:text-light-blue px-3 py-2 rounded-md text-sm font-medium"
                >
                  Projects
                </Link>
                <Link
                  href="/resume"
                  className="text-powder-blue hover:bg-royal-blue hover:text-light-blue px-3 py-2 rounded-md text-sm font-medium"
                >
                  Resume
                </Link>
              </div>
            </div>
            <div className="-mr-2 flex md:hidden">
              {/* Mobile menu button */}
              <button
                type="button"
                className="bg-midnight-blue inline-flex items-center justify-center p-2 rounded-md text-powder-blue hover:text-light-blue hover:bg-royal-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-midnight-blue focus:ring-light-blue"
                aria-controls="mobile-menu"
                aria-expanded="false"
                onClick={() => {
                  setShowMenu(!showMenu)
                }}
              >
                <span className="sr-only">Open main menu</span>
                {/* Icon for mobile menu */}
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
        {/* Mobile menu */}
        {showMenu &&
                <div className="md:hidden" id="mobile-menu">
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                  <Link
                    href="/"
                    className="text-powder-blue hover:bg-royal-blue hover:text-light-blue block px-3 py-2 rounded-md text-base font-medium"
                  >
                    Home
                  </Link>
                  <Link
                    href="/projects"
                    className="text-powder-blue hover:bg-royal-blue hover:text-light-blue block px-3 py-2 rounded-md text-base font-medium"
                  >
                    Projects
                  </Link>
                  <a
                    href="/resume"
                    className="text-powder-blue hover:bg-royal-blue hover:text-light-blue block px-3 py-2 rounded-md text-base font-medium"
                  >
                    Resume
                  </a>
                </div>
              </div>
        }

      </nav>
    );
  };

export default Navbar;