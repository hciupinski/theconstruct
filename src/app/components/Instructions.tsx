import { GitBranch, PersonStanding } from 'lucide-react';

const LINKS = [
  {
    href: 'https://github.com/hciupinski/',
    label: 'github.com',
    Icon: GitBranch,
  },
  {
    href: 'https://www.linkedin.com/in/hubert-ciupinski/',
    label: 'linkedin.com',
    Icon: PersonStanding,
  },
];

export default function Instructions() {
  return (
    <div className="fixed bottom-0 right-0 z-10 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg p-4 shadow-sm inline-block">
          <div className="flex items-center gap-6 text-sm text-gray-600">
            {LINKS.map(({ href, label, Icon }) => (
              <div key={href} className="flex items-center gap-2">
                <Icon className="w-4 h-4" />
                <a href={href} target="_blank" rel="noreferrer noopener">
                  <span>{label}</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
