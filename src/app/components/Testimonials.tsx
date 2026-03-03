import { Star, Quote } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

interface Testimonial {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

const defaultTestimonials: Testimonial[] = [
  {
    id: "default-1",
    name: "Marcus Johnson",
    rating: 5,
    comment:
      "Zynx Capital completely changed my trading career. Getting funded at no cost was a game-changer. The support team is incredibly responsive and the profit splits are fair.",
    date: "Feb 28, 2026",
    verified: true,
  },
  {
    id: "default-2",
    name: "Sarah Chen",
    rating: 5,
    comment:
      "I've been with several prop firms, but Zynx Capital stands out. The vetting process ensures you're working with serious traders, and the platform is incredibly smooth.",
    date: "Feb 25, 2026",
    verified: true,
  },
  {
    id: "default-3",
    name: "David Martinez",
    rating: 5,
    comment:
      "The application process was straightforward, and I was approved within 48 hours. Already made my first withdrawal - processed in just 2 days!",
    date: "Feb 20, 2026",
    verified: true,
  },
  {
    id: "default-4",
    name: "Emma Williams",
    rating: 4,
    comment:
      "Great platform with excellent support. The MT5 integration is seamless. Only wish the profit split was slightly higher, but still very competitive.",
    date: "Feb 18, 2026",
    verified: true,
  },
];

export function Testimonials({ refreshKey }: { refreshKey?: number }) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(defaultTestimonials);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, [refreshKey]);

  const loadReviews = async () => {
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading reviews:", error);
        setLoading(false);
        return;
      }

      if (data && data.length > 0) {
        const formattedReviews: Testimonial[] = data.map((review) => ({
          id: review.id,
          name: review.name,
          rating: review.rating,
          comment: review.comment,
          date: new Date(review.created_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          verified: review.verified,
        }));

        // Combine default testimonials with user reviews
        setTestimonials([...defaultTestimonials, ...formattedReviews]);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000); // Slide every 4 seconds

    return () => clearInterval(timer);
  }, [testimonials.length]);

  const getVisibleTestimonials = () => {
    const visible = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % testimonials.length;
      visible.push({ ...testimonials[index], displayIndex: i });
    }
    return visible;
  };

  if (loading) {
    return (
      <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-8 border border-slate-800">
        <div className="text-center">
          <p className="text-slate-400">Loading reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-8 border border-slate-800 overflow-hidden">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-3">
          What Our Traders Say
        </h2>
        <p className="text-slate-400">
          Join thousands of successful traders funded by Zynx Capital
        </p>
      </div>

      <div className="relative h-[280px]">
        <div className="flex gap-4 justify-center items-center h-full">
          <AnimatePresence mode="popLayout">
            {getVisibleTestimonials().map((testimonial, idx) => (
              <motion.div
                key={`${testimonial.id}-${currentIndex}-${idx}`}
                initial={{ opacity: 0, x: 300, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -300, scale: 0.8 }}
                transition={{
                  duration: 0.5,
                  ease: "easeInOut",
                }}
                className="bg-slate-950/50 rounded-2xl p-5 border border-slate-800 hover:border-pink-500/30 transition-all w-[280px] flex-shrink-0"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-sm">
                        {testimonial.name}
                      </h4>
                      <p className="text-slate-500 text-xs">{testimonial.date}</p>
                    </div>
                  </div>
                  <Quote className="w-5 h-5 text-pink-500/30 flex-shrink-0" />
                </div>

                <div className="flex gap-0.5 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-3.5 h-3.5 ${
                        star <= testimonial.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-slate-600"
                      }`}
                    />
                  ))}
                </div>

                <p className="text-slate-300 text-xs leading-relaxed mb-3 line-clamp-4">
                  {testimonial.comment}
                </p>

                {testimonial.verified && (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-500/10 border border-green-500/30 rounded-full">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                    <span className="text-green-400 text-xs font-medium">
                      Verified Trader
                    </span>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-6">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === currentIndex
                  ? "bg-pink-500 w-6"
                  : "bg-slate-700 hover:bg-slate-600"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}