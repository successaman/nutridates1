import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Nutri Dates Blog | Health, Nutrition & Wellness Insights',
  description:
    'Read our latest articles on dates nutrition benefits, healthy health drinks for kids, gym stamina boosters, and sugar-free lifestyle tips from Nutri Dates.',
  alternates: {
    canonical: 'https://nutridates.in/blog',
  },
};

const blogPosts = [
  {
    slug: 'benefits-dates-chocolate-milk',
    title: 'The Nutritional Benefits of Adding Dates Powder to Chocolate Milk',
    summary: 'Discover how switching from refined sugar milk additives to real dates powder boosts vitamins, dietary fiber, and natural energy without crashes.',
    category: 'Nutrition',
    date: 'June 9, 2026',
    readTime: '4 min read',
  },
  {
    slug: 'healthy-drinks-without-refined-sugar-kids',
    title: 'Top Sugar-Free Healthy Drinks for Kids in India: A Parent\'s Guide',
    summary: 'A complete analysis of modern kids health drinks in India. Learn how to spot hidden maltodextrin sugars and find healthy natural alternatives.',
    category: 'Healthy Living',
    date: 'June 8, 2026',
    readTime: '5 min read',
  },
  {
    slug: 'natural-daily-energy-boosters-busy-schedule',
    title: 'Natural Daily Energy Boosters to Stay Productive on a Busy Schedule',
    summary: 'Struggling with mid-day fatigue? Read our expert checklist of natural superfoods, hydration strategies, and stamina drink habits.',
    category: 'Wellness',
    date: 'June 7, 2026',
    readTime: '3 min read',
  },
  {
    slug: 'maltodextrin-gut-health-risks',
    title: 'Why Maltodextrin in Your Health Mix is Damaging Your Kid\'s Gut',
    summary: 'Many health drinks use maltodextrin as a cheap filler. Read the scientific research explaining how it alters gut bacteria and spikes glycemic levels.',
    category: 'Nutrition',
    date: 'June 6, 2026',
    readTime: '6 min read',
  },
  {
    slug: 'dates-vs-white-sugar-glycemic-index',
    title: 'Dates vs. White Sugar: A Glycemic Index Comparison for Daily Energy',
    summary: 'Analyze how natural simple sugars paired with plant fiber in dates ensure a slow insulin response compared to refined cane sugar.',
    category: 'Wellness',
    date: 'June 5, 2026',
    readTime: '4 min read',
  },
  {
    slug: 'bournvita-replacement-guide',
    title: 'Replacing Sugary Milk Additives: A Parent\'s Transition Guide for Kids',
    summary: 'Struggling to get your picky child off sugary chocolate powders? Follow our practical, step-by-step guide to transition to clean nutrition.',
    category: 'Healthy Living',
    date: 'June 4, 2026',
    readTime: '5 min read',
  },
];

export default function BlogHub() {
  return (
    <>
      <Breadcrumbs />
      <main className="min-h-screen bg-[#FBF9F6] px-6 py-12 md:py-20">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-10 text-center">
            <span className="inline-block border-2 border-black bg-[#FF5000] text-white text-xs font-black tracking-widest uppercase px-3 py-1 mb-4">
              Daily Wellness Insights
            </span>
            <h1 className="text-4xl font-black uppercase text-[#111111] tracking-tight">
              NUTRI DATES JOURNAL
            </h1>
            <p className="mt-2 text-sm font-semibold text-[#4E3A2E] max-w-xl mx-auto">
              Expert articles on dates, natural nutrition, and healthy drinks. Learn how real ingredients power daily strength.
            </p>
          </div>

          {/* Grid list of posts */}
          <div className="grid gap-8">
            {blogPosts.map((post) => (
              <article
                key={post.slug}
                className="border-4 border-black bg-white p-6 md:p-8 rounded-xl shadow-[6px_6px_0px_0px_#111111] hover:shadow-[3px_3px_0px_0px_#111111] hover:translate-x-[3px] hover:translate-y-[3px] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 text-xs font-black uppercase tracking-wider mb-2">
                    <span className="text-[#FF5000]">{post.category}</span>
                    <span className="text-stone-300">|</span>
                    <span className="text-stone-500">{post.date}</span>
                    <span className="text-stone-300">|</span>
                    <span className="text-stone-500">{post.readTime}</span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-black uppercase text-[#111111] tracking-tight mb-3">
                    {post.title}
                  </h2>
                  <p className="text-sm font-semibold text-[#4E3A2E] leading-relaxed mb-6">
                    {post.summary}
                  </p>
                </div>
                <div>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-black uppercase text-[#FF5000] hover:underline"
                  >
                    Read Article &rarr;
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
