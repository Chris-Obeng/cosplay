import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { CosplayCreator } from './components/CosplayCreator';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = storedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    const newTheme = theme;
    const oldTheme = newTheme === 'light' ? 'dark' : 'light';
    
    root.classList.remove(oldTheme);
    root.classList.add(newTheme);
    localStorage.setItem('theme', newTheme);
  }, [theme]);
  
  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

const App: React.FC = () => {
    const [showApp, setShowApp] = useState(false);

    const handleLaunchApp = () => {
        setShowApp(true);
    };

    return (
        <ThemeProvider>
            <div className="min-h-screen bg-bg-primary text-text-primary font-sans">
                <Header />
                <main className="pt-16">
                    <SignedOut>
                        <LandingPage />
                    </SignedOut>
                    <SignedIn>
                        <CosplayCreator />
                    </SignedIn>
                </main>
            </div>
        </ThemeProvider>
    );
};

export default App;
