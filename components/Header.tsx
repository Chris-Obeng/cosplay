
import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { Icons } from './icons';
import { ThemeContext } from '../App';
import BackButton from './BackButton';

export const Header: React.FC = () => {
  const themeContext = useContext(ThemeContext);
  const location = useLocation();
  const isGalleryPage = location.pathname === '/gallery';

  if (!themeContext) {
    // Should not happen as it's wrapped in provider
    return null;
  }

  const { theme, toggleTheme } = themeContext;

  return (
    <header className="fixed top-0 left-0 right-0 bg-bg-primary/80 backdrop-blur-lg border-b border-border-primary z-50 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-1 flex items-center justify-start">
            {isGalleryPage ? (
              <BackButton />
            ) : (
              <Link to="/" className="flex items-center space-x-2">
                <div className="text-accent">
                  <Icons.sparkles size={28} />
                </div>
                <h1 className="text-lg sm:text-xl font-bold text-text-primary tracking-tight transition-colors duration-300">
                  CosplayMe
                </h1>
              </Link>
            )}
          </div>

          {isGalleryPage && (
            <div className="flex-1 flex items-center justify-center">
              <h1 className="text-lg sm:text-xl font-bold text-text-primary tracking-tight transition-colors duration-300">
                Cosplay Gallery
              </h1>
            </div>
          )}

          <div className="flex-1 flex items-center justify-end space-x-2 sm:space-x-4">
            <SignedIn>
              {!isGalleryPage && (
                <Link to="/gallery" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors duration-300 px-4 py-2 rounded-lg bg-gray-100/10 hover:bg-gray-100/20">
                  Gallery
                </Link>
              )}
            </SignedIn>
            <button
                onClick={toggleTheme}
                aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                className="h-11 w-11 flex items-center justify-center rounded-full bg-bg-secondary text-text-secondary hover:text-text-primary transition-colors duration-300">
                {theme === 'dark' ? <Icons.sun size={22} /> : <Icons.moon size={22} />}
            </button>
            <SignedOut>
                <SignInButton />
            </SignedOut>
            <SignedIn>
                <UserButton />
            </SignedIn>
          </div>
        </div>
      </div>
    </header>
  );
};
