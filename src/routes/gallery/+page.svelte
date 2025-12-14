<script>
    import GalleryCard from '$lib/components/GalleryCard.svelte';
    import PlateImage from '$lib/components/PlateImage.svelte';
    import OmniTrayImage from '$lib/components/OmniTrayImage.svelte';
    import OmniTrayPicture from '$lib/components/OmniTrayPicture.svelte';
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';
    import { well_colors, old_well_colors } from '$lib/proteins.js';
    import { page } from '$app/stores';

    const filter_list = ['Approved', 'Media Lab', 'Off']
    const url_prefix = 'https://ginkgo-artworks.nyc3.cdn.digitaloceanspaces.com/agar-art/'
    
    let filter = $state(3);
    let record_load_iteration = $state(0);
    let loadingRecords = $state(true);
    let loadedRecords = $state([]);
    let images = [];
    let container;
    // -1 = Image/Video
    // 0 = HTGAA
    // 3 = SBS

    onMount(async () => {
        if (browser) {
            if ($page.url.searchParams.get('htgaa')){
                filter = 0;
            }
            loadGallery();
            const res = await fetch('/images.txt');
            const text = await res.text();
            images = text.split('\n').map(line => line.trim()).filter(line => line.length > 0).map(filename => url_prefix + filename);
        }
    });

    async function loadGallery() {
        if (filter !== -1) {
            loadingRecords = true;
            const response = await fetch('../loadGallery', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ record_load_iteration, filter })
            });
            const r = await response.json();
            loadedRecords = [...loadedRecords, ...r.records];
            record_load_iteration += 1;
            loadingRecords = false;
        }
    }

    function handleMouseMove(event) {
        const rect = container.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        const rotateX = (-y / rect.height) * 125;
        const rotateY = (x / rect.width) * 125;

        container.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }

    function resetTilt() {
        container.style.transform = 'rotateX(0deg) rotateY(0deg)';
    }
</script>

<article class="prose w-full mx-auto mt-5">
    <h2 class="text-center">Automation Art Gallery</h2>
</article>

<div class="flex flex-row w-full max-w-[100vw] sm:max-w-[500px] mx-auto px-5 opacity-70">
    <a class="flex flex-row gap-1 text-base-content items-center" href="/" aria-label="back">
        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M11.7071 4.29289C12.0976 4.68342 12.0976 5.31658 11.7071 5.70711L6.41421 11H20C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13H6.41421L11.7071 18.2929C12.0976 18.6834 12.0976 19.3166 11.7071 19.7071C11.3166 20.0976 10.6834 20.0976 10.2929 19.7071L3.29289 12.7071C3.10536 12.5196 3 12.2652 3 12C3 11.7348 3.10536 11.4804 3.29289 11.2929L10.2929 4.29289C10.6834 3.90237 11.3166 3.90237 11.7071 4.29289Z" fill="currentColor"></path> </g></svg> 
    </a>
<div class="mx-auto p-4 rounded-box ">
    <div class="tabs tabs-bordered">
        <input type="radio" name="tab" class="tab" aria-label="Designs" onclick={() => {if ($page.url.searchParams.get('htgaa')){filter = 0} else {filter = 3}; record_load_iteration = 0; loadedRecords = []; loadGallery();}} checked />
        <input type="radio" name="tab" class="tab" aria-label="Images" onclick={() => {filter = -1;}} />
    </div>
</div>


</div>

{#if filter === -1}
    <div class="grid grid-cols-[repeat(auto-fit,115px)] justify-center gap-2 pt-3 mb-10">
        {#each images as img, i}
            <OmniTrayPicture {img} />
        {/each}
    </div>
    <!-- <div class="flex flex-col max-w-[99%] mx-auto gap-3">
        <span class="font-semibold text-center underline">Lab Video (2025)</span>
        <iframe
        class="mx-auto w-full md:max-w-[500px] lg:max-w-[750px] xl:max-w-[900px] rounded-lg aspect-video"
        src={`https://drive.google.com/file/d/1MHXiPh85IKux6wNkvq7fSiePwY7eT-WN/preview`}
        title="Opentrons"
        allowfullscreen
        ></iframe>
    </div>

    <div class="flex flex-col max-w-[99%] mx-auto mt-3 gap-3 pb-10">
        <span class="font-semibold text-center underline">Student Designs (2025)</span>
        <img src={`/2025_images/2025_Student_Grid_11x6.png`} alt={`question mark illustration`} class="mx-auto w-full md:max-w-[500px] lg:max-w-[750px] xl:max-w-[900px] rounded-lg"/>
    </div> -->
{/if}

{#if !loadingRecords}
    <!-- HTGAA Plates -->
    {#if filter === 0}
        <div class="flex flex-row flex-wrap w-full mx-auto justify-center pt-3 gap-0 mb-10">
            {#each loadedRecords as record, i}
                <a class="max-w-[110px] sm:max-w-[120px] my-auto" href="/?id={record.id}">
                    {#if record.grid_style === 'Echo384' || record.grid_style === 'Echo384Image' || record.grid_style === 'Echo1536' || record.grid_style === 'Echo1536Image'}
                        <OmniTrayImage {record} {i} {well_colors} {old_well_colors} />
                    {:else}
                        <PlateImage {record} {i} {well_colors} {old_well_colors} />
                    {/if}
                </a>
            {/each}
        </div>
    <!-- SBS Plates -->
    {:else if filter === 3} 
        <div class="grid grid-cols-[repeat(auto-fit,110px)] justify-center gap-2 pt-3 mb-10">
            {#each loadedRecords as record, i}
                {#if record.grid_style === 'Echo384' || record.grid_style === 'Echo384Image' || record.grid_style === 'Echo1536' || record.grid_style === 'Echo1536Image'}
                <a class="w-[110px] aspect-[3/2]" href="/?id={record.id}">
                    <OmniTrayImage {record} {i} {well_colors} {old_well_colors} />
                </a>
                {/if}
            {/each}
        </div>
    {/if}
{:else}
    <!-- LOADING HTGAA Plates -->
    {#if filter === 0}
        <div class="flex flex-row flex-wrap w-full mx-auto justify-center mb-10 pt-3">
            {#each Array(100).fill(0) as _, i}
                <div class="skeleton w-[75px] h-[75px] sm:w-[100px] sm:h-[100px] rounded-full"></div>
            {/each}
        </div>
    <!-- LOADING SBS Plates -->
    {:else if filter === 3} 
        <div class="flex flex-row flex-wrap w-full mx-auto justify-center mb-10 pt-3 gap-2">
            {#each Array(100).fill(0) as _, i}
                <div class="skeleton w-[110px] sm:w-[120px] sm:h-[75px] sm:h-[85px] my-auto rounded-md"></div>
            {/each}
        </div>
    {/if}
{/if}