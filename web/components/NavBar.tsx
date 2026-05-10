import Link from "next/link";

type NavItemId = "home" | "howto" | "about";

const ITEMS: { id: NavItemId; label: string; href: string }[] = [
  { id: "home", label: "Game", href: "/" },
  { id: "howto", label: "How to Play", href: "/how-to-play" },
  { id: "about", label: "About", href: "/about" },
];

interface NavBarProps {
  active: NavItemId;
}

export default function NavBar({ active }: NavBarProps) {
  return (
    <header className="flex items-center justify-between mb-10 sm:mb-14 gap-3 sm:gap-6">
      <Link
        href="/"
        className="flex items-center gap-2 sm:gap-3 shrink-0 no-underline text-inherit focus-ring rounded-md"
      >
        <img
          src="/logo.svg"
          width={28}
          height={28}
          alt="Color Dash logo"
          className="inline-block shrink-0"
        />
        <span className="hidden sm:inline mono text-mono-sm tracking-mono-xl uppercase text-ink-2">
          Color Dash
        </span>
      </Link>

      <nav
        aria-label="Primary"
        className="inline-flex gap-1 p-1 bg-bg-1 border border-line rounded-card shadow-infobar"
      >
        {ITEMS.map((it) => {
          const isActive = active === it.id;
          return (
            <Link
              key={it.id}
              href={it.href}
              aria-current={isActive ? "page" : undefined}
              className={`focus-ring no-underline px-2.5 sm:px-3.5 py-1.5 sm:py-2 min-h-[36px] sm:min-h-[40px] flex items-center border-0 rounded-btn font-semibold text-[11px] sm:text-mono-md tracking-[0.04em] transition-all duration-150 ease-in-out ${
                isActive
                  ? "bg-tab-active text-neon shadow-tab-active"
                  : "bg-transparent text-ink-2 hover:text-ink-0"
              }`}
            >
              {it.label}
            </Link>
          );
        })}
      </nav>

      <div className="hidden sm:flex mono text-mono-sm tracking-[0.2em] text-ink-3 items-center gap-2 uppercase shrink-0">
        <span className="led inline-block w-1.5 h-1.5 rounded-full bg-neon shadow-led-neon-sm" />
        Online
      </div>
    </header>
  );
}
