import { useState, useEffect } from "react";
import { ArrowLeft, Award, Trophy, Target, TrendingUp, Zap, Star, Share2 } from "lucide-react";
import { useNavigate } from "react-router";
import { supabase } from "../lib/supabase";

interface Achievement {
  id: string;
  badge_type: string;
  title: string;
  description: string;
  icon: string;
  earned_at?: string;
  shared: boolean;
  progress?: number;
  total?: number;
}

const allBadges: Achievement[] = [
  {
    id: "1",
    badge_type: "first_profit",
    title: "First Profit Day",
    description: "Completed your first profitable trading day",
    icon: "trophy",
    earned_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    shared: false,
  },
  {
    id: "2",
    badge_type: "win_streak_10",
    title: "10 Win Streak",
    description: "Achieved 10 consecutive winning trades",
    icon: "zap",
    earned_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    shared: true,
  },
  {
    id: "3",
    badge_type: "funded_trader",
    title: "Funded Trader",
    description: "Successfully passed the challenge and got funded",
    icon: "award",
    earned_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    shared: false,
  },
  {
    id: "4",
    badge_type: "profit_target_50k",
    title: "$50K Profit Target",
    description: "Reached $50,000 in total profits",
    icon: "target",
    earned_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    shared: false,
  },
  {
    id: "5",
    badge_type: "consistent_trader",
    title: "Consistent Trader",
    description: "30 consecutive days of trading activity",
    icon: "trending",
    progress: 22,
    total: 30,
    shared: false,
  },
  {
    id: "6",
    badge_type: "risk_master",
    title: "Risk Master",
    description: "Maintained max 1% risk per trade for 50 trades",
    icon: "star",
    progress: 35,
    total: 50,
    shared: false,
  },
  {
    id: "7",
    badge_type: "early_bird",
    title: "Early Bird",
    description: "Completed 100 trades during London session",
    icon: "trophy",
    progress: 67,
    total: 100,
    shared: false,
  },
  {
    id: "8",
    badge_type: "drawdown_warrior",
    title: "Drawdown Warrior",
    description: "Never exceeded 5% drawdown in a funded account",
    icon: "award",
    shared: false,
  },
];

export function Achievements() {
  const navigate = useNavigate();
  const [achievements, setAchievements] = useState<Achievement[]>(allBadges);
  const [selectedBadge, setSelectedBadge] = useState<Achievement | null>(null);

  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("achievements")
        .select("*")
        .eq("user_id", user.id);

      if (error) throw error;

      // Merge with default badges
      if (data && data.length > 0) {
        // Update earned status from database
        const updatedBadges = allBadges.map((badge) => {
          const earned = data.find((d: any) => d.badge_type === badge.badge_type);
          if (earned) {
            return { ...badge, earned_at: earned.earned_at, shared: earned.shared };
          }
          return badge;
        });
        setAchievements(updatedBadges);
      }
    } catch (error) {
      console.error("Error loading achievements:", error);
      // Use default mock data
      setAchievements(allBadges);
    }
  };

  const handleShare = async (badge: Achievement) => {
    if (!badge.earned_at) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Update shared status
      const { error } = await supabase
        .from("achievements")
        .update({ shared: true })
        .eq("user_id", user.id)
        .eq("badge_type", badge.badge_type);

      if (error) throw error;

      // Share on social media (simplified - just copy to clipboard)
      const shareText = `🏆 I just earned the "${badge.title}" badge on ZYNX Capital! ${badge.description} #ZYNXCapital #PropTrading`;
      
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareText);
        alert("Achievement text copied to clipboard! Share it on your social media.");
      } else {
        alert(shareText);
      }

      loadAchievements();
    } catch (error: any) {
      console.error("Error sharing achievement:", error);
      alert(error.message || "Failed to share achievement");
    }
  };

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case "trophy":
        return Trophy;
      case "zap":
        return Zap;
      case "award":
        return Award;
      case "target":
        return Target;
      case "trending":
        return TrendingUp;
      case "star":
        return Star;
      default:
        return Award;
    }
  };

  const earnedBadges = achievements.filter((a) => a.earned_at);
  const inProgressBadges = achievements.filter((a) => !a.earned_at && a.progress);
  const lockedBadges = achievements.filter((a) => !a.earned_at && !a.progress);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="w-10 h-10 bg-slate-800/50 hover:bg-slate-700/50 rounded-xl flex items-center justify-center transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">Achievements</h1>
            <p className="text-slate-400">Unlock badges and celebrate your trading milestones</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-pink-500/20 via-pink-600/20 to-rose-600/20 backdrop-blur-xl rounded-3xl p-6 border border-pink-500/30">
            <div className="flex items-center gap-3 mb-2">
              <Trophy className="w-6 h-6 text-pink-400" />
              <p className="text-slate-300 text-sm">Badges Earned</p>
            </div>
            <p className="text-4xl font-bold text-white">{earnedBadges.length}</p>
            <p className="text-xs text-pink-400 mt-2">Out of {achievements.length} total</p>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-6 border border-slate-800">
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-6 h-6 text-blue-400" />
              <p className="text-slate-300 text-sm">In Progress</p>
            </div>
            <p className="text-4xl font-bold text-white">{inProgressBadges.length}</p>
            <p className="text-xs text-slate-400 mt-2">Keep pushing forward!</p>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-6 border border-slate-800">
            <div className="flex items-center gap-3 mb-2">
              <Award className="w-6 h-6 text-slate-400" />
              <p className="text-slate-300 text-sm">Locked</p>
            </div>
            <p className="text-4xl font-bold text-white">{lockedBadges.length}</p>
            <p className="text-xs text-slate-400 mt-2">Challenges to unlock</p>
          </div>
        </div>

        {/* Earned Badges */}
        {earnedBadges.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Earned Badges 🎉</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {earnedBadges.map((badge) => {
                const Icon = getIcon(badge.icon);
                return (
                  <div
                    key={badge.id}
                    className="bg-gradient-to-br from-pink-500/20 via-pink-600/20 to-rose-600/20 backdrop-blur-xl rounded-3xl p-6 border border-pink-500/30 hover:scale-105 transition-all cursor-pointer"
                    onClick={() => setSelectedBadge(badge)}
                  >
                    <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-pink-500/30">
                      <Icon className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-white text-center mb-2">{badge.title}</h3>
                    <p className="text-xs text-slate-300 text-center mb-3">{badge.description}</p>
                    {badge.earned_at && (
                      <p className="text-xs text-pink-400 text-center">
                        Earned {new Date(badge.earned_at).toLocaleDateString()}
                      </p>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShare(badge);
                      }}
                      className="w-full mt-3 flex items-center justify-center gap-2 bg-slate-900/50 hover:bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all"
                    >
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* In Progress */}
        {inProgressBadges.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">In Progress 📊</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {inProgressBadges.map((badge) => {
                const Icon = getIcon(badge.icon);
                const progress = badge.progress && badge.total ? (badge.progress / badge.total) * 100 : 0;
                return (
                  <div
                    key={badge.id}
                    className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-6 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer"
                    onClick={() => setSelectedBadge(badge)}
                  >
                    <div className="w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-10 h-10 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white text-center mb-2">{badge.title}</h3>
                    <p className="text-xs text-slate-400 text-center mb-3">{badge.description}</p>
                    
                    {/* Progress Bar */}
                    <div className="mb-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-slate-400">Progress</span>
                        <span className="text-xs font-semibold text-blue-400">
                          {badge.progress}/{badge.total}
                        </span>
                      </div>
                      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Locked Badges */}
        {lockedBadges.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Locked Badges 🔒</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {lockedBadges.map((badge) => {
                const Icon = getIcon(badge.icon);
                return (
                  <div
                    key={badge.id}
                    className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-6 border border-slate-800 opacity-50 hover:opacity-75 transition-all cursor-pointer"
                    onClick={() => setSelectedBadge(badge)}
                  >
                    <div className="w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-10 h-10 text-slate-600" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-400 text-center mb-2">{badge.title}</h3>
                    <p className="text-xs text-slate-500 text-center">{badge.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Badge Detail Modal */}
        {selectedBadge && (
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedBadge(null)}
          >
            <div
              className="bg-slate-900 rounded-3xl p-8 border border-slate-800 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className={`w-32 h-32 ${selectedBadge.earned_at ? 'bg-gradient-to-br from-pink-500 to-rose-600' : 'bg-slate-800'} rounded-3xl flex items-center justify-center mx-auto mb-6 ${selectedBadge.earned_at ? 'shadow-lg shadow-pink-500/30' : ''}`}>
                  {(() => {
                    const Icon = getIcon(selectedBadge.icon);
                    return <Icon className={`w-16 h-16 ${selectedBadge.earned_at ? 'text-white' : 'text-slate-600'}`} />;
                  })()}
                </div>
                <h2 className="text-3xl font-bold text-white mb-3">{selectedBadge.title}</h2>
                <p className="text-slate-300 mb-6">{selectedBadge.description}</p>

                {selectedBadge.earned_at && (
                  <>
                    <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4 mb-4">
                      <p className="text-green-400 font-semibold">✓ Badge Earned!</p>
                      <p className="text-xs text-slate-300 mt-1">
                        {new Date(selectedBadge.earned_at).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleShare(selectedBadge)}
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-rose-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg hover:shadow-pink-500/30 transition-all"
                    >
                      <Share2 className="w-5 h-5" />
                      Share Achievement
                    </button>
                  </>
                )}

                {selectedBadge.progress && selectedBadge.total && (
                  <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-4 mb-4">
                    <p className="text-blue-400 font-semibold mb-2">In Progress</p>
                    <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all"
                        style={{ width: `${(selectedBadge.progress / selectedBadge.total) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-300 mt-2">
                      {selectedBadge.progress} / {selectedBadge.total}
                    </p>
                  </div>
                )}

                {!selectedBadge.earned_at && !selectedBadge.progress && (
                  <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                    <p className="text-slate-400 text-sm">🔒 Complete the challenge to unlock this badge</p>
                  </div>
                )}
              </div>

              <button
                onClick={() => setSelectedBadge(null)}
                className="mt-6 w-full bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-xl font-medium transition-all"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
