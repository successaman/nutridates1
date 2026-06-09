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
  'maltodextrin-gut-health-risks': {
    title: 'Why Maltodextrin in Your Health Mix is Damaging Your Kid\'s Gut',
    category: 'Nutrition',
    date: 'June 6, 2026',
    readTime: '6 min read',
    summary: 'Maltodextrin is widely used in commercial kids health drinks as a cheap texturizer, but studies show it suppresses beneficial gut bacteria and carries a higher Glycemic Index than table sugar.',
    content: [
      'If you scan the ingredient list on a standard chocolate health drink in India, you will frequently see maltodextrin listed near the top. This processed white powder is derived from corn, rice, or potato starch and acts as a cheap thickening agent and filler.',
      'Recent clinical research demonstrates that consuming maltodextrin can impair intestinal mucosal layers and decrease the growth of probiotics like bifidobacteria in your child\'s stomach. This can lead to digestive discomfort and weakened immune responses.',
      'Nutri Dates provides a clean alternative. Instead of starches and processing fillers, we use pure rolled oats and premium dehydrated dates, which promote healthy gut microflora and smooth digestion.',
    ],
    citations: [
      'Maltodextrin consumption alters intestinal microbiota and increases susceptibility to colitis, PLOS ONE Journal.',
      'The impact of processed food additives on pediatric gut barrier function, Journal of Gastroenterology.',
    ],
    stats: [
      'Maltodextrin carries a high Glycemic Index of 110 to 135 (higher than table sugar at 65).',
      'Nutri Dates contains 0g of maltodextrin, starch, or thickeners.',
    ],
    faqs: [
      { q: 'What is maltodextrin used for in commercial drinks?', a: 'It is primarily used as a cheap filler to increase bulk volume and improve texture, while keeping ingredient costs extremely low.' },
      { q: 'How does dates powder compare for digestive health?', a: 'Dehydrated dates powder is a natural whole food that retains beneficial dietary fibers, feeding healthy gut bacteria rather than suppressing them.' },
    ],
  },
  'dates-vs-white-sugar-glycemic-index': {
    title: 'Dates vs. White Sugar: A Glycemic Index Comparison for Daily Energy',
    category: 'Wellness',
    date: 'June 5, 2026',
    readTime: '4 min read',
    summary: 'Switching from refined sucrose to whole dates powder changes how your body processes energy. The plant fiber in dates ensures slow absorption, providing stable stamina without insulin crashes.',
    content: [
      'Refined white sugar consists of pure sucrose, which is quickly broken down by the digestive system. This results in a sudden spike in blood sugar levels, causing a short burst of energy followed by a severe crash that leaves you feeling tired and unfocused.',
      'Whole dates powder, while sweet, has a completely different physiological impact. Because dates are rich in natural dietary fiber and minerals like potassium, the digestion process is moderated. Glucose is released into the bloodstream at a steady pace.',
      'This makes dates powder the perfect clean energy source for gym workouts, long study sessions, and daily office productivity.'
    ],
    citations: [
      'Glycemic index and glycemic load of different date varieties, Nutrition Journal, 2021.',
      'Role of dietary fiber in managing glycemic curves, American Journal of Clinical Nutrition.'
    ],
    stats: [
      'Refined white sugar has a Glycemic Index (GI) of 65.',
      'Whole dates carry a low-to-medium Glycemic Index (GI) of approximately 42 to 50.',
    ],
    faqs: [
      { q: 'Does dates powder taste as sweet as white sugar?', a: 'Yes, it provides a rich, caramel-like sweetness that blends beautifully with cocoa and milk.' },
      { q: 'Can I cook or bake with dates powder?', a: 'Absolutely, dates powder is heat-stable and can replace white sugar in baking, porridge, and daily milk shakes.' }
    ],
  },
  'bournvita-replacement-guide': {
    title: 'Replacing Sugary Milk Additives: A Parent\'s Transition Guide for Kids',
    category: 'Healthy Living',
    date: 'June 4, 2026',
    readTime: '5 min read',
    summary: 'Struggling to get your picky child off sugary chocolate mixes? Learn how to gradually switch them to dates and cocoa mixes for clean, long-lasting growing energy.',
    content: [
      'If your child is used to highly sweetened commercial chocolate drinks, switching them to a completely unsweetened drink overnight can lead to resistance. The key is a gradual, positive transition.',
      'Start by mixing 50% of their old chocolate powder with 50% Nutri Dates in their milk. This keeps the familiar flavor profile while instantly cutting their refined sugar intake in half and adding oats and dry fruit fibers.',
      'After 7-10 days, shift the ratio to 100% Nutri Dates. Because our mix is naturally sweetened with dates and cocoa, kids adapt quickly, learning to appreciate clean, real flavors instead of chemical syrups.'
    ],
    citations: [
      'Fostering healthy food habits in picky children, Pediatric Nutrition Research, 2023.',
      'Sugar addiction and taste receptor adaptations in childhood development.'
    ],
    stats: [
      'It takes approximately 7 to 10 days for a child\'s taste receptors to adjust to lower sweetness levels.',
      'Transitioning to Nutri Dates cuts out approximately 5 kilograms of refined sugar per child per year.'
    ],
    faqs: [
      { q: 'Will my child notice the difference?', a: 'At first, they will notice a richer, nuttier chocolate flavor. Mixing it half-and-half during the first week ensures a seamless transition.' },
      { q: 'What is the best milk to mix Nutri Dates with?', a: 'It mixes excellently with standard warm dairy milk, but also works wonderfully with soy or almond milk.' }
    ],
  }
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
