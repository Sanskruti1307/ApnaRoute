import React from 'react';
import { ArrowRight, BriefcaseBusiness, Compass, Mail, Phone, UserRound } from 'lucide-react';

interface AccessPortalProps {
  onExplore: () => void;
  onTravelerLogin: () => void;
  onPartnerLogin: () => void;
}

export const AccessPortal: React.FC<AccessPortalProps> = ({ onExplore, onTravelerLogin, onPartnerLogin }) => (
  <section id="access-portal" className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
    <div className="rounded-2xl border border-[#1f293d] bg-[#0d111b]/90 p-4 shadow-2xl shadow-black/20 sm:p-6">
      <div className="mb-5 flex flex-col justify-between gap-2 border-b border-slate-800/80 pb-4 sm:flex-row sm:items-end">
        <div><p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400">Choose your route</p><h2 className="mt-1 font-['Outfit'] text-xl font-bold text-white sm:text-2xl">Start with the access that fits your journey.</h2></div>
        <span className="text-xs text-slate-500">No account required to discover India</span>
      </div>
      <div className="grid gap-3 lg:grid-cols-2">
        <button onClick={onExplore} className="group flex min-h-40 flex-col justify-between rounded-xl border border-indigo-500/40 bg-indigo-950/25 p-5 text-left transition hover:-translate-y-0.5 hover:border-indigo-400/70 hover:bg-indigo-950/45">
          <div className="flex items-start justify-between"><span className="flex h-10 w-10 items-center justify-center rounded-lg border border-indigo-400/30 bg-indigo-500/10 text-indigo-300"><Compass className="h-5 w-5" /></span><ArrowRight className="h-4 w-4 text-indigo-300 transition-transform group-hover:translate-x-1" /></div>
          <span><strong className="block font-['Outfit'] text-base text-white">Explorer / Guest Access</strong><span className="mt-1 block text-xs leading-relaxed text-slate-400">Browse 500+ destinations, routes, and live advisories without signing in.</span></span>
        </button>
        <div className="min-h-40 rounded-xl border border-slate-700/80 bg-[#111827]/70 p-5">
          <div className="flex items-start justify-between"><span className="flex h-10 w-10 items-center justify-center rounded-lg border border-cyan-400/30 bg-cyan-500/10 text-cyan-300"><UserRound className="h-5 w-5" /></span><span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-emerald-300">Traveler</span></div>
          <strong className="mt-5 block font-['Outfit'] text-base text-white">Traveler / Partner Login</strong><p className="mt-1 text-xs leading-relaxed text-slate-400">Save trips and live routes as a traveler, or join as a verified service partner or local guide.</p>
          <div className="mt-4 flex flex-wrap gap-2"><button onClick={onTravelerLogin} className="inline-flex items-center gap-1.5 rounded-md bg-indigo-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-indigo-500"><Mail className="h-3.5 w-3.5" /> Email / Google</button><button onClick={onTravelerLogin} className="inline-flex items-center gap-1.5 rounded-md border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:border-cyan-400/50 hover:text-white"><Phone className="h-3.5 w-3.5" /> Phone OTP</button><button onClick={onPartnerLogin} className="inline-flex items-center gap-1.5 rounded-md border border-amber-400/30 px-3 py-2 text-xs font-semibold text-amber-300 transition hover:border-amber-300"><BriefcaseBusiness className="h-3.5 w-3.5" /> Partner login</button></div>
        </div>
      </div>
    </div>
  </section>
);