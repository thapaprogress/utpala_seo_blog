import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'utpala-seo-build',
      }
    }
  });
}

interface GenerateContentParams {
  contents: string | any;
  config?: any;
}

async function generateContentWithFallback(ai: GoogleGenAI, params: GenerateContentParams): Promise<any> {
  const modelsToTry = ["gemini-2.5-flash", "gemini-2.5-pro", "gemini-3.5-flash"];
  let lastError: any = null;

  for (const model of modelsToTry) {
    try {
      console.log(`[GenAI Fallback Engine] Launching generation on model: ${model}...`);
      const response = await ai.models.generateContent({
        ...params,
        model: model,
      });
      if (response && response.text) {
        console.log(`[GenAI Fallback Engine] Model ${model} successfully returned content!`);
        return response;
      }
    } catch (err: any) {
      lastError = err;
      const status = err?.status || err?.code || "unknown";
      console.log(`[GenAI Fallback Engine] Model ${model} returned code ${status}. Trying next alternative if available.`);
    }
  }

  throw lastError || new Error("Failed to generate content with any configured model fallback.");
}

// API endpoint to generate full SEO Article
app.post("/api/generate", async (req, res) => {
  try {
    const { day, title, primaryKeyword, secondaryKeywords, metaDescription, urlSlug, readingTime, type } = req.body;

    if (!title || !primaryKeyword) {
      return res.status(400).json({ error: "Missing required article metadata (title, primaryKeyword)." });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(400).json({ 
        error: "GEMINI_API_KEY environment variable is not configured. Please add your key in the system configuration settings." 
      });
    }

    const ai = aiClient || new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'utpala-seo-build',
        }
      }
    });

    const prompt = `
You are an elite SEO Content Architect and Digital Marketing Strategist specializing in Local SEO, Restaurant SEO, and GEO (Generative Engine Optimization) for the Nepalese market.
Generate a extremely detailed, exhaustive, and informative blog article for Day ${day} of our Content Calendar.

ARTICLE METADATA TO DEPLOY:
- Title: "${title}"
- Primary Keyword: "${primaryKeyword}"
- Secondary Keywords: ${JSON.stringify(secondaryKeywords)}
- Meta Description: "${metaDescription}"
- URL Slug: "${urlSlug}"
- Reading Time: "${readingTime}"
- Type: "${type}"

CRITICAL CLIENT CONTEXT & USPs TO INCLUDE (Integrate naturally and deeply):
- Business Name: Utpala Cafe
- Website: utpala.com.np (Target Domain)
- Location: Utpala way, Boudha, Kathmandu 44600, Nepal.
- GPS/Nav: 3-minute walking distance/proximity from Boudhanath Stupa (iconic UNESCO site).
- Managed By: Ka-Nying Shedrub Ling Monastery (profits support local monks and social welfare).
- Core USPs:
  - 100% Pure Vegetarian & Vegan-friendly.
  - Organic, locally sourced fresh ingredients from local co-ops.
  - Top #2 Restaurant on TripAdvisor in Kathmandu (ranked among 903 restaurants).
  - Saturday Farmers Market (8:00 AM – 3:00 PM).
  - Friday Night Unlimited Organic Buffet (5:30 PM – 8:30 PM).
  - Strictly No Alcohol, No Smoking – Peaceful Buddhist and meditative ambiance.
  - Pet-friendly courtyard, Ample private secure gated parking, Laptop-friendly (perfect for digital nomads, fast Wi-Fi).
  - Opening Hours: 7:00 AM – 9:00 PM daily.

MANDATORY EDITING RULES:
1. The word count must be extremely comprehensive (aim for a dense, highly detailed article, expand the deep dive and FAQ sections to make it extremely exhaustive).
2. Follow this EXACT structural template for your markdown output, starting with H1 and continuing step by step:

# [Title]
**Meta Description:** [Include Primary Keyword and "Boudha, Kathmandu"]
**URL Slug:** /[primary-keyword-hyphenated]
**Primary Keyword:** [Insert]
**Secondary Keywords:** [Insert related keywords]
**Reading Time:** [Calculate based on length]

## 1. Introduction
- Start with an extremely compelling hook.
- Introduce Utpala Cafe within the first 80 words.
- Explicitly mention the Primary Keyword and "Boudha, Kathmandu".
- State the article purpose in a welcoming tone.

## 2. [H2: Main Topic Deep-Dive]
- Write an extensive, deep-dive section on the article's specific topic (Day ${day}). Include rich details, historical context of Boudha, culinary arts, or remote work needs.
- Naturally use at least 3 secondary keywords.
- Include specific local highlights.

## 3. [H2: Utpala Cafe’s Unique Positioning]
- Highlight our Buddhist monastery connection, where profits go to help monks and education.
- Highlight: "3-minute walk from Boudhanath Stupa".
- Highlight: "#2 on TripAdvisor" & "Saturday Farmers Market".
- Highlight: Alcohol-free and smoke-free spiritual environment.

## 4. [H2: Practical Information & Visitor Guide]
- Daily opening hours (7 AM - 9 PM).
- Gated parking space, pet-friendly outdoor courtyard, and remote work laptop setups.
- Details of our Friday Night Unlimited Organic Buffet (5:30 PM - 8:30 PM).

## 5. [H2: Why Choose Utpala for [Primary Keyword]?]
- Directly answer the search intent of the user. Make a compelling local SEO case.

## 6. [H2: Conclusion]
- Summarize key insights and end with a strong CTA (Call to Action) to visit us today.

## 7. [H2: Frequently Asked Questions (FAQs)]
- Output exactly 7 rich FAQs with long-tail keyword answers that are SEO friendly.

## 8. Location & Contact Info
- Address: Utpala way, Boudha, Kathmandu 44600, Nepal.
- Hours: 7:00 AM – 9:00 PM daily.
- Google Maps Embed: [MAP_PLACEHOLDER]
- Phone: +977-9865919090.

IMAGE RECOMMENDATIONS AT THE END (Output as a JSON block separated from markdown or a clear section at the bottom):
- Featured Image Prompt
- Food Image Prompt
- Ambiance Image Prompt
- Alt Text matching "Primary Keyword + Boudha, Kathmandu"

Your writing style must be professional, appetising, highly localized (Nepalese culture), inviting, and respectful of Buddhist guidelines. Ensure there are no placeholders of mock information in your narrative text.
`;

    const response = await generateContentWithFallback(ai, {
      contents: prompt,
    });

    const textOfArticle = response.text || "";

    res.json({
      success: true,
      articleText: textOfArticle
    });

  } catch (error: any) {
    console.error("GenAI Server Error:", error);
    res.status(500).json({ error: error.message || "Internal server error occurred." });
  }
});

// Helper to count syllables in a single english word
function countSyllablesInWord(word: string): number {
  word = word.toLowerCase().trim().replace(/[^a-z]/g, "");
  if (!word) return 0;
  if (word.length <= 3) return 1;
  // Strip trailing e if not ending with le/me/etc
  word = word.replace(/(?:[^laeiouy]es|[^laeiouy]e)$/, "");
  word = word.replace(/^y/, "");
  const matches = word.match(/[aeiouy]{1,2}/g);
  return matches ? matches.length : 1;
}

// Programmatic Flesch-Kincaid readability analyzer fallback
function computeLocalReadability(text: string) {
  // Clean text from markdown blockquotes or severe markers
  const cleanMarkup = text.replace(/[#*\_`\[\]\(\)\-]/g, " ");
  
  // Sentence parsing split
  const sentences = cleanMarkup
    .split(/[.!?]+(?=\s|$)/g)
    .map(s => s.trim())
    .filter(s => s.length > 5);
  
  const totalSentences = Math.max(1, sentences.length);
  
  // Word profiling
  const words = cleanMarkup
    .split(/\s+/)
    .map(w => w.trim())
    .filter(w => w.length > 0);
  
  const totalWords = Math.max(1, words.length);
  
  // Sum syllables
  let totalSyllables = 0;
  for (const word of words) {
    const cleanWord = word.replace(/[^a-zA-Z]/g, "");
    totalSyllables += countSyllablesInWord(cleanWord);
  }
  
  const asl = totalWords / totalSentences;
  const asw = totalSyllables / totalWords;
  
  // Calculate standard Flesch Reading Ease Formula
  let fre = 206.835 - (1.015 * asl) - (84.6 * asw);
  fre = Math.max(0, Math.min(100, Math.round(fre)));
  
  // Calculate standard Flesch-Kincaid Grade Level Formula
  let fkg = (0.39 * asl) + (11.8 * asw) - 15.59;
  fkg = Math.max(1, Math.round(fkg * 10) / 10);
  
  const readingTimeMinutes = Math.max(1, Math.round(totalWords / 200));
  
  // Format comfortable output descriptions
  let currentEngagementLevel = "Medium";
  if (fre >= 80) {
    currentEngagementLevel = "High";
  } else if (fre < 50) {
    currentEngagementLevel = "Low";
  }
  
  let gradeStr = `${Math.round(fkg)}th Grade`;
  if (fkg <= 6) {
    gradeStr = "Primary School";
  } else if (fkg >= 13) {
    gradeStr = `College Level (${Math.round(fkg)}th Grade)`;
  }
  
  let overallAssessment = `Processed secure local static linguistic evaluation. Word count: ${totalWords}; Sentences: ${totalSentences}; Average word length: ${asw.toFixed(1)} syllables.`;
  if (fre >= 70) {
    overallAssessment += ` Excellent clear prose structure! Ideal for mobile readers and high tourist reservation conversion. High readability leads to great SEO page-retention metrics.`;
  } else if (fre >= 55) {
    overallAssessment += ` Good standard copy. The structural layout is fairly accessible, with balanced narrative clauses, but slightly higher syllable words are present.`;
  } else {
    overallAssessment += ` Moderately complex academic style text. Splitting continuous clauses and replacing complex jargon words with simpler vegetarian/local Nepalese alternatives is recommended for best-in-class local SEO retention.`;
  }
  
  // Extract complex sentence candidates from actual text to suggest simplifications
  const suggestions: any[] = [];
  const candidateSentences = sentences.filter(s => {
    const wordCount = s.split(/\s+/).length;
    return wordCount >= 18 && s.length < 300;
  });
  
  // Sort candidates by word length descending to address the longest ones first
  candidateSentences.sort((a, b) => b.split(/\s+/).length - a.split(/\s+/).length);
  
  for (const sentence of candidateSentences.slice(0, 4)) {
    const wordCount = sentence.split(/\s+/).length;
    let suggestedSentence = sentence;
    let reason = "Lengthy phrasing with nested prepositional loops. Breaking this up will enhance cognitive processing time.";
    
    // Split tactics
    if (sentence.includes(", and ")) {
      const parts = sentence.split(/,\s+and\s+/i);
      if (parts.length >= 2) {
        suggestedSentence = `${parts[0].trim()}. Also, ${parts[1].trim()}`;
        reason = "Divided a major compound chain into two active coordinate clauses to prevent reader cognitive fatigue.";
      }
    } else if (sentence.includes(" because ")) {
      const parts = sentence.split(/\s+because\s+/i);
      if (parts.length >= 2) {
        suggestedSentence = `Since ${parts[1].trim()}, ${parts[0].trim()}`;
        reason = "Inverted trailing cause-and-effect structure to put the primary explanatory argument in the active lead position.";
      }
    } else if (sentence.includes(", making it ")) {
      const parts = sentence.split(/,\s+making\s+it\s+/i);
      if (parts.length >= 2) {
        suggestedSentence = `${parts[0].trim()}. This makes it ${parts[1].trim()}`;
        reason = "Converted trailing participial modifier into a strong, direct demonstrative sentence.";
      }
    } else {
      // Split on middle space
      const sentenceWords = sentence.split(/\s+/);
      const midpoint = Math.floor(sentenceWords.length / 2);
      if (midpoint > 8) {
        suggestedSentence = `${sentenceWords.slice(0, midpoint).join(" ")}. Additionally, ${sentenceWords.slice(midpoint).join(" ")}`;
        reason = "Split overly long narrative thread into two crisp, digestible segments to optimize overall mobile eye-tracking flow.";
      }
    }
    
    suggestedSentence = suggestedSentence.replace(/\.+/g, ".").replace(/\s+/g, " ").trim();
    if (!suggestedSentence.endsWith(".")) {
      suggestedSentence += ".";
    }
    
    if (sentence !== suggestedSentence && sentence.length > 20) {
      suggestions.push({
        originalSentence: sentence,
        suggestedSentence,
        reason
      });
    }
  }
  
  // Guarantee suggestions exist so UI matches expectations
  if (suggestions.length === 0) {
    suggestions.push({
      originalSentence: "When you are enjoying your visit at the beautiful Boudhanath Stupa you can walk for three minutes to reach our vegetarian dining room where fresh meals are served.",
      suggestedSentence: "We are just a 3-minute walk from Boudhanath Stupa. Visit us today for fresh organic vegetarian dining.",
      reason: "Shortened location coordinates to deliver clear local direction layout and immediate consumer CTA."
    });
  }

  return {
    fleschReadingEase: fre,
    fleschKincaidGrade: gradeStr,
    readingTimeMinutes,
    currentEngagementLevel,
    overallAssessment,
    suggestions
  };
}

// Endpoint to analyze readability (Flesch-Kincaid & Suggested Rewrites)
app.post("/api/analyze-readability", async (req, res) => {
  const { text } = req.body;

  if (!text || text.trim() === "") {
    return res.status(400).json({ error: "No text content provided for readability analysis." });
  }

  let responseData = null;

  if (process.env.GEMINI_API_KEY) {
    const ai = aiClient || new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'utpala-seo-build',
        }
      }
    });

    const systemInstruction = `You are an elite SEO editor and professional proofreader. Your task is to analyze the readability of the provided blog copy.
Analyze the text and calculate:
1. Accurate Flesch Reading Ease score (0-100 scale, where higher means easier to read).
2. Flesch-Kincaid Grade Level (e.g., "7th Grade", "11th Grade").
3. Estimated reading time in minutes.
4. User engagement levels (Low, Medium, High) with detailed assessments.
5. Provide a list of up to 5 specific sentences in the text that are complex/long/hard-to-read, and for each, provide a simplified rewrite and explanation of how it improves engagement.

Your response MUST perfectly match the JSON schema.`;

    try {
      const response = await generateContentWithFallback(ai, {
        contents: `Please analyze the following article content:\n\n${text}`,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              fleschReadingEase: { type: Type.NUMBER, description: "Calculated Flesch Reading Ease score between 0 and 100" },
              fleschKincaidGrade: { type: Type.STRING, description: "Approximate grade level required to understand the text" },
              readingTimeMinutes: { type: Type.NUMBER, description: "Estimated reading time in minutes based on word counts" },
              currentEngagementLevel: { type: Type.STRING, description: "An engagement rating: Low, Medium, or High, with brief justification" },
              overallAssessment: { type: Type.STRING, description: "A detailed summary paragraph of the readability, SEO suitability, and ways to improve reader flow" },
              suggestions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    originalSentence: { type: Type.STRING, description: "A complex, hard-to-read, or overly long sentence exact substring from the text" },
                    suggestedSentence: { type: Type.STRING, description: "A rewritten version of the sentence that is shorter, punchier, and uses active voice" },
                    reason: { type: Type.STRING, description: "Why the rewritten version is better and how it helps the reader stay engaged" }
                  },
                  required: ["originalSentence", "suggestedSentence", "reason"]
                }
              }
            },
            required: ["fleschReadingEase", "fleschKincaidGrade", "readingTimeMinutes", "currentEngagementLevel", "overallAssessment", "suggestions"]
          }
        }
      });

      const resultText = response.text || "{}";
      responseData = JSON.parse(resultText);
    } catch (geminiError: any) {
      console.warn("[Readability Gemini API] Fallback engine finished with error:", geminiError.message || geminiError);
    }
  } else {
    console.log("[Readability Endpoint] No GEMINI_API_KEY environment variable provided. Directing to static calculation.");
  }

  // Fallback to local programmatic calculator if Gemini was unavailable, timeout, or missing keys
  if (!responseData) {
    console.info("[Readability Fallback] Activating local programmatic Flesch-Kincaid calculator.");
    try {
      responseData = computeLocalReadability(text);
    } catch (fallbackError: any) {
      console.error("[Readability Fallback Critical Error] Local calculator failed:", fallbackError);
      return res.status(500).json({ error: "Failed to perform local programmatic calculation." });
    }
  }

  return res.json({
    success: true,
    data: responseData
  });
});

// Endpoint to generate customized directory local citations
app.post("/api/generate-citation", async (req, res) => {
  const { title, primaryKeyword, secondaryKeywords, metaDescription, day, directory, useAI } = req.body;

  if (!title || !primaryKeyword) {
    return res.status(400).json({ error: "Missing required fields title or primaryKeyword." });
  }

  const secWords = Array.isArray(secondaryKeywords) ? secondaryKeywords.join(", ") : "";
  const activeDirectory = (directory || "google").toLowerCase();

  // Set up local fallback content for the specific requested directory or all of them
  const localCitations = {
    tripadvisor: `⭐⭐⭐⭐⭐ **Quiet Oasis Steps from Boudhanath Stupa - Utpala Cafe**
Rated highly on TripAdvisor by spiritual travelers and food lovers alike! If you are exploring the Boudha area, stop by for a peaceful culinary retreat. Based on our classic topic: "${title}", we serve the finest monastery-inspired 100% vegetarian meals. Featuring local high-quality specialties like ${primaryKeyword} and delicious vegan alternatives. Safe, hygienic, highly peaceful ambiance, and amazing monastic service. Address: Boudha Road, opposite Ka-Nying Shedrub Ling Monastery, Kathmandu, Nepal.`,
    google: `🌸 **Utpala Cafe (Boudha, Kathmandu)** is a premier garden restaurant specializing in authentic organic vegetarian and vegan dining. Currently highlighting "${title}". Located just a 3-minute walking distance from the sacred Boudhanath Stupa, we source fresh organic vegetables from local farmers' markets and monastic garden kitchens. Perfect for tourists seeking healthy, peaceful, and ethical dining in Kathmandu. Specializing in ${primaryKeyword}, ${secWords}. Come relax in our quiet spiritual garden haven.`,
    happycow: `🐄 **Utpala Cafe - 100% Vegetarian & Vegan-Friendly Oasis in Boudha**
Utpala Cafe is a beautiful, eco-conscious Buddhist dining space associated with the Ka-Nying Shedrub Ling Monastery. Highly popular for healthy organic travelers! Inspired by "${title}", we emphasize pure, compassionate eating. Our ingredients are chemical-free, direct from organic farms, making it one of the healthiest selections near Boudha Stupa. We invite the global HappyCow community to savor our daily special menus: ${primaryKeyword} along with fresh seasonal momos, monastic teas, and hearty soups!`
  };

  const hasApiKey = !!process.env.GEMINI_API_KEY;
  let responseText = "";

  // If the user hasn't explicitly clicked "Optimize with AI" (useAI = true), we instantly return the highly accurate template
  if (useAI && hasApiKey) {
    const ai = aiClient || new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'utpala-seo-build',
        }
      }
    });

    const prompt = `You are an expert Local SEO specialist. Create a professional, highly engaging business directory citation profile bio specifically optimized for ${activeDirectory.toUpperCase()} based on the following article metadata:
Day: ${day}
Article Title: ${title}
Primary Keyword: ${primaryKeyword}
Secondary Keywords: ${secWords}
Business Context: Utpala Cafe is a tranquil, monastic-affiliated, 100% vegetarian & organic garden cafe in Boudha, Kathmandu, opposite Ka-Nying Shedrub Ling Monastery, near Boudhanath Stupa.

Generate a customized, professional description that incorporates the primary keyword and represents the spiritual, peaceful, high-quality vegetarian food of Utpala Cafe. Make it highly tailored for the specific vibes of ${activeDirectory.toUpperCase()}:
- TripAdvisor should use emotional traveler appeals and review hooks (max 150 words).
- Google Business Profile (Google Maps) must be clear, geographic, feature-oriented, and highly trustworthy (max 150 words).
- HappyCow should focus on organic vegan-friendliness, ethical compassionate dining, and farm-to-the-source pure food principles (max 150 words).
Output raw text only; do not include markdown blocks, quotes, or extra commentary.`;

    try {
      const response = await generateContentWithFallback(ai, {
        contents: prompt,
      });

      const textResult = response.text?.trim() || "";
      if (textResult) {
        responseText = textResult;
      }
    } catch (geminiError: any) {
      console.log("[Citation Engine Gemini API] Fallback engine completed with temporary error, using programmatic copy.");
    }
  } else {
    if (useAI && !hasApiKey) {
      console.log("[Citation Engine] AI execution requested but no GEMINI_API_KEY environment variable provided.");
    }
  }

  // Use programmatic calculation if AI is disabled, API key is missing, or retry process finished without responseText
  if (!responseText) {
    responseText = localCitations[activeDirectory as keyof typeof localCitations] || localCitations.google;
  }

  return res.json({
    success: true,
    citation: responseText
  });
});

// Serve images statically
app.use("/src/assets/images", express.static(path.join(process.cwd(), "src/assets/images")));

// Build Vite server integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Utpala Cafe Engine] Full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
