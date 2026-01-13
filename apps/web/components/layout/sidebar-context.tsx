"use client";

import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
	type ReactNode,
} from "react";

interface SidebarContextValue {
	/** Whether sidebar is open (mobile) */
	open: boolean;
	setOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
	/** Expanded folder paths */
	expandedPaths: Set<string>;
	togglePath: (path: string) => void;
	/** Expand a path (does not collapse if already expanded) */
	expandPath: (path: string) => void;
	/** Scroll position memory */
	scrollPosition: number;
	setScrollPosition: (position: number) => void;
	/** Default level to auto-expand folders */
	defaultOpenLevel: number;
	/** Whether client-side hydration has completed (localStorage loaded) */
	hasHydrated: boolean;
	/** Whether localStorage had stored expanded paths (vs first visit) */
	hadStoredData: boolean;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

const STORAGE_KEY_EXPANDED = "sidebar-expanded-paths";
const STORAGE_KEY_SCROLL = "sidebar-scroll-position";

interface SidebarProviderProps {
	children: ReactNode;
	defaultOpenLevel?: number;
}

/**
 * Sidebar Provider
 *
 * Manages sidebar state including:
 * - Open/closed state for mobile
 * - Expanded folder paths with localStorage persistence
 * - Scroll position memory
 */
// Helper to load expanded paths from localStorage (client-side only)
function getStoredExpandedPaths(): Set<string> | null {
	if (typeof window === "undefined") return null;
	try {
		const saved = localStorage.getItem(STORAGE_KEY_EXPANDED);
		if (saved !== null) {
			return new Set(JSON.parse(saved));
		}
	} catch {
		// Ignore localStorage errors
	}
	return null;
}

// Helper to load scroll position from localStorage synchronously
function getInitialScrollPosition(): number {
	if (typeof window === "undefined") return 0;
	try {
		const saved = localStorage.getItem(STORAGE_KEY_SCROLL);
		if (saved !== null) {
			return JSON.parse(saved);
		}
	} catch {
		// Ignore localStorage errors
	}
	return 0;
}

export function SidebarProvider({
	children,
	defaultOpenLevel = 1,
}: SidebarProviderProps) {
	const [open, setOpen] = useState(false);
	// Start with empty set - defaults are computed in SidebarFolder during render
	// This ensures SSR and initial client render show expanded defaults (no flash)
	const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set());
	const [scrollPosition, setScrollPosition] = useState(0);
	const [hasHydrated, setHasHydrated] = useState(false);
	const [hadStoredData, setHadStoredData] = useState(false);

	// After mount, load from localStorage (if any)
	useEffect(() => {
		const storedPaths = getStoredExpandedPaths();
		if (storedPaths !== null) {
			setExpandedPaths(storedPaths);
			setHadStoredData(true);
		}
		setScrollPosition(getInitialScrollPosition());
		setHasHydrated(true);
	}, []);

	// Persist expanded paths (only after hydration to avoid overwriting with empty set)
	useEffect(() => {
		if (!hasHydrated || typeof window === "undefined") return;
		try {
			localStorage.setItem(
				STORAGE_KEY_EXPANDED,
				JSON.stringify([...expandedPaths])
			);
		} catch {
			// Ignore localStorage errors
		}
	}, [expandedPaths, hasHydrated]);

	// Persist scroll position (debounced, only after hydration)
	useEffect(() => {
		if (!hasHydrated || typeof window === "undefined") return;
		const timeout = setTimeout(() => {
			try {
				localStorage.setItem(
					STORAGE_KEY_SCROLL,
					JSON.stringify(scrollPosition)
				);
			} catch {
				// Ignore localStorage errors
			}
		}, 100);
		return () => clearTimeout(timeout);
	}, [scrollPosition, hasHydrated]);

	const togglePath = useCallback((path: string) => {
		setExpandedPaths((prev) => {
			const next = new Set(prev);
			if (next.has(path)) {
				next.delete(path);
			} else {
				next.add(path);
			}
			return next;
		});
	}, []);

	const expandPath = useCallback((path: string) => {
		setExpandedPaths((prev) => {
			if (prev.has(path)) return prev; // Already expanded, no change
			const next = new Set(prev);
			next.add(path);
			return next;
		});
	}, []);

	return (
		<SidebarContext.Provider
			value={{
				open,
				setOpen,
				expandedPaths,
				togglePath,
				expandPath,
				scrollPosition,
				setScrollPosition,
				defaultOpenLevel,
				hasHydrated,
				hadStoredData,
			}}
		>
			{children}
		</SidebarContext.Provider>
	);
}

export function useSidebar() {
	const context = useContext(SidebarContext);
	if (!context) {
		throw new Error("useSidebar must be used within a SidebarProvider");
	}
	return context;
}
