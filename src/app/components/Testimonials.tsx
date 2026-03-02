import { Star, Quote } from "lucide-react";
import { motion } from "motion/react";

interface Testimonial {
  id: number;
  name: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

const defaultTestimonials: Testimonial[] = [
  {
    id: 1,
    name: "Marcus Johnson",
    rating: 5,
    comment:
      "Zynx Capital completely changed my trading career. Getting funded at no cost was a game-changer. The support team is incredibly responsive and the profit splits are fair.",
    date: "Feb 28, 2026",
    verified: true,
  },
  {
    id: 2,
    name: "Sarah Chen",
    rating: 5,
    comment:
      "I've been with several prop firms, but Zynx Capital stands out. The vetting process ensures you're working with serious traders, and the platform is incredibly smooth.",
    date: "Feb 25, 2026",
    verified: true,
  },
  {
    id: 3,
    name: "David Martinez",
    rating: 5,
    comment:
      "The application process was straightforward, and I was approved within 48 hours. Already made my first withdrawal - processed in just 2 days!",
    date: "Feb 20, 2026",
    verified: true,
  },
  {
    id: 4,
    name: "Emma Williams",
    rating: 4,
    comment:
      "Great platform with excellent support. The MT5 integration is seamless. Only wish the profit split was slightly higher, but still very competitive.",
    date: "Feb 18, 2026",
    verified: true,
  },
];

interface TestimonialsProps {
  userReviews?: Testimonial[];
}

export function Testimonials({ userReviews = [] }: TestimonialsProps) {
  const allTestimonials = [...defaultTestimonials, ...userReviews];

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-8 border border-slate-800">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-3">
          What Our Traders Say
        </h2>
        <p className="text-slate-400">
          Join thousands of successful traders funded by Zynx Capital
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {allTestimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-slate-950/50 rounded-2xl p-6 border border-slate-800 hover:border-pink-500/30 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center text-white font-bold">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-white font-semibold">
                    {testimonial.name}
                  </h4>
                  <p className="text-slate-500 text-xs">{testimonial.date}</p>
                </div>
              </div>
              <Quote className="w-6 h-6 text-pink-500/30" />
            </div>

            <div className="flex gap-1 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= testimonial.rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-slate-600"
                  }`}
                />
              ))}
            </div>

            <p className="text-slate-300 text-sm leading-relaxed mb-3">
              {testimonial.comment}
            </p>

            {testimonial.verified && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-full">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                <span className="text-green-400 text-xs font-medium">
                  Verified Trader
                </span>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
