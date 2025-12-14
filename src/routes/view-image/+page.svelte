<script>
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';

  let imageUrl = '';

  onMount(() => {
    const urlParams = new URLSearchParams(get(page).url.search);
    imageUrl = urlParams.get('src');
  });
</script>

{#if imageUrl}
  <div
    class="fixed inset-0 bg-black flex items-center justify-center"
    style="height: 100vh; width: 100vw;"
  >
    <img src="{imageUrl}" alt="Artwork" class="max-w-[95%] max-h-[95%] object-contain"/>
  </div>
{/if}