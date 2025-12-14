<script>
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';
    import { flip } from 'svelte/animate';

    export let img;
    let flipped = false;
    let canvas;
    let container;

    onMount(async () => {
        if (browser) {
            drawPoints();
        }
    });

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

<a bind:this={container} onmousemove={handleMouseMove} onmouseleave={resetTilt} class="w-[115px] sm:w-[115px] tilt-effect rounded-md overflow-hidden bg-base-200 border border-neutral/70 aspect-[3/2]" href={`/view-image?src=${encodeURIComponent(img)}`} target="_blank">
    <img src="{img}" alt="Artwork" class="tilt-effect w-full h-full object-cover"/>
</a>


<style>
    .tilt-effect {
        transition: transform 0.1s ease;
        transform-style: preserve-3d;
        transform-origin: center;
        will-change: transform;
    }
</style>

