export enum Direction {
	Up,
	Down,
	Left,
	Right
}

export enum GameState {
	Playing,
	Win,
	Loss
}

export type Position = {
	x: number;
	y: number;
};

export type Game = {
	state: GameState;
	grid: Grid;
	score: number;
};

type GridTile = {
	id: number;
	value: number;
};

type GridRow = (GridTile | null)[];

type Grid = GridRow[];

const GRID_SIZE = 4;

/** Get random int in the range [0,max) */
const getRandomInt = (max: number) => Math.floor(Math.random() * Math.ceil(max));
const newId = () => getRandomInt(10 ** 10);
const twoOrFour = () => ((getRandomInt(10) % 2) + 1) * 2;

function isPosition(maybePosition: Position | undefined): maybePosition is Position {
	return !!maybePosition;
}

export function newGame(): Game {
	return {
		state: GameState.Playing,
		grid: insertRandomTile(insertRandomTile(newGrid(GRID_SIZE))),
		score: 0
	};
}

function mergeTilesLeft(grid: Grid): { grid: Grid; score: number } {
	const newGrid: Grid = [];
	let score = 0;
	for (const row of grid) {
		const tiles = row.filter(notEmpty);

		if (tiles.length === 1) {
			newGrid.push(padTiles([tiles[0]], grid.length));
			continue;
		}

		const newTiles: GridTile[] = [];

		for (let i = 0; i < tiles.length; i++) {
			if (i === tiles.length - 1) {
				newTiles.push(tiles[i]);
				continue;
			}

			if (tiles[i].value === tiles[i + 1].value) {
				newTiles.push({ id: newId(), value: tiles[i].value * 2 });
				score += tiles[i].value * 2;
				i++; // Skip next tile
			} else {
				newTiles.push(tiles[i]);
			}
		}

		// let i = 0;
		// while (i < tiles.length - 1) {
		// 	if (tiles[i].value === tiles[i + 1].value) {
		// 		newTiles.push({ id: newId(), value: tiles[i].value * 2 });
		// 		score += tiles[i].value * 2;
		// 		i++; // Skip next tile
		// 	} else {
		// 		newTiles.push(tiles[i]);
		// 	}
		// 	i++;
		// }

		newGrid.push(padTiles(newTiles, grid.length));
	}

	// printGrid(newGrid);
	return {
		grid: newGrid,
		score
	};
}

export function nextUpState(game: Game): Game {
	const { grid, score } = mergeTilesLeft(rotateGridLeft(game.grid));
	const newGrid = rotateGridRight(grid);
	return {
		...game,
		score: game.score + score,
		grid: newGrid
	};
}

export function nextDownState(game: Game): Game {
	const { grid, score } = mergeTilesLeft(rotateGridRight(game.grid));
	const newGrid = rotateGridLeft(grid);
	return {
		...game,
		score: game.score + score,
		grid: newGrid
	};
}

export function nextLeftState(game: Game): Game {
	const { grid, score } = mergeTilesLeft(game.grid);
	return {
		...game,
		score: game.score + score,
		grid
	};
}

export function nextRightState(game: Game): Game {
	const { grid, score } = mergeTilesLeft(flipGrid(game.grid));
	return {
		...game,
		score: game.score + score,
		grid: flipGrid(grid)
	};
}

export function isTileEqual(t1: GridTile | null, t2: GridTile | null) {
	if (t1 === t2) return true; // check if both null
	if (t1 === null || t2 === null) return false;
	return t1.value === t2.value && t1.id === t2.id;
}

function isGridEqual(g1: Grid, g2: Grid) {
	if (g1.length !== g2.length) return false;
	for (let i = 0; i < g1.length; i++) {
		if (g1[i].length !== g2[i].length) return false;
		for (let j = 0; j < g1.length; j++) {
			if (isTileEqual(g1[i][j], g2[i][j])) {
				return false;
			}
		}
	}
	return true;
}

export function isGameEqual(g1: Game, g2: Game) {
	return isGridEqual(g1.grid, g2.grid) && g1.score === g2.score && g1.state === g2.state;
}

export function isGameOver(state: Game) {
	const nextStates = [
		nextUpState(state),
		nextLeftState(state),
		nextRightState(state),
		nextRightState(state)
	];
	return nextStates.every((nextState) => isGameEqual(state, nextState));
}

export function isVictory({ grid }: Game) {
	for (let i = 0; i < grid.length; i++) {
		for (let j = 0; j < grid.length; j++) {
			if (grid[i][j]?.value === 2048) {
				return true;
			}
		}
	}
	return false;
}

export function getGameState(game: Game) {
	return isGameOver(game) ? GameState.Loss : isVictory(game) ? GameState.Win : GameState.Playing;
}

export function updateState(game: Game) {
	return { ...game, state: getGameState(game) };
}

export function insertRandomTile(grid: Grid): Grid {
	const filledPositions = grid.map((row) => row.map((item) => !!item));
	const possible = filledPositions.flatMap((xs, y) =>
		xs.map((isFilled, x) => (isFilled ? undefined : { x, y })).filter(isPosition)
	);

	if (!possible.length) return grid;

	const insertTo = possible[getRandomInt(possible.length)];
	const newGrid = cloneGrid(grid);
	newGrid[insertTo.y][insertTo.x] = { id: newId(), value: twoOrFour() };
	return newGrid;
}

function rotateGridRight(grid: Grid): Grid {
	return grid[0].map((_, index) => grid.map((row) => row[index]).reverse());
}

function rotateGridLeft(grid: Grid): Grid {
	return grid[0].map((_, c) => grid.map((_, r) => grid[r][c])).reverse();
}

function flipGrid(grid: Grid): Grid {
	return rotateGridRight(rotateGridRight(grid));
}

function cloneGrid(grid: Grid) {
	return grid.map((row) => [...row]);
}

function newGrid(size: number): Grid {
	return [...new Array(size)].map(() => new Array(size).fill(null));
}

export function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
	return value !== null && value !== undefined;
}

function padTiles(tiles: GridRow, length: number) {
	const padded = [...tiles];
	for (let i = 0; i < length - tiles.length; i++) {
		padded.push(null);
	}
	return padded;
}

export function printGrid(grid: Grid) {
	for (const row of grid) {
		console.log(row.map((item) => item?.value ?? null));
	}
}
