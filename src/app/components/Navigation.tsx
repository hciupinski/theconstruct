import { NavLink } from 'react-router-dom';

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Architect', to: '/architect' },
  { label: 'Portfolio', to: '/portfolio' },
  { label: 'Blog', to: '/blog' },
  { label: 'Matrix', to: '/matrix' },
];

export default function Navigation() {
  return (
    <div className="fixed top-0 left-0 right-0 z-10 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl tracking-tight">The Construct</h1>
            <p className="text-sm text-gray-600 mt-1">
              Software • Architecture • Security
            </p>
          </div>
          <nav className="flex flex-wrap items-center gap-4 text-sm">
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
    </div>
  );
}
