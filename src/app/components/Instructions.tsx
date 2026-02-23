import { Linkedin, Github } from 'lucide-react';

const LINKS = [
  {
    href: 'https://github.com/hciupinski/',
    Icon: Github,
  },
  {
    href: 'https://www.linkedin.com/in/hubert-ciupinski/',
    Icon: Linkedin,
  },
];

export default function Instructions() {
  return (
    <div className="fixed bottom-0 right-0 z-10 p-5 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg p-4 shadow-sm inline-block">
          <div className="flex items-center gap-6 text-sm text-gray-600">
            {LINKS.map(({ href, Icon }) => (
              <div key={href} className="flex items-center gap-2">
                <a href={href} target="_blank" rel="noreferrer noopener">
                  <Icon className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
