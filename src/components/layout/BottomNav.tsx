'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, PlusCircle, Film } from 'lucide-react';
import Avatar from '../shared/Avatar';

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/search', icon: Search, label: 'Search' },
  { href: '/create', icon: PlusCircle, label: 'Create' },
  { href: '/reels', icon: Film, label: 'Reels' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      <nav className="bottom-nav-pill flex items-center gap-6 px-6 py-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center justify-center"
            >
              <Icon 
                className={`w-6 h-6 text-white ${isActive ? 'opacity-100' : 'opacity-70'}`}
                strokeWidth={isActive ? 2.5 : 2}
              />
            </Link>
          );
        })}
        
        {/* Profile */}
        <Link href="/profile" className="flex items-center justify-center">
          <div className={`rounded-full ${pathname === '/profile' ? 'ring-2 ring-white' : ''}`}>
            <Avatar size="xs" src="https://i.pravatar.cc/150?img=33" />
          </div>
        </Link>
      </nav>
    </div>
  );
}

