import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  BookOpen,
  PlayCircle,
  FileText,
  TrendingUp,
  Target,
  BarChart3,
  Clock,
  Award,
  Lock,
} from "lucide-react";
import { Footer } from "../components/Footer";
import { motion } from "motion/react";

interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  lessons: number;
  locked: boolean;
  progress: number;
  category: string;
  thumbnail: string;
}

interface Article {
  id: string;
  title: string;
  excerpt: string;
  readTime: string;
  category: string;
}

export function Education() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"courses" | "articles" | "videos">("courses");

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const courses: Course[] = [
    {
      id: "1",
      title: "Forex Trading Fundamentals",
      description: "Learn the basics of forex trading, market structure, and how to analyze currency pairs",
      duration: "4 hours",
      level: "Beginner",
      lessons: 12,
      locked: false,
      progress: 45,
      category: "Fundamentals",
      thumbnail: "📊",
    },
    {
      id: "2",
      title: "Technical Analysis Mastery",
      description: "Master chart patterns, indicators, and price action strategies for consistent profits",
      duration: "6 hours",
      level: "Intermediate",
      lessons: 18,
      locked: false,
      progress: 20,
      category: "Technical Analysis",
      thumbnail: "📈",
    },
    {
      id: "3",
      title: "Risk Management Strategies",
      description: "Protect your capital with proven risk management techniques and position sizing",
      duration: "3 hours",
      level: "Beginner",
      lessons: 10,
      locked: false,
      progress: 0,
      category: "Risk Management",
      thumbnail: "🛡️",
    },
    {
      id: "4",
      title: "Advanced Trading Psychology",
      description: "Develop the mindset of professional traders and overcome emotional trading",
      duration: "5 hours",
      level: "Advanced",
      lessons: 15,
      locked: true,
      progress: 0,
      category: "Psychology",
      thumbnail: "🧠",
    },
    {
      id: "5",
      title: "Algorithmic Trading Basics",
      description: "Introduction to automated trading systems and creating your first trading bot",
      duration: "8 hours",
      level: "Advanced",
      lessons: 20,
      locked: true,
      progress: 0,
      category: "Algorithmic",
      thumbnail: "🤖",
    },
  ];

  const articles: Article[] = [
    {
      id: "1",
      title: "10 Common Trading Mistakes and How to Avoid Them",
      excerpt: "Learn from the most common errors traders make and how to prevent them from affecting your trading",
      readTime: "5 min read",
      category: "Trading Tips",
    },
    {
      id: "2",
      title: "The Complete Guide to Support and Resistance",
      excerpt: "Master the art of identifying key levels that can make or break your trades",
      readTime: "8 min read",
      category: "Technical Analysis",
    },
    {
      id: "3",
      title: "How to Create a Profitable Trading Plan",
      excerpt: "Step-by-step guide to building a trading plan that actually works for your strategy",
      readTime: "10 min read",
      category: "Strategy",
    },
    {
      id: "4",
      title: "Understanding Market Volatility and How to Trade It",
      excerpt: "Learn how to identify volatile markets and adjust your trading strategy accordingly",
      readTime: "6 min read",
      category: "Market Analysis",
    },
  ];

  const videos = [
    {
      id: "1",
      title: "Daily Market Analysis - EUR/USD Breakdown",
      duration: "12:45",
      views: "1.2K",
      category: "Market Analysis",
    },
    {
      id: "2",
      title: "Live Trading Session - Scalping Strategy",
      duration: "45:30",
      views: "3.5K",
      category: "Live Trading",
    },
    {
      id: "3",
      title: "How I Made $5,000 in One Week",
      duration: "18:20",
      views: "8.2K",
      category: "Case Study",
    },
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-green-500/20 text-green-400";
      case "Intermediate":
        return "bg-yellow-500/20 text-yellow-400";
      case "Advanced":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-slate-500/20 text-slate-400";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-slate-900/60 backdrop-blur-xl border-b border-slate-800"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/dashboard")}
                className="p-2.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all active:scale-95"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-gradient-to-br from-pink-500 via-pink-600 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-500/20">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Education Center</h1>
                  <p className="text-xs text-slate-400">Learn from the best traders</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Hero Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-pink-500 via-pink-600 to-rose-600 rounded-3xl p-8 mb-8 shadow-2xl shadow-pink-500/20"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-white mb-3">
                Master Trading with Expert Guidance 📚
              </h2>
              <p className="text-pink-100 text-lg mb-4">
                Access professional trading courses, market analysis, and educational content to
                accelerate your trading journey
              </p>
              <div className="flex gap-3">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                  <p className="text-xs text-pink-100">Available Courses</p>
                  <p className="text-xl font-bold text-white">{courses.length}</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                  <p className="text-xs text-pink-100">Articles</p>
                  <p className="text-xl font-bold text-white">{articles.length}+</p>
                </div>
              </div>
            </div>
            <div className="w-32 h-32 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center">
              <Award className="w-16 h-16 text-white" />
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-800 mb-8 p-2"
        >
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("courses")}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                activeTab === "courses"
                  ? "bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg shadow-pink-500/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <PlayCircle className="w-4 h-4" />
              <span>Courses</span>
            </button>
            <button
              onClick={() => setActiveTab("articles")}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                activeTab === "articles"
                  ? "bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg shadow-pink-500/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Articles</span>
            </button>
            <button
              onClick={() => setActiveTab("videos")}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                activeTab === "videos"
                  ? "bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg shadow-pink-500/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <PlayCircle className="w-4 h-4" />
              <span>Videos</span>
            </button>
          </div>
        </motion.div>

        {/* Courses Tab */}
        {activeTab === "courses" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                className="bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-800 overflow-hidden group hover:border-pink-500/30 transition-all"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-pink-500/30">
                      {course.thumbnail}
                    </div>
                    <div className="flex gap-2">
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(course.level)}`}>
                        {course.level}
                      </div>
                      {course.locked && (
                        <div className="px-3 py-1 bg-slate-700 rounded-full text-xs font-medium text-slate-300 flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          Locked
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-white mb-2">{course.title}</h3>
                  <p className="text-slate-400 text-sm mb-4">{course.description}</p>

                  {/* Meta */}
                  <div className="flex items-center gap-4 text-slate-400 text-sm mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {course.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      {course.lessons} lessons
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {!course.locked && course.progress > 0 && (
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-slate-400 mb-2">
                        <span>Progress</span>
                        <span>{course.progress}%</span>
                      </div>
                      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-pink-500 to-rose-600 rounded-full transition-all"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <motion.button
                    whileHover={{ scale: course.locked ? 1 : 1.02 }}
                    whileTap={{ scale: course.locked ? 1 : 0.98 }}
                    disabled={course.locked}
                    className={`w-full py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                      course.locked
                        ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                        : course.progress > 0
                        ? "bg-slate-800 hover:bg-slate-700 text-white"
                        : "bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg shadow-pink-500/30"
                    }`}
                  >
                    {course.locked ? (
                      <>
                        <Lock className="w-4 h-4" />
                        Get Funded to Unlock
                      </>
                    ) : course.progress > 0 ? (
                      <>
                        <PlayCircle className="w-4 h-4" />
                        Continue Learning
                      </>
                    ) : (
                      <>
                        <PlayCircle className="w-4 h-4" />
                        Start Course
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Articles Tab */}
        {activeTab === "articles" && (
          <div className="space-y-4">
            {articles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                className="bg-slate-900/60 backdrop-blur-xl rounded-2xl p-6 border border-slate-800 hover:border-pink-500/30 transition-all group cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-pink-500/30">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-white group-hover:text-pink-400 transition-colors">
                        {article.title}
                      </h3>
                      <div className="flex items-center gap-2 text-slate-400 text-sm">
                        <Clock className="w-4 h-4" />
                        {article.readTime}
                      </div>
                    </div>
                    <p className="text-slate-400 text-sm mb-3">{article.excerpt}</p>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-pink-500/20 text-pink-300 rounded-full text-xs">
                        {article.category}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Videos Tab */}
        {activeTab === "videos" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                className="bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-800 overflow-hidden group hover:border-pink-500/30 transition-all cursor-pointer"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                  <PlayCircle className="w-16 h-16 text-white group-hover:text-pink-400 transition-colors" />
                  <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-sm px-2 py-1 rounded text-white text-xs font-medium">
                    {video.duration}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-white font-semibold mb-2 group-hover:text-pink-400 transition-colors">
                    {video.title}
                  </h3>
                  <div className="flex items-center justify-between text-slate-400 text-sm">
                    <span className="px-2 py-1 bg-pink-500/20 text-pink-300 rounded text-xs">
                      {video.category}
                    </span>
                    <span>{video.views} views</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
