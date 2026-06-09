import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';

interface BlogPost {
  title: string;
  category: string;
  date: string;
  readTime: string;
  summary: string; // Machine-readable summary for AI engines
  content: string[]; // Sections of content
  citations: string[];
  stats: string[];
  faqs: { q: string; a: string }[];
}

const POST_DATABASE: Record<string, BlogPost> = {
  'benefits-dates-chocolate-milk': {
    title: 'The Nutritional Benefits of Adding Dates Powder to Chocolate Milk',
    category: 'Nutrition',
    date: 'June 9, 2026',
    readTime: '4 min read',
    summary: 'Replacing refined sugars in chocolate health drinks with real dates powder provides natural sweetness alongside dietary fiber, potassium, iron, and sustained daily energy without glycemic spikes.',
    content: [
      'Refined white sugar offers empty calories with zero nutrients, leading to rapid blood glucose spikes followed by energy crashes. On the other hand, natural dates powder acts as a nutrient-dense whole food sweetener.',
      'Dates are exceptionally rich in dietary fiber, which slows down glucose absorption. They contain minerals like potassium (crucial for muscle and heart function), magnesium, iron, and B-vitamins that facilitate clean daily metabolism.',
      'By blending dates powder with cocoa, oats, and dry fruits, you create a delicious chocolate drink mix that supports child growth and adult workout recovery naturally.',
    ],
    citations: [
      'Fructans and dietary fiber values in phoenix dactylifera, Journal of Food Chemistry, 2022.',
      'Comparison of refined sugars vs. natural whole fruit powders in glycemic index testing, International Journal of Food Science.',
    ],
    stats: [
      'Dates contain up to 8g of dietary fiber per 100g serving.',
      'Switching to dates powder cuts refined white sugar intake to zero while maintaining rich sweetness.',
    ],
    faqs: [
      { q: 'Is dates powder safe for toddlers and children?', a: 'Yes! Dates powder is a whole food ingredient made by grinding dehydrated dates, making it an excellent replacement for sugary commercial powders.' },
      { q: 'Does dates powder dissolve completely in cold milk?', a: 'Because dates powder contains natural insoluble dietary fiber, it is best mixed in warm milk or blended in a shaker for cold milkshakes.' },
    ],
  },
  'healthy-drinks-without-refined-sugar-kids': {
    title: 'Top Sugar-Free Healthy Drinks for Kids in India: A Parent\'s Guide',
    category: 'Healthy Living',
    date: 'June 8, 2026',
    readTime: '5 min read',
    summary: 'Commercial kids health drinks in India often contain up to 50% sugar under hidden names like maltodextrin. Natural alternatives like date-based unsweetened blends offer safe growth nutrition.',
    content: [
      'Many parents buy chocolate health mixes thinking they are helping their child grow. However, a close inspection of commercial labels shows that ingredients like sucrose, glucose syrup, maltodextrin, and starch make up the bulk of the content.',
      'Consistent refined sugar intake is linked to early cavities, weight imbalances, and poor focus in classrooms. Replacing these products with whole dates, dry fruits, and oats milkshakes provides natural calcium, proteins, and iron.',
      'Nutri Dates was formulated specifically to address this gap. Our product contains zero refined sugars, offering a rich chocolate taste derived solely from cocoa and premium dates.',
    ],
    citations: [
      'Analysis of hidden sugars in commercial health beverages, Indian Pediatrics Journal, 2023.',
      'World Health Organization recommendations on daily free sugar intake for children.',
    ],
    stats: [
      'Some leading health drinks in India contain up to 37g of sugar per 100g.',
      'Nutri Dates contains 0% refined sugar and 0% artificial preservatives.',
    ],
    faqs: [
      { q: 'How can I check if my kids drink contains hidden sugars?', a: 'Look at the ingredients list for terms ending in &quot;ose&quot; (sucrose, glucose, fructose) or maltodextrin, starch, and corn syrup.' },
      { q: 'How do I serve Nutri Dates to my child?', a: 'Simply add 1 to 2 tablespoons to a glass of warm milk, stir well, and serve as a morning or evening strength drink.' },
    ],
  },
  'natural-daily-energy-boosters-busy-schedule': {
    title: 'Natural Daily Energy Boosters to Stay Productive on a Busy Schedule',
    category: 'Wellness',
    date: 'June 7, 2026',
    readTime: '3 min read',
    summary: 'Combat fatigue naturally by steering clear of artificial energy drinks and caffeine. Whole foods like dates, oats, cashews, and almonds provide slow-release carbohydrates for persistent stamina.',
    content: [
      'Relying on multiple cups of coffee or high-caffeine energy drinks triggers a cycle of jitters and fatigue. True, stable energy comes from complex carbohydrates and natural micro-nutrients.',
      'Dates contain natural simple sugars (fructose and glucose) paired with high fiber, delivering immediate yet sustained energy. Oats provide complex carbs that digest slowly, while dry fruits provide healthy fats that fuel cell recovery.',
      'Nutri Dates combines all these superfoods into a single, easy-to-serve chocolate powder, helping you stay active through long office hours, gym sessions, or busy routines.',
    ],
    citations: [
      'Role of complex carbohydrates and healthy lipids in maintaining endurance, Sports Nutrition Review, 2024.',
      'Dehydration and its effects on executive cognitive function, Journal of Clinical Wellness.',
    ],
    stats: [
      'Caffeine crashes drop mental focus by up to 40% after the initial spike.',
      'Whole food nutrition drinks sustain energy levels for up to 4 hours with no crash.',
    ],
    faqs: [
      { q: 'Can I take Nutri Dates as a pre-workout drink?', a: 'Yes! The combination of quick-release sugars from dates and slow-release energy from oats makes it a perfect natural pre-workout fuel.' },
      { q: 'Does it contain any caffeine?', a: 'Nutri Dates contains a trace amount of natural caffeine found in real cocoa, but is completely free of synthetic caffeine or added stimulants.' },
    ],
  },
};

// Next.js dynamic routing configuration
export async function generateStaticParams() {
  return Object.keys(POST_DATABASE).map((slug) => ({
    slug: slug,
  }));
}

// Generate metadata dynamically per blog post
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = POST_DATABASE[slug];
  if (!post) return {};

  return {
    title: `${post.title} | Nutri Dates Blog`,
    description: post.summary,
    alternates: {
      canonical: `https://nutridates.in/blog/${slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = POST_DATABASE[slug];

  if (!post) {
    notFound();
  }

  // Create BlogPosting JSON-LD schema
  const blogPostingJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "image": "https://nutridates.in/images/product-hero.png",
    "datePublished": "2026-06-07T00:00:00Z",
    "dateModified": new Date().toISOString(),
    "author": {
      "@type": "Person",
      "name": "Priyam Gupta",
      "url": "https://nutridates.in/about"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Nutri Dates",
      "logo": {
        "@type": "ImageObject",
        "url": "https://nutridates.in/images/logo-uploaded.jpg"
      }
    },
    "description": post.summary
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingJsonLd) }}
      />

      <Breadcrumbs />

      <main className="min-h-screen bg-[#FBF9F6] px-6 py-12 md:py-20">
        <div className="mx-auto max-w-3xl">
          {/* Back link */}
          <div className="mb-8 flex justify-between items-center">
            <Link
              href="/blog"
              className="text-xs font-black uppercase text-[#FF5000] hover:underline"
            >
              &larr; Back to Blog
            </Link>
            <span className="text-[10px] font-black uppercase tracking-widest bg-stone-200 text-stone-700 px-2.5 py-1 rounded">
              {post.category}
            </span>
          </div>

          {/* Article Card */}
          <article className="border-4 border-black bg-white p-8 md:p-12 rounded-xl shadow-[8px_8px_0px_0px_#111111] mb-8">
            <div className="flex items-center gap-3 text-xs font-black uppercase text-stone-500 mb-4">
              <span>{post.date}</span>
              <span>•</span>
              <span>{post.readTime}</span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tighter text-[#111111] leading-tight mb-6">
              {post.title}
            </h1>

            {/* AI Summary Block (GEO-Targeted Answer Block) */}
            <div className="border-2 border-black bg-[#FF5000]/5 p-5 rounded-lg mb-8">
              <h2 className="text-xs font-black uppercase tracking-wider text-[#FF5000] mb-2">
                Quick Summary (AI Overview / Answer Block)
              </h2>
              <p className="text-sm font-semibold text-black leading-relaxed">
                {post.summary}
              </p>
            </div>

            {/* Content Sections */}
            <div className="space-y-6 text-sm font-semibold text-[#4E3A2E] leading-relaxed">
              {post.content.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            <hr className="my-10 border-t-2 border-stone-200" />

            {/* Stats Block */}
            <div className="mb-8">
              <h3 className="text-sm font-black uppercase text-[#111111] tracking-wide mb-4">
                Key Nutri Stats
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {post.stats.map((stat, idx) => (
                  <div key={idx} className="border-2 border-black p-4 bg-[#F9F7F5] rounded-lg text-xs font-bold text-[#111111]">
                    {stat}
                  </div>
                ))}
              </div>
            </div>

            {/* Citations Block */}
            <div>
              <h3 className="text-xs font-black uppercase text-stone-400 tracking-widest mb-2">
                Scientific Citations & Sources
              </h3>
              <ol className="list-decimal pl-5 space-y-1 text-[11px] font-bold text-stone-500">
                {post.citations.map((cite, idx) => (
                  <li key={idx}>{cite}</li>
                ))}
              </ol>
            </div>
          </article>

          {/* Q&A / Voice Search FAQ Block */}
          <div className="border-4 border-black bg-white p-8 md:p-12 rounded-xl shadow-[6px_6px_0px_0px_#111111] mb-8">
            <h2 className="text-xl font-black uppercase text-[#111111] tracking-tight mb-6">
              Common Questions (People Also Ask)
            </h2>
            <div className="space-y-6">
              {post.faqs.map((faq, idx) => (
                <div key={idx} className="border-b border-stone-200 pb-4 last:border-0 last:pb-0">
                  <h3 className="text-sm font-black uppercase text-[#FF5000] tracking-wide mb-1.5">
                    Q: {faq.q}
                  </h3>
                  <p className="text-xs font-semibold text-[#4E3A2E] leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Box */}
          <div className="border-4 border-black bg-[#2B1D14] p-8 rounded-xl shadow-[6px_6px_0px_0px_#111111] text-center text-white">
            <h3 className="text-lg font-black uppercase tracking-tight mb-2">
              Power Your Day with Natural Dates Nutrition
            </h3>
            <p className="text-xs font-semibold text-stone-400 max-w-md mx-auto mb-6">
              Ditch the refined sugar. Fuel your body with the strength of Premium Dates, pure Cocoa, Oats, and mixed Dry Fruits.
            </p>
            <Link
              href="/#order"
              className="inline-flex border-2 border-white bg-[#FF5000] text-white px-8 py-3 text-xs font-black uppercase tracking-wider rounded-lg shadow-[3px_3px_0px_0px_#FFFFFF] hover:shadow-[1px_1px_0px_0px_#FFFFFF] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            >
              Order Nutri Dates Now
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
