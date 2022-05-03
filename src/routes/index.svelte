<script>
	import { newGame, notEmpty } from '../game/2048';

	import Tile from '../components/Tile.svelte';
	const game = newGame();

	$: tiles = game.grid
		.flatMap((row, y) => row.map((tile, x) => (tile ? { ...tile, x, y } : null)))
		.filter(notEmpty);
</script>

<div class="grid">
	{#each tiles as tile (tile.id)}
		<Tile value={tile.value} x={tile.x} y={tile.y} />
	{/each}
</div>

<style>
	.grid {
		width: 100%;
	}
</style>
