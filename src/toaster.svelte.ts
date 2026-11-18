export type ToastVariant = 'info' | 'success' | 'error';

export interface Toast {
	id: string;
	message: string;
	variant: ToastVariant;
	duration: number;
}

export interface ToasterOptions {
	/** Toasts kept in the stack; the oldest is dismissed first. */
	max?: number;
	/** Default time to live in ms. `0` keeps a toast until dismissed. */
	duration?: number;
}

interface Runtime {
	handle: number | null;
	deadline: number;
	remaining: number;
}

export class Toaster {
	toasts = $state<Toast[]>([]);
	#runtimes = new Map<string, Runtime>();
	#max: number;
	#duration: number;
	#seq = 0;

	constructor({ max = 3, duration = 4000 }: ToasterOptions = {}) {
		this.#max = max;
		this.#duration = duration;
	}

	push(
		message: string,
		{ variant = 'info', duration = this.#duration }: { variant?: ToastVariant; duration?: number } = {}
	): string {
		const id = `toast-${++this.#seq}`;
		this.toasts.push({ id, message, variant, duration });
		while (this.toasts.length > this.#max) {
			this.dismiss(this.toasts[0].id);
		}
		if (duration > 0) this.#start(id, duration);
		return id;
	}

	dismiss(id: string) {
		const index = this.toasts.findIndex((toast) => toast.id === id);
		if (index === -1) return;
		this.#clear(id);
		this.toasts.splice(index, 1);
	}

	dismissAll() {
		for (const toast of [...this.toasts]) this.dismiss(toast.id);
	}

	pause(id: string) {
		const runtime = this.#runtimes.get(id);
		if (!runtime || runtime.handle === null) return;
		clearTimeout(runtime.handle);
		runtime.handle = null;
		runtime.remaining = Math.max(0, runtime.deadline - Date.now());
	}

	resume(id: string) {
		const runtime = this.#runtimes.get(id);
		if (!runtime || runtime.handle !== null) return;
		if (runtime.remaining === 0) this.dismiss(id);
		else this.#arm(id, runtime, runtime.remaining);
	}

	#start(id: string, duration: number) {
		const runtime: Runtime = { handle: null, deadline: 0, remaining: duration };
		this.#runtimes.set(id, runtime);
		this.#arm(id, runtime, duration);
	}

	#arm(id: string, runtime: Runtime, delay: number) {
		runtime.deadline = Date.now() + delay;
		runtime.handle = window.setTimeout(() => this.dismiss(id), delay);
	}

	#clear(id: string) {
		const runtime = this.#runtimes.get(id);
		if (runtime?.handle != null) clearTimeout(runtime.handle);
		this.#runtimes.delete(id);
	}
}

export function createToaster(options: ToasterOptions = {}): Toaster {
	return new Toaster(options);
}
