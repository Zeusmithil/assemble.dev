import React from 'react';
import { Reveal, Icon } from '../landing/primitives';
import { rgbString } from '../landing/journey';

const TRACKS = [
  {
    id: 'attendees',
    title: 'For attendees',
    icon: 'confirmation_number',
    rgb: [140, 202, 244],
    cta: { label: 'Explore events', view: 'discover' },
    steps: [
      { title: 'Discover events', text: 'Explore workshops, summits, shows and masterclasses with city, format and price filters.' },
      { title: 'Register instantly', text: 'Pick a ticket tier and receive a digital pass with the venue, schedule and agenda.' },
      { title: 'Check in at the door', text: 'Show your QR pass for contactless check-in, then stay connected through communities.' },
    ],
  },
  {
    id: 'organizers',
    title: 'For organizers',
    icon: 'edit_calendar',
    rgb: [185, 168, 242],
    cta: { label: 'Create an event', view: 'create-event' },
    steps: [
      { title: 'Create & draft', text: 'Define the title, schedule, capacity and ticket pricing for your event.' },
      { title: 'Book venues & speakers', text: 'Source venues and speakers from the marketplace, and request sponsorship.' },
      { title: 'Publish live', text: 'Launch to the discovery feed and follow registrations and revenue as they arrive.' },
      { title: 'Run the day', text: 'Use the built-in QR validator at the door and track attendance in real time.' },
    ],
  },
];

export const HowItWorksView = ({ setActiveView }) => (
  <div className="relative overflow-hidden">
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgb(140 202 244 / 0.14), transparent 70%)' }}
      aria-hidden="true"
    />
    <div className="relative px-5 sm:px-8 max-w-[1180px] mx-auto py-16 sm:py-24 space-y-16">
      <header className="text-center max-w-[720px] mx-auto">
        <Reveal>
          <p className="text-[12px] uppercase tracking-[0.22em] text-white/50">How it works</p>
        </Reveal>
        <Reveal delay={0.06}>
          <h1 className="mt-5 font-geist font-semibold tracking-[-0.03em] text-white text-[40px] sm:text-[56px] leading-[1.05]">
            Simple for a first event.
            <br />
            <span className="font-display italic font-normal text-attendee">Powerful for the hundredth.</span>
          </h1>
        </Reveal>
      </header>

      {TRACKS.map((track) => (
        <section key={track.id} aria-labelledby={`${track.id}-title`} className="glass-strong rounded-[32px] p-7 sm:p-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 id={`${track.id}-title`} className="font-geist text-2xl font-semibold text-white flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: rgbString(track.rgb, 0.14), color: rgbString(track.rgb) }}>
                <Icon name={track.icon} className="!text-[20px]" />
              </span>
              {track.title}
            </h2>
            <button
              type="button"
              onClick={() => setActiveView(track.cta.view)}
              className="rounded-full px-5 py-2.5 text-[13px] font-semibold text-ink-950 cursor-pointer transition-opacity hover:opacity-90"
              style={{ background: rgbString(track.rgb) }}
            >
              {track.cta.label}
            </button>
          </div>
          <ol className={`mt-8 grid gap-4 ${track.steps.length === 4 ? 'md:grid-cols-4' : 'md:grid-cols-3'}`}>
            {track.steps.map((step, i) => (
              <Reveal as="li" key={step.title} delay={i * 0.07} className="rounded-2xl bg-white/[0.035] border border-white/[0.07] p-5">
                <span className="font-mono text-[12px]" style={{ color: rgbString(track.rgb) }}>0{i + 1}</span>
                <h3 className="font-geist text-base font-semibold text-white mt-3">{step.title}</h3>
                <p className="text-[13px] text-white/60 leading-relaxed mt-1.5">{step.text}</p>
              </Reveal>
            ))}
          </ol>
        </section>
      ))}
    </div>
  </div>
);
