import { Article, ArticleMetadata } from '../types';
import { articlesPart1 } from './articlesPart1';
import { articlesPart2 } from './articlesPart2';

export const preloadedArticles: Article[] = [...articlesPart1, ...articlesPart2];

export const calendarMetadata: ArticleMetadata[] = [
  // Week 1
  {
    day: 1,
    title: "Welcome to Utpala Cafe – A Peaceful Haven in Boudha",
    primaryKeyword: "Cafe in Boudha",
    secondaryKeywords: ["Best vegetarian food in Kathmandu", "Boudhanath Stupa cafe", "organic dining Boudha", "peaceful cafes Kathmandu"],
    metaDescription: "Welcome to Utpala Cafe, a peaceful Cafe in Boudha, Kathmandu. Enjoy organic vegetarian and vegan dining steps away from Boudhanath Stupa.",
    urlSlug: "/cafe-in-boudha-utpala",
    readingTime: "15 min read",
    type: "Brand Intro"
  },
  {
    day: 2,
    title: "The Story Behind Utpala Cafe – From Monastery Kitchen to Community Table",
    primaryKeyword: "Cafe in Boudha",
    secondaryKeywords: ["Buddhist cafe Kathmandu", "Monastery kitchen Nepal", "Ka-Nying Shedrub Ling food", "ethical dining Kathmandu"],
    metaDescription: "Discover how Utpala Cafe grew from a quiet monastery kitchen to Boudha's beloved vegetarian Cafe in Boudha, Kathmandu.",
    urlSlug: "/monastery-kitchen-story-boudha",
    readingTime: "14 min read",
    type: "Brand Story"
  },
  {
    day: 3,
    title: "10 Reasons Why Utpala Cafe is the Best Cafe in Boudha",
    primaryKeyword: "Best Cafe in Boudha",
    secondaryKeywords: ["Vegan friendly restaurant Kathmandu", "organic cafe Boudha", "peaceful work cafe Nepal", "TripAdvisor top restaurant Kathmandu"],
    metaDescription: "Discover why foodies and spiritual travelers rate Utpala Cafe as the Best Cafe in Boudha, Kathmandu.",
    urlSlug: "/10-reasons-best-cafe-in-boudha",
    readingTime: "16 min read",
    type: "Listicle"
  },
  {
    day: 4,
    title: "A Complete Guide to Boudha’s Vibrant Cafe Culture",
    primaryKeyword: "Cafe in Boudha",
    secondaryKeywords: ["Boudhanath Stupa coffee", "Kathmandu cafe guide", "slow travel Nepal", "spiritual dining Boudha"],
    metaDescription: "Navigate the vibrant, spiritual world of coffee and local community spaces with our complete guide to Cafe in Boudha, Kathmandu.",
    urlSlug: "/boudha-vibrant-cafe-culture",
    readingTime: "15 min read",
    type: "Local Guide"
  },
  {
    day: 5,
    title: "Exploring Utpala Cafe's Menu – A Vegetarian’s Paradise",
    primaryKeyword: "Cafe in Boudha",
    secondaryKeywords: ["Vegetarian restaurant Boudha", "vegan food Kathmandu", "organic dining Nepal", "farmers market Kathmandu"],
    metaDescription: "Dive deep into the organic, 100% vegetarian menu at Utpala, the premier healthy Cafe in Boudha, Kathmandu.",
    urlSlug: "/vegetarian-menu-deep-dive-utpala",
    readingTime: "16 min read",
    type: "Menu Deep-Dive"
  },
  {
    day: 6,
    title: "The Boudha Farmers Market – Every Saturday at Utpala Cafe",
    primaryKeyword: "Cafe in Boudha",
    secondaryKeywords: ["Organic farming Nepal", "Saturday farmers market Kathmandu", "boudhanath community events", "buy organic Kathmandu"],
    metaDescription: "Experience the vibrant Saturday Farmers Market at Utpala Cafe, the ultimate community and organic food Cafe in Boudha, Kathmandu.",
    urlSlug: "/boudha-farmers-market-saturday-utpala",
    readingTime: "14 min read",
    type: "Event/Local Highlight"
  },
  {
    day: 7,
    title: "Why Utpala Cafe Stands Out Among Boudha’s Best Eateries",
    primaryKeyword: "Best Cafe in Boudha",
    secondaryKeywords: ["Organic vegetarian foods Kathmandu", "monastery run business Nepal", "highly rated restaurant Boudha", "secure parking Boudha"],
    metaDescription: "An in-depth comparative look at why Utpala Cafe is evaluated as the Best Cafe in Boudha, Kathmandu. Explore our unique organic features.",
    urlSlug: "/why-utpala-stands-out-in-boudha",
    readingTime: "15 min read",
    type: "Comparative Analysis"
  },
  // Week 2
  {
    day: 8,
    title: "Best Cafes in Kathmandu – Why Utpala Leads the List",
    primaryKeyword: "Cafe in Kathmandu",
    secondaryKeywords: ["Top rated restaurants Kathmandu", "vegetarian restaurants Nepal", "eco-friendly dining Kathmandu", "best garden cafe Kathmandu"],
    metaDescription: "A comprehensive roundup of the Best Cafes in Kathmandu, Nepal. Explore why Utpala Cafe leads as the top vegetarian destination.",
    urlSlug: "/best-cafes-in-kathmandu",
    readingTime: "15 min read",
    type: "City Guide"
  },
  {
    day: 9,
    title: "Utpala Cafe – Kathmandu’s Top Vegan & Organic Dining Destination",
    primaryKeyword: "Best Cafe in Kathmandu",
    secondaryKeywords: ["Vegan friendly restaurant Kathmandu", "organic vegan food Nepal", "raw foods Kathmandu", "best food spot Boudha"],
    metaDescription: "Looking for pure, local, organic food? Learn why Utpala is rated the Best Cafe in Kathmandu, Nepal for vegan and healthy dining.",
    urlSlug: "/best-vegan-organic-cafe-kathmandu",
    readingTime: "16 min read",
    type: "Niche Focus"
  },
  {
    day: 10,
    title: "A Food Lover’s Guide to Cafes in Kathmandu Valley",
    primaryKeyword: "Cafe in Kathmandu",
    secondaryKeywords: ["Best coffee shops Nepal", "must visit eateries Kathmandu", "healthy dining Kathmandu", "tourist cafe guide Boudha"],
    metaDescription: "Your ultimate explorer's guide to the finest coffee and cultural spaces. Discover why Utpala belongs in every Cafe in Kathmandu list.",
    urlSlug: "/kathmandu-valley-cafe-guide",
    readingTime: "15 min read",
    type: "Travel Guide"
  },
  {
    day: 11,
    title: "How Utpala Cafe Became #2 on TripAdvisor in Kathmandu",
    primaryKeyword: "Best Cafe in Kathmandu",
    secondaryKeywords: ["TripAdvisor top restaurant Kathmandu", "customer service standard Nepal", "top rated cafe Boudha", "monastery hospitality"],
    metaDescription: "Discover how Utpala Cafe combined Buddhist culture, high hygiene, and organic dining to rank #2 on TripAdvisor in Kathmandu.",
    urlSlug: "/how-utpala-became-number-2-tripadvisor",
    readingTime: "15 min read",
    type: "Trust/Authority"
  },
  {
    day: 12,
    title: "Organic & Sustainable Dining – Kathmandu’s Best Kept Secret",
    primaryKeyword: "Best Cafe in Kathmandu",
    secondaryKeywords: ["Organic agriculture Nepal", "sustainable restaurant Kathmandu", "eco-friendly travel Kathmandu", "clean eating Boudha"],
    metaDescription: "Explore how Utpala Cafe sets the bar for Organic & Sustainable Dining as the premier Best Cafe in Kathmandu, Nepal.",
    urlSlug: "/organic-sustainable-dining-kathmandu",
    readingTime: "15 min read",
    type: "Sustainability"
  },
  {
    day: 13,
    title: "Kathmandu Cafe Hopping – Start Your Journey at Utpala",
    primaryKeyword: "Cafe in Kathmandu",
    secondaryKeywords: ["Cafe hopping Kathmandu", "best aesthetic cafe Boudha", "espresso spots Nepal", "travel blogger guide Kathmandu"],
    metaDescription: "Plan your ultimate Kathmandu cafe hopping path starting in Boudha. See why Utpala Cafe is our top recommended start location.",
    urlSlug: "/kathmandu-cafe-hopping-guide",
    readingTime: "14 min read",
    type: "Lifestyle"
  },
  {
    day: 14,
    title: "What Makes a Cafe the Best in Kathmandu? The Utpala Standard",
    primaryKeyword: "Best Cafe in Kathmandu",
    secondaryKeywords: ["High hygiene restaurants Nepal", "top food quality Kathmandu", "conscious business Kathmandu", "best space in Kathmandu"],
    metaDescription: "Defining the pinnacle of hospitality. Learn how the Utpala Standard sets a new benchmark for the Best Cafe in Kathmandu.",
    urlSlug: "/the-utpala-standard-cafes-kathmandu",
    readingTime: "15 min read",
    type: "Thought Leadership"
  },
  // Week 3
  {
    day: 15,
    title: "Find the Best Cafe Near Me in Boudha – Utpala Cafe",
    primaryKeyword: "Cafe Near Me",
    secondaryKeywords: ["Best cafe near me", "restaurants in Boudha", "organic coffee near me", "places to eat near stupa"],
    metaDescription: "Searching for a peaceful, organic, and laptop-friendly Cafe Near Me in Boudha, Kathmandu? Find your sanctuary at Utpala Cafe.",
    urlSlug: "/cafe-near-me-boudha-utpala",
    readingTime: "15 min read",
    type: "Location SEO"
  },
  {
    day: 16,
    title: "Why Locals Choose Utpala – The Best Cafe Near Me",
    primaryKeyword: "Best Cafe Near Me",
    secondaryKeywords: ["Local hangout Boudha", "where locals eat Kathmandu", "peaceful tea spot Nepal", "work cafe boudha stupa"],
    metaDescription: "Discover why Kathmandu residents and Boudha locals consistently rate Utpala Cafe as the Best Cafe Near Me for healthy food.",
    urlSlug: "/best-cafe-near-me-locals-choice",
    readingTime: "15 min read",
    type: "Local Trust"
  },
  {
    day: 17,
    title: "Craving Great Food? Find the Best Restaurant Near Me in Boudha",
    primaryKeyword: "Restaurant Near Me",
    secondaryKeywords: ["Best restaurant near me", "vegetarian food Boudha", "lunch spots Kathmandu", "family restaurant Boudha"],
    metaDescription: "Satisfy your cravings with healthy, 100% vegetarian food. Locate the ultimate Restaurant Near Me in Boudha: Utpala Cafe.",
    urlSlug: "/restaurant-near-me-boudha-eateries",
    readingTime: "15 min read",
    type: "Discovery"
  },
  {
    day: 18,
    title: "Boudha’s Best Restaurant Near Me – An Honest Review",
    primaryKeyword: "Best Restaurant Near Me",
    secondaryKeywords: ["Top rated restaurant boudha", "nepalese vegetarian set review", "vegan buffet kathmandu", "utpala honest review"],
    metaDescription: "Ready for an organic, spiritual dining adventure? Read our review of Utpala Cafe, the ultimate Best Restaurant Near Me in Boudha.",
    urlSlug: "/best-restaurant-near-me-boudha-review",
    readingTime: "14 min read",
    type: "Review"
  },
  {
    day: 19,
    title: "How to Reach Utpala Cafe – Directions from Boudhanath Stupa",
    primaryKeyword: "Cafe Near Me",
    secondaryKeywords: ["Boudhanath stupa walking directions", "utpala way location map", "boudha parking guide", "safe location stupa"],
    metaDescription: "Step-by-step navigation from the iconic Boudhanath Stupa to Utpala Cafe. Learn how to locate this quiet Cafe Near Me in Kathmandu.",
    urlSlug: "/directions-how-to-reach-utpala-cafe",
    readingTime: "14 min read",
    type: "Navigation Guide"
  },
  {
    day: 20,
    title: "The Ultimate 'Near Me' Guide – Cafes in Boudha",
    primaryKeyword: "Best Cafe Near Me",
    secondaryKeywords: ["Boudhanath directory map", "healthy snacks boudha", "best remote work space stupa", "peaceful gardens Kathmandu"],
    metaDescription: "Plan your day in Boudha with our ultimate directory to finding the Best Cafe Near Me, starring organic champion Utpala Cafe.",
    urlSlug: "/ultimate-near-me-guide-boudha-cafes",
    readingTime: "16 min read",
    type: "Comprehensive Guide"
  },
  {
    day: 21,
    title: "Utpala – Your Go-To Restaurant Near Me for Healthy Eating",
    primaryKeyword: "Best Restaurant Near Me",
    secondaryKeywords: ["Healthy lifestyle Kathmandu", "low calorie meals Boudha", "pure organic nutrition Nepal", "superfood bowls stupa"],
    metaDescription: "Nourish your wellness journey. Discover why Utpala is the top Best Restaurant Near Me for fitness enthusiasts and healthy eaters in Boudha.",
    urlSlug: "/healthy-restaurant-near-me-utpala",
    readingTime: "15 min read",
    type: "Health Focus"
  },
  // Week 4
  {
    day: 22,
    title: "Best Restaurant in Kathmandu – The Utpala Cafe Experience",
    primaryKeyword: "Best Restaurant in Kathmandu",
    secondaryKeywords: ["Fine vegetarian dining Kathmandu", "monastery social business", "top outdoor garden restaurant", "organic certification Nepal"],
    metaDescription: "Experience the magic. Discover why Utpala Cafe is recognized by families and critics as the Best Restaurant in Kathmandu, Nepal.",
    urlSlug: "/best-restaurant-in-kathmandu-utpala-experience",
    readingTime: "16 min read",
    type: "Authority"
  },
  {
    day: 23,
    title: "Kathmandu Restaurant Guide – Where to Eat Near Boudha",
    primaryKeyword: "Best Restaurant in Kathmandu",
    secondaryKeywords: ["Where to eat Boudha", "Kathmandu culinary directory", "Himalayan tourism dining", "top lunch spots stupa"],
    metaDescription: "Embark on a culinary voyage with our definitive guide. Find out why Utpala stands out as the Best Restaurant in Kathmandu near Boudha.",
    urlSlug: "/kathmandu-restaurant-guide-boudha-edition",
    readingTime: "15 min read",
    type: "Travel Guide"
  },
  {
    day: 24,
    title: "From Monastery Kitchen to Top Restaurant – Utpala’s Journey",
    primaryKeyword: "Best Restaurant in Kathmandu",
    secondaryKeywords: ["Buddhist enterprise success", "Ka-Nying Shedrub Ling history", "ethical restaurant management", "organic farming partners"],
    metaDescription: "Read the full, inspiring chronicle of how a modest monastery kitchen achieved status as the Best Restaurant in Kathmandu.",
    urlSlug: "/monastery-kitchen-to-best-restaurant-kathmandu",
    readingTime: "15 min read",
    type: "Brand Story"
  },
  {
    day: 25,
    title: "A Complete Guide to Boudha’s Best Restaurants",
    primaryKeyword: "Best Restaurant Near Me",
    secondaryKeywords: ["Restaurants around stupa", "best vegetarian eateries boudha", "dinner spots boudha", "clean food stupa"],
    metaDescription: "Hungry near the stupa? Skip the low-hygiene tourist traps with our review of the Best Restaurant Near Me in Boudha: Utpala Cafe.",
    urlSlug: "/complete-guide-boudhas-best-restaurants",
    readingTime: "15 min read",
    type: "Local Guide"
  },
  {
    day: 26,
    title: "Why Utpala is Kathmandu’s Most Peaceful Restaurant",
    primaryKeyword: "Best Restaurant in Kathmandu",
    secondaryKeywords: ["Peaceful garden dining Kathmandu", "meditative ambiance cafe", "smoke free restaurant boudha", "silent workspace stupa"],
    metaDescription: "Escape the bustle. Discover the soothing, meditative ambiance of Utpala Cafe, the Best Restaurant in Kathmandu for mindful dining.",
    urlSlug: "/most-peaceful-restaurant-in-kathmandu",
    readingTime: "15 min read",
    type: "Ambiance Focus"
  },
  {
    day: 27,
    title: "The Ultimate Vegetarian Restaurant Guide – Kathmandu Edition",
    primaryKeyword: "Best Restaurant in Kathmandu",
    secondaryKeywords: ["Vegetarian society nepal", "best vegan curry Kathmandu", "pure vegetarian dining", "gluten free choices boudha"],
    metaDescription: "Your complete guide to plant-based luxury in Nepal. Find out why Utpala is voted the undisputed Best Restaurant in Kathmandu for vegetarians.",
    urlSlug: "/ultimate-vegetarian-restaurant-guide-kathmandu",
    readingTime: "16 min read",
    type: "Niche Guide"
  },
  {
    day: 28,
    title: "30 Days of Utpala – A Journey Through Boudha’s Best Cafe",
    primaryKeyword: "Cafe in Boudha",
    secondaryKeywords: ["Organic food diary Nepal", "month in boudha stupa", "digital nomad review Nepal", "healthy meal planning Kathmandu"],
    metaDescription: "Recapping a month of pure, organic vegetarian joy. See how eating at Utpala, the finest Cafe in Boudha, shapes your body and mind.",
    urlSlug: "/30-days-at-utpala-cafe-recap",
    readingTime: "15 min read",
    type: "Recap/Brand"
  },
  {
    day: 29,
    title: "What Defines the Best Restaurant in Kathmandu?",
    primaryKeyword: "Best Restaurant in Kathmandu",
    secondaryKeywords: ["High standards hospitality Nepal", "social social enterprises Kathmandu", "hygienic raw food", "buddhist ethics business"],
    metaDescription: "Thought leadership study: what elevated Utpala Cafe to represent the quintessential Best Restaurant in Kathmandu, Nepal?",
    urlSlug: "/what-defines-best-restaurant-kathmandu",
    readingTime: "15 min read",
    type: "Thought Leadership"
  },
  {
    day: 30,
    title: "Plan Your Perfect Visit – Utpala Cafe, Boudha",
    primaryKeyword: "All 10 Keywords (Summary)",
    secondaryKeywords: ["Cafe in Boudha", "Best Cafe in Boudha", "Cafe in Kathmandu", "Best Restaurant in Kathmandu", "Cafe Near Me", "Restaurant Near Me"],
    metaDescription: "Ready to step into our garden? Here is the absolute final guide to parking, menu items, prices, and events at Utpala Cafe, Boudha.",
    urlSlug: "/plan-your-perfect-visit-utpala-cafe-boudha",
    readingTime: "18 min read",
    type: "CTA/Summary"
  }
];

export function getSkeletonArticle(day: number, metadata: ArticleMetadata): Article {
  return {
    day,
    metadata,
    status: 'Draft',
    content: `# ${metadata.title}

**Meta Description:** ${metadata.metaDescription}
**URL Slug:** ${metadata.urlSlug}
**Primary Keyword:** ${metadata.primaryKeyword}
**Secondary Keywords:** ${metadata.secondaryKeywords.join(', ')}
**Reading Time:** ${metadata.readingTime}

## 1. Introduction
[This article is currently a Draft. Click the "Generate 3,000+ Words Article" button below to initiate our server-side Google Gemini content architect to generate a fully optimized, 3,000-word deep-dive article containing detailed research, organic food insights, monastery background, and local Kathmandu context.]

## 2. Main Topic Deep-Dive
*To be generated by Google Gemini content architect...*

## 3. Utpala Cafe’s Unique Positioning
*Our 3-minute walking proximity to Boudhanath Stupa, TripAdvisor Rank #2, Saturday Farmers Market, and drug-and-smoke-free environment will be explored here.*

## 4. Practical Information & Visitor Guide
*Opening hours (7 AM - 9 PM daily), laptop-friendliness, parking, pet rules, and our Friday Night Unlimited Organic Buffet details will be compiled.*

## 5. Why Choose Utpala for ${metadata.primaryKeyword}?
*Direct search intent mapping will be architected here.*

## 6. Conclusion
*A captivating Call-to-Action summarizing our peace sanctuary will be created.*

## 7. Frequently Asked Questions (FAQs)
*7 highly structured SEO-optimized FAQs will be constructed.*

## 8. Location & Contact Info
- **Address:** Utpala way, Boudha, Kathmandu 44600, Nepal.
- **Hours:** 7:00 AM – 9:00 PM daily.
- **Google Maps Embed:** [MAP_PLACEHOLDER]
- **Phone:** +977-9865919090.
`,
    imagePrompts: {
      featuredImage: `Featured high-quality shot illustrating: ${metadata.title}`,
      image2Food: "A brilliant shot of organic, 100% vegetarian culinary arts or fresh green salad.",
      image3Ambiance: "The serene garden of Utpala Cafe or a beautiful shot of the nearby Boudhanath Stupa.",
      altText: `${metadata.primaryKeyword} Boudha, Kathmandu - Serene scene exploring ${metadata.title}`
    },
    internalLinks: [
      "Learn about our Saturday Farmers Market in our Day 6 article.",
      "Explore the secret story of our Ka-Nying monastery connection in Day 2."
    ],
    externalLinks: [
      { anchor: "Boudhanath Stupa UNESCO Site", url: "https://whc.unesco.org/en/list/121" },
      { anchor: "Utpala TripAdvisor Page", url: "https://www.tripadvisor.com" }
    ],
    outreachTargets: [
      { name: "Kathmandu Tourism Media", reason: `Pitching our comprehensive guide for local search: ${metadata.primaryKeyword}` },
      { name: "Himalayan Travel Blogs", reason: "Inviting travel influencers to write backlink guides." },
      { name: "HappyCow Kathmandu List", reason: "Strengthening our local citations for pure organic dining." }
    ]
  };
}

export function getArticleByDay(day: number): Article {
  const preloaded = preloadedArticles.find(a => a.day === day);
  if (preloaded) {
    return preloaded;
  }
  const metadata = calendarMetadata.find(m => m.day === day);
  if (metadata) {
    return getSkeletonArticle(day, metadata);
  }
  // Fallback default
  const defaultMeta: ArticleMetadata = {
    day,
    title: `Day ${day} Content Article`,
    primaryKeyword: "Cafe in Boudha",
    secondaryKeywords: ["vegetarian", "organic", "restaurant"],
    metaDescription: `Read our Day ${day} article exploring Utpala Cafe in Boudha, Kathmandu.`,
    urlSlug: `/day-${day}-article`,
    readingTime: "15 min read",
    type: "Brand Post"
  };
  return getSkeletonArticle(day, defaultMeta);
}
export const totalDaysList = Array.from({ length: 30 }, (_, i) => i + 1);
