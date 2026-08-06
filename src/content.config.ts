import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string().min(1),
    excerpt: z.string().min(1),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    tags: z.array(z.string().min(1)).min(1),
    seoTitle: z.string().min(1).optional(),
    coverImage: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const portfolio = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/portfolio' }),
  schema: z.object({
    title: z.string().min(1),
    summary: z.string().min(1),
    techStack: z.array(z.string().min(1)).min(1),
    links: z
      .array(
        z.object({
          label: z.string().min(1),
          href: z.string().url(),
        })
      )
      .min(1),
    seoTitle: z.string().min(1).optional(),
    coverImage: z.string().optional(),
    updatedAt: z.coerce.date().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog, portfolio };
