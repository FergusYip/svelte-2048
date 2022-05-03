<script lang="ts">
	import {
		newGame,
		nextUpState,
		notEmpty,
		nextDownState,
		nextLeftState,
		nextRightState,
		insertRandomTile
	} from '../game/2048';

	import Tile from '../components/Tile.svelte';
	let game = newGame();

	$: tiles = game.grid
		.flatMap((row, y) => row.map((tile, x) => (tile ? { ...tile, x, y } : null)))
		.filter(notEmpty);

	function handleKeydown(event: KeyboardEvent) {
		switch (event.key) {
			case 'ArrowUp':
				game = nextUpState(game);
				break;
			case 'ArrowDown':
				game = nextDownState(game);
				break;
			case 'ArrowLeft':
				game = nextLeftState(game);
				break;
			case 'ArrowRight':
				game = nextRightState(game);
				break;

			default:
				break;
		}
		game = { ...game, grid: insertRandomTile(game.grid) };
	}

	// $: printGrid(game.grid);
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="grid">
	{#each tiles as tile (tile.id)}
		<Tile value={tile.value} x={tile.x} y={tile.y} />
	{/each}
</div>

<style>
	.grid {
		width: 100%;
		position: relative;
	}
</style>
