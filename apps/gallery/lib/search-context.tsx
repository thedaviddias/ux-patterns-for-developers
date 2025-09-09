"use client";

import { createContext, type ReactNode, useContext, useState } from "react";

interface SearchContextType {
	isSearchOpen: boolean;
	openSearch: () => void;
	closeSearch: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

interface SearchProviderProps {
	children: ReactNode;
}

export function SearchProvider({ children }: SearchProviderProps) {
	const [isSearchOpen, setIsSearchOpen] = useState(false);

	const openSearch = () => {
		setIsSearchOpen(true);
	};

	const closeSearch = () => {
		setIsSearchOpen(false);
	};

	return (
		<SearchContext.Provider value={{ isSearchOpen, openSearch, closeSearch }}>
			{children}
		</SearchContext.Provider>
	);
}

export function useSearch() {
	const context = useContext(SearchContext);
	if (context === undefined) {
		throw new Error("useSearch must be used within a SearchProvider");
	}
	return context;
}
