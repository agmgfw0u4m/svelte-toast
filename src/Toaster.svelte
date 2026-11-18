<script lang="ts">
	import Toast from './Toast.svelte';
	import type { Toaster } from './toaster.svelte';

	let { toaster }: { toaster: Toaster } = $props();
</script>

<div class="toaster" aria-label="Notifications">
	{#each toaster.toasts as toast (toast.id)}
		<Toast {toast} {toaster} />
	{/each}
</div>

<style>
	.toaster {
		position: fixed;
		inset-block-end: 1rem;
		inset-inline-end: 1rem;
		z-index: 1000;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		width: min(22rem, calc(100vw - 2rem));
	}
</style>
