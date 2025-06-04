<script lang="ts">
  import { enhance } from '$app/forms';
  import type { PageServerData } from './$types';

  let { data }: { data: PageServerData } = $props();
</script>

<div class="">
  <h1>Hi, {data.user.name}!</h1>
  <p>Your user ID is {data.user.id}.</p>
  <form id="logout-form" method="post" action="?/logout" use:enhance></form>

  <pre>{JSON.stringify(data.user, null, 4)}</pre>
</div>
