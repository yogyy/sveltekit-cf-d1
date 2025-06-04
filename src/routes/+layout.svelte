<script lang="ts">
  import '../app.css';
  import { page } from '$app/state';
  let { children, data } = $props();
</script>

{#if page.url.pathname !== '/demo/lucia/login'}
  <header class="flex items-center justify-between p-4 bg-accent text-white fixed w-svw">
    <div class="flex gap-3 items-center flex-col min-[400px]:flex-row">
      <h1 class="text-2xl font-bold cursor-default text-primary capitalize">sveltekit with D1</h1>
      <ul class="flex space-x-4 px-4">
        <li><a href="/" class="text-foreground hover:text-primary/70">Home</a></li>
        <li><a href="/demo" class="text-foreground hover:text-primary/70">Demo</a></li>
        <li><a href="/demo/lucia" class="text-foreground hover:text-primary/70">Lucia</a></li>
      </ul>
    </div>
    {#if data.user !== null}
      <button form="logout-form" type="submit" class="shrink-0">Sign out</button>
    {/if}
  </header>
{/if}

<main class="flex items-center justify-center h-svh">{@render children()}</main>
