import { useState } from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Architect', to: '/architect' },
  { label: 'Portfolio', to: '/portfolio' },
  { label: 'Blog', to: '/blog' },
];

export default function Navigation() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="fixed top-0 left-0 right-0 z-10 bg-white px-5 py-6 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start justify-between gap-3 md:items-center md:gap-4">
            <div>
              <h1 className="text-2xl tracking-tight"><NavLink to="/">The Construct</NavLink></h1>
              <p className="mt-1 text-sm whitespace-nowrap text-gray-600">
                Software • Architecture • Security
              </p>
            </div>
            <button
              type="button"
              className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 text-gray-700 transition hover:text-gray-900"
              onClick={() => setIsSidebarOpen(true)}
              aria-expanded={isSidebarOpen}
              aria-controls="mobile-nav"
              aria-label="Open menu"
            >
              <span className="sr-only">Open menu</span>
              <span className="flex flex-col gap-1">
                <span className="h-0.5 w-5 rounded bg-current" />
                <span className="h-0.5 w-5 rounded bg-current" />
                <span className="h-0.5 w-5 rounded bg-current" />
              </span>
            </button>
          </div>
          <nav className="hidden md:flex flex-wrap items-center gap-4 text-sm">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [
                    'transition-colors',
                    isActive ? 'text-foreground' : 'text-muted-foreground',
                  ].join(' ')
                }
                end={item.to === '/'}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
      <div
        className={[
          'fixed inset-0 bg-black/40 transition-opacity md:hidden',
          isSidebarOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        ].join(' ')}
        onClick={closeSidebar}
      />
      <aside
        id="mobile-nav"
        className={[
          'fixed top-0 right-0 h-full w-full bg-white shadow-xl transition-transform md:hidden',
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full',
        ].join(' ')}
        aria-hidden={!isSidebarOpen}
      >
        <div className="flex items-center justify-between border-b border-gray-100 p-4">
          <span className="text-xl font-medium text-gray-700">The Construct</span>
          <button
            type="button"
            className="rounded-md px-2 py-1 text-xl text-gray-600 transition hover:text-gray-900"
            onClick={closeSidebar}
          >
            Close
          </button>
        </div>
        <nav className="flex flex-col gap-3 p-4 text-4xl">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={closeSidebar}
              className={({ isActive }) =>
                [
                  'transition-colors',
                  isActive ? 'text-foreground' : 'text-muted-foreground',
                ].join(' ')
              }
              end={item.to === '/'}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </div>
  );
}
