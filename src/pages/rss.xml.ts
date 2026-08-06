import { getCollection } from 'astro:content';

const escapeXml = (value: string) =>
  value.replace(/[<>&'\"]/g, (character) => ({
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    "'": '&apos;',
    '"': '&quot;',
  })[character] ?? character);

export async function GET() {
  const posts = (await getCollection('blog', ({ data }) => !data.draft)).sort(
    (left, right) => right.data.publishedAt.valueOf() - left.data.publishedAt.valueOf()
  );
  const site = 'https://hciupinski.github.io/theconstruct';
  const items = posts.map((post) => {
    const url = `${site}/blog/${post.id}/`;
    return `<item><title>${escapeXml(post.data.title)}</title><description>${escapeXml(post.data.excerpt)}</description><link>${url}</link><guid>${url}</guid><pubDate>${post.data.publishedAt.toUTCString()}</pubDate></item>`;
  }).join('');
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>The Construct</title><description>Software architecture, security, and engineering notes.</description><link>${site}/</link>${items}</channel></rss>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
