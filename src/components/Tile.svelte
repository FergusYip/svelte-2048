<script lang="ts">
	export let value: number;
	export let x: number;
	export let y: number;

	let w: number;
	let h: number;
</script>

<div
	class="tile tile-{value}"
	bind:clientWidth={w}
	bind:clientHeight={h}
	style="transform: translate({w * x}px, {h * y}px)"
>
	{value}
</div>

<style>
	:root {
		--tile-size: 5rem;
		--tile-margin: calc(var(--tile-size) * 0.1);
	}

	.tile {
		width: var(--tile-size);
		height: var(--tile-size);
		margin: var(--tile-margin);
		border-radius: 5px;
		font-weight: bold;
		font-size: 3rem;
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;
		background-color: #29275e;
		color: #f9f6f2;

		position: absolute;
	}

	.tile-2 {
		background-color: #eee4da;
		color: #776e65;
	}

	.tile-4 {
		background-color: #ede0c8;
		color: #776e65;
	}

	.tile-8 {
		background-color: #f2b179;
	}

	.tile-16 {
		background-color: #f59563;
	}

	.tile-32 {
		background-color: #f67c5f;
	}

	.tile-64 {
		background-color: #f65e3b;
	}

	.tile-128 {
		background-color: #edcf72;
	}

	.tile-256 {
		background-color: #edcc63;
	}

	.tile-512 {
		background-color: #edc64d;
	}

	.tile-1024 {
		background-color: #f0c038;
	}

	.tile-2048 {
		background-color: #eec22e;
	}

	@media screen and (max-width: 400px) {
		:root {
			--tile-size: 4rem;
		}
	}
</style>
