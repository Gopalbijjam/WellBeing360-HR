import React from 'react';
import { Layers, ShieldCheck, HeartPulse, Sparkles, MessagesSquare, ArrowRight, TrendingUp, Award, DollarSign } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

export default function LandingPage({ onStart }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      
      {/* 1. Brand Header */}
      <nav className="max-w-7xl mx-auto px-6 w-full h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shadow-md shadow-emerald-500/25">
            <Layers className="text-white w-4.5 h-4.5" />
          </div>
          <h1 className="text-lg font-bold text-slate-800 tracking-tight">
            WellBeing<span className="text-emerald-500">360</span>
          </h1>
        </div>
        <button 
          onClick={onStart}
          className="px-5 py-2.5 bg-slate-900 text-white font-semibold rounded-full hover:bg-slate-800 hover:-translate-y-0.5 transition shadow-md cursor-pointer text-sm"
        >
          Sign In
        </button>
      </nav>

      {/* 2. Hero Section */}
      <header className="max-w-7xl mx-auto px-6 w-full py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center flex-1">
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full text-xs font-bold text-emerald-600">
            <Sparkles className="w-3.5 h-3.5" /> Next-Gen Corporate Wellness
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-tight">
            Invest in your <span className="text-emerald-500">Well-Being</span> & Flexible Benefits.
          </h2>
          <p className="text-base sm:text-lg text-slate-500 font-medium max-w-xl">
            A comprehensive, premium platform designed for modern corporate benefit plans, active wellness tracking, mental counseling, peer nominations, and financial analytics.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <button 
              onClick={onStart}
              className="px-8 py-4 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 hover:-translate-y-0.5 transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              Get Started Now <ArrowRight className="w-4 h-4" />
            </button>
            <a 
              href="#features"
              className="px-8 py-4 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 hover:border-slate-300 hover:-translate-y-0.5 transition flex items-center justify-center cursor-pointer text-sm"
            >
              Learn More
            </a>
          </div>
        </div>

        {/* Hero Visual Mockup */}
        <div className="lg:col-span-5 relative w-full flex justify-center">
          <div className="relative w-full max-w-sm bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 overflow-hidden animate-fade-in hover:-translate-y-1 transition duration-500">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Dashboard Snapshot</span>
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
            </div>
            
            {/* Stat Box */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Wellness Wallet</span>
              <p className="text-2xl font-black text-slate-800 mt-1">12,450 <span className="text-xs text-slate-500 font-medium">Points</span></p>
              <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                <TrendingUp className="w-4 h-4" /> +12% this week
              </div>
            </div>

            {/* Spark line visual representation */}
            <div className="mb-4">
              <svg viewBox="0 0 100 30" className="w-full h-12 overflow-visible">
                <path d="M 0 25 Q 25 5, 50 18 T 100 2" fill="none" stroke="#00d09c" strokeWidth="3" strokeLinecap="round" />
                <path d="M 0 25 Q 25 5, 50 18 T 100 2 L 100 30 L 0 30 Z" fill="url(#hero-grad)" opacity="0.1" />
                <defs>
                  <linearGradient id="hero-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00d09c" />
                    <stop offset="100%" stopColor="#ffffff" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Small Quick Actions */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4 text-indigo-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-800 truncate">Health Flex Enrolment</p>
                  <p className="text-[10px] text-slate-400">Eligible grade G2 - Open Window</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-pink-50 flex items-center justify-center shrink-0">
                  <MessagesSquare className="w-4 h-4 text-pink-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-800 truncate">Employee Assistance EAP</p>
                  <p className="text-[10px] text-slate-400">Dr. Sharma scheduled - 10:00 AM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 3. Features Grid */}
      <section id="features" className="bg-white border-t border-slate-100 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h3 className="text-3xl font-black text-slate-900">Comprehensive Solutions</h3>
            <p className="text-slate-500 font-medium">
              We cover all angles of corporate wellness, benefits administration, employee recognition, and audits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4 hover:-translate-y-1 transition duration-300">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
              </div>
              <h4 className="font-bold text-slate-800">Flexible Benefits</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Configure coverage limits, medical/dental buckets, and employee contributions according to corporate grades.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4 hover:-translate-y-1 transition duration-300">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                <HeartPulse className="w-5 h-5 text-indigo-500" />
              </div>
              <h4 className="font-bold text-slate-800">Wellness Logging</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Log steps, sync challenge progress, earn point bundles, and view live team leaderboards.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4 hover:-translate-y-1 transition duration-300">
              <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center">
                <MessagesSquare className="w-5 h-5 text-pink-500" />
              </div>
              <h4 className="font-bold text-slate-800">Confidential EAP</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Seamless booking with mental health counselors, legal guides, or retirement planners.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4 hover:-translate-y-1 transition duration-300">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Award className="w-5 h-5 text-amber-500" />
              </div>
              <h4 className="font-bold text-slate-800">Rewards & Feed</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Peer nominations, badge distribution, custom emoji reactions, and point redemptions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
              <Layers className="text-white w-4.5 h-4.5" />
            </div>
            <span className="text-white font-bold">WellBeing360</span>
          </div>
          <p className="text-xs">
            © 2026 WellBeing360 Inc. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
