import { useEffect, useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

const THEME_KEY = "theme" as const;
type Theme = "light" | "dark" | "system";

function getSystemPrefersDark() {
  return (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  const effectiveDark =
    theme === "system" ? getSystemPrefersDark() : theme === "dark";

  root.classList.toggle("dark", effectiveDark);
  root.setAttribute("data-theme", effectiveDark ? "dark" : "light");
}

function useTheme(): [Theme, (t: Theme) => void] {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = (typeof window !== "undefined" &&
      localStorage.getItem(THEME_KEY)) as Theme | null;
    return stored ?? "system";
  });

  useEffect(() => {
    applyTheme(theme);

    if (theme === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = () => applyTheme("system");
      mq.addEventListener?.("change", handler);
      return () => mq.removeEventListener?.("change", handler);
    }
  }, [theme]);

  const set = (t: Theme) => {
    setTheme(t);
    localStorage.setItem(THEME_KEY, t);
  };

  return [theme, set];
}

function ThemeIcon({ theme }: { theme: Theme }) {
  if (theme === "dark") return <Moon className="h-5 w-5" aria-hidden />;
  if (theme === "light") return <Sun className="h-5 w-5" aria-hidden />;
  return <Monitor className="h-5 w-5" aria-hidden />;
}

export default function Theme() {
  const [theme, setTheme] = useTheme();
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  // Sprawdzenie czy ekran jest mały
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const handler = (e: MediaQueryListEvent) => setIsSmallScreen(e.matches);
    setIsSmallScreen(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const motionProps = {
    initial:
      theme === "dark"
        ? { x: "38%" }
        : theme === "light"
        ? { x: "0%" }
        : { x: "78%" },
    animate:
      theme === "dark"
        ? { x: "38%" }
        : theme === "light"
        ? { x: "0%" }
        : { x: "78%" },
  };

  return (
    <div className="dark:bg-stone-950 transition-colors">
      <header className="relative top-0 backdrop-blur supports-[backdrop-filter]:bg-teal-200/30 dark:supports-[backdrop-filter]:bg-zinc-950/60 border-b border-zinc-200 dark:border-zinc-800 rounded-2xl">
        {isSmallScreen ? (
          <motion.div {...motionProps}>
            <ThemeSelect theme={theme} onChange={setTheme} />
          </motion.div>
        ) : (
          <div>
            <ThemeSelect theme={theme} onChange={setTheme} />
          </div>
        )}
      </header>
    </div>
  );
}

function ThemeSelect({
  theme,
  onChange,
}: {
  theme: Theme;
  onChange: (t: Theme) => void;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Motyw: ${theme}`}
        onClick={() => setOpen(!open)}
        className="inline-flex items-center dark:text-white gap-2 rounded-2xl border border-zinc-300 dark:border-zinc-700 px-3 py-2 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900 focus:ring-2 focus:ring-blue-500"
      >
        <ThemeIcon theme={theme} />
        <span className="hidden sm:inline">Motyw: {theme}</span>
      </button>

      {open && (
        <ul
          role="listbox"
          tabIndex={-1}
          className="absolute right-0 mt-2 w-48 overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-lg"
        >
          {(["light", "dark", "system"] as Theme[]).map((opt) => (
            <li key={opt} role="option" aria-selected={theme === opt}>
              <button
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
                className={`w-full px-3 py-2 text-left text-sm dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800 ${
                  theme === opt ? "font-semibold" : ""
                }`}
              >
                <div className="flex items-center gap-2">
                  <ThemeIcon theme={opt} />
                  <span className="capitalize">{opt}</span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
