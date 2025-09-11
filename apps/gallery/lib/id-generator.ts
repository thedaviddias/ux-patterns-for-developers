import { createHash } from "node:crypto";
import { customAlphabet } from "nanoid";

// Custom alphabet without ambiguous characters (no 0/O, 1/l/I)
// This makes IDs more readable and less error-prone when sharing
const nanoid = customAlphabet(
	"23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz",
	8,
);

/**
 * Generates a short, URL-safe ID for entries
 * Format: 8 characters from a curated alphabet
 * Example: "K9mNp3xV"
 *
 * Collision probability:
 * - ~2.8 trillion possible combinations
 * - At 1000 IDs/day, would take centuries for 1% collision chance
 */
export const generateEntryId = (): string => nanoid();

/**
 * Generates a consistent, deterministic ID based on website and image src
 * This ensures the same inputs always generate the same ID
 * Format: 8 characters from the curated alphabet
 */
export function generateConsistentId(
	website: string,
	imageSrc: string,
): string {
	// Extract just the number from the image src (e.g., "001.png" -> "001")
	const imageNumber = imageSrc.replace(/\.[^.]+$/, "");

	// Create a deterministic hash from website + image number
	const input = `${website}-${imageNumber}`;
	const hash = createHash("sha256").update(input).digest("hex");

	// Convert hex hash to our custom alphabet
	const alphabet = "23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz";
	let result = "";

	// Take first 8 hex pairs and map to our alphabet
	for (let i = 0; i < 8; i++) {
		const hexPair = hash.substring(i * 2, i * 2 + 2);
		const decimal = parseInt(hexPair, 16);
		const index = decimal % alphabet.length;
		result += alphabet[index];
	}

	return result;
}

/**
 * Validates if a string is a valid short ID format
 */
export const isValidShortId = (id: string): boolean => {
	const validChars =
		/^[23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz]{8}$/;
	return validChars.test(id);
};
