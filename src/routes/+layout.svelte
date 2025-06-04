<script lang="ts">
  import '../app.css';

  let { children } = $props();
</script>

<main class="flex items-center justify-center h-svh">{@render children()}</main>
