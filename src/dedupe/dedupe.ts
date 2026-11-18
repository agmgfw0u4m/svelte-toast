import type { Toaster, ToastVariant } from '../toaster.svelte';

export interface PushOptions {
	variant?: ToastVariant;
	duration?: number;
}

/**
 * Wraps `toaster.push` so an identical message inside `window` ms is dropped.
 * Returns the new toast id, or `null` when the message was suppressed.
 */
export function createDedupedPush(toaster: Toaster, window = 500) {
	const seen = new Map<string, number>();

	return (message: string, options: PushOptions = {}): string | null => {
		const now = Date.now();
		for (const [key, at] of seen) {
			if (now - at >= window) seen.delete(key);
		}
		if (seen.has(message)) return null;

		seen.set(message, now);
		return toaster.push(message, options);
	};
}
