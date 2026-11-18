<script lang="ts">
	import type { Toaster, Toast } from './toaster.svelte';

	let { toast, toaster }: { toast: Toast; toaster: Toaster } = $props();

	let hovering = $state(false);
	let focusInside = $state(false);

	function pause() {
		if (toast.duration > 0) toaster.pause(toast.id);
	}

	function resume() {
		if (toast.duration > 0 && !hovering && !focusInside) toaster.resume(toast.id);
	}

	function onpointerenter() {
		hovering = true;
		pause();
	}

	function onpointerleave() {
		hovering = false;
		resume();
	}

	function onfocusin() {
		focusInside = true;
		pause();
	}

	function onfocusout(event: FocusEvent) {
		const next = event.relatedTarget as Node | null;
		if (next && event.currentTarget instanceof Node && event.currentTarget.contains(next)) return;
		focusInside = false;
		resume();
	}
</script>

<div
	class="toast toast-{toast.variant}"
	role={toast.variant === 'error' ? 'alert' : 'status'}
	onpointerenter={onpointerenter}
	onpointerleave={onpointerleave}
	onfocusin={onfocusin}
	onfocusout={onfocusout}
>
	<p class="toast-message">{toast.message}</p>
	<button
		class="toast-dismiss"
		type="button"
		aria-label="Dismiss notification"
		onclick={() => toaster.dismiss(toast.id)}
	>
		×
	</button>
</div>

<style>
	.toast {
		display: flex;
		gap: 0.75rem;
		align-items: flex-start;
		padding: 0.625rem 0.75rem;
		border: 1px solid var(--toast-border, #d4d4d8);
		border-radius: 0.375rem;
		background: var(--toast-bg, #fff);
		color: var(--toast-fg, #18181b);
		box-shadow: 0 1px 2px rgb(0 0 0 / 8%);
	}

	.toast-error {
		border-color: var(--toast-error, #dc2626);
	}

	.toast-message {
		margin: 0;
		flex: 1;
		font-size: 0.875rem;
		line-height: 1.4;
	}

	.toast-dismiss {
		padding: 0 0.25rem;
		border: 0;
		background: none;
		color: inherit;
		font-size: 1rem;
		line-height: 1.4;
		cursor: pointer;
	}

	.toast-dismiss:focus-visible {
		outline: 2px solid currentColor;
		outline-offset: 2px;
	}
</style>
