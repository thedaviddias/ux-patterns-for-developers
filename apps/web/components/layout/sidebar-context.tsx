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
// Helper to load expanded paths from localStorage synchronously
function getInitialExpandedPaths(): Set<string> {
	if (typeof window === "undefined") return new Set();
	try {
		const saved = localStorage.getItem(STORAGE_KEY_EXPANDED);
		if (saved) {
			return new Set(JSON.parse(saved));
		}
	} catch {
		// Ignore localStorage errors
	}
	return new Set();
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
	// Initialize from localStorage synchronously to avoid flicker
	const [expandedPaths, setExpandedPaths] = useState<Set<string>>(getInitialExpandedPaths);
	const [scrollPosition, setScrollPosition] = useState(getInitialScrollPosition);
	const [initialized, setInitialized] = useState(true);

	// Persist expanded paths
	useEffect(() => {
		if (!initialized || typeof window === "undefined") return;
		try {
			localStorage.setItem(
				STORAGE_KEY_EXPANDED,
				JSON.stringify([...expandedPaths])
			);
		} catch {
			// Ignore localStorage errors
		}
	}, [expandedPaths, initialized]);

	// Persist scroll position (debounced)
	useEffect(() => {
		if (!initialized || typeof window === "undefined") return;
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
	}, [scrollPosition, initialized]);

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
