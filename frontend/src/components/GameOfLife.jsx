import React, {useState, useEffect, useRef} from "react";

const GameOfLife = () => {
	// Get container dimensions
	const containerRef = useRef(null);
	const [dimensions, setDimensions] = useState({width: 0, height: 0});
	const [isLoading, setIsLoading] = useState(true);

	const CELL_SIZE = 30;
	const [gridWidth, setGridWidth] = useState(0);
	const [gridHeight, setGridHeight] = useState(0);
	const UPDATE_INTERVAL = 250; // milliseconds

	// Create initial empty grid
	const createEmptyGrid = () => {
		return Array(gridHeight)
			.fill()
			.map(() => Array(gridWidth).fill(false));
	};

	// Create random grid with ~25% of cells alive
	const createRandomGrid = () => {
		if (gridWidth === 0 || gridHeight === 0) return [[]];
		return Array(gridHeight)
			.fill()
			.map(() =>
				Array(gridWidth)
					.fill()
					.map(() => Math.random() < 0.25)
			);
	};

	const [grid, setGrid] = useState([[]]);
	const runningRef = useRef(true);
	const runSimulation = useRef(null);

	// Update grid dimensions when container size changes
	useEffect(() => {
		if (!containerRef.current) return;

		const updateDimensions = () => {
			if (containerRef.current) {
				const {width, height} =
					containerRef.current.getBoundingClientRect();
				setDimensions({width, height});

				const newGridWidth = Math.floor(width / CELL_SIZE) + 2;
				const newGridHeight = Math.floor(height / CELL_SIZE) + 1;

				if (
					newGridWidth !== gridWidth ||
					newGridHeight !== gridHeight
				) {
					setGridWidth(newGridWidth);
					setGridHeight(newGridHeight);
				}
			}
		};

		updateDimensions();

		const resizeObserver = new ResizeObserver(updateDimensions);
		resizeObserver.observe(containerRef.current);

		return () => {
			if (containerRef.current) {
				resizeObserver.unobserve(containerRef.current);
			}
		};
	}, [containerRef]);

	// Update grid when dimensions change
	useEffect(() => {
		if (gridWidth > 0 && gridHeight > 0) {
			setGrid(createRandomGrid());
		}
	}, [gridWidth, gridHeight]);

	// The core Game of Life algorithm
	const computeNextGeneration = () => {
		if (gridWidth === 0 || gridHeight === 0) return;

		setGrid((currentGrid) => {
			const nextGrid = createEmptyGrid();

			for (let i = 0; i < gridHeight; i++) {
				for (let j = 0; j < gridWidth; j++) {
					// Count live neighbors
					let neighbors = 0;

					// Check all 8 neighbors
					for (let di = -1; di <= 1; di++) {
						for (let dj = -1; dj <= 1; dj++) {
							if (di === 0 && dj === 0) continue; // Skip self

							const ni = i + di;
							const nj = j + dj;

							// Handle edge cases with wraparound
							const neighborI = (ni + gridHeight) % gridHeight;
							const neighborJ = (nj + gridWidth) % gridWidth;

							if (
								currentGrid[neighborI] &&
								currentGrid[neighborI][neighborJ]
							) {
								neighbors += 1;
							}
						}
					}

					// Apply Game of Life rules
					if (currentGrid[i] && currentGrid[i][j]) {
						// Living cell survives if it has 2 or 3 neighbors
						nextGrid[i][j] = neighbors === 2 || neighbors === 3;
					} else {
						// Dead cell becomes alive if it has exactly 3 neighbors
						nextGrid[i][j] = neighbors === 3;
					}
				}
			}

			return nextGrid;
		});
	};

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsLoading(false);
		}, 800);

		return () => clearTimeout(timer);
	}, []);

	// Run simulation
	useEffect(() => {
		runSimulation.current = setInterval(() => {
			if (runningRef.current) {
				computeNextGeneration();
			}
		}, UPDATE_INTERVAL);

		// Cleanup function (for unmounting)
		return () => {
			clearInterval(runSimulation.current);
		};
	}, [gridWidth, gridHeight]);

	return (
		<div
			className={`flex flex-col items-center w-full h-full ${
				isLoading ? "" : "blur-md dark:blur-md"
			}  
				blur-3xl transition-filter duration-5000 dark:brightness-50`}>
			<div
				ref={containerRef}
				className="flex-1 w-full overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-900 dark:border-gray-700">
				<div
					className="grid"
					style={{
						gridTemplateColumns: `repeat(${gridWidth}, ${CELL_SIZE}px)`,
						gridTemplateRows: `repeat(${gridHeight}, ${CELL_SIZE}px)`,
					}}>
					{grid.map((rows, i) =>
						rows.map((cell, j) => (
							<div
								key={`${i}-${j}`}
								className={`transition-colors duration-500 ${
									cell
										? "bg-blue-600 dark:bg-blue-500"
										: "bg-gray-100 dark:bg-gray-800"
								}`}
								style={{width: CELL_SIZE, height: CELL_SIZE}}
							/>
						))
					)}
				</div>
			</div>
		</div>
	);
};

export default GameOfLife;
