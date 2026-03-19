// No "use client" here — this is a Server Component by default
// Server Components render on the server and send HTML to the browser
// They CANNOT use useState, useEffect, or browser APIs
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4">
      
      {/* Hero Section */}
      <div className="text-center max-w-2xl mx-auto">
        
        {/* Logo / Brand */}
        <div className="mb-6">
          <span className="text-6xl">🚀</span>
        </div>

        <h1 className="text-5xl font-bold text-gradient mb-4">
          LifeOS
        </h1>
        
        <p className="text-xl text-slate-600 mb-2">
          Your personal life management system
        </p>
        
        <p className="text-slate-500 mb-10">
          Track tasks, build habits, monitor your mood, and level up your life — all in one place.
        </p>

        {/* CTA Buttons */}
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/auth/register"
            className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-medium 
                       hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
          >
            Get Started Free
          </Link>
          <Link
            href="/auth/login"
            className="px-8 py-3 bg-white text-indigo-600 rounded-xl font-medium 
                       border border-indigo-200 hover:bg-indigo-50 transition-colors"
          >
            Log In
          </Link>
        </div>
      </div>

      {/* Feature Pills */}
      <div className="mt-16 flex gap-3 flex-wrap justify-center">
        {[
          { icon: "✅", label: "Smart Tasks" },
          { icon: "🎯", label: "Habit Streaks" },
          { icon: "🧠", label: "Mood Tracking" },
          { icon: "🎮", label: "Gamification" },
          { icon: "📊", label: "Insights" },
        ].map(({ icon, label }) => (
          <div
            key={label}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-full 
                       border border-slate-100 shadow-sm text-sm text-slate-700"
          >
            <span>{icon}</span>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </main>
  );
}