import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Sparkles, 
  CheckCircle, 
  Calendar, 
  ChevronRight, 
  Copy, 
  Download, 
  Check, 
  Leaf, 
  MapPin, 
  Clock, 
  Laptop, 
  Search, 
  FileText, 
  AlertTriangle, 
  RefreshCw, 
  ExternalLink, 
  Eye, 
  PenTool, 
  X, 
  Settings, 
  Compass, 
  Award,
  ShieldCheck,
  CheckSquare,
  Flame,
  Globe
} from 'lucide-react';
import { Article, PublishStatus } from './types';
import { getArticleByDay, calendarMetadata, totalDaysList } from './data/articlesIndex';

// Pre-defined local paths for our generated premium images
const IMAGE_PATHS = {
  exterior: "/src/assets/images/utpala_cafe_exterior_1781766524317.jpg",
  food: "/src/assets/images/utpala_cafe_food_1781766543597.jpg",
  stupa: "/src/assets/images/utpala_cafe_stupa_1781766562911.jpg"
};

export default function App() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [activeDay, setActiveDay] = useState<number>(1);
  const [articles, setArticles] = useState<{ [key: number]: Article }>({});
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<'content' | 'images' | 'links' | 'seo' | 'subdomain'>('content');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editorContent, setEditorContent] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [copiedDay, setCopiedDay] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [showHeatmap, setShowHeatmap] = useState<boolean>(false);
  const [isAnalyzingReadability, setIsAnalyzingReadability] = useState<boolean>(false);
  const [readabilityResult, setReadabilityResult] = useState<any>(null);
  const [readabilityError, setReadabilityError] = useState<string | null>(null);

  // New states for Local Citation engine with interactive USP mapping
  const [selectedUSPs, setSelectedUSPs] = useState<string[]>(['monastery', 'stupa', 'organic']);
  const [citationTexts, setCitationTexts] = useState<Record<'google' | 'tripadvisor' | 'happycow', string>>({
    google: '',
    tripadvisor: '',
    happycow: ''
  });
  const [citationLoadingStates, setCitationLoadingStates] = useState<Record<'google' | 'tripadvisor' | 'happycow', boolean>>({
    google: false,
    tripadvisor: false,
    happycow: false
  });
  const [citationErrors, setCitationErrors] = useState<Record<'google' | 'tripadvisor' | 'happycow', string | null>>({
    google: null,
    tripadvisor: null,
    happycow: null
  });

  // Predefined USPs for Utpala Cafe
  const AVAILABLE_USPS = [
    { id: 'monastery', label: 'Monastic Stewardship', desc: '100% of profits fund Ka-Nying Shedrub Ling Monastery Buddhist education.' },
    { id: 'stupa', label: 'Boudha Stupa Proximity', desc: 'Peaceful garden situated just a 3-minute stroll from the sacred Boudhanath Stupa.' },
    { id: 'organic', label: '100% Organic Sourcing', desc: 'Chemical-free, seasonal vegetables sourced directly from local Nepalese cooperatives.' },
    { id: 'buffet', label: 'Legendary Friday Night Buffet', desc: 'Weekly Rs. 450 unlimited organic buffet where community meets.' },
    { id: 'nomad', label: 'Digital Nomad Friendly', desc: 'Dual-line commercial fiber Wi-Fi, plentiful power outlets, and quiet study zones.' },
    { id: 'vegan', label: 'Hygienic Pure Veg / Vegan', desc: 'Strict Buddhist kitchen guidelines preventing cross-contamination and prioritizing wellness.' }
  ];

  const generateProgrammaticCitation = (platform: 'google' | 'tripadvisor' | 'happycow', pkw: string, selectedIds: string[]): string => {
    const chosenUSPs = AVAILABLE_USPS.filter(u => selectedIds.includes(u.id));
    const activeMeta = calendarMetadata.find(m => m.day === activeDay);
    const title = activeMeta ? activeMeta.title : "Utpala Cafe";

    const uspBulletText = chosenUSPs.map(u => `• ${u.label}: ${u.desc}`).join("\n");
    const uspCheckText = chosenUSPs.map(u => `✓ ${u.label} - ${u.desc}`).join("\n");
    const uspDashText = chosenUSPs.map(u => `- ${u.label} (${u.desc})`).join("\n");

    if (platform === 'tripadvisor') {
      return `⭐⭐⭐⭐⭐ Peaceful Zen Garden & Best Plant-Based Sanctuary in Kathmandu Valley!

Planning an escape to Boudha, Kathmandu? Utpala Cafe is a tranquil sanctuary opposite Ka-Nying Shedrub Ling Monastery. Highly acclaimed for our pure vegetarian recipes, healthy community food, and amazing monastic service.

Based on our community-voted theme: "${title}", we are proud to offer deep expertise in:
${uspBulletText || "• Healthy Organic Food & Pure Plant-Based Cooking"}

Whether you're visiting for our specialized "${pkw}" experience or seeking a clean, mindful corner in Kathmandu, Utpala will become your peaceful, sensory, and spiritual second home!`;
    }

    if (platform === 'google') {
      return `🌸 Utpala Cafe (Boudha, Kathmandu) is a premier garden restaurant specializing in authentic, 100% organic vegetarian & vegan dining. Our current theme is: "${title}".

Located just a 3-minute walking distance from the sacred Boudhanath Stupa, we prioritize local community health:
${uspDashText || "- Authentic farm-to-table vegetarian menu"}

Our core highlights include:
- Specifically offering: "${pkw}"
- Warm Nepalese hospitality & clean, quiet ambiance.

Perfect for tourists, practitioners, and digital nomads seeking highly hygienic and ethical dining in Kathmandu. Visit our peaceful garden opposite the monastery!`;
    }

    // happycow
    return `🌱 Utpala Cafe - 100% vegetarian & Eco-Mindful Garden Oasis near Boudha Stupa

Savor compassionate, chemical-free dining at Utpala Cafe, associated with Ka-Nying Shedrub Ling Monastery. Dedicated to travelers looking for healthy vegan foods and mindful living:
${uspCheckText || "✓ Traditional, clean, and delicious plant-based cooking"}

Our chef's special is: "${pkw}" which matches the rich spiritual tradition of our neighborhood.

Why our community loves us:
Whether you are here to work remote with high-speed Wi-Fi, join our Friday buffet, or meditate in our serene garden, we promise clean preparation and pure ingredients. Join our global family!`;
  };

  // Re-calculate the programmatic citations instantly whenever day or selected USPs update
  useEffect(() => {
    const activeMeta = calendarMetadata.find(m => m.day === activeDay);
    if (!activeMeta) return;
    const pkw = activeMeta.primaryKeyword;

    setCitationTexts({
      google: generateProgrammaticCitation('google', pkw, selectedUSPs),
      tripadvisor: generateProgrammaticCitation('tripadvisor', pkw, selectedUSPs),
      happycow: generateProgrammaticCitation('happycow', pkw, selectedUSPs)
    });
  }, [activeDay, selectedUSPs]);

  // AI-powered citation optimization
  const loadAICitation = async (platform: 'google' | 'tripadvisor' | 'happycow') => {
    setCitationLoadingStates(prev => ({ ...prev, [platform]: true }));
    setCitationErrors(prev => ({ ...prev, [platform]: null }));
    try {
      const activeMeta = calendarMetadata.find(m => m.day === activeDay);
      if (!activeMeta) return;

      const chosenUSPsLabels = AVAILABLE_USPS.filter(u => selectedUSPs.includes(u.id)).map(u => u.label).join(", ");

      const res = await fetch("/api/generate-citation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: activeMeta.title,
          primaryKeyword: activeMeta.primaryKeyword,
          secondaryKeywords: [chosenUSPsLabels, ...activeMeta.secondaryKeywords],
          metaDescription: activeMeta.metaDescription,
          day: activeMeta.day,
          directory: platform,
          useAI: true
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Could not retrieve directory copy.");
      }
      setCitationTexts(prev => ({ ...prev, [platform]: data.citation || "" }));
      showToast(`AI polished citation for ${platform === 'google' ? 'Google Maps' : platform === 'tripadvisor' ? 'TripAdvisor' : 'HappyCow'}!`);
    } catch (err: any) {
      console.error("Local citation system error:", err);
      setCitationErrors(prev => ({ ...prev, [platform]: err.message || "Failed to load customized citations." }));
    } finally {
      setCitationLoadingStates(prev => ({ ...prev, [platform]: false }));
    }
  };

  // Initialize and load articles from localStorage (or fallback to preloaded)
  useEffect(() => {
    const loadedArticles: { [key: number]: Article } = {};
    for (const d of totalDaysList) {
      const storageKey = `utpala_day_${d}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          loadedArticles[d] = JSON.parse(saved);
        } catch {
          loadedArticles[d] = getArticleByDay(d);
        }
      } else {
        loadedArticles[d] = getArticleByDay(d);
      }
    }
    setArticles(loadedArticles);
  }, []);

  const currentArticle = articles[activeDay] || getArticleByDay(activeDay);

  // Helper to save article changes to state and storage
  const saveArticle = (updated: Article) => {
    const newArticles = { ...articles, [updated.day]: updated };
    setArticles(newArticles);
    localStorage.setItem(`utpala_day_${updated.day}`, JSON.stringify(updated));
  };

  // Trigger quick notifications
  const showToast = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  // Copy full article markdown to clipboard
  const copyMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(currentArticle.content);
      setCopiedDay(true);
      showToast("Copied optimized markdown successfully!");
      setTimeout(() => setCopiedDay(false), 2000);
    } catch {
      showToast("Could not copy content automatically.");
    }
  };

  // Trigger TXT File Download
  const downloadArticle = () => {
    const element = document.createElement("a");
    const file = new Blob([currentArticle.content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `Day_${currentArticle.day}_Utpala_SEO_Article.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    showToast(`Downloaded Day ${currentArticle.day} Article as TXT`);
  };

  // Toggle Publish Status
  const toggleStatus = (newStatus: PublishStatus) => {
    const updated = { ...currentArticle, status: newStatus };
    saveArticle(updated);
    showToast(`Status updated to ${newStatus}`);
  };

  // Save manual text edits
  const handleSaveEdits = () => {
    const updated = { ...currentArticle, content: editorContent };
    saveArticle(updated);
    setIsEditing(false);
    showToast("Content modified and saved locally!");
  };

  // Trigger client-editor state
  const handleStartEditing = () => {
    setEditorContent(currentArticle.content);
    setIsEditing(true);
  };

  // Call server-side Gemini Content generation
  const handleAIGenerate = async () => {
    setIsGenerating(true);
    setGenerationError(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentArticle.metadata)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "An error occurred during AI generation.");
      }
      if (data.articleText) {
        const updated = {
          ...currentArticle,
          content: data.articleText,
          status: 'Draft' as PublishStatus
        };
        saveArticle(updated);
        showToast(`AI successfully generated the 3,000+ words article!`);
      } else {
        throw new Error("No content received from server.");
      }
    } catch (err: any) {
      console.error(err);
      setGenerationError(err.message || "Failed to connect to the generation server.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Helper to build semantic regex patterns for both primary and secondary matches
  const buildCombinedPattern = (primary: string, secondaries: string[]) => {
    const parts = [
      '(!\\[[^\\]]*\\]\\([^)]+\\))', // markdown images
      '(\\[[^\\]]+\\]\\([^)]+\\))',    // markdown links
      '(\\*\\*[^*]+\\*\\*)',           // bold
    ];
    
    if (primary) {
      const escapedPrimary = primary.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      parts.push(`(\\b${escapedPrimary}\\b)`);
    }
    
    secondaries.forEach(sec => {
      if (sec) {
        const escapedSec = sec.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        parts.push(`(\\b${escapedSec}\\b)`);
      }
    });
    
    return new RegExp(parts.join('|'), 'gi');
  };

  // Live element tokenizer rendering bold, links, photos, and matching keyword overlays
  const renderInteractiveText = (text: string, primary: string, secondaries: string[], showHeat: boolean) => {
    if (!text) return null;
    
    if (!showHeat) {
      // If heatmap highlight is toggled OFF, safely parse standard markdown markup
      return parseTextMarkup(text);
    }
    
    const pattern = buildCombinedPattern(primary, secondaries);
    const matches = [...text.matchAll(pattern)];
    
    const elements: any[] = [];
    let lastIndex = 0;
    
    matches.forEach((match, mIdx) => {
      const matchStr = match[0];
      const matchIndex = match.index!;
      
      if (matchIndex > lastIndex) {
        elements.push(text.substring(lastIndex, matchIndex));
      }
      
      if (matchStr.startsWith('**') && matchStr.endsWith('**')) {
        elements.push(
          <strong key={`bold-${mIdx}`} className="font-bold text-gray-900">
            {matchStr.slice(2, -2)}
          </strong>
        );
      } else if (matchStr.startsWith('![')) {
        const altStart = 2;
        const altEnd = matchStr.indexOf(']');
        const urlStart = matchStr.indexOf('(') + 1;
        const urlEnd = matchStr.lastIndexOf(')');
        const alt = matchStr.slice(altStart, altEnd);
        const url = matchStr.slice(urlStart, urlEnd);
        
        let resolvedUrl = url;
        if (url.includes('exterior')) resolvedUrl = IMAGE_PATHS.exterior;
        else if (url.includes('food')) resolvedUrl = IMAGE_PATHS.food;
        else if (url.includes('stupa')) resolvedUrl = IMAGE_PATHS.stupa;
        
        elements.push(
          <span key={`img-${mIdx}`} className="block my-6 max-w-xl mx-auto text-center bg-gray-50 p-2 border border-gray-200/60 rounded-xl shadow-sm">
            <img 
              src={resolvedUrl} 
              alt={alt} 
              referrerPolicy="no-referrer"
              className="rounded-lg border border-gray-150 max-h-72 object-cover mx-auto"
            />
            <span className="block text-xs text-gray-500 mt-2 italic font-mono uppercase tracking-wider">{alt}</span>
          </span>
        );
      } else if (matchStr.startsWith('[')) {
        const textStart = 1;
        const textEnd = matchStr.indexOf(']');
        const urlStart = matchStr.indexOf('(') + 1;
        const urlEnd = matchStr.lastIndexOf(')');
        const linkText = matchStr.slice(textStart, textEnd);
        const url = matchStr.slice(urlStart, urlEnd);
        
        const isInternal = url.startsWith('/') || url.includes('utpala.com.np/');
        
        if (isInternal) {
          const cleanSlug = url.substring(url.indexOf('/'));
          const matchedMeta = calendarMetadata.find(m => m.urlSlug === cleanSlug || cleanSlug.includes(m.urlSlug));
          
          if (matchedMeta) {
            elements.push(
              <button
                key={`link-${mIdx}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveDay(matchedMeta.day);
                  setIsEditing(false);
                  showToast(`Navigated to Day ${matchedMeta.day}: ${matchedMeta.title}`);
                }}
                className="text-[#F27D26] hover:text-orange-700 font-bold underline transition-colors cursor-pointer inline-flex items-center bg-orange-500/5 px-1 py-0.5 rounded gap-0.5 text-xs font-mono"
              >
                <span>{linkText}</span>
                <span className="bg-[#F27D26] text-white text-[8px] font-mono font-bold px-1 rounded-sm">D{matchedMeta.day}</span>
              </button>
            );
          } else {
            elements.push(
              <a
                key={`link-${mIdx}`}
                href={url}
                target="_blank"
                rel="noreferrer"
                className="text-[#F27D26] hover:underline font-bold transition-colors inline-block"
              >
                {linkText}
              </a>
            );
          }
        } else {
          elements.push(
            <a
              key={`link-${mIdx}`}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-600 hover:text-orange-800 font-bold underline transition-colors inline-flex items-center bg-orange-50/50 px-1 rounded gap-0.5"
            >
              <span>{linkText}</span>
              <ExternalLink className="h-2.5 w-2.5 inline shrink-0" />
            </a>
          );
        }
      } else {
        const isPrimary = matchStr.toLowerCase() === primary.toLowerCase();
        
        if (isPrimary) {
          elements.push(
            <span 
              key={`pk-${mIdx}`} 
              className="bg-orange-500/20 text-orange-950 font-bold border-b border-orange-500 px-1 py-0.5 rounded cursor-help transition-all hover:bg-orange-500/30 text-sm inline-flex items-center gap-1 font-sans shadow-sm"
              title="Primary SEO Goal Match!"
            >
              <span>{matchStr}</span>
              <span className="text-[7.5px] uppercase tracking-tighter text-white bg-[#F27D26] font-mono font-bold p-0.5 rounded-sm leading-none shrink-0">
                Primary
              </span>
            </span>
          );
        } else {
          elements.push(
            <span 
              key={`sk-${mIdx}`} 
              className="bg-emerald-500/10 text-emerald-950 font-semibold border-b border-emerald-500 px-1 py-0.5 rounded cursor-help transition-all hover:bg-emerald-500/20 text-sm inline-flex items-center gap-1 font-sans"
              title="Secondary Keyword Overlap"
            >
              <span>{matchStr}</span>
              <span className="text-[7.5px] uppercase tracking-tighter text-emerald-700 bg-emerald-100 font-mono font-semibold p-0.5 rounded-sm leading-none shrink-0">
                Sec
              </span>
            </span>
          );
        }
      }
      
      lastIndex = matchIndex + matchStr.length;
    });
    
    if (lastIndex < text.length) {
      elements.push(text.substring(lastIndex));
    }
    
    return <>{elements}</>;
  };

  // Fast markup parser for disabled heatmap
  const parseTextMarkup = (text: string) => {
    const pattern = /(!?\[[^\]]*\]\([^)]+\)|\*\*[^*]+\*\*)/g;
    const matches = [...text.matchAll(pattern)];
    
    const elements: any[] = [];
    let lastIndex = 0;
    
    matches.forEach((match, mIdx) => {
      const matchStr = match[0];
      const matchIndex = match.index!;
      
      if (matchIndex > lastIndex) {
        elements.push(text.substring(lastIndex, matchIndex));
      }
      
      if (matchStr.startsWith('**') && matchStr.endsWith('**')) {
        elements.push(
          <strong key={`bold-${mIdx}`} className="font-semibold text-slate-900 border-b border-gray-100 pb-0.5">
            {matchStr.slice(2, -2)}
          </strong>
        );
      } else if (matchStr.startsWith('![')) {
        const altStart = 2;
        const altEnd = matchStr.indexOf(']');
        const urlStart = matchStr.indexOf('(') + 1;
        const urlEnd = matchStr.lastIndexOf(')');
        const alt = matchStr.slice(altStart, altEnd);
        const url = matchStr.slice(urlStart, urlEnd);
        
        let resolvedUrl = url;
        if (url.includes('exterior')) resolvedUrl = IMAGE_PATHS.exterior;
        else if (url.includes('food')) resolvedUrl = IMAGE_PATHS.food;
        else if (url.includes('stupa')) resolvedUrl = IMAGE_PATHS.stupa;
        
        elements.push(
          <span key={`img-${mIdx}`} className="block my-6 max-w-xl mx-auto text-center bg-gray-50 p-2 border border-gray-200/60 rounded-xl shadow-sm animate-fade-in">
            <img 
              src={resolvedUrl} 
              alt={alt} 
              referrerPolicy="no-referrer"
              className="rounded-lg border border-gray-150 max-h-72 object-cover mx-auto"
            />
            <span className="block text-xs text-gray-500 mt-2 italic font-mono uppercase tracking-wider">{alt}</span>
          </span>
        );
      } else if (matchStr.startsWith('[')) {
        const textStart = 1;
        const textEnd = matchStr.indexOf(']');
        const urlStart = matchStr.indexOf('(') + 1;
        const urlEnd = matchStr.lastIndexOf(')');
        const linkText = matchStr.slice(textStart, textEnd);
        const url = matchStr.slice(urlStart, urlEnd);
        
        const isInternal = url.startsWith('/') || url.includes('utpala.com.np/');
        
        if (isInternal) {
          const cleanSlug = url.substring(url.indexOf('/'));
          const matchedMeta = calendarMetadata.find(m => m.urlSlug === cleanSlug || cleanSlug.includes(m.urlSlug));
          
          if (matchedMeta) {
            elements.push(
              <button
                key={`link-${mIdx}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveDay(matchedMeta.day);
                  setIsEditing(false);
                  showToast(`Navigated to Day ${matchedMeta.day}: ${matchedMeta.title}`);
                }}
                className="text-[#F27D26] hover:text-orange-700 font-bold underline transition-colors cursor-pointer inline-flex items-center bg-orange-500/5 px-1 py-0.5 rounded gap-0.5 text-xs font-mono"
              >
                <span>{linkText}</span>
                <span className="bg-[#F27D26] text-white text-[8px] font-mono font-bold px-1 rounded-sm">D{matchedMeta.day}</span>
              </button>
            );
          } else {
            elements.push(
              <a
                key={`link-${mIdx}`}
                href={url}
                target="_blank"
                rel="noreferrer"
                className="text-[#F27D26] hover:underline font-bold transition-colors inline-block"
              >
                {linkText}
              </a>
            );
          }
        } else {
          elements.push(
            <a
              key={`link-${mIdx}`}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-600 hover:text-orange-850 font-bold underline transition-colors inline-flex items-center bg-orange-50 px-1 rounded gap-0.5"
            >
              <span>{linkText}</span>
              <ExternalLink className="h-2.5 w-2.5 inline shrink-0" />
            </a>
          );
        }
      }
      
      lastIndex = matchIndex + matchStr.length;
    });
    
    if (lastIndex < text.length) {
      elements.push(text.substring(lastIndex));
    }
    
    return <>{elements}</>;
  };

  // High-fidelity split Markdown Render Engine
  const renderMarkdownText = (markdown: string) => {
    if (!markdown) return null;
    const lines = markdown.split('\n');
    let inList = false;
    let listItems: string[] = [];
    let paragraphCounter = 0;

    const elements: any[] = [];

    const flushList = (key: number) => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`list-${key}`} className="list-disc pl-6 my-4 space-y-2 text-slate-700 font-sans leading-relaxed text-base">
            {listItems.map((item, idx) => {
              return (
                <li key={idx}>
                  {renderInteractiveText(item, currentArticle.metadata.primaryKeyword, currentArticle.metadata.secondaryKeywords, showHeatmap)}
                </li>
              );
            })}
          </ul>
        );
        listItems = [];
        inList = false;
      }
    };

    lines.forEach((line, index) => {
      // Check list items
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        inList = true;
        listItems.push(line.trim().substring(2));
        return;
      } else if (line.trim() !== '' && inList && !line.trim().startsWith('- ') && !line.trim().startsWith('* ')) {
        flushList(index);
      } else if (line.trim() === '' && inList) {
        flushList(index);
      }

      // Headers
      if (line.startsWith('# ')) {
        elements.push(<h1 key={index} className="text-2xl font-display font-bold text-gray-900 mt-8 mb-4 border-b pb-3 border-gray-200">{line.substring(2)}</h1>);
      } else if (line.startsWith('## ')) {
        const sectionTitle = line.substring(3).trim();
        const elementKeyPrefix = `inserted-photo-${index}`;
        
        // Dynamic full-width high fidelity image compiler
        if (sectionTitle.includes("Introduction") || sectionTitle.slice(0, 3).includes("1")) {
          elements.push(
            <div key={`${elementKeyPrefix}-stupa`} className="my-6 rounded-xl overflow-hidden border border-gray-200 shadow-sm relative group bg-gray-50">
              <img src={IMAGE_PATHS.stupa} alt="Boudhanath Stupa perspective near Utpala Cafe" referrerPolicy="no-referrer" className="w-full h-80 object-cover group-hover:scale-[1.01] transition-transform duration-500" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/85 to-transparent p-4 text-white">
                <span className="text-[10px] font-mono tracking-widest text-[#F27D26] uppercase font-bold block">Featured Ambiance Spot</span>
                <span className="text-xs font-sans italic mt-1 block">"Our serene space situated exactly 3-minute walking distance from Boudhanath Stupa"</span>
              </div>
            </div>
          );
        } else if (sectionTitle.includes("Deep-Dive") || sectionTitle.slice(0, 3).includes("2")) {
          elements.push(
            <div key={`${elementKeyPrefix}-food`} className="my-6 rounded-xl overflow-hidden border border-gray-200 shadow-sm relative group bg-gray-50">
              <img src={IMAGE_PATHS.food} alt="Delicious 100% Pure Vegetarian Food at Utpala" referrerPolicy="no-referrer" className="w-full h-80 object-cover group-hover:scale-[1.01] transition-transform duration-500" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/85 to-transparent p-4 text-white">
                <span className="text-[10px] font-mono tracking-widest text-[#F27D26] uppercase font-bold block">Pure Vegetarian Cuisine</span>
                <span className="text-xs font-sans italic mt-1 block">"100% pure vegetarian and vegan-friendly ingredients prepared daily"</span>
              </div>
            </div>
          );
        } else if (sectionTitle.includes("Unique Positioning") || sectionTitle.slice(0, 3).includes("3")) {
          elements.push(
            <div key={`${elementKeyPrefix}-exterior`} className="my-6 rounded-xl overflow-hidden border border-gray-200 shadow-sm relative group bg-gray-50">
              <img src={IMAGE_PATHS.exterior} alt="Utpala Cafe House Courtyard" referrerPolicy="no-referrer" className="w-full h-80 object-cover group-hover:scale-[1.01] transition-transform duration-500" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/85 to-transparent p-4 text-white">
                <span className="text-[10px] font-mono tracking-widest text-[#F27D26] uppercase font-bold block">Sanctuary Courtyard Garden</span>
                <span className="text-xs font-sans italic mt-1 block">"A peaceful, walled garden courtyard ideal for focus or meditation"</span>
              </div>
            </div>
          );
        }
        
        elements.push(<h2 key={index} className="text-lg font-display font-extrabold border-b border-[#F27D26] inline-block mb-3 mt-8 text-gray-900 uppercase tracking-tight">{sectionTitle}</h2>);
      } else if (line.startsWith('### ')) {
        elements.push(<h3 key={index} className="text-base font-display font-medium text-gray-800 mt-6 mb-2">{line.substring(4)}</h3>);
      }
      else if (line.startsWith('**Meta Description:**') || line.startsWith('**URL Slug:**') || line.startsWith('**Primary Keyword:**') || line.startsWith('**Secondary Keywords:**') || line.startsWith('**Reading Time:**')) {
        const titleSep = line.split(':');
        const label = titleSep[0].replace(/\*\*/g, '').trim();
        const val = titleSep.slice(1).join(':').trim();
        elements.push(
          <div key={index} className="flex bg-orange-50/50 border-l-4 border-[#F27D26] py-1.5 px-3 my-2 font-mono text-xs">
            <span className="font-semibold text-orange-950 mr-2 uppercase tracking-wide text-[10px]">{label}:</span>
            <span className="text-gray-700">{val}</span>
          </div>
        );
      }
      else if (line.trim() === '---') {
        elements.push(<hr key={index} className="my-6 border-slate-200" />);
      }
      else if (line.trim() !== '') {
        paragraphCounter++;
        const currentPIdx = paragraphCounter;
        
        let borderStyle = "my-4 text-slate-700 font-sans leading-relaxed text-base transition-all duration-300";
        let hoverLabel = "";
        
        if (showHeatmap) {
          // Calculate density dynamically
          const pk = currentArticle.metadata.primaryKeyword;
          const sks = currentArticle.metadata.secondaryKeywords;
          const kws = [pk, ...sks];
          let occurrences = 0;
          kws.forEach(kw => {
            const escaped = kw.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
            const regex = new RegExp(`\\b${escaped}\\b`, 'gi');
            occurrences += (line.match(regex) || []).length;
          });
          
          if (occurrences > 0) {
            borderStyle += " border-l-2 border-amber-400 pl-3 bg-gradient-to-r from-orange-500/5 to-transparent rounded-r-md py-1";
            hoverLabel = `${occurrences} target keyword matches!`;
          } else {
            borderStyle += " border-l border-transparent pl-3";
          }
        }

        elements.push(
          <p 
            id={`p-line-${currentPIdx}`}
            key={index}
            className={borderStyle}
            title={hoverLabel}
          >
            {renderInteractiveText(line, currentArticle.metadata.primaryKeyword, currentArticle.metadata.secondaryKeywords, showHeatmap)}
          </p>
        );
      }
    });

    flushList(lines.length);
    return <div className="space-y-1">{elements}</div>;
  };

  // Real-time local SEO Analyzer functions
  const countWords = (text: string) => {
    if (!text) return 0;
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  const checkKeywordInText = (text: string, keyword: string) => {
    if (!text || !keyword) return false;
    return text.toLowerCase().includes(keyword.toLowerCase());
  };

  // Real-time helper for overall campaign dashboard SEO score
  const getSeoScoreForArticleTextAndMeta = (text: string, meta: typeof calendarMetadata[0]) => {
    if (!text) return 0;
    const wordCount = countWords(text);
    const lengthCheck = wordCount >= 1000;
    const idealLengthCheck = wordCount >= 3000;
    const titleCheck = checkKeywordInText(meta.title, meta.primaryKeyword);
    const introPortion = text.split('\n').slice(0, 15).join(' ');
    const introCheck = checkKeywordInText(introPortion, meta.primaryKeyword);
    const metaDescCheck = checkKeywordInText(meta.metaDescription, meta.primaryKeyword) && meta.metaDescription.includes("Boudha, Kathmandu");
    const metaDescLen = meta.metaDescription.length >= 140 && meta.metaDescription.length <= 170;

    let score = 20;
    if (lengthCheck) score += 15;
    if (idealLengthCheck) score += 15;
    if (titleCheck) score += 10;
    if (introCheck) score += 15;
    if (metaDescCheck) score += 15;
    if (metaDescLen) score += 10;
    return Math.min(score, 100);
  };

  // Perform Gemini-powered readability and structure analysis
  const handleAnalyzeReadability = async () => {
    setIsAnalyzingReadability(true);
    setReadabilityError(null);
    try {
      const activeText = isEditing ? editorContent : currentArticle.content;
      const res = await fetch("/api/analyze-readability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: activeText })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to retrieve readability data.");
      }
      if (data.success && data.data) {
        setReadabilityResult(data.data);
        showToast("Readability study complete! Review suggestions in SEO tab.");
      } else {
        throw new Error("Invalid response format received from analysis engine.");
      }
    } catch (err: any) {
      console.error("Readability client error:", err);
      setReadabilityError(err.message || "Could not successfully analyze copy.");
    } finally {
      setIsAnalyzingReadability(false);
    }
  };

  // Apply suggested simplified sentence restructure
  const applyReadabilityRewrite = (original: string, rewrote: string) => {
    const currentText = isEditing ? editorContent : currentArticle.content;
    if (currentText.includes(original)) {
      const newText = currentText.replace(original, rewrote);
      if (isEditing) {
        setEditorContent(newText);
      } else {
        const updated = { ...currentArticle, content: newText };
        saveArticle(updated);
      }
      
      // Update readabilityResult suggestions list locally to prevent repeating
      if (readabilityResult && readabilityResult.suggestions) {
        setReadabilityResult({
          ...readabilityResult,
          suggestions: readabilityResult.suggestions.filter((s: any) => s.originalSentence !== original)
        });
      }
      showToast("Applied sentence simplification to editor!");
    } else {
      showToast("Sentence exact match not found. You can manually tweak the text.");
    }
  };

  // Live content evaluator that feeds on live typed buffers (editorContent) if active
  const activeContentText = isEditing ? editorContent : currentArticle.content;

  const getSeoMetrics = () => {
    const text = activeContentText;
    const meta = currentArticle.metadata;
    const wordCount = countWords(text);
    
    const lengthCheck = wordCount >= 1000;
    const idealLengthCheck = wordCount >= 3000;
    const titleCheck = checkKeywordInText(meta.title, meta.primaryKeyword);
    
    const introPortion = text.split('\n').slice(0, 15).join(' ');
    const introCheck = checkKeywordInText(introPortion, meta.primaryKeyword);
    const metaDescCheck = checkKeywordInText(meta.metaDescription, meta.primaryKeyword) && meta.metaDescription.includes("Boudha, Kathmandu");
    const metaDescLen = meta.metaDescription.length >= 140 && meta.metaDescription.length <= 170;

    const usps = [
      { key: "vegetarian", text: "vegetarian", matched: checkKeywordInText(text, "vegetarian") || checkKeywordInText(text, "vegan") },
      { key: "organic", text: "organic sourcing", matched: checkKeywordInText(text, "organic") },
      { key: "monastery", text: "monastery association", matched: checkKeywordInText(text, "monastery") || checkKeywordInText(text, "Ka-Nying") },
      { key: "stupa", text: "3-minute walk from Stupa", matched: checkKeywordInText(text, "Boudhanath Stupa") || checkKeywordInText(text, "walking distance") },
      { key: "tripadvisor", text: "#2 on TripAdvisor", matched: checkKeywordInText(text, "TripAdvisor") },
      { key: "farmers_market", text: "Saturday Farmers Market", matched: checkKeywordInText(text, "Farmers Market") },
      { key: "buffet", text: "Friday Unlimited Buffet", matched: checkKeywordInText(text, "Buffet") },
      { key: "no_alcohol", text: "No Alcohol, No Smoking", matched: checkKeywordInText(text, "no alcohol") || checkKeywordInText(text, "alcohol-free") || checkKeywordInText(text, "smoke-free") },
      { key: "facilities", text: "Ample parking & pet friendly", matched: checkKeywordInText(text, "parking") || checkKeywordInText(text, "pet-friendly") || checkKeywordInText(text, "laptop") }
    ];

    let score = 20;
    if (lengthCheck) score += 15;
    if (idealLengthCheck) score += 15;
    if (titleCheck) score += 10;
    if (introCheck) score += 15;
    if (metaDescCheck) score += 15;
    if (metaDescLen) score += 10;

    return {
      wordCount,
      score: Math.min(score, 100),
      checks: {
        lengthCheck,
        idealLengthCheck,
        titleCheck,
        introCheck,
        metaDescCheck,
        metaDescLen
      },
      usps
    };
  };

  const seoMetrics = getSeoMetrics();

  // Keyword overlap algorithm to list semantic interlinking partners across the remaining budget
  const getInternalLinkSuggestions = () => {
    const text = activeContentText || '';
    if (!text) return [];
    
    return calendarMetadata
      .filter(m => m.day !== activeDay)
      .map(m => {
        const keywords = [m.primaryKeyword, ...m.secondaryKeywords];
        const matches: { term: string; count: number; isPrimary: boolean }[] = [];
        
        keywords.forEach((kw, index) => {
          if (!kw) return;
          const escaped = kw.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
          const regex = new RegExp(`\\b${escaped}\\b`, 'gi');
          const occurrences = text.match(regex);
          if (occurrences && occurrences.length > 0) {
            matches.push({
              term: kw,
              count: occurrences.length,
              isPrimary: index === 0
            });
          }
        });
        
        const totalMatches = matches.reduce((sum, item) => sum + item.count, 0);
        
        return {
          day: m.day,
          title: m.title,
          urlSlug: m.urlSlug,
          primaryKeyword: m.primaryKeyword,
          matches,
          totalMatches
        };
      })
      .filter(item => item.totalMatches > 0)
      .sort((a, b) => b.totalMatches - a.totalMatches);
  };

  const suggestedLinks = getInternalLinkSuggestions();

  // One-click autolink word injector
  const handleAutolink = (targetDay: number, word: string) => {
    const metadata = calendarMetadata.find(m => m.day === targetDay);
    if (!metadata) return;
    
    const escaped = word.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`\\b(${escaped})\\b`, 'i');
    
    const currentText = isEditing ? editorContent : currentArticle.content;
    
    if (regex.test(currentText)) {
      const newText = currentText.replace(regex, `[$1](${metadata.urlSlug})`);
      if (isEditing) {
        setEditorContent(newText);
      } else {
        const updated = { ...currentArticle, content: newText };
        saveArticle(updated);
      }
      showToast(`Automatically linked "${word}" to Day ${targetDay}'s URL Slug!`);
    } else {
      showToast(`Precise word boundaries for "${word}" not found in current text.`);
    }
  };

  // Dynamically compile Backlink counts and relations across the entire 30-day scope
  const getBacklinkMap = () => {
    const counts: { [day: number]: { incomingDays: number[]; total: number } } = {};
    
    totalDaysList.forEach(d => {
      counts[d] = { incomingDays: [], total: 0 };
    });

    totalDaysList.forEach(sourceDay => {
      const sourceArt = articles[sourceDay] || getArticleByDay(sourceDay);
      const sourceContent = sourceArt?.content || "";
      if (!sourceContent) return;

      totalDaysList.forEach(targetDay => {
        if (sourceDay === targetDay) return;
        
        const targetMeta = calendarMetadata.find(m => m.day === targetDay);
        if (!targetMeta) return;

        const slugEscaped = targetMeta.urlSlug.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        // Matches standard Markdown links referencing the targets URL slug
        const regex = new RegExp(`\\[[^\\]]+\\]\\([^\\)]*${slugEscaped}[^\\)]*\\)`, 'i');
        
        if (regex.test(sourceContent)) {
          counts[targetDay].incomingDays.push(sourceDay);
          counts[targetDay].total += 1;
        }
      });
    });

    return counts;
  };

  const backlinkMap = getBacklinkMap();

  // One-click map link injector
  const handleDirectBacklinkInsert = (targetDay: number) => {
    const targetMeta = calendarMetadata.find(m => m.day === targetDay);
    if (!targetMeta) return;

    if (targetDay === activeDay) {
      showToast("Cannot insert a backlink back to the active article itself!");
      return;
    }

    const currentText = isEditing ? editorContent : currentArticle.content;
    const terms = [targetMeta.primaryKeyword, ...targetMeta.secondaryKeywords].filter(Boolean);
    let matchedKeyword = "";

    for (const term of terms) {
      const escaped = term.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = new RegExp(`\\b(${escaped})\\b`, 'i');
      if (regex.test(currentText)) {
        matchedKeyword = term;
        break;
      }
    }

    let newText = "";
    if (matchedKeyword) {
      const escaped = matchedKeyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = new RegExp(`\\b(${escaped})\\b`, 'i');
      newText = currentText.replace(regex, `[$1](${targetMeta.urlSlug})`);
      showToast(`Success! Found "${matchedKeyword}" in text and linked to Day ${targetDay}.`);
    } else {
      // Append a highly natural transition recommendation sentence
      newText = currentText.trim() + `\n\n*Read more about our related specialty guide: [${targetMeta.title}](${targetMeta.urlSlug})*`;
      showToast(`Appended specialty context block for Day ${targetDay} at the bottom of draft copy!`);
    }

    if (isEditing) {
      setEditorContent(newText);
    } else {
      const updated = { ...currentArticle, content: newText };
      saveArticle(updated);
    }
  };

  // Filter 30-day listing based on user search triggers
  const filteredMetadata = calendarMetadata.filter(meta => {
    const article = articles[meta.day] || getArticleByDay(meta.day);
    const matchesSearch = meta.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          meta.primaryKeyword.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          meta.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || article.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex flex-col lg:flex-row h-screen w-screen bg-[#111111] font-sans text-gray-200 overflow-hidden selection:bg-orange-200 selection:text-orange-950">
      
      {/* Toast Notification Container */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-[#0D0D0D] text-white py-3 px-6 rounded-md shadow-xl border border-white/10 flex items-center space-x-2 text-xs"
          >
            <Check className="h-4 w-4 text-[#F27D26]" />
            <span>{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Top Header */}
      <div className="lg:hidden flex items-center justify-between px-5 py-4 bg-[#0D0D0D] border-b border-white/10 shrink-0 z-40">
        <div className="text-[#F27D26] font-display font-bold text-lg tracking-tighter uppercase flex items-center space-x-2">
          <Compass className="h-5 w-5 text-[#F27D26] animate-pulse" />
          <span>Utpala Engine</span>
        </div>
        <button 
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="bg-white/5 hover:bg-white/10 hover:text-white text-gray-300 font-mono text-[10px] uppercase tracking-wider font-bold px-3 py-2 rounded-lg border border-white/10 cursor-pointer flex items-center space-x-1.5 transition-colors"
        >
          <span>{isMobileSidebarOpen ? "✕ Close" : "☰ 30-Day Planner"}</span>
        </button>
      </div>

      {/* Mobile Dim Overlay when drawer is active */}
      {isMobileSidebarOpen && (
        <div 
          onClick={() => setIsMobileSidebarOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/60 z-40 transition-opacity"
        />
      )}

      {/* LEFT SIDEBAR: 30-Day Content Planner & Keywords Manager */}
      <aside className={`
        ${isMobileSidebarOpen ? 'flex fixed inset-y-0 left-0 z-50 w-[85%] sm:w-80 border-r border-white/10 shadow-2xl h-full' : 'hidden lg:flex lg:w-80'} 
        flex-col bg-[#0D0D0D] shrink-0 lg:h-full overflow-hidden transition-all duration-300
      `}>
        
        {/* Sidebar Brand Header */}
        <div className="p-6 border-b border-white/10">
          <div className="text-[#F27D26] font-display font-bold text-xl tracking-tighter uppercase mb-1 flex items-center space-x-2">
            <Compass className="h-5 w-5 text-[#F27D26] animate-pulse" />
            <span>Utpala Engine</span>
          </div>
          <div className="text-[10px] text-gray-400 font-mono tracking-widest uppercase italic leading-none">
            SEO Campaign Planner
          </div>
        </div>

        {/* Global Stats Block */}
        <div className="p-4 border-b border-white/5 bg-black/30 grid grid-cols-2 gap-2 text-center text-xs">
          <div className="bg-white/5 border border-white/5 rounded p-2 flex flex-col justify-center">
            <span className="text-[8px] uppercase tracking-wider text-gray-500 font-mono">Campaign Path</span>
            <span className="font-mono text-[#F27D26] font-bold mt-1">30 DAYS</span>
          </div>
          <div className="bg-white/5 border border-white/5 rounded p-2 flex flex-col justify-center">
            <span className="text-[8px] uppercase tracking-wider text-gray-500 font-mono">Active Target</span>
            <span className="font-mono text-green-500 font-bold mt-1">#2 TRIPADV.</span>
          </div>
        </div>

        {/* Search Parameter Dashboard */}
        <div className="p-4 border-b border-white/10 space-y-3 bg-black/20">
          <div className="flex items-center space-x-2 bg-white/5 border border-white/10 rounded px-2.5 py-1.5 focus-within:border-[#F27D26] transition-colors">
            <Search className="h-3.5 w-3.5 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search target title/tag..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs bg-transparent text-gray-200 placeholder-gray-500 focus:outline-none"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="p-0.5 hover:text-[#F27D26] text-gray-400">
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
          
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-gray-400 font-bold uppercase tracking-wider">STATUS FILTER</span>
            <div className="flex space-x-1">
              {['All', 'Published', 'Scheduled', 'Draft'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase transition-colors ${
                    statusFilter === st 
                      ? 'bg-[#F27D26] text-white shadow-sm' 
                      : 'bg-white/5 text-gray-400 hover:text-gray-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 30-Day Filtered Lists */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          
          {/* Visual 30-Day Campaign Progress Map with Color-Coded Rings */}
          <div className="bg-[#121212] border border-white/5 rounded-lg p-3 space-y-3 mb-2">
            <div className="flex justify-between items-center text-[9px] font-mono text-gray-400 font-bold uppercase tracking-wider">
              <span>Campaign Metrics Rings</span>
              <span className="text-[#F27D26] font-bold">
                {calendarMetadata.filter(m => (articles[m.day] || getArticleByDay(m.day)).status === 'Published').length} / 30 Published
              </span>
            </div>
            
            <div className="grid grid-cols-6 gap-1.5 justify-items-center">
              {calendarMetadata.map((meta) => {
                const article = articles[meta.day] || getArticleByDay(meta.day);
                const status = article.status;
                const isActive = activeDay === meta.day;
                const score = getSeoScoreForArticleTextAndMeta(article.content, meta);
                
                // stroke calculations (radius=10, circumference ~ 62.83)
                const r = 10;
                const circ = 2 * Math.PI * r;
                const strokeOffset = circ - (score / 100) * circ;
                
                return (
                  <button
                    key={meta.day}
                    onClick={() => {
                      setActiveDay(meta.day);
                      setIsEditing(false);
                      setIsMobileSidebarOpen(false);
                    }}
                    title={`Day ${meta.day}: ${meta.title}\nStatus: ${status}\nSEO Score: ${score}%`}
                    className={`relative w-9 h-9 flex items-center justify-center rounded-md transition-all outline-none ${
                      isActive 
                        ? 'bg-white/10 ring-1 ring-[#F27D26] scale-105' 
                        : 'hover:bg-white/5 hover:scale-105'
                    }`}
                  >
                    <svg className="w-8 h-8 transform -rotate-90">
                      <circle
                        cx="16"
                        cy="16"
                        r={r}
                        className="text-white/5"
                        strokeWidth="2"
                        stroke="currentColor"
                        fill="transparent"
                      />
                      <circle
                        cx="16"
                        cy="16"
                        r={r}
                        className={`${
                          status === 'Published'
                            ? 'text-emerald-500'
                            : status === 'Scheduled'
                            ? 'text-sky-400'
                            : 'text-amber-500/80'
                        }`}
                        strokeWidth="2"
                        strokeDasharray={circ}
                        strokeDashoffset={strokeOffset}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                      />
                    </svg>
                    <span className="absolute text-[8.5px] font-mono font-bold text-gray-305">
                      {meta.day}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-between items-center text-[8px] text-gray-400 font-mono border-t border-white/5 pt-1.5">
              <span className="flex items-center space-x-1">
                <span className="h-1 w-1 rounded-full bg-amber-500 block animate-pulse" />
                <span>Draft</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="h-1 w-1 rounded-full bg-sky-400 block" />
                <span>Scheduled</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="h-1 w-1 rounded-full bg-emerald-500 block" />
                <span>Published</span>
              </span>
            </div>
          </div>

          <div className="text-[10px] uppercase font-mono tracking-widest text-[#F27D26] font-bold mb-3 pl-1">
            Campaign Calendar ({filteredMetadata.length})
          </div>
          
          <div className="space-y-2">
            {filteredMetadata.map((meta) => {
              const article = articles[meta.day] || getArticleByDay(meta.day);
              const isActive = activeDay === meta.day;
              const isPreloaded = meta.day <= 10;
              
              let badgeText = article.status;
              if (isPreloaded && article.status === 'Draft') badgeText = 'Ready';

              return (
                <div
                  key={meta.day}
                  onClick={() => {
                    setActiveDay(meta.day);
                    setIsEditing(false);
                    setIsMobileSidebarOpen(false);
                  }}
                  className={`p-3 rounded-md transition-all cursor-pointer text-left border ${
                    isActive
                      ? 'bg-[#F27D26] text-white shadow-lg border-[#F27D26]'
                      : 'hover:bg-white/5 bg-transparent text-gray-300 border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className={`text-[10px] font-bold font-mono tracking-wider ${isActive ? 'text-white/95' : 'text-[#F27D26]'}`}>
                      DAY {meta.day < 10 ? `0${meta.day}` : meta.day} • {meta.type.toUpperCase()}
                    </div>
                    <span className={`text-[9px] font-mono px-1 py-0.5 rounded leading-none uppercase font-bold border ${
                      isActive 
                        ? 'bg-black/20 text-white border-white/10' 
                        : badgeText === 'Published' 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/15' 
                          : badgeText === 'Scheduled' 
                            ? 'bg-sky-500/10 text-sky-400 border-sky-500/15' 
                            : 'bg-amber-500/10 text-[#F27D26] border-orange-500/20'
                    }`}>
                      {badgeText}
                    </span>
                  </div>
                  <h3 className={`text-xs mt-1 truncate ${isActive ? 'text-white font-semibold' : 'text-gray-200'}`}>
                    {meta.title}
                  </h3>
                  <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-white/5">
                    <span className={`text-[9px] font-mono leading-none flex items-center space-x-1 ${isActive ? 'text-white/80' : 'text-gray-500'}`}>
                      <Leaf className="h-2.5 w-2.5 text-emerald-500 shrink-0" />
                      <span className="truncate">{meta.primaryKeyword}</span>
                    </span>
                  </div>
                </div>
              );
            })}
            
            {filteredMetadata.length === 0 && (
              <div className="text-center py-8 text-xs text-gray-500 font-mono border border-dashed border-white/5 rounded-lg">
                NO ENGINE DRAFTS REACH MATCH
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Footer detailing metadata values */}
        <div className="p-4 border-t border-white/10 bg-black/40 mt-auto shrink-0">
          <div className="flex justify-between items-center text-[10px] font-mono text-gray-400 uppercase tracking-widest">
            <span>Target Site</span>
            <a href="https://utpala.com.np" target="_blank" rel="noreferrer" className="text-[#F27D26] hover:underline flex items-center space-x-1">
              <span>utpala.com.np</span>
              <ExternalLink className="h-2.5 w-2.5" />
            </a>
          </div>
        </div>

      </aside>

      {/* CORE WORKSPACE: High-contrast rich editor & data grid interface */}
      <section className="flex-1 flex flex-col bg-[#FDFCFB] text-[#1A1A1B] lg:overflow-hidden overflow-y-auto">
        
        {/* Workspace banner containing key metrics and action parameters */}
        <header className="p-6 border-b border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center bg-white gap-4 shrink-0">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono bg-orange-100 text-[#F27D26] px-2 py-0.5 rounded font-bold uppercase tracking-wide">
                Day {currentArticle.day} Article Draft
              </span>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs text-gray-500 font-mono">{currentArticle.metadata.type}</span>
              {currentArticle.day <= 10 && (
                <span className="text-[10px] bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded flex items-center space-x-0.5 border border-emerald-100 font-mono">
                  <ShieldCheck className="h-2.5 w-2.5" />
                  <span>Deep-Researched Setup</span>
                </span>
              )}
            </div>
            <h1 className="text-xl md:text-2xl font-display font-bold text-gray-900 tracking-tight mt-1 leading-tight">
              {currentArticle.metadata.title}
            </h1>
            <p className="text-xs text-gray-500 mt-1 flex items-center space-x-2">
              <span>Architecture Draft: Local SEO Optimization</span>
              <span>•</span>
              <span className="text-[#F27D26] font-mono font-bold">Priority Status: High</span>
            </p>
          </div>
          
          <div className="flex gap-4 bg-gray-50 border border-gray-200 rounded-xl p-3 shrink-0">
            <div className="text-center px-2">
              <div className="text-[10px] uppercase tracking-tighter font-bold text-gray-400 font-mono">Word Count</div>
              <div className="text-lg font-mono font-bold leading-none text-gray-900 mt-1">{seoMetrics.wordCount}</div>
            </div>
            <div className="w-px bg-gray-200 self-stretch" />
            <div className="text-center px-2">
              <div className="text-[10px] uppercase tracking-tighter font-bold text-gray-400 font-mono">SEO Score</div>
              <div className="text-lg font-mono font-bold leading-none text-green-600 mt-1">{seoMetrics.score}%</div>
            </div>
          </div>
        </header>

        {/* Horizontal controls block acting as Action Toolbar */}
        <div className="bg-gray-50 border-b border-gray-200 p-3 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex overflow-x-auto space-x-1 pb-1 md:pb-0">
            {([
              { id: 'content', label: 'Content Feed', icon: FileText },
              { id: 'images', label: 'Media Prompts', icon: Sparkles },
              { id: 'links', label: 'Interlinking', icon: Compass },
              { id: 'seo', label: 'SEO Analyzer', icon: CheckSquare },
              { id: 'subdomain', label: 'Domain SEO Launcher', icon: Globe }
            ] as const).map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-semibold tracking-wide transition-all whitespace-nowrap cursor-pointer ${
                    isActive 
                      ? 'bg-white text-[#F27D26] border border-gray-200 shadow-sm font-bold' 
                      : 'text-gray-600 hover:bg-gray-150 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-[#F27D26]' : 'text-gray-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center flex-wrap gap-2">
            {/* Status Selector */}
            <div className="flex items-center space-x-0.5 bg-white border border-gray-200 rounded p-0.5">
              {(['Draft', 'Scheduled', 'Published'] as PublishStatus[]).map((st) => (
                <button
                  key={st}
                  onClick={() => toggleStatus(st)}
                  className={`px-2 py-1 rounded text-[9px] font-mono font-bold uppercase transition-colors cursor-pointer ${
                    currentArticle.status === st 
                      ? 'bg-[#111111] text-white' 
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <button
              onClick={copyMarkdown}
              title="Copy markdown content to clipboard"
              className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-3 py-1.5 rounded text-xs font-mono font-medium flex items-center space-x-1 cursor-pointer"
            >
              {copiedDay ? <Check className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3" />}
              <span>{copiedDay ? "COPIED" : "COPY MD"}</span>
            </button>

            <button
              onClick={downloadArticle}
              title="Download article as txt file"
              className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-3 py-1.5 rounded text-xs font-mono font-medium flex items-center space-x-1 cursor-pointer"
            >
              <Download className="h-3 w-3" />
              <span>DOWNLOAD</span>
            </button>

            <button
              onClick={() => {
                setShowHeatmap(!showHeatmap);
                showToast(showHeatmap ? "Visual Heatmap overlay toggled off" : "Visual Heatmap active! Density highlights and scrolling coordinates active.");
              }}
              title="Toggle SEO Keyword occurrences and density highlights"
              className={`px-3 py-1.5 rounded text-xs font-mono font-bold flex items-center space-x-1 border cursor-pointer transition-all ${
                showHeatmap 
                  ? 'bg-amber-500/10 text-amber-700 border-amber-300 shadow-sm' 
                  : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-200'
              }`}
            >
              <Flame className={`h-3.5 w-3.5 ${showHeatmap ? 'text-amber-500 fill-amber-500/10' : 'text-gray-400'}`} />
              <span>{showHeatmap ? "HEATMAP ON" : "HEATMAP OFF"}</span>
            </button>

            {isEditing ? (
              <button
                onClick={() => setIsEditing(false)}
                className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-3 py-1.5 rounded text-xs font-semibold font-mono cursor-pointer"
              >
                CANCEL
              </button>
            ) : (
              <button
                onClick={handleStartEditing}
                className="bg-orange-50 hover:bg-orange-100 text-[#F27D26] border border-orange-200 px-3 py-1.5 rounded text-xs font-bold flex items-center space-x-1 font-mono cursor-pointer"
              >
                <PenTool className="h-3.5 w-3.5" />
                <span>MODIFY</span>
              </button>
            )}
          </div>
        </div>

        {/* WORKSPACE DOUBLE GRID DIVISION */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 lg:overflow-hidden h-auto lg:h-full">
          
          {/* Main Primary Viewport for content */}
          <div className="col-span-1 lg:col-span-8 p-6 lg:p-8 bg-white lg:overflow-y-auto h-auto lg:h-full space-y-6">
            <AnimatePresence mode="wait">
              
              {/* Tab 1: Markdown Editor or Reader */}
              {activeTab === 'content' && (
                <motion.div
                  key="content-tab"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center text-[10px] font-mono uppercase bg-gray-50 p-2 border border-gray-200 rounded">
                        <span className="text-gray-500 font-bold">Modifying active workspace buffer text</span>
                        <span className="text-[#F27D26]">Live preview matches automatically</span>
                      </div>
                      <textarea
                        value={editorContent}
                        onChange={(e) => setEditorContent(e.target.value)}
                        className="w-full text-gray-900 font-mono text-sm leading-relaxed bg-[#FDFCFB] border border-gray-300 rounded-xl p-4 min-h-[420px] focus:outline-none focus:border-[#F27D26] focus:ring-1 focus:ring-[#F27D26] shadow-inner"
                      />
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => setIsEditing(false)}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded text-xs font-semibold font-mono border cursor-pointer"
                        >
                          Discard
                        </button>
                        <button
                          onClick={handleSaveEdits}
                          className="bg-[#111111] hover:bg-[#222121] text-white px-4 py-2 rounded text-xs font-bold font-mono shadow-md cursor-pointer"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      {/* AI Generator Prompts for drafts */}
                      {currentArticle.day > 10 && currentArticle.status === 'Draft' && currentArticle.content.includes("currently a Draft") && (
                        <div className="mb-6 bg-gradient-to-r from-orange-500/10 via-orange-500/5 to-transparent border border-[#F27D26]/20 rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 shadow-sm">
                          <div className="space-y-1">
                            <h3 className="text-sm font-semibold text-gray-900 flex items-center space-x-1.5">
                              <Sparkles className="h-4 w-4 text-[#F27D26] animate-bounce" />
                              <span className="font-display">Unlock Elite 3,000+ Words Optimization</span>
                            </h3>
                            <p className="text-xs text-gray-600 max-w-xl font-sans leading-relaxed">
                              Instantly generate a highly-researched, deep-dive local SEO article featuring local Nepalese ingredient catalogs, monastery values, Boudhanath guidelines, and perfect keyword density. Powered by the Google Gemini server-side architect.
                            </p>
                          </div>
                          <button
                            onClick={handleAIGenerate}
                            disabled={isGenerating}
                            className="bg-[#F27D26] hover:bg-[#d66513] text-white px-4 py-2.5 rounded-lg text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center space-x-1.5 shrink-0 self-end md:self-auto uppercase tracking-wider font-mono border-b-2 border-orange-700 cursor-pointer"
                          >
                            {isGenerating ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                            <span>{isGenerating ? "Generating..." : "Generate with Gemini"}</span>
                          </button>
                        </div>
                      )}

                      {/* Generation Error banner */}
                      {generationError && (
                        <div className="bg-red-50 border border-red-200 p-4 rounded-xl text-xs text-red-950 my-4 flex items-start space-x-3">
                          <AlertTriangle className="h-5 w-5 text-red-600 shrink-0" />
                          <div className="space-y-1">
                            <span className="font-semibold block text-red-900">Content Architect Generation Fault</span>
                            <p className="text-gray-600 font-sans leading-relaxed">{generationError}</p>
                            <span className="block text-[10px] text-gray-400 font-mono mt-2">Ensure process.env.GEMINI_API_KEY is configured in Settings &gt; Secrets.</span>
                          </div>
                        </div>
                      )}

                      {/* Pure Render Output of Article */}
                      <article className="prose max-w-none text-gray-800">
                        {renderMarkdownText(currentArticle.content)}
                      </article>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Tab 2: Image Requirements */}
              {activeTab === 'images' && (
                <motion.div
                  key="images-tab"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="border-b pb-4">
                    <h3 className="text-sm font-display font-bold text-gray-900 uppercase tracking-tight">Campaign High-Fidelity Graphics</h3>
                    <p className="text-xs text-gray-500 mt-1">We have synchronized premium physical images inside the workspace repository matching the monastery aesthetics. Apply these on web channels.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Courtyard */}
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col justify-between">
                      <div className="relative aspect-video">
                        <img 
                          src={IMAGE_PATHS.exterior} 
                          alt="Utpala Cafe Courtyard" 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 bg-[#0D0D0D]/90 text-white border border-white/5 text-[9px] font-mono py-0.5 px-2 rounded font-bold uppercase">
                          16:9 • COURTYARD
                        </div>
                      </div>
                      <div className="p-3.5 space-y-1.5 flex-1 flex flex-col justify-between">
                        <div className="border-l-2 border-[#F27D26] pl-2.5">
                          <span className="block text-[10px] text-gray-400 font-mono uppercase tracking-wider font-bold">Featured Image</span>
                          <p className="text-xs text-gray-600 font-sans italic mt-1">"{currentArticle.imagePrompts.featuredImage}"</p>
                        </div>
                        <div className="bg-gray-50 border p-1 rounded font-mono text-[9px] text-gray-400 truncate mt-3">
                          File: {IMAGE_PATHS.exterior}
                        </div>
                      </div>
                    </div>

                    {/* Food */}
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col justify-between">
                      <div className="relative aspect-video">
                        <img 
                          src={IMAGE_PATHS.food} 
                          alt="Pure Vegetarian Food" 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 bg-[#0D0D0D]/90 text-white border border-white/5 text-[9px] font-mono py-0.5 px-2 rounded font-bold uppercase">
                          16:9 • CUISINE SECRETS
                        </div>
                      </div>
                      <div className="p-3.5 space-y-1.5 flex-1 flex flex-col justify-between">
                        <div className="border-l-2 border-[#F27D26] pl-2.5">
                          <span className="block text-[10px] text-gray-400 font-mono uppercase tracking-wider font-bold">Product Food View</span>
                          <p className="text-xs text-gray-600 font-sans italic mt-1">"{currentArticle.imagePrompts.image2Food}"</p>
                        </div>
                        <div className="bg-gray-50 border p-1 rounded font-mono text-[9px] text-gray-400 truncate mt-3">
                          File: {IMAGE_PATHS.food}
                        </div>
                      </div>
                    </div>

                    {/* Ambiance */}
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col justify-between">
                      <div className="relative aspect-video">
                        <img 
                          src={IMAGE_PATHS.stupa} 
                          alt="Stupa Ambiance perspective" 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 bg-[#0D0D0D]/90 text-white border border-white/5 text-[9px] font-mono py-0.5 px-2 rounded font-bold uppercase">
                          16:9 • Boudha vibe
                        </div>
                      </div>
                      <div className="p-3.5 space-y-1.5 flex-1 flex flex-col justify-between">
                        <div className="border-l-2 border-[#F27D26] pl-2.5">
                          <span className="block text-[10px] text-gray-400 font-mono uppercase tracking-wider font-bold">Location Ambiance</span>
                          <p className="text-xs text-gray-600 font-sans italic mt-1">"{currentArticle.imagePrompts.image3Ambiance}"</p>
                        </div>
                        <div className="bg-gray-50 border p-1 rounded font-mono text-[9px] text-gray-400 truncate mt-3">
                          File: {IMAGE_PATHS.stupa}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mandate description */}
                  <div className="bg-orange-50/50 border border-orange-200 rounded-xl p-4 space-y-2">
                    <h4 className="text-xs font-mono font-bold text-orange-950 uppercase tracking-widest flex items-center space-x-1.5">
                      <ShieldCheck className="h-4 w-4 text-[#F27D26]" />
                      <span>IMAGE ALT-TAG METRICS (GEO PARAMETERS)</span>
                    </h4>
                    <p className="text-xs text-gray-700 leading-relaxed font-sans">
                      Ensure highest citation ranks in search and image carousels for queries near Boudhanath. Copy the generated Alt specification tag directly:
                    </p>
                    <div className="bg-white p-3 rounded-lg border border-orange-200/60 font-mono text-xs flex justify-between items-center mt-2.5">
                      <div className="min-w-0 flex-1">
                        <span className="block text-[9px] text-[#F27D26] font-bold uppercase">MANDATORY ALT SCRIPT</span>
                        <span className="text-gray-800 font-medium block truncate max-w-xl">{currentArticle.imagePrompts.altText}</span>
                      </div>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(currentArticle.imagePrompts.altText);
                          showToast("Alt tag copy absolute!");
                        }}
                        className="bg-gray-100 hover:bg-gray-250 p-2 rounded transition-colors ml-4 shrink-0 border cursor-pointer"
                      >
                        <Copy className="h-3.5 w-3.5 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Tab 3: PR Links & Outreach targets */}
              {activeTab === 'links' && (
                <motion.div
                  key="links-tab"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6 text-gray-800"
                >
                  <div className="border-b pb-4">
                    <h3 className="text-sm font-display font-bold text-gray-900 uppercase tracking-tight">SEMANTIC INTERLINKING SCHEMAS & LOCAL CITATIONS</h3>
                    <p className="text-xs text-gray-500 mt-1">Strengthen the domain authority of utpala.com.np with automated interlinking maps and targeted directory bios.</p>
                  </div>

                  {/* INTERACTIVE BACKLINK MAP VISUALIZATION */}
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4.5 space-y-4 shadow-sm text-left">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 border-b border-gray-200/60 pb-3">
                      <div>
                        <h4 className="text-xs font-display font-bold text-orange-600 uppercase tracking-wider flex items-center gap-1.5 font-bold">
                          <Compass className="h-4 w-4 text-[#F27D26]" />
                          <span className="text-gray-900">30-DAY INTERNAL CAMPAIGN BACKLINK MAP</span>
                        </h4>
                        <p className="text-[11px] text-gray-500 mt-0.5 font-sans">
                          Live inbound links count across all articles. Click any underlinked day (<span className="text-red-500 font-bold">🔴</span>) to auto-insert a contextual transition guide into the current editor!
                        </p>
                      </div>
                      <div className="flex items-center space-x-3 text-[9px] font-mono shrink-0">
                        <span className="flex items-center space-x-1 font-bold">
                          <span className="h-2 w-2 rounded-full bg-red-500" />
                          <span className="text-gray-600">0 Links (Critical)</span>
                        </span>
                        <span className="flex items-center space-x-1 font-bold">
                          <span className="h-2 w-2 rounded-full bg-amber-500" />
                          <span className="text-gray-600">1 Link (Fair)</span>
                        </span>
                        <span className="flex items-center space-x-1 font-bold">
                          <span className="h-2 w-2 rounded-full bg-emerald-500" />
                          <span className="text-gray-600">2+ Links (Optimized)</span>
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                      {calendarMetadata.map((meta) => {
                        const { total, incomingDays } = backlinkMap[meta.day] || { incomingDays: [], total: 0 };
                        const statusColor = total === 0 
                          ? 'bg-red-50 border-red-300 text-red-700 hover:bg-red-100/70' 
                          : total === 1 
                          ? 'bg-amber-50 border-amber-300 text-amber-700 hover:bg-amber-100/70' 
                          : 'bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-emerald-100/70';
                          
                        const isActive = activeDay === meta.day;

                        return (
                          <div key={meta.day} className="relative group">
                            <button
                              disabled={isActive}
                              onClick={() => handleDirectBacklinkInsert(meta.day)}
                              className={`w-full border rounded-lg p-2.5 flex flex-col items-center justify-center transition-all cursor-pointer outline-none ${statusColor} ${
                                isActive ? 'opacity-35 cursor-not-allowed border-gray-300 bg-gray-100 text-gray-400' : 'hover:scale-[1.03] active:scale-[0.98]'
                              }`}
                            >
                              <span className="text-[12px] font-mono font-black">{meta.day}</span>
                              <span className="text-[8.5px] font-mono font-bold mt-0.5 opacity-90">{total} Link{total !== 1 && 's'}</span>
                            </button>

                            {/* Beautiful tooltip */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 bg-gray-900 border border-gray-700 text-white rounded-lg p-2.5 text-[10px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50 text-left space-y-1 shadow-xl leading-relaxed">
                              <span className="font-sans font-bold block text-amber-400 text-[10.5px]">Day {meta.day}: {meta.type}</span>
                              <span className="font-sans text-gray-100 block font-semibold truncate leading-tight">{meta.title}</span>
                              <span className="font-mono text-gray-300 block text-[9.5px]">
                                Inbound links: <span className="font-bold text-white">{total}</span> {incomingDays.length > 0 && `(Days ${incomingDays.join(', ')})`}
                              </span>
                              <span className="font-sans text-emerald-300 block border-t border-gray-750 pt-1 mt-1 text-[9px] font-bold">
                                {isActive ? "Active Article" : "Click to auto-link/insert!"}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* LOCAL CITATIONS GENERATOR SECTION */}
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-5 shadow-sm text-left">
                    <div className="border-b border-gray-200/80 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <h4 className="text-xs font-display font-bold text-[#F27D26] uppercase tracking-wider flex items-center gap-1.5 font-bold">
                          <Award className="h-4 w-4 text-[#F27D26]" />
                          <span className="text-gray-900">PRE-FORMATTED CITATION & DIRECTORY BUILDER</span>
                        </h4>
                        <p className="text-[11px] text-gray-500 mt-1 font-sans">
                          Instantly construct optimized business directory listing templates combining your live SEO focus keywords and active Unique Selling Points (USPs).
                        </p>
                      </div>
                      <span className="text-[9px] bg-emerald-50 text-emerald-800 border border-emerald-200 py-1 px-2.5 rounded-full font-mono font-bold uppercase tracking-wider">
                        Active Article: Day {activeDay}
                      </span>
                    </div>

                    {/* SEO Context & Configurator - 2 Column Dashboard block */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
                      <div className="lg:col-span-4 space-y-3 lg:border-r lg:border-r-gray-200 lg:pr-5 border-b lg:border-b-0 pb-4 lg:pb-0">
                        <span className="block text-[9px] uppercase text-gray-400 font-mono tracking-wider font-bold">SEO Keyword Injector</span>
                        <div className="space-y-1.5 text-left">
                          <div className="text-[10px] text-gray-500 font-sans leading-relaxed">
                            The primary SEO keyword will automatically be embedded to raise local search relevance:
                          </div>
                          <div className="p-2.5 bg-amber-500/10 border border-amber-300 text-amber-900 rounded-lg text-xs font-mono font-bold text-center break-all select-all flex items-center justify-between gap-1">
                            <span className="truncate">{currentArticle.primaryKeyword}</span>
                            <span className="text-[8px] bg-amber-500 text-white font-mono uppercase px-1 rounded shrink-0 font-bold">ACTIVE</span>
                          </div>
                          <div className="text-[9px] text-gray-400 italic font-mono leading-tight">
                            * Dynamic local search crawler index optimization
                          </div>
                        </div>
                      </div>

                      <div className="lg:col-span-8 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="block text-[9px] uppercase text-gray-400 font-mono tracking-wider font-bold">Interactive USPs Selector (Choose 1 or more)</span>
                          <span className="text-[9px] font-mono text-gray-500 font-bold">{selectedUSPs.length} Selected</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {AVAILABLE_USPS.map((usp) => {
                            const isSelected = selectedUSPs.includes(usp.id);
                            return (
                              <button
                                key={usp.id}
                                onClick={() => {
                                  if (isSelected) {
                                    if (selectedUSPs.length > 1) {
                                      setSelectedUSPs(prev => prev.filter(id => id !== usp.id));
                                    } else {
                                      showToast("Keep at least one USP selected to preserve citation length!");
                                    }
                                  } else {
                                    setSelectedUSPs(prev => [...prev, usp.id]);
                                  }
                                }}
                                className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all select-none flex items-start gap-2.5 outline-none ${
                                  isSelected
                                    ? 'bg-emerald-50 bg-opacity-70 border-emerald-400 text-emerald-950 shadow-sm'
                                    : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-600'
                                }`}
                              >
                                <div className={`h-4 w-4 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                                  isSelected ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-gray-300'
                                }`}>
                                  {isSelected && <Check className="h-3 w-3" />}
                                </div>
                                <div className="space-y-0.5">
                                  <div className="text-[11px] font-bold font-sans tracking-tight leading-none">{usp.label}</div>
                                  <div className="text-[9.5px] text-gray-500 line-clamp-2 leading-tight mt-0.5">{usp.desc}</div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Pre-Formatted Copy Panels */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 pt-1">
                      {([
                        { 
                          id: 'google', 
                          title: 'Google Maps / GBP',
                          subtitle: 'Feature-heavy, trust-driven, geo-optimized local listing text.',
                          colorClass: 'border-blue-200 bg-blue-50/5',
                          badgeColor: 'bg-blue-600 text-white',
                          icon: '📍'
                        },
                        { 
                          id: 'tripadvisor', 
                          title: 'TripAdvisor Profile',
                          subtitle: 'Review-hungry tourist focus with high geographic tags.',
                          colorClass: 'border-emerald-200 bg-emerald-50/5',
                          badgeColor: 'bg-emerald-650 text-white',
                          icon: '⭐'
                        },
                        { 
                          id: 'happycow', 
                          title: 'HappyCow (Eco Vegan)',
                          subtitle: 'Pure plant-based compassion, green dining highlights.',
                          colorClass: 'border-green-200 bg-green-50/5',
                          badgeColor: 'bg-green-600 text-white',
                          icon: '🌱'
                        }
                      ] as const).map((plat) => {
                        const citationText = citationTexts[plat.id] || '';
                        const isLoading = citationLoadingStates[plat.id];
                        const err = citationErrors[plat.id];
                        const wordCount = citationText.split(/\s+/).filter(Boolean).length;
                        const hasAIUpdate = !citationText.includes("Planning an escape to") && !citationText.includes("located just steps from");

                        return (
                          <div 
                            key={plat.id} 
                            className={`border rounded-xl p-4 flex flex-col justify-between space-y-3.5 shadow-sm bg-white transition-all hover:bg-neutral-50/5 hover:shadow ${plat.colorClass}`}
                          >
                            <div className="space-y-1">
                              <div className="flex justify-between items-center bg-gray-50 -mx-4 -mt-4 px-4 py-2.5 rounded-t-xl border-b border-gray-200">
                                <div className="flex items-center space-x-1.5">
                                  <span className="text-xs">{plat.icon}</span>
                                  <span className="text-[11px] font-display font-bold text-gray-900 tracking-tight">{plat.title}</span>
                                </div>
                                <span className={`text-[8.5px] font-mono font-bold leading-none px-1.5 py-0.5 rounded ${plat.badgeColor}`}>
                                  {hasAIUpdate ? 'AI OPTIMIZED' : 'DYNAMIC'}
                                </span>
                              </div>
                              <p className="text-[10px] text-gray-500 font-sans italic mt-1.5 leading-snug">
                                {plat.subtitle}
                              </p>
                            </div>

                            {/* Main Box */}
                            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 h-[170px] overflow-y-auto relative flex flex-col">
                              {isLoading ? (
                                <div className="flex flex-col items-center justify-center my-auto py-8 space-y-2">
                                  <svg className="animate-spin h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                  </svg>
                                  <span className="text-[10px] font-mono text-gray-500">Drafting template...</span>
                                </div>
                              ) : err ? (
                                <span className="text-[10px] text-red-600 bg-red-50 p-2 rounded block font-mono">
                                  {err}
                                </span>
                              ) : (
                                <span className="text-[11px] text-gray-700 whitespace-pre-wrap leading-relaxed select-all block break-words text-left font-sans font-medium">
                                  {citationText}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center justify-between border-t border-gray-150 pt-2 text-[9px] font-mono text-gray-400">
                              <span>(~{wordCount} words)</span>
                              <span className="text-[#F27D26] font-bold">100% Compliant</span>
                            </div>

                            {/* Buttons and copy handlers */}
                            <div className="flex items-center gap-1.5 pt-0.5">
                              <button
                                onClick={async () => {
                                  try {
                                    await navigator.clipboard.writeText(citationText);
                                    showToast(`Copied ${plat.title} citation template!`);
                                  } catch {
                                    showToast("Copy failed, please select and copy manually.");
                                  }
                                }}
                                className="flex-1 bg-neutral-950 hover:bg-neutral-800 text-white font-mono font-bold text-[9px] uppercase tracking-wider py-2 px-2.5 rounded-lg transition-all cursor-pointer flex items-center justify-center space-x-1 shadow-sm"
                              >
                                <Copy className="h-3 w-3" />
                                <span>Copy Text</span>
                              </button>

                              <button
                                onClick={() => loadAICitation(plat.id)}
                                className="bg-[#F27D26]/10 hover:bg-[#F27D26]/18 text-[#F27D26] font-mono font-bold text-[9px] uppercase tracking-wider py-2 px-2.5 rounded-lg transition-all border border-[#F27D26]/25 cursor-pointer flex items-center justify-center space-x-1"
                                title="Enrich description copy with live Gemini reasoning"
                                disabled={isLoading}
                              >
                                <Sparkles className="h-2.5 w-2.5 text-[#F27D26] animate-pulse" />
                                <span>AI Polish</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* AUTOMATED SEMANTIC TARGET MATRIX */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#F27D26] flex items-center space-x-1">
                        <Sparkles className="h-3 w-3 text-[#F27D26] animate-pulse" />
                        <span>AI CO-OCCURRENCE LINK SUGGESTIONS (CURRENT ARTICLE SEGMENT)</span>
                      </h4>
                      <span className="text-[9px] bg-[#F27D26]/10 text-[#F27D26] font-mono px-2 py-0.5 rounded font-bold uppercase">
                        {suggestedLinks.length} Targets Found
                      </span>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                      <div className="bg-gray-50/50 p-4 border-b border-gray-200">
                        <p className="text-xs text-gray-600 leading-relaxed font-sans">
                          Our automated crawler has scanned your workspace draft copy and discovered keywords that map directly to other days in Utpala Cafe's 30-day content calendar. Use the quick-inserters below to anchor backlinks instantly!
                        </p>
                      </div>

                      {suggestedLinks.length === 0 ? (
                        <div className="p-6 text-center text-gray-400 text-xs font-sans">
                          No direct calendar keyword overlaps detected in current text. Try adding mentions of other blog topics like "Friday Night Unlimited Organic Buffet", "Saturday Farmers Market", or monastic connections to trigger live links!
                        </div>
                      ) : (
                        <div className="divide-y divide-gray-150">
                          {suggestedLinks.map((sLink) => (
                            <div key={sLink.day} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50/30 transition-colors">
                              <div className="space-y-1 my-auto">
                                <div className="flex items-center space-x-2">
                                  <span className="bg-orange-500 text-white font-mono text-[9px] font-bold px-1.5 py-0.5 rounded">
                                    DAY {sLink.day}
                                  </span>
                                  <span className="font-display font-bold text-gray-900 text-xs truncate max-w-sm">
                                    {sLink.title}
                                  </span>
                                </div>
                                <div className="text-[10px] text-gray-400 font-mono">
                                  URL Slug: <span className="text-gray-600">{sLink.urlSlug}</span>
                                </div>
                                {/* Matches Pills list */}
                                <div className="flex flex-wrap gap-1.5 pt-1.5">
                                  {sLink.matches.map((item, idx) => (
                                    <span 
                                      key={idx} 
                                      className={`text-[8.5px] px-2 py-0.5 rounded-sm font-mono border flex items-center space-x-1 ${
                                        item.isPrimary 
                                          ? 'bg-orange-50 border-orange-200 text-[#F27D26] font-extrabold' 
                                          : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                                      }`}
                                    >
                                      <span>{item.term}</span>
                                      <span className="opacity-75">({item.count}x)</span>
                                    </span>
                                  ))}
                                </div>
                              </div>

                              <div className="flex items-center space-x-2 shrink-0 md:self-center">
                                {/* Autolink word select button */}
                                <select 
                                  onChange={(e) => {
                                    if (e.target.value) {
                                      handleAutolink(sLink.day, e.target.value);
                                      e.target.value = ''; // Reset select
                                    }
                                  }}
                                  className="text-[10px] font-mono font-bold bg-white border border-gray-250 hover:bg-gray-50 py-1.5 px-2.5 rounded cursor-pointer text-gray-700 outline-none max-w-[130px]"
                                  defaultValue=""
                                >
                                  <option value="" disabled>Autolink Word...</option>
                                  {sLink.matches.map((item, mIdx) => (
                                    <option key={mIdx} value={item.term}>
                                      {item.term}
                                    </option>
                                  ))}
                                </select>

                                {/* Markdown Copy Button */}
                                <button
                                  onClick={() => {
                                    const primaryMatch = sLink.matches[0]?.term || sLink.primaryKeyword;
                                    const markdownLink = `[${primaryMatch}](${sLink.urlSlug})`;
                                    navigator.clipboard.writeText(markdownLink);
                                    showToast(`Copied Markdown code to clipboard: ${markdownLink}`);
                                  }}
                                  className="border p-2 bg-white hover:bg-gray-100 rounded transition-colors text-gray-600 cursor-pointer"
                                  title="Copy Relative Markdown Link Code"
                                >
                                  <Copy className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Internal anchor rules */}
                  <div className="space-y-3 pt-2">
                    <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#F27D26]">PREDEFINED INTERNAL LINK MANDATES</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {currentArticle.internalLinks.map((link, idx) => (
                        <div key={idx} className="bg-gray-50 border border-gray-200 p-3 rounded-lg flex items-start space-x-2 text-xs font-sans">
                          <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="text-gray-700 leading-relaxed">{link}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* External target outlines */}
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-gray-400">HIGH-AUTHORITY EXTERNAL RESOURCES</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {currentArticle.externalLinks.map((link, idx) => (
                        <a 
                          key={idx} 
                          href={link.url} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="bg-white border border-gray-200 hover:border-[#F27D26] hover:bg-orange-50/10 p-3.5 rounded-lg flex justify-between items-center transition-all cursor-pointer shadow-sm text-xs"
                        >
                          <div>
                            <span className="font-bold text-gray-900 block font-display">{link.anchor}</span>
                            <span className="text-[9px] text-gray-400 font-mono block truncate max-w-[200px] md:max-w-xs mt-0.5">{link.url}</span>
                          </div>
                          <ExternalLink className="h-4 w-4 text-gray-400" />
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Outreach Matrix outlines */}
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#F27D26]">MONTHLY CITATION OUTREACH TARGETS</h4>
                    <div className="space-y-2.5">
                      {currentArticle.outreachTargets.map((target, idx) => (
                        <div key={idx} className="bg-orange-50/20 border border-orange-200/50 p-4 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                          <div>
                            <span className="font-mono font-bold text-[#F27D26] text-[9px] uppercase tracking-wider block">TARGET #{idx+1}</span>
                            <span className="font-display font-bold text-gray-900 text-sm mt-0.5 block">{target.name}</span>
                          </div>
                          <div className="md:max-w-md text-gray-600 font-sans leading-relaxed bg-white border border-gray-200 p-2 rounded-md shadow-sm text-xs font-medium">
                            {target.reason}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Tab 4: Local Live SEO checklist */}
              {activeTab === 'seo' && (
                <motion.div
                  key="seo-tab"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="border-b pb-4 flex justify-between items-center">
                    <div>
                      <h3 className="text-sm font-display font-bold text-gray-900 uppercase">LIVE SEMANTIC COPY AUDITING</h3>
                      <p className="text-xs text-gray-500 mt-1">Scoring parameters verifying keyword density, density distribution, and physical local mentions.</p>
                    </div>
                    <div className="text-right">
                      <span className="block text-[9px] text-gray-400 font-mono font-bold uppercase tracking-wider">LIVE RECORD SCORE</span>
                      <span className="text-2.5xl font-mono font-black text-green-600 leading-none block mt-1">
                        {seoMetrics.score}%
                      </span>
                    </div>
                  </div>

                  {/* Score progression slide banner */}
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden shadow-inner">
                    <div 
                      className="h-full transition-all duration-500 bg-green-500 rounded-full"
                      style={{ width: `${seoMetrics.score}%` }}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Check item list */}
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#F27D26]">METADATA ANALYSIS</h4>
                      <div className="space-y-2 text-xs">
                        
                        {/* Length count tag */}
                        <div className="flex items-center justify-between p-3 rounded-lg bg-white border border-gray-200 shadow-sm font-mono">
                          <span className="text-gray-700">Word Count: {seoMetrics.wordCount} words</span>
                          {seoMetrics.checks.idealLengthCheck ? (
                            <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded text-[9px] font-bold uppercase border border-green-150">Ideal</span>
                          ) : seoMetrics.checks.lengthCheck ? (
                            <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-[9px] font-bold uppercase border border-blue-150">Optimized</span>
                          ) : (
                            <span className="text-[#F27D26] bg-orange-50 px-2 py-0.5 rounded text-[9px] font-bold uppercase border border-orange-150 flex items-center space-x-1">
                              <AlertCircle className="h-3 w-3 shrink-0" />
                              <span>Short</span>
                            </span>
                          )}
                        </div>

                        {/* Title Check */}
                        <div className="flex items-center justify-between p-3 rounded-lg bg-white border border-gray-200 shadow-sm font-mono">
                          <span className="text-gray-700">Keyword in H1 Element</span>
                          {seoMetrics.checks.titleCheck ? (
                            <span className="text-green-600 font-bold bg-green-50 border border-green-200 px-1.5 py-0.5 rounded text-[9px]">MATCHED</span>
                          ) : (
                            <span className="text-amber-600 font-bold bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded text-[9px]">UNFOUND</span>
                          )}
                        </div>

                        {/* Intro Check */}
                        <div className="flex items-center justify-between p-3 rounded-lg bg-white border border-gray-200 shadow-sm font-mono">
                          <span className="text-gray-700">Keyword in Introduction (First 150 words)</span>
                          {seoMetrics.checks.introCheck ? (
                            <span className="text-green-600 font-bold bg-green-50 border border-green-200 px-1.5 py-0.5 rounded text-[9px]">MATCHED</span>
                          ) : (
                            <span className="text-amber-600 font-bold bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded text-[9px]">UNFOUND</span>
                          )}
                        </div>

                        {/* Meta desc validation */}
                        <div className="flex items-center justify-between p-3 rounded-lg bg-white border border-gray-200 shadow-sm font-mono">
                          <span className="text-gray-700">Meta includes Key & "Boudha, Kathmandu"</span>
                          {seoMetrics.checks.metaDescCheck ? (
                            <span className="text-green-600 font-bold bg-green-50 border border-green-200 px-1.5 py-0.5 rounded text-[9px]">MATCHED</span>
                          ) : (
                            <span className="text-amber-600 font-bold bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded text-[9px]">UNFOUND</span>
                          )}
                        </div>

                        {/* Meta desc length */}
                        <div className="flex items-center justify-between p-3 rounded-lg bg-white border border-gray-200 shadow-sm font-mono">
                          <span className="text-gray-700">Meta Desc Length (140-170 Chars)</span>
                          {seoMetrics.checks.metaDescLen ? (
                            <span className="text-green-600 font-bold bg-green-50 border border-green-200 px-1.5 py-0.5 rounded text-[9px]">OK</span>
                          ) : (
                            <span className="text-amber-600 font-bold bg-[#FAF9F6] border border-amber-200 px-1.5 py-0.5 rounded text-[9px]">{currentArticle.metadata.metaDescription.length} CH</span>
                          )}
                        </div>

                      </div>
                    </div>

                    {/* Mentions Checklist */}
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#F27D26]">LOCAL SEARCH ENTITY MENTIONS</h4>
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2">
                        <p className="text-[10px] text-gray-500 font-sans leading-relaxed mb-2">Mentions detected inside active text editor buffer:</p>
                        <div className="grid grid-cols-1 gap-2">
                          {seoMetrics.usps.map((usp) => (
                            <div key={usp.key} className="flex justify-between items-center border-b border-gray-200/50 pb-1.5 last:border-0 last:pb-0 text-xs">
                              <span className="text-gray-700 font-sans font-semibold">{usp.text}</span>
                              <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold ${
                                usp.matched ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-500 font-normal'
                              }`}>
                                {usp.matched ? "VERIFIED" : "ABSENT"}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Flesch-Kincaid Readability & Simplified Restructures (AI Component) */}
                  <div className="border-t border-gray-200 pt-6 mt-6 space-y-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <h4 className="text-xs font-display font-bold text-[#F27D26] uppercase tracking-wide flex items-center gap-1.5">
                          <Sparkles className="h-4 w-4 text-[#F27D26]" />
                          <span>AI READABILITY & SENTENCE SIMPLIFIER</span>
                        </h4>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          Analyze copywriting structure for active voice, brief clauses, syllabic density, and user retention.
                        </p>
                      </div>
                      <button
                        onClick={handleAnalyzeReadability}
                        disabled={isAnalyzingReadability}
                        className={`px-4 py-2 rounded-lg text-xs font-bold font-mono uppercase shadow-sm flex items-center space-x-1.5 transition-all outline-none cursor-pointer ${
                          isAnalyzingReadability 
                            ? 'bg-orange-100 text-orange-400 cursor-not-allowed'
                            : 'bg-[#F27D26] hover:bg-orange-600 text-white hover:shadow-md'
                        }`}
                      >
                        {isAnalyzingReadability ? (
                          <>
                            <svg className="animate-spin h-3.5 w-3.5 text-orange-450" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            <span>Studying Flow...</span>
                          </>
                        ) : (
                          <>
                            <BookOpen className="h-3.5 w-3.5" />
                            <span>Analyze Readability</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Error display */}
                    {readabilityError && (
                      <div className="bg-red-50 border border-red-200 text-red-600 text-xs p-3.5 rounded-lg font-mono">
                        {readabilityError}
                      </div>
                    )}

                    {/* Results dashboard overlay */}
                    {readabilityResult ? (
                      <div className="space-y-4 animate-fade-in">
                        {/* 4 Score Metrics boxes */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {/* Ease block */}
                          <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-inner text-center space-y-1">
                            <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-gray-400 block font-sans">Flesch Reading Ease</span>
                            <div className="text-xl font-mono font-black text-gray-950 leading-none">
                              {readabilityResult.fleschReadingEase}
                            </div>
                            <span className={`inline-block text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase ${
                              readabilityResult.fleschReadingEase >= 70
                                ? 'bg-green-100 text-green-700'
                                : readabilityResult.fleschReadingEase >= 60
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {readabilityResult.fleschReadingEase >= 90 ? 'Very Easy' :
                               readabilityResult.fleschReadingEase >= 80 ? 'Easy' :
                               readabilityResult.fleschReadingEase >= 70 ? 'Fairly Easy' :
                               readabilityResult.fleschReadingEase >= 60 ? 'Standard' :
                               readabilityResult.fleschReadingEase >= 50 ? 'Fairly Hard' : 'Difficult'}
                            </span>
                          </div>

                          {/* Grade Level */}
                          <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-inner text-center space-y-1">
                            <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-gray-400 block font-sans">Kincaid Grade Level</span>
                            <div className="text-xl font-mono font-black text-gray-950 leading-none">
                              {readabilityResult.fleschKincaidGrade}
                            </div>
                            <span className="inline-block text-[9px] text-gray-500 font-mono">Target Audience</span>
                          </div>

                          {/* Optimal Reading Time */}
                          <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-inner text-center space-y-1">
                            <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-gray-400 block font-sans">Est. Reading Time</span>
                            <div className="text-xl font-mono font-black text-[#F27D26] leading-none">
                              {readabilityResult.readingTimeMinutes} min
                            </div>
                            <span className="inline-block text-[9px] text-[#F27D26] font-mono font-bold">Optimal Retention</span>
                          </div>

                          {/* Engagement Predictor */}
                          <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-inner text-center space-y-1">
                            <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-gray-400 block font-sans">Engagement Level</span>
                            <div className="text-xl font-mono font-black text-gray-950 leading-none">
                              {readabilityResult.currentEngagementLevel}
                            </div>
                            <span className="inline-block text-[9px] text-gray-500 font-mono">Predictive Output</span>
                          </div>
                        </div>

                        {/* Overall qualitative paragraph assessment copy */}
                        <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl text-xs text-gray-700 font-sans leading-relaxed text-left">
                          <strong className="text-gray-900 uppercase text-[9px] tracking-wider block mb-1">Qualitative Prose Assessment:</strong>
                          {readabilityResult.overallAssessment}
                        </div>

                        {/* Rewrite suggestions cards stack */}
                        <div className="space-y-3 text-left">
                          <h5 className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest block pl-0.5">
                            ACTIVATE REWRITE SIMPLIFICATIONS ({readabilityResult.suggestions?.length || 0})
                          </h5>

                          {readabilityResult.suggestions && readabilityResult.suggestions.length > 0 ? (
                            <div className="space-y-2.5">
                              {readabilityResult.suggestions.map((suggestion: any, sIdx: number) => (
                                <div key={sIdx} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-3">
                                  <div className="space-y-1.5 text-left">
                                    <div className="flex justify-between items-center text-[10px] font-mono">
                                      <span className="text-red-600 font-bold uppercase bg-red-50 border border-red-100 px-1.5 py-0.5 rounded leading-none">Complex Structure</span>
                                      <span className="text-gray-400">Sentence #{sIdx + 1}</span>
                                    </div>
                                    <p className="text-xs bg-gray-50/50 p-2.5 rounded border border-dashed border-gray-200 text-gray-650 italic select-all leading-relaxed">
                                      "{suggestion.originalSentence}"
                                    </p>
                                  </div>

                                  <div className="space-y-1.5 text-left">
                                    <div className="text-[10px] font-mono text-emerald-600 font-bold uppercase bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded leading-none inline-block">
                                      Simplify To Better Retention:
                                    </div>
                                    <p className="text-xs text-gray-900 font-semibold p-2.5 rounded bg-emerald-500/5 border border-emerald-200 leading-relaxed">
                                      "{suggestion.suggestedSentence}"
                                    </p>
                                  </div>

                                  <div className="text-[10.5px] text-gray-500 bg-gray-50/30 p-2 rounded leading-relaxed border flex justify-between items-center gap-4 text-left">
                                    <span className="font-sans font-medium text-gray-600">
                                      <strong>Improvement:</strong> {suggestion.reason}
                                    </span>
                                    <button
                                      onClick={() => applyReadabilityRewrite(suggestion.originalSentence, suggestion.suggestedSentence)}
                                      className="bg-[#F27D26] hover:bg-orange-600 text-white font-mono font-bold text-[9.5px] uppercase tracking-wider px-2.5 py-1.5 rounded-lg border border-[#F27D26] hover:shadow-sm flex items-center space-x-1 shrink-0 cursor-pointer"
                                    >
                                      <span>Apply Revision</span>
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-6 border border-dashed rounded-xl bg-gray-50 text-xs font-mono text-gray-450">
                              Excellent syllable and structural density detected. No complex sentences need simplification.
                            </div>
                          )}
                        </div>

                      </div>
                    ) : (
                      <div className="text-center py-8 border border-dashed rounded-xl bg-gray-50 text-xs font-sans text-gray-400 space-y-1 flex flex-col items-center justify-center">
                        <Sparkles className="h-5 w-5 text-gray-300 mb-1" />
                        <span>Ready to run detailed copy diagnostics.</span>
                        <span className="text-[10px] text-gray-350 font-mono">Requires Gemini API to build syllables and grade index values.</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Tab 5: Subdomain SEO Sub-channel Connection Guide */}
              {activeTab === 'subdomain' && (
                <motion.div
                  key="subdomain-tab"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6 text-gray-800"
                >
                  <div className="border-b pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h3 className="text-sm font-display font-bold text-gray-900 uppercase tracking-tight flex items-center space-x-1.5">
                        <Globe className="h-4 w-4 text-[#F27D26]" />
                        <span>blog.utpala.com.np SEO Connection Launchpad</span>
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        Leverage your new 30-Day Campaign to inject authority directly into your core reservation & brand domain <strong>utpala.com.np</strong>.
                      </p>
                    </div>
                    <div className="bg-[#F27D26]/10 border border-[#F27D26]/20 px-3 py-1.5 rounded-lg flex items-center space-x-1.5">
                      <ShieldCheck className="h-4 w-4 text-[#F27D26]" />
                      <span className="text-[10px] text-[#F27D26] font-mono font-bold uppercase tracking-wider">Verified Strategy</span>
                    </div>
                  </div>

                  {/* HIGH VALUE EXECUTIVE CONTEXT BANNER */}
                  <div className="bg-[#111111] text-white p-5 rounded-xl border border-white/10 space-y-3 relative overflow-hidden shadow-md">
                    <div className="absolute top-0 right-0 p-8 transform translate-x-1/3 -translate-y-1/3 bg-[#F27D26]/10 rounded-full blur-2xl" />
                    <span className="text-[9px] font-mono tracking-widest text-[#F27D26] uppercase font-bold block">
                      CORE SEO OPPORTUNITY: THE SUBDOMAIN EQUITY PIPELINE
                    </span>
                    <h4 className="font-display font-bold text-base text-gray-100 max-w-xl">
                      How blog.utpala.com.np ranks the root utpala.com.np
                    </h4>
                    <p className="text-xs text-gray-350 leading-relaxed font-sans max-w-2xl">
                      By default, search engine spiders (specifically Googlebot) analyze subdomains as separate conceptual hosts. Since your cafe's main business conversions (reservations, food orders, menu catalog) live on <strong>utpala.com.np</strong>, you must build explicit link equity pipelines and technical signals from this daily blog subdomain back to the root to pass your SEO ranking authority.
                    </p>
                  </div>

                  {/* THE FIVE COMMANDMENTS GRID */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#F27D26] border-b pb-1">
                      ACTIVATE ROOT RANKING SIGNS (5-STEP BLUEPRINT)
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Step 1: Link Pump */}
                      <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm space-y-2 hover:border-orange-200 transition-all">
                        <div className="flex items-center space-x-2">
                          <span className="bg-[#F27D26] text-white font-mono text-[9px] font-bold h-5 w-5 rounded-full flex items-center justify-center">
                            1
                          </span>
                          <span className="font-display font-bold text-gray-900 text-xs uppercase tracking-wide">
                            Contextual Anchor Link Pump
                          </span>
                        </div>
                        <p className="text-xs text-gray-650 leading-relaxed">
                          Do not link using generic text like "click here" or "our website". Instead, inject hyper-relevant anchor text linking from your subdomain back to primary pages.
                        </p>
                        <div className="bg-gray-50 border p-2 rounded text-[10px] font-mono text-gray-600 mt-2 space-y-1">
                          <div className="font-bold text-[#F27D26]">Optimal Anchor Mappings:</div>
                          <div>• To Menu Page: <span className="text-gray-900 font-bold">"pure vegetarian food menu in Boudha"</span></div>
                          <div>• To Contact Page: <span className="text-gray-900 font-bold">"locate Utpala Cafe Kathmandu"</span></div>
                        </div>
                      </div>

                      {/* Step 2: GSC Property */}
                      <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm space-y-2 hover:border-emerald-200 transition-all">
                        <div className="flex items-center space-x-2">
                          <span className="bg-emerald-600 text-white font-mono text-[9px] font-bold h-5 w-5 rounded-full flex items-center justify-center">
                            2
                          </span>
                          <span className="font-display font-bold text-gray-900 text-xs uppercase tracking-wide">
                            GSC Unified Domain Property
                          </span>
                        </div>
                        <p className="text-xs text-gray-650 leading-relaxed">
                          Do not add <strong>blog.utpala.com.np</strong> as a standalone simple "URL Prefix" profile. Instead, configure a single broad <strong>"Domain Property"</strong> for <strong>utpala.com.np</strong> in Google Search Console.
                        </p>
                        <div className="text-[10px] text-emerald-800 font-sans italic bg-emerald-50 p-2 rounded border border-emerald-100 mt-2">
                          This groups all indexing metrics together, directly signaling to Google that the subdomain content is a semantic department of your main trademark.
                        </div>
                      </div>

                      {/* Step 3: Schema Connection */}
                      <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm space-y-2 hover:border-blue-200 transition-all">
                        <div className="flex items-center space-x-2">
                          <span className="bg-blue-600 text-white font-mono text-[9px] font-bold h-5 w-5 rounded-full flex items-center justify-center">
                            3
                          </span>
                          <span className="font-display font-bold text-gray-900 text-xs uppercase tracking-wide">
                            Linked Brand Schema Markup
                          </span>
                        </div>
                        <p className="text-xs text-gray-650 leading-relaxed">
                          Embed comprehensive LocalBusiness JSON-LD structure in both domains. Ensure the blog's publisher metadata references the root site as its core identity.
                        </p>
                        <div className="text-[10px] text-blue-800 font-sans italic bg-blue-50 p-2 rounded border border-blue-100 mt-2">
                          Using the "parentOrganization" or "mainEntityOfPage" structural variables instantly aligns subdomain pages to root entity authority graphs.
                        </div>
                      </div>

                      {/* Step 4: CNAME Alignment */}
                      <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm space-y-2 hover:border-purple-200 transition-all">
                        <div className="flex items-center space-x-2">
                          <span className="bg-purple-600 text-white font-mono text-[9px] font-bold h-5 w-5 rounded-full flex items-center justify-center">
                            4
                          </span>
                          <span className="font-display font-bold text-gray-900 text-xs uppercase tracking-wide">
                            Fast DNS CNAME Alignment
                          </span>
                        </div>
                        <p className="text-xs text-gray-650 leading-relaxed">
                          Point <strong>blog</strong> subdomain traffic directly to this container build without losing secure routing. Setup a clean CNAME record in your registrar.
                        </p>
                        <div className="text-[10px] text-purple-850 font-mono bg-purple-50 p-2 rounded border border-purple-100 mt-2 flex justify-between items-center">
                          <span>Name: <strong>blog</strong> • Target: <strong>Host URL</strong></span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SCHEMA & CANONICAL BUILDER ENGINE (INTERACTIVE) */}
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-gray-400">
                      COPY TECHNICAL SEO CODE BLOCK SNIPPETS
                    </h4>
                    
                    <div className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden shadow-inner">
                      <div className="bg-gray-100 p-3 border-b flex justify-between items-center">
                        <span className="text-[10px] font-sans font-extrabold text-gray-700 uppercase">
                          Schema.org JSON-LD Root Alignment Tag
                        </span>
                        <button
                          onClick={() => {
                            const snippet = `<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "BlogPosting",\n  "headline": "${currentArticle.metadata.title}",\n  "description": "${currentArticle.metadata.metaDescription}",\n  "publisher": {\n    "@type": "FoodEstablishment",\n    "name": "Utpala Cafe",\n    "url": "https://utpala.com.np",\n    "logo": "https://utpala.com.np/logo.png",\n    "sameAs": [\n      "https://www.tripadvisor.com/Restaurant_Review-g293890-d12217686-Reviews-Utpala_Cafe-Kathmandu_Kathmandu_Valley_Bagmati_Zone_Central_Region.html"\n    ]\n  }\n}\n</script>`;
                            navigator.clipboard.writeText(snippet);
                            showToast("JSON-LD connection tag copied to clipboard!");
                          }}
                          className="bg-white hover:bg-gray-250 text-gray-650 px-2 py-1 rounded text-[9.5px] font-mono border font-bold uppercase cursor-pointer"
                        >
                          Copy LD Code
                        </button>
                      </div>
                      <pre className="p-4 text-[9.5px] font-mono text-gray-700 overflow-x-auto leading-relaxed bg-[#FFFFFF]">
{`<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "${currentArticle.metadata.title}",
  "description": "${currentArticle.metadata.metaDescription}",
  "publisher": {
    "@type": "FoodEstablishment",
    "name": "Utpala Cafe",
    "url": "https://utpala.com.np",
    "logo": "https://utpala.com.np/logo.png"
  }
}
</script>`}
                      </pre>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden shadow-inner mt-4">
                      <div className="bg-gray-100 p-3 border-b flex justify-between items-center">
                        <span className="text-[10px] font-sans font-extrabold text-gray-700 uppercase">
                          Domain Link juice passing template (Markdown)
                        </span>
                        <button
                          onClick={() => {
                            const mdSnippet = `We welcome you to enjoy [pure organic vegetarian meals in Kathmandu](https://utpala.com.np) inside the quiet temple gardens.`;
                            navigator.clipboard.writeText(mdSnippet);
                            showToast("Markdown domain contextual link copied!");
                          }}
                          className="bg-white hover:bg-gray-250 text-gray-650 px-2 py-1 rounded text-[9.5px] font-mono border font-bold uppercase cursor-pointer"
                        >
                          Copy Link MD
                        </button>
                      </div>
                      <div className="p-4 bg-white text-xs text-gray-650 space-y-2">
                        <p className="font-sans">
                          Paste this exact phrase block in your active editor draft to anchor a high-quality link to your root page:
                        </p>
                        <div className="bg-gray-50 border p-2.5 rounded font-mono text-[10.5px] text-[#F27D26] select-all">
                          We welcome you to enjoy [pure organic vegetarian meals in Kathmandu](https://utpala.com.np) inside the quiet temple gardens.
                        </div>
                      </div>
                    </div>

                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* Side Secondary Panel Widget Column */}
          <aside className="col-span-1 lg:col-span-4 bg-[#FAF9F6] border-t lg:border-t-0 lg:border-l border-gray-200 p-6 space-y-6 lg:overflow-y-auto h-auto lg:h-full">
            
            {/* Widget 1: Keywords Manager */}
            <div>
              <div className="flex items-center space-x-1.5 border-b pb-2 mb-3">
                <Award className="h-4 w-4 text-[#F27D26]" />
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#0D0D0D] font-mono">Semantic Keyword Dashboard</h3>
              </div>
              <div className="space-y-2.5">
                <div className="p-2.5 bg-white border border-gray-200 rounded-lg shadow-sm">
                  <span className="block text-[8px] uppercase text-gray-400 font-mono tracking-wider font-bold mb-1">MILESTONE 1 (BOUDHA FOCUS)</span>
                  <div className="flex flex-wrap gap-1">
                    {['Cafe in Boudha', 'Best Cafe in Boudha', 'Cafe in Kathmandu', 'Best Cafe in Kathmandu', 'Cafe Near Me'].map((kw) => (
                      <span 
                        key={kw} 
                        onClick={() => setSearchTerm(kw)} 
                        className={`text-[9px] py-1 px-1.5 rounded font-mono cursor-pointer transition-colors border ${
                          currentArticle.metadata.primaryKeyword === kw 
                            ? 'bg-orange-500/10 text-[#F27D26] border-[#F27D26] font-bold' 
                            : 'bg-[#FAF9F6] text-gray-500 hover:bg-gray-100 border-gray-200'
                        }`}
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-2.5 bg-white border border-gray-200 rounded-lg shadow-sm">
                  <span className="block text-[8px] uppercase text-gray-400 font-mono tracking-wider font-bold mb-1">MILESTONE 2 (INTENT FOCUS)</span>
                  <div className="flex flex-wrap gap-1">
                    {['Best Cafe Near Me', 'Restaurant Near Me', 'Best Restaurant Near Me', 'Best Restaurant in Kathmandu'].map((kw) => (
                      <span 
                        key={kw} 
                        onClick={() => setSearchTerm(kw)} 
                        className={`text-[9px] py-1 px-1.5 rounded font-mono cursor-pointer transition-colors border ${
                          currentArticle.metadata.primaryKeyword === kw 
                            ? 'bg-orange-500/10 text-[#F27D26] border-[#F27D26] font-bold' 
                            : 'bg-[#FAF9F6] text-gray-500 hover:bg-gray-100 border-gray-200'
                        }`}
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-2.5 bg-white border border-gray-200 rounded-lg shadow-sm">
                  <span className="block text-[8px] uppercase text-gray-400 font-mono tracking-wider font-bold mb-1">MILESTONE 3 (CORE SEMANTICS)</span>
                  <div className="flex flex-wrap gap-1">
                    {['vegetarian', 'vegan', 'cafe', 'Boudha', 'Kathmandu', 'organic food', 'monastery', 'restaurant', 'buffet', 'local ingredients'].map((kw) => (
                      <span 
                        key={kw} 
                        onClick={() => setSearchTerm(kw)} 
                        className={`text-[9.5px] py-1 px-1.5 rounded font-mono cursor-pointer transition-all border ${
                          checkKeywordInText(activeContentText, kw)
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300 font-bold' 
                            : 'bg-[#FAF9F6] text-gray-500 hover:bg-gray-100 border-gray-200'
                        }`}
                        title={checkKeywordInText(activeContentText, kw) ? `"${kw}" matches active draft body content!` : `Click to search for "${kw}"`}
                      >
                        {kw} {checkKeywordInText(activeContentText, kw) ? '✓' : ''}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Widget 1.5: Dynamic Heatmap Visual Grid */}
            <div>
              {(() => {
                const paragraphsList = activeContentText.split('\n\n').filter(p => p.trim() !== '');
                const paragraphStats = paragraphsList.map((text, idx) => {
                  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
                  const pk = currentArticle.metadata.primaryKeyword;
                  const sks = currentArticle.metadata.secondaryKeywords;
                  const keywords = [pk, ...sks];
                  let matchCount = 0;
                  const kwDetails: string[] = [];
                  
                  keywords.forEach(kw => {
                    const escaped = kw.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
                    const regex = new RegExp(`\\b${escaped}\\b`, 'gi');
                    const matches = text.match(regex);
                    if (matches) {
                      matchCount += matches.length;
                      kwDetails.push(`${kw} (x${matches.length})`);
                    }
                  });
                  
                  const density = wordCount > 0 ? (matchCount / wordCount) * 105 : 0;
                  
                  let heatColor = 'bg-gray-50 border-gray-150 text-gray-400';
                  let label = 'Unoptimized (Cold)';
                  
                  if (matchCount > 0) {
                    if (density < 1.0) {
                      heatColor = 'bg-emerald-50 text-emerald-800 border-emerald-200';
                      label = 'Healthy Density (Optimal)';
                    } else if (density <= 2.8) {
                      heatColor = 'bg-green-600 text-white border-green-700 font-bold';
                      label = 'SEO Sweet Spot!';
                    } else if (density <= 4.5) {
                      heatColor = 'bg-amber-500 text-white border-amber-600 font-bold';
                      label = 'Warm (High Density)';
                    } else {
                      heatColor = 'bg-red-500 text-white border-red-650 font-bold animate-pulse';
                      label = 'Hot (Keyword Stuffing)';
                    }
                  }
                  
                  return {
                    index: idx + 1,
                    text,
                    wordCount,
                    matchCount,
                    density: density.toFixed(1),
                    heatColor,
                    label,
                    kwDetails
                  };
                });

                return (
                  <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-3">
                    <div className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-center space-x-1.5">
                        <Flame className={`h-4 w-4 ${showHeatmap ? 'text-amber-500 animate-pulse' : 'text-gray-400'}`} />
                        <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#0D0D0D] font-mono">Live Density Heatmap</h3>
                      </div>
                      <button
                        onClick={() => {
                          setShowHeatmap(!showHeatmap);
                          showToast(showHeatmap ? "Heatmap disabled" : "Heatmap active! Scroll highlight overlays ready.");
                        }}
                        className={`text-[9.5px] font-mono px-2 py-0.5 rounded border uppercase font-bold transition-all cursor-pointer ${
                          showHeatmap 
                            ? 'bg-amber-500/10 text-amber-700 border-amber-300' 
                            : 'bg-gray-50 text-gray-400 border-gray-200 hover:text-gray-650'
                        }`}
                      >
                        {showHeatmap ? "ON" : "OFF"}
                      </button>
                    </div>
                    
                    <div className="text-[10px] text-gray-500 font-sans leading-relaxed">
                      Click any paragraph below to auto-scroll directly to that block in the workspace editor.
                    </div>
                    
                    <div className="grid grid-cols-5 gap-1.5 pt-1">
                      {paragraphStats.map((p) => (
                        <button
                          key={p.index}
                          onClick={() => {
                            const target = document.getElementById(`p-line-${p.index}`);
                            if (target) {
                              target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                              showToast(`Scrolled to Paragraph #${p.index} (${p.density}% Density)`);
                            } else {
                              showToast(`Click registered! Paragraph #${p.index} keyword density is ${p.density}%`);
                            }
                          }}
                          className={`aspect-square rounded-md border text-[9.5px] font-mono font-bold flex flex-col items-center justify-center transition-all cursor-pointer relative group p-1 ${p.heatColor} shadow-sm hover:scale-[1.08] hover:shadow-md`}
                          title={`Paragraph #${p.index}: ${p.wordCount} words, ${p.matchCount} matches (${p.density}% keywords. Status: ${p.label})`}
                        >
                          <span>P{p.index < 10 ? `0${p.index}` : p.index}</span>
                          <span className="text-[7px] mt-0.5 opacity-80">{p.density}%</span>
                          
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-[#0a0a0a] text-[#f7f7f7] p-2 rounded-lg text-[9px] font-mono hidden group-hover:block z-50 pointer-events-none shadow-xl border border-white/10 space-y-1">
                            <div className="text-[#F27D26] font-bold">PARAGRAPH #{p.index} INFO</div>
                            <div className="text-gray-400">Total Words: <span className="text-white font-medium">{p.wordCount} words</span></div>
                            <div className="text-gray-400">Keyword Occurrences: <span className="text-white font-medium">{p.matchCount}</span></div>
                            <div className="text-gray-400">Keyword Density: <span className={p.matchCount > 0 ? "text-green-400 font-bold" : "text-white"}>{p.density}%</span></div>
                            {p.kwDetails.length > 0 && (
                              <div className="border-t border-white/5 pt-1 mt-1 text-gray-350">
                                Keywords: {p.kwDetails.join(', ')}
                              </div>
                            )}
                            <div className="text-[6.5px] text-gray-500 italic mt-1 text-center">Click block to scroll to paragraph</div>
                          </div>
                        </button>
                      ))}
                    </div>
                    
                    <div className="flex flex-wrap gap-x-1.5 gap-y-1 pt-2 border-t border-gray-150 text-[7px] font-mono text-gray-400 uppercase leading-none">
                      <div className="flex items-center space-x-1">
                        <span className="h-1.5 w-1.5 rounded bg-gray-100 border border-gray-200" />
                        <span>Cold</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="h-1.5 w-1.5 rounded bg-emerald-50 border border-emerald-250" />
                        <span>Healthy</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="h-1.5 w-1.5 rounded bg-green-600" />
                        <span>Optimal</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="h-1.5 w-1.5 rounded bg-red-500 animate-pulse" />
                        <span>Over-stuffed</span>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Widget 2: USPs checklist */}
            <div>
              <div className="flex items-center space-x-1.5 border-b pb-2 mb-3">
                <Leaf className="h-4 w-4 text-[#F27D26]" />
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#1A1A1B] font-mono font-semibold">UTPALA BRAND GUIDELINES</h3>
              </div>
              <div className="bg-white border rounded-lg p-3.5 space-y-3 shadow-sm text-xs text-gray-650 font-sans leading-relaxed">
                <div className="flex items-start space-x-2">
                  <div className="h-1.5 w-1.5 bg-[#F27D26] rounded-full mt-1.5 shrink-0" />
                  <span><strong>Monastery Run:</strong> Feature Ka-Nying Shedrub Ling connection proudly so clicks know profits back social causes.</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="h-1.5 w-1.5 bg-[#F27D26] rounded-full mt-1.5 shrink-0" />
                  <span><strong>Pure Vegetarian:</strong> Highlight chemical-free, organic ingredient streams and vegan-friendly alternatives.</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="h-1.5 w-1.5 bg-[#F27D26] rounded-full mt-1.5 shrink-0" />
                  <span><strong>Strict Sobriety:</strong> Emphasize our smoke-free and absolute alcohol-free environment supporting inner serenity.</span>
                </div>
              </div>
            </div>

            {/* Widget 3: Quick CTA PR pitch */}
            <div className="bg-[#111111] text-gray-100 p-4 rounded-xl border border-white/10 relative overflow-hidden shadow-md">
              <div className="absolute top-0 right-0 h-16 w-16 bg-[#F27D26]/10 rounded-bl-full pointer-events-none" />
              <h4 className="text-[10px] font-mono font-bold uppercase text-[#F27D26] mb-1 tracking-wider">Campaign Citation Target</h4>
              <p className="text-xs font-semibold text-white tracking-tight mt-0.5">
                {currentArticle.outreachTargets[0]?.name || "Local Blog outreach"}
              </p>
              <p className="text-[10px] italic leading-relaxed text-gray-400 mt-2 font-sans">
                "{currentArticle.outreachTargets[0]?.reason || "Backlink targets ready for publishing citation pitches."}"
              </p>
              <button 
                onClick={() => {
                  setActiveTab('links');
                  showToast("Opened Outreach panel!");
                }}
                className="w-full text-center py-2 bg-white/10 hover:bg-white/15 border border-white/5 rounded text-[10px] font-bold tracking-widest uppercase transition-all mt-3 cursor-pointer text-white font-mono"
              >
                PROCEED TO PITCH →
              </button>
            </div>

          </aside>

        </div>

      </section>

    </div>
  );
}

// Inline fallback for AlertCircle
function AlertCircle(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" x2="12" y1="8" y2="12" />
      <line x1="12" x2="12.01" y1="16" y2="16" />
    </svg>
  );
}
