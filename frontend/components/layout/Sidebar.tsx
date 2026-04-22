'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '../../lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: '📊' },
  { name: 'Namespaces', href: '/namespaces', icon: '📁' },
  { name: 'Pods', href: '/pods', icon: '🚀' },
  { name: 'Deployments', href: '/deployments', icon: '⚙️' },
  { name: 'Services', href: '/services', icon: '🌐' },
  { name: 'Events', href: '/events', icon: '📋' },
  { name: 'Logs', href: '/logs', icon: '📝' },
  { name: 'AI Insights', href: '/ai-insights', icon: '🤖' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-gray-900">
      <div className="flex h-16 shrink-0 items-center px-4">
        <h1 className="text-xl font-bold text-white">K8s Assist</h1>
      </div>
      <nav className="flex flex-1 flex-col px-2 py-4">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      pathname === item.href
                        ? 'bg-gray-800 text-white'
                        : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                      'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6'
                    )}
                  >
                    <span className="text-lg">{item.icon}</span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  );
}