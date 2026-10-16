import React from 'react';
import { ROLE_JOURNEY, rgbString } from './landing/journey';

const FooterLink = ({ children, onClick }) => (
  <button type="button" onClick={onClick} className="text-fg/55 hover:text-fg text-left transition-colors cursor-pointer">
    {children}
  </button>
);

export const Footer = ({ setActiveView, onJoin }) => {
  const year = new Date().getFullYear();
  return (
    <footer className="relative z-10 w-full px-4 md:px-8 pb-8 pt-10 max-w-[1280px] mx-auto mt-auto">
      <div className="rounded-[32px] border border-fg/[0.08] bg-gradient-to-b from-surface to-surface-2 p-8 md:p-12 shadow-[0_40px_80px_-40px_rgb(0_0_0/0.6)]">
        <div className="flex flex-col lg:flex-row justify-between gap-12">
          <div className="max-w-sm">
            <div className="font-geist text-lg font-semibold text-fg flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-full bg-fg text-bg flex items-center justify-center text-sm font-bold">C</span>
              Connect
            </div>
            <p className="text-[14px] text-fg/55 mt-4 leading-relaxed">
              One ecosystem for attendees, organizers, speakers, volunteers, sponsors and venue partners.
            </p>
            <div className="flex gap-1.5 mt-6" aria-hidden="true">
              {ROLE_JOURNEY.map((r) => (
                <span key={r.id} className="h-1 w-8 rounded-full" style={{ background: rgbString(r.rgb, 0.8) }} />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 text-[14px]">
            <div className="flex flex-col gap-3">
              <span className="text-[11px] font-semibold text-fg/35 uppercase tracking-[0.18em] mb-1">Platform</span>
              <FooterLink onClick={() => setActiveView('discover')}>Browse events</FooterLink>
              <FooterLink onClick={() => setActiveView('create-event')}>Organize an event</FooterLink>
              <FooterLink onClick={() => setActiveView('venues-marketplace')}>Venue marketplace</FooterLink>
              <FooterLink onClick={() => setActiveView('speakers-marketplace')}>Speaker network</FooterLink>
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-[11px] font-semibold text-fg/35 uppercase tracking-[0.18em] mb-1">Join as</span>
              {ROLE_JOURNEY.map((r) => (
                <FooterLink key={r.id} onClick={() => onJoin(r.signupRole)}>
                  {r.label}
                </FooterLink>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-[11px] font-semibold text-fg/35 uppercase tracking-[0.18em] mb-1">Company</span>
              <FooterLink onClick={() => setActiveView('home')}>Home</FooterLink>
              <FooterLink onClick={() => setActiveView('about')}>About</FooterLink>
              <FooterLink onClick={() => setActiveView('how-it-works')}>How it works</FooterLink>
            </div>
          </div>
        </div>

        <div className="hairline my-8" />
        <p className="text-[12px] text-fg/40">© {year} Connect. Discover events or bring your own to life.</p>
      </div>
    </footer>
  );
};
