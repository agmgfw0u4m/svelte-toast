# dedupe

Opt-in guard against the same message being pushed twice in a burst, for example when a
network retry fires the same error callback several times in a row.

```svelte
<script lang="ts">
	import { createDedupedPush } from 'svelte-toast/dedupe';

	const notify = createDedupedPush(toaster, 500);
</script>

<button onclick={() => notify('Could not reach the server', { variant: 'error' })}>Retry</button>
```

The wrapper returns `null` for a suppressed message and the new id otherwise, so callers can
still branch on it.

Keys live for `window` ms (500 by default) and are evicted lazily on the next call. A suppressed
push does not extend the existing toast's timer, because the toast may be paused under the
pointer.
