# svelte-toast

A small toast store for Svelte 5. Messages stack at most three deep, timers stop while the
pointer or keyboard focus rests on a toast, and every toast has a labelled dismiss button.

Pause-on-hover is the point: a reader can stop the clock on a message without racing it, and
focus moving onto the dismiss button keeps the remaining time frozen.

[REPL](https://svelte.dev/repl/hello-world?version=5) — placeholder until the demo ships.

## Install

```sh
npm install svelte-toast
```

## Usage

```svelte
<script lang="ts">
	import { ToastRegion, createToaster } from 'svelte-toast';

	const toaster = createToaster({ max: 3, duration: 4000 });
</script>

<button onclick={() => toaster.push('Draft saved', { variant: 'success' })}>Save</button>
<ToastRegion {toaster} />
```

`push` returns the toast id. `duration: 0` keeps a toast until it is dismissed, and going over
`max` evicts the oldest toast first.

## API

| Member | Behaviour |
| --- | --- |
| `createToaster({ max, duration })` | Builds a store; `max` defaults to 3, `duration` to 4000 ms. |
| `toaster.push(message, { variant, duration })` | Adds a toast and returns its id. |
| `toaster.dismiss(id)` | Removes one toast and clears its timer. |
| `toaster.dismissAll()` | Removes every toast. |
| `toaster.pause(id)` / `toaster.resume(id)` | Freezes or restarts the remaining time. |

Variants are `info`, `success` and `error`; errors are announced with `role="alert"` instead of
`role="status"`.

## Layout

```
src/toaster.svelte.ts  store, timer bookkeeping, pause/resume
src/Toast.svelte       single toast, pointer and focus handling, dismiss button
src/Toaster.svelte     fixed region that renders the stack
src/index.ts           package entry
```

## License

MIT
