import React from 'react';
import { ROLE_JOURNEY, rgbString } from '../landing/journey';
import { Reveal, Icon } from '../landing/primitives';

const PRINCIPLES = [
  {
    icon: 'hub',
    title: 'One connected ecosystem',
    text: 'Discovery, ticketing, venues, speakers, volunteers and sponsorship live in one place instead of six disconnected tools.',
  },
  {
    icon: 'auto_awesome',
    title: 'Calm, considered design',
    text: 'Clear hierarchy and generous space, so the work of running an event never feels like fighting the software.',
  },
  {
    icon: 'qr_code_2',
    title: 'Built for the day itself',
    text: 'Digital passes and instant door check-in keep the moment of arrival as smooth as everything before it.',
  },
];

export const AboutView = () => (
  <div className="relative overflow-hidden">
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgb(185 168 242 / 0.16), transparent 70%)' }}
      aria-hidden="true"
    />
    <div className="relative px-5 sm:px-8 max-w-[1100px] mx-auto py-16 sm:py-24 space-y-20">
      <header className="text-center max-w-[760px] mx-auto">
        <Reveal>
          <p className="text-[12px] uppercase tracking-[0.22em] text-fg/50">About Connect</p>
        </Reveal>
        <Reveal delay={0.06}>
          <h1 className="mt-5 font-geist font-semibold tracking-[-0.03em] text-fg text-[40px] sm:text-[56px] leading-[1.05]">
            Making events easier
            <br />
            <span className="font-display italic font-normal text-organizer-ink">for everyone involved.</span>
          </h1>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="mt-6 text-[17px] leading-relaxed text-fg/65">
            Connect was created to simplify the event ecosystem — bringing curious attendees, passionate organizers, inspiring
            venues, speakers, volunteers and sponsors together around the moments they share.
          </p>
        </Reveal>
      </header>

      <section aria-labelledby="principles-title">
        <h2 id="principles-title" className="sr-only">Our principles</h2>
        <div className="grid md:grid-cols-3 gap-5">
          {PRINCIPLES.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.08} className="glass rounded-[28px] p-7">
              <span className="w-10 h-10 rounded-xl bg-fg/[0.07] border border-fg/10 flex items-center justify-center text-fg/85">
                <Icon name={p.icon} className="!text-[20px]" />
              </span>
              <h3 className="font-geist text-lg font-semibold text-fg mt-5">{p.title}</h3>
              <p className="text-[14px] text-fg/60 leading-relaxed mt-2">{p.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section aria-labelledby="roles-title" className="glass-strong rounded-[32px] p-8 sm:p-12">
        <Reveal>
          <h2 id="roles-title" className="font-geist text-2xl sm:text-3xl font-semibold text-fg tracking-tight">
            Six ways to take part
          </h2>
          <p className="text-[15px] text-fg/60 mt-2 max-w-[560px]">
            Everyone on Connect plays a part in making an event happen. Most people play more than one.
          </p>
        </Reveal>
        <ul className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-8">
          {ROLE_JOURNEY.map((r, i) => (
            <Reveal as="li" key={r.id} delay={i * 0.06}>
              <span className="block h-1 w-10 rounded-full" style={{ background: rgbString(r.rgb) }} />
              <p className="font-geist text-base font-semibold text-fg mt-4">{r.label}</p>
              <p className="text-[13px] text-fg/55 mt-1.5 leading-relaxed">{r.benefits[0].text}</p>
            </Reveal>
          ))}
        </ul>
      </section>
    </div>
  </div>
);
