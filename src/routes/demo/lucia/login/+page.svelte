<script lang="ts">
  import { enhance } from '$app/forms';
  import type { ActionData } from './$types';

  let { form }: { form: ActionData } = $props();
</script>

<div class="flex flex-col max-w-sm w-full">
  <h1>Login/Register</h1>
  <form method="post" action="?/login" use:enhance class="flex flex-col gap-4">
    <div class="flex flex-col">
      <label for="email">Email</label>
      <input
        id="email"
        name="email"
        placeholder="lex@kryptonite.stn"
        class="mt-1 px-3 py-2 bg-muted border border-muted-foreground rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primarring-primary"
      />
    </div>
    <div class="flex flex-col">
      <label for="password">Password</label>
      <input
        id="password"
        type="password"
        name="password"
        placeholder="********"
        class="mt-1 px-3 py-2 bg-muted border border-muted-foreground rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primarring-primary"
      />
    </div>
    <button class="bg-primary text-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition"
      >Login</button
    >
    <button
      formaction="?/register"
      class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
      >Register</button
    >
  </form>
  <p style="color: red">{form?.error ?? ''}</p>
</div>

<style scoped>
  label {
    font-size: 14px;
  }
</style>
