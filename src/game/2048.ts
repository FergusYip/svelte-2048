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

export type Tile = {
	id: number;
	value: number;
	position: Position;
};

export type Game = {
	state: GameState;
	tiles: Tile[];
	score: number;
};

const BOARD_SIZE = 4;

const getRandomInt = (max: number) => Math.floor(Math.random() * Math.ceil(max));
const newId = () => getRandomInt(10 ** 10);
const twoOrFour = () => ((getRandomInt(10) % 2) + 1) * 2;

function getRandomEmptyPosition(existing: { position: Position }[]): Position | undefined {
	let pos: Position = { x: getRandomInt(BOARD_SIZE), y: getRandomInt(BOARD_SIZE) };
	if (existing.length === BOARD_SIZE ** 2) return undefined;
	while (existing.find(({ position: p }) => p.x === pos.x && p.y === pos.y)) {
		pos = { x: getRandomInt(BOARD_SIZE), y: getRandomInt(BOARD_SIZE) };
	}
	return pos;
}
export function newGame(): Game {
	return {
		state: GameState.Playing,
		tiles: [],
		score: 0
	};
}
