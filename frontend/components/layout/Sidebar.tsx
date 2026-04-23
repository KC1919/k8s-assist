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
    <div className="flex h-full w-64 flex-col bg-slate-950 border-r border-slate-800">
      <div className="flex h-16 shrink-0 items-center px-4">
        <h1 className="text-xl font-bold text-white">K8s Assist</h1>
      </div>
      <nav className="flex flex-1 flex-col px-3 py-4">
        <ul role="list" className="flex flex-1 flex-col divide-y divide-slate-800">
          {navigation.map((item) => (
            <li key={item.name} className="py-1">
              <Link
                href={item.href}
                className={cn(
                  pathname === item.href
                    ? 'bg-slate-700 text-white shadow-sm ring-1 ring-slate-600'
                    : 'bg-slate-900 text-slate-200 hover:bg-slate-800 hover:text-white hover:ring-1 hover:ring-slate-600',
                  'group flex items-center gap-x-3 rounded-2xl px-4 py-3 text-sm font-semibold leading-6 transition duration-150 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 cursor-pointer'
                )}
              >
                <span className="text-base">{item.icon}</span>
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}