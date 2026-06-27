"use client";
import { motion } from "motion/react";
import { Lightbulb, Users, Heart, TrendingUp } from "lucide-react";

const benefits = [
  {
    icon: <Lightbulb className="w-10 h-10" />,
    title: "Preserve Your Wisdom",
    desc: "Never forget the hard-earned lessons that shaped who you are today.",
  },
  {
    icon: <Users className="w-10 h-10" />,
    title: "Learn from Community",
    desc: "Gain insights from thousands of real human experiences.",
  },
  {
    icon: <Heart className="w-10 h-10" />,
    title: "Track Your Growth",
    desc: "Mark favorites and watch yourself evolve over time.",
  },
  {
    icon: <TrendingUp className="w-10 h-10" />,
    title: "Share Your Legacy",
    desc: "Your story might become the exact lesson someone needs.",
  },
];

export default function WhyLearningMatters() {
  return (
    <section className="py-20 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Why Learning From Life Matters
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            In a fast-moving world, wisdom is our most valuable currency.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-slate-50 dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-purple-200 hover:shadow-xl transition-all group"
            >
              <div className="text-primary mb-6">{benefit.icon}</div>
              <h3 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
                {benefit.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {benefit.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
