import React from 'react';

/*
 * Shared building blocks for the app pages, matching the landing page:
 * glass surfaces, pill buttons and tabs, a serif italic accent line, and the
 * active role's colour via the --accent-rgb / --accent-ink variables set on
 * the app root (see App.jsx).
 */

export const Icon = ({ name, className = '', style }) => (
  <span className={`material-symbols-outlined ${className}`} style={style} aria-hidden="true">
    {name}
  </span>
);

const ACCENT_TEXT = { color: 'var(--accent-ink)' };
const ACCENT_CHIP = { background: 'rgb(var(--accent-rgb) / 0.16)', color: 'var(--accent-ink)' };

// Page title block used at the top of every app page
export const PageHeader = ({ icon, kicker, title, accent, description, actions }) => (
  <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pt-2">
    <div className="max-w-2xl">
      <p className="flex items-center gap-2.5 text-[12px] font-medium uppercase tracking-[0.2em]" style={ACCENT_TEXT}>
        {icon && (
          <span className="w-7 h-7 rounded-lg flex items-center justify-center" style={ACCENT_CHIP}>
            <Icon name={icon} className="!text-[16px]" />
          </span>
        )}
        {kicker}
      </p>
      <h1 className="mt-4 font-geist font-semibold tracking-[-0.03em] text-fg text-[34px] leading-[1.06] sm:text-[44px]">
        {title}
        {accent && (
          <>
            <br />
            <span className="font-display italic font-normal tracking-[-0.01em]" style={ACCENT_TEXT}>
              {accent}
            </span>
          </>
        )}
      </h1>
      {description && <p className="mt-3 text-[15px] leading-relaxed text-fg/60 max-w-xl">{description}</p>}
    </div>
    {actions && <div className="flex flex-wrap items-center gap-2.5">{actions}</div>}
  </header>
);

const BUTTON_STYLES = {
  primary:
    'text-ink-950 bg-[rgb(var(--accent-rgb))] hover:brightness-[0.96] shadow-[0_12px_30px_-14px_rgb(var(--accent-rgb)/0.9)]',
  secondary: 'glass text-fg/85 hover:text-fg',
  ghost: 'text-fg/70 hover:text-fg hover:bg-fg/[0.06]',
};

export const Button = ({ variant = 'primary', icon, children, className = '', type = 'button', ...props }) => (
  <button
    type={type}
    className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 font-geist text-[13px] font-semibold transition-all duration-200 active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${BUTTON_STYLES[variant]} ${className}`}
    {...props}
  >
    {icon && <Icon name={icon} className="!text-[17px]" />}
    {children}
  </button>
);

/**
 * Pill tab bar. items: [{ id, label, icon?, count?, onClick? }]
 * An item with its own onClick (e.g. one that opens another page) is not a tab.
 */
export const Tabs = ({ items, value, onChange, label }) => (
  <div className="max-w-full overflow-x-auto no-scrollbar -mx-1 px-1">
    <div role="tablist" aria-label={label} className="glass rounded-full p-1 inline-flex gap-1">
      {items.map((item) => {
        const active = !item.onClick && item.id === value;
        return (
          <button
            key={item.id}
            type="button"
            role={item.onClick ? undefined : 'tab'}
            aria-selected={item.onClick ? undefined : active}
            onClick={() => (item.onClick ? item.onClick() : onChange(item.id))}
            className={`shrink-0 inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium whitespace-nowrap transition-colors duration-200 cursor-pointer ${
              active ? 'bg-fg text-bg shadow-sm' : 'text-fg/65 hover:text-fg hover:bg-fg/[0.06]'
            }`}
          >
            {item.icon && <Icon name={item.icon} className="!text-[17px]" />}
            {item.label}
            {item.count != null && (
              <span className={`min-w-5 rounded-full px-1.5 text-[11px] font-semibold ${active ? 'bg-bg/20' : 'bg-fg/[0.08]'}`}>
                {item.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  </div>
);

export const StatTile = ({ icon, label, value }) => (
  <div className="glass rounded-[24px] p-5 flex items-center gap-4 min-w-0">
    <span className="w-11 h-11 shrink-0 rounded-2xl flex items-center justify-center" style={ACCENT_CHIP}>
      <Icon name={icon} className="!text-[21px]" />
    </span>
    <div className="min-w-0">
      <p className="font-geist text-2xl font-semibold tracking-tight text-fg truncate">{value}</p>
      <p className="text-[12px] text-fg/55 truncate">{label}</p>
    </div>
  </div>
);

export const StatGrid = ({ children }) => <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">{children}</div>;
