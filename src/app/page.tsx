'use client';
import HomeView from '@/components/Dashboard/HomeView';
import { useTheme } from '@/context/ThemeContext';

export default function Home() {
  const { isDarkMode } = useTheme();
  return (
    <div className={`w-full h-full ${isDarkMode ? 'bg-black' : 'bg-gray-100'}`}>
      <HomeView />
    </div>
  );
}
