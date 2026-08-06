export const site = {
  name: 'The Construct',
  origin: 'https://theconstruct.ing',
  locale: 'en_US',
  language: 'en',
  defaultTitle: 'The Construct — Software, Architecture, Security',
  defaultDescription: 'Software architecture, security, and engineering notes by Hubert Ciupinski.',
  author: {
    name: 'Hubert Ciupinski',
    github: 'https://github.com/hciupinski/',
    linkedin: 'https://www.linkedin.com/in/hubert-ciupinski/',
  },
  defaultImage: '/og-default.svg',
} as const;

export const absoluteUrl = (path: string) => new URL(path, `${site.origin}/`).toString();

export const absoluteImageUrl = (path: string = site.defaultImage) => absoluteUrl(path);
