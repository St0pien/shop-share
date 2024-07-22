'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { cn } from '@/lib/utils';

import { Switch } from './ui/switch';

export function ThemeSwitch() {
  const { resolvedTheme, setTheme } = useTheme();

  const onSwitchTheme = (isDark: boolean) => {
    setTheme(isDark ? 'dark' : 'light');
  };

  const isDarkTheme = resolvedTheme === 'dark';

  return (
    <div className='flex gap-2'>
      <Sun className={cn(!isDarkTheme ? 'text-black' : 'text-gray-500')} />
      <Switch
        className='data-[state=checked]:bg-white data-[state=unchecked]:bg-gray-500'
        checked={isDarkTheme}
        onCheckedChange={onSwitchTheme}
      />
      <Moon className={cn(isDarkTheme ? 'text-white' : 'text-gray-500')} />
    </div>
  );
}
