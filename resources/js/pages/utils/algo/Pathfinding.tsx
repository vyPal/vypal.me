import UtilitiesLayout from '@/layouts/UtilitiesLayout';
import { Head } from '@inertiajs/react';
import { useCallback, useEffect, useRef, useState } from 'react';

// Node types for grid
type NodeType = 'empty' | 'wall' | 'start' | 'end' | 'visited' | 'path' | 'visiting';

// Node interface
interface Node {
    row: number;
    col: number;
    type: NodeType;
    isVisited: boolean;
    distance: number;
    previousNode: Node | null;
    isWall: boolean;
    f?: number; // f = g + h (for A*)
    g?: number; // cost from start to current node (for A*)
    h?: number; // heuristic cost from current to end (for A*)
}

// Algorithm types
type AlgorithmName = 'dijkstra' | 'astar' | 'bfs' | 'dfs';

// Animation speeds
type Speed = 'slow' | 'medium' | 'fast';
const speedValues = {
    slow: 150,
    medium: 50,
    fast: 10,
};

// Grid sizes
type GridSize = 'small' | 'medium' | 'large';
const gridSizes = {
    small: { rows: 15, cols: 30 },
    medium: { rows: 20, cols: 40 },
    large: { rows: 25, cols: 50 },
};

export default function PathfindingVisualizer() {
    // State variables
    const [grid, setGrid] = useState<Node[][]>([]);
    const [gridSize, setGridSize] = useState<GridSize>('medium');
    const [mouseIsPressed, setMouseIsPressed] = useState(false);
    const [selectedAlgorithm, setSelectedAlgorithm] = useState<AlgorithmName>('dijkstra');
    const [isPathfinding, setIsPathfinding] = useState(false);
    const [speed, setSpeed] = useState<Speed>('medium');
    const [currentTool, setCurrentTool] = useState<'wall' | 'start' | 'end'>('wall');
    const [startNode, setStartNode] = useState<{ row: number; col: number } | null>(null);
    const [endNode, setEndNode] = useState<{ row: number; col: number } | null>(null);
    const [nodesVisited, setNodesVisited] = useState(0);
    const [pathLength, setPathLength] = useState(0);
    const [currentStep, setCurrentStep] = useState<string | null>(null);
    const [mazeDensity, setMazeDensity] = useState<'low' | 'medium' | 'high'>('medium');

    // Animation timeouts reference for cleanup
    const animationTimeoutsRef = useRef<number[]>([]);

    // Clear all animation timeouts
    const clearTimeouts = () => {
        animationTimeoutsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
        animationTimeoutsRef.current = [];
    };

    // Initialize grid
    const initializeGrid = useCallback(() => {
        const { rows, cols } = gridSizes[gridSize];
        const newGrid: Node[][] = [];

        for (let row = 0; row < rows; row++) {
            const currentRow: Node[] = [];
            for (let col = 0; col < cols; col++) {
                currentRow.push(createNode(row, col));
            }
            newGrid.push(currentRow);
        }

        // Default start and end positions
        const startRow = Math.floor(rows / 2);
        const startCol = Math.floor(cols / 4);
        const endRow = Math.floor(rows / 2);
        const endCol = Math.floor((cols / 4) * 3);

        newGrid[startRow][startCol].type = 'start';
        newGrid[endRow][endCol].type = 'end';

        setStartNode({ row: startRow, col: startCol });
        setEndNode({ row: endRow, col: endCol });

        setGrid(newGrid);
        setNodesVisited(0);
        setPathLength(0);
        setCurrentStep(null);
    }, [gridSize]);

    // Create a node object
    const createNode = (row: number, col: number): Node => {
        return {
            row,
            col,
            type: 'empty',
            isVisited: false,
            distance: Infinity,
            previousNode: null,
            isWall: false,
        };
    };

    // Initialize on component mount and when grid size changes
    useEffect(() => {
        clearTimeouts();
        initializeGrid();

        return () => {
            clearTimeouts();
        };
    }, [initializeGrid, gridSize]);

    // Handle mouse down on a node
    const handleMouseDown = (row: number, col: number) => {
        if (isPathfinding) return;

        const newGrid = [...grid];
        const node = newGrid[row][col];

        // If selecting start or end node
        if (currentTool === 'start') {
            // Clear previous start node
            if (startNode) {
                newGrid[startNode.row][startNode.col].type = 'empty';
            }
            node.type = 'start';
            setStartNode({ row, col });
        } else if (currentTool === 'end') {
            // Clear previous end node
            if (endNode) {
                newGrid[endNode.row][endNode.col].type = 'empty';
            }
            node.type = 'end';
            setEndNode({ row, col });
        } else if (node.type !== 'start' && node.type !== 'end') {
            // Toggle wall
            node.isWall = !node.isWall;
            node.type = node.isWall ? 'wall' : 'empty';
        }

        setGrid(newGrid);
        setMouseIsPressed(true);
    };

    // Handle mouse enter (for drag operations)
    const handleMouseEnter = (row: number, col: number) => {
        if (!mouseIsPressed || isPathfinding) return;

        const newGrid = [...grid];
        const node = newGrid[row][col];

        // Only update if we're using the wall tool and not hovering over start/end
        if (currentTool === 'wall' && node.type !== 'start' && node.type !== 'end') {
            node.isWall = !node.isWall;
            node.type = node.isWall ? 'wall' : 'empty';
            setGrid(newGrid);
        }
    };

    // Handle mouse up
    const handleMouseUp = () => {
        setMouseIsPressed(false);
    };

    // Reset board but keep walls
    const resetBoard = () => {
        if (isPathfinding) return;

        clearTimeouts();
        const newGrid = grid.map((row) =>
            row.map((node) => {
                return {
                    ...node,
                    isVisited: false,
                    distance: Infinity,
                    previousNode: null,
                    type: node.isWall ? ('wall' as NodeType) : node.type === 'start' ? 'start' : node.type === 'end' ? 'end' : 'empty',
                    f: Infinity,
                    g: Infinity,
                    h: Infinity,
                };
            }),
        );

        setGrid(newGrid);
        setNodesVisited(0);
        setPathLength(0);
        setCurrentStep(null);
    };

    // Clear the entire board
    const clearBoard = () => {
        if (isPathfinding) return;

        clearTimeouts();
        initializeGrid();
    };

    // Generate random maze
    const generateRandomMaze = () => {
        if (isPathfinding) return;

        clearTimeouts();
        const newGrid = grid.map((row) =>
            row.map((node) => {
                const newNode = {
                    ...node,
                    isVisited: false,
                    distance: Infinity,
                    previousNode: null,
                    isWall: false,
                    type: node.type === 'start' ? ('start' as NodeType) : node.type === 'end' ? 'end' : 'empty',
                };

                // Define wall density
                const densityMap = {
                    low: 0.2,
                    medium: 0.3,
                    high: 0.4,
                };

                // Set random walls based on density
                if (newNode.type !== 'start' && newNode.type !== 'end' && Math.random() < densityMap[mazeDensity]) {
                    newNode.isWall = true;
                    newNode.type = 'wall';
                }

                return newNode;
            }),
        );

        setGrid(newGrid);
        setNodesVisited(0);
        setPathLength(0);
        setCurrentStep(null);
    };

    // Generate maze with recursive division
    const generateMaze = () => {
        if (isPathfinding) return;

        clearTimeouts();
        // Start with a clear grid
        const newGrid = grid.map((row) =>
            row.map((node) => {
                return {
                    ...node,
                    isVisited: false,
                    distance: Infinity,
                    previousNode: null,
                    isWall: false,
                    type: node.type === 'start' ? ('start' as NodeType) : node.type === 'end' ? 'end' : 'empty',
                };
            }),
        );

        // Add wall border
        const { rows, cols } = gridSizes[gridSize];
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if (i === 0 || j === 0 || i === rows - 1 || j === cols - 1) {
                    if (newGrid[i][j].type !== 'start' && newGrid[i][j].type !== 'end') {
                        newGrid[i][j].isWall = true;
                        newGrid[i][j].type = 'wall';
                    }
                }
            }
        }

        // Recursive division function (simplified for this example)
        const recursiveDivision = (
            grid: Node[][],
            rowStart: number,
            rowEnd: number,
            colStart: number,
            colEnd: number,
            orientation: 'horizontal' | 'vertical',
        ) => {
            if (rowEnd - rowStart < 2 || colEnd - colStart < 2) {
                return;
            }

            if (orientation === 'horizontal') {
                // Find a random row to put a wall on
                const rowWall = Math.floor(Math.random() * (rowEnd - rowStart - 1)) + rowStart + 1;
                // Find a random column to put a passage through
                const colPassage = Math.floor(Math.random() * (colEnd - colStart)) + colStart;

                // Build the wall
                for (let col = colStart; col <= colEnd; col++) {
                    if (col !== colPassage && grid[rowWall][col].type !== 'start' && grid[rowWall][col].type !== 'end') {
                        grid[rowWall][col].isWall = true;
                        grid[rowWall][col].type = 'wall';
                    }
                }

                // Recursively divide the top and bottom parts
                recursiveDivision(grid, rowStart, rowWall - 1, colStart, colEnd, chooseOrientation(rowWall - 1 - rowStart, colEnd - colStart));
                recursiveDivision(grid, rowWall + 1, rowEnd, colStart, colEnd, chooseOrientation(rowEnd - (rowWall + 1), colEnd - colStart));
            } else {
                // Find a random column to put a wall on
                const colWall = Math.floor(Math.random() * (colEnd - colStart - 1)) + colStart + 1;
                // Find a random row to put a passage through
                const rowPassage = Math.floor(Math.random() * (rowEnd - rowStart)) + rowStart;

                // Build the wall
                for (let row = rowStart; row <= rowEnd; row++) {
                    if (row !== rowPassage && grid[row][colWall].type !== 'start' && grid[row][colWall].type !== 'end') {
                        grid[row][colWall].isWall = true;
                        grid[row][colWall].type = 'wall';
                    }
                }

                // Recursively divide the left and right parts
                recursiveDivision(grid, rowStart, rowEnd, colStart, colWall - 1, chooseOrientation(rowEnd - rowStart, colWall - 1 - colStart));
                recursiveDivision(grid, rowStart, rowEnd, colWall + 1, colEnd, chooseOrientation(rowEnd - rowStart, colEnd - (colWall + 1)));
            }
        };

        // Choose orientation based on the shape of the area
        const chooseOrientation = (width: number, height: number): 'horizontal' | 'vertical' => {
            if (width < height) {
                return 'horizontal';
            } else if (height < width) {
                return 'vertical';
            } else {
                return Math.random() < 0.5 ? 'horizontal' : 'vertical';
            }
        };

        // Apply recursive division to the grid (excluding the border)
        recursiveDivision(newGrid, 1, rows - 2, 1, cols - 2, chooseOrientation(cols - 2, rows - 2));

        setGrid(newGrid);
        setNodesVisited(0);
        setPathLength(0);
        setCurrentStep(null);
    };

    // Helper function to get neighbors of a node
    const getNeighbors = (node: Node, grid: Node[][]) => {
        const { row, col } = node;
        const neighbors: Node[] = [];
        const { rows, cols } = gridSizes[gridSize];

        // Check up, right, down, left neighbors
        if (row > 0) neighbors.push(grid[row - 1][col]);
        if (col < cols - 1) neighbors.push(grid[row][col + 1]);
        if (row < rows - 1) neighbors.push(grid[row + 1][col]);
        if (col > 0) neighbors.push(grid[row][col - 1]);

        return neighbors.filter((neighbor) => !neighbor.isVisited && !neighbor.isWall);
    };

    // Calculate Manhattan distance (for A*)
    const calculateManhattanDistance = (row1: number, col1: number, row2: number, col2: number) => {
        return Math.abs(row1 - row2) + Math.abs(col1 - col2);
    };

    // Animate visited nodes and shortest path
    const animateAlgorithm = (visitedNodesInOrder: Node[], nodesInShortestPathOrder: Node[]) => {
        const animationSpeed = speedValues[speed];

        for (let i = 0; i <= visitedNodesInOrder.length; i++) {
            if (i === visitedNodesInOrder.length) {
                // After all nodes are visited, animate the shortest path
                const timeoutId = window.setTimeout(() => {
                    animateShortestPath(nodesInShortestPathOrder);
                }, animationSpeed * i);
                animationTimeoutsRef.current.push(timeoutId);
            } else {
                const timeoutId = window.setTimeout(() => {
                    const node = visitedNodesInOrder[i];
                    // Skip start and end nodes in the animation
                    if (node.type !== 'start' && node.type !== 'end') {
                        const newGrid = [...grid];
                        newGrid[node.row][node.col].type = 'visiting';
                        setGrid([...newGrid]);

                        // Change to visited after a brief pause
                        const visitedTimeoutId = window.setTimeout(() => {
                            const updatedGrid = [...newGrid];
                            updatedGrid[node.row][node.col].type = 'visited';
                            setGrid([...updatedGrid]);
                        }, animationSpeed / 2);
                        animationTimeoutsRef.current.push(visitedTimeoutId);
                    }

                    setNodesVisited(i + 1);
                    setCurrentStep(`Visiting node at (${node.row}, ${node.col})`);
                }, animationSpeed * i);
                animationTimeoutsRef.current.push(timeoutId);
            }
        }
    };

    // Animate the shortest path
    const animateShortestPath = (nodesInShortestPathOrder: Node[]) => {
        const animationSpeed = speedValues[speed] * 2; // Slower animation for path

        for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
            const timeoutId = window.setTimeout(() => {
                const node = nodesInShortestPathOrder[i];
                // Skip start and end nodes
                if (node.type !== 'start' && node.type !== 'end') {
                    const newGrid = [...grid];
                    newGrid[node.row][node.col].type = 'path';
                    setGrid([...newGrid]);
                }

                setPathLength(i + 1);
                setCurrentStep(`Building path: step ${i + 1}`);

                // When animation is complete
                if (i === nodesInShortestPathOrder.length - 1) {
                    setIsPathfinding(false);
                    setCurrentStep(`Path found! Length: ${nodesInShortestPathOrder.length}, Nodes visited: ${nodesVisited}`);
                }
            }, animationSpeed * i);
            animationTimeoutsRef.current.push(timeoutId);
        }

        // If no path is found
        if (nodesInShortestPathOrder.length === 0) {
            const timeoutId = window.setTimeout(() => {
                setIsPathfinding(false);
                setCurrentStep('No path found!');
            }, animationSpeed);
            animationTimeoutsRef.current.push(timeoutId);
        }
    };

    // Get nodes in shortest path order
    const getNodesInShortestPathOrder = (finishNode: Node) => {
        const nodesInShortestPathOrder = [];
        let currentNode: Node | null = finishNode;

        // Start node doesn't have a previous node
        while (currentNode !== null && currentNode.type !== 'start') {
            nodesInShortestPathOrder.unshift(currentNode);
            currentNode = currentNode.previousNode;
        }

        return nodesInShortestPathOrder;
    };

    // Dijkstra's Algorithm
    const dijkstra = () => {
        if (!startNode || !endNode) return { visitedNodesInOrder: [], nodesInShortestPathOrder: [] };

        const visitedNodesInOrder: Node[] = [];
        const startNodeObj = grid[startNode.row][startNode.col];
        const finishNodeObj = grid[endNode.row][endNode.col];

        // Initialize
        startNodeObj.distance = 0;
        const unvisitedNodes = getAllNodes(grid);

        // Main loop
        while (unvisitedNodes.length) {
            // Sort by distance
            sortNodesByDistance(unvisitedNodes);

            // Get the closest node
            const closestNode = unvisitedNodes.shift();
            if (!closestNode) break;

            // If we encounter a wall, skip it
            if (closestNode.isWall) continue;

            // If we can't reach the node, we're trapped
            if (closestNode.distance === Infinity) return { visitedNodesInOrder, nodesInShortestPathOrder: [] };

            // Mark as visited
            closestNode.isVisited = true;
            visitedNodesInOrder.push(closestNode);

            // If we reached the end node
            if (closestNode === finishNodeObj) {
                const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNodeObj);
                return { visitedNodesInOrder, nodesInShortestPathOrder };
            }

            // Update all neighbors
            updateUnvisitedNeighbors(closestNode, grid);
        }

        // If we got here, no path was found
        return { visitedNodesInOrder, nodesInShortestPathOrder: [] };
    };

    // A* Search Algorithm
    const astar = () => {
        if (!startNode || !endNode) return { visitedNodesInOrder: [], nodesInShortestPathOrder: [] };

        const visitedNodesInOrder: Node[] = [];
        const startNodeObj = grid[startNode.row][startNode.col];
        const finishNodeObj = grid[endNode.row][endNode.col];

        // Initialize
        startNodeObj.distance = 0;
        startNodeObj.g = 0;
        startNodeObj.h = calculateManhattanDistance(startNodeObj.row, startNodeObj.col, finishNodeObj.row, finishNodeObj.col);
        startNodeObj.f = startNodeObj.g + startNodeObj.h;

        const openSet: Node[] = [startNodeObj];
        const closedSet: Node[] = [];

        // Main loop
        while (openSet.length > 0) {
            // Sort by f value (g + h)
            sortNodesByF(openSet);

            // Get the node with the lowest f value
            const currentNode = openSet.shift();
            if (!currentNode) break;

            // If we hit a wall, skip
            if (currentNode.isWall) continue;

            // Add to visited nodes
            currentNode.isVisited = true;
            visitedNodesInOrder.push(currentNode);
            closedSet.push(currentNode);

            // If we reached the end node
            if (currentNode === finishNodeObj) {
                const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNodeObj);
                return { visitedNodesInOrder, nodesInShortestPathOrder };
            }

            // Check all neighbors
            const neighbors = getNeighbors(currentNode, grid);
            for (const neighbor of neighbors) {
                // Skip if in closed set
                if (closedSet.includes(neighbor)) continue;

                // Calculate tentative g score
                const tentativeG = (currentNode.g || 0) + 1;

                // If this path is better than any previous one
                if (!openSet.includes(neighbor) || tentativeG < (neighbor.g || Infinity)) {
                    neighbor.previousNode = currentNode;
                    neighbor.g = tentativeG;
                    neighbor.h = calculateManhattanDistance(neighbor.row, neighbor.col, finishNodeObj.row, finishNodeObj.col);
                    neighbor.f = neighbor.g + neighbor.h;

                    if (!openSet.includes(neighbor)) {
                        openSet.push(neighbor);
                    }
                }
            }
        }

        // If we got here, no path was found
        return { visitedNodesInOrder, nodesInShortestPathOrder: [] };
    };

    // Breadth-First Search
    const bfs = () => {
        if (!startNode || !endNode) return { visitedNodesInOrder: [], nodesInShortestPathOrder: [] };

        const visitedNodesInOrder: Node[] = [];
        const startNodeObj = grid[startNode.row][startNode.col];
        const finishNodeObj = grid[endNode.row][endNode.col];

        // Initialize
        startNodeObj.distance = 0;
        startNodeObj.isVisited = true;
        visitedNodesInOrder.push(startNodeObj);

        const queue: Node[] = [startNodeObj];

        // Main loop
        while (queue.length) {
            const currentNode = queue.shift();
            if (!currentNode) break;

            // If we hit a wall, skip
            if (currentNode.isWall) continue;

            // If we reached the end node
            if (currentNode === finishNodeObj) {
                const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNodeObj);
                return { visitedNodesInOrder, nodesInShortestPathOrder };
            }

            // Check all neighbors
            const neighbors = getNeighbors(currentNode, grid);
            for (const neighbor of neighbors) {
                neighbor.isVisited = true;
                neighbor.previousNode = currentNode;
                visitedNodesInOrder.push(neighbor);
                queue.push(neighbor);
            }
        }

        // If we got here, no path was found
        return { visitedNodesInOrder, nodesInShortestPathOrder: [] };
    };

    // Depth-First Search
    const dfs = () => {
        if (!startNode || !endNode) return { visitedNodesInOrder: [], nodesInShortestPathOrder: [] };

        const visitedNodesInOrder: Node[] = [];
        const startNodeObj = grid[startNode.row][startNode.col];
        const finishNodeObj = grid[endNode.row][endNode.col];

        // DFS helper function
        const dfsRecursive = (currentNode: Node, visited: Set<string>): boolean => {
            // If we reached the target
            if (currentNode === finishNodeObj) return true;

            // Mark as visited
            const key = `${currentNode.row}-${currentNode.col}`;
            visited.add(key);
            currentNode.isVisited = true;
            visitedNodesInOrder.push(currentNode);

            // Check all neighbors
            const neighbors = getNeighbors(currentNode, grid);
            for (const neighbor of neighbors) {
                const neighborKey = `${neighbor.row}-${neighbor.col}`;
                if (!visited.has(neighborKey)) {
                    neighbor.previousNode = currentNode;
                    // If we found the target from this neighbor
                    if (dfsRecursive(neighbor, visited)) return true;
                }
            }

            return false;
        };

        // Start DFS
        const visited = new Set<string>();
        const found = dfsRecursive(startNodeObj, visited);

        const nodesInShortestPathOrder = found ? getNodesInShortestPathOrder(finishNodeObj) : [];
        return { visitedNodesInOrder, nodesInShortestPathOrder };
    };

    // Get all nodes from the grid
    const getAllNodes = (grid: Node[][]) => {
        const nodes: Node[] = [];
        for (const row of grid) {
            for (const node of row) {
                nodes.push(node);
            }
        }
        return nodes;
    };

    // Sort nodes by distance (for Dijkstra)
    const sortNodesByDistance = (nodes: Node[]) => {
        nodes.sort((a, b) => a.distance - b.distance);
    };

    // Sort nodes by f value (for A*)
    const sortNodesByF = (nodes: Node[]) => {
        nodes.sort((a, b) => (a.f || 0) - (b.f || 0));
    };

    // Update unvisited neighbors (for Dijkstra)
    const updateUnvisitedNeighbors = (node: Node, grid: Node[][]) => {
        const neighbors = getNeighbors(node, grid);
        for (const neighbor of neighbors) {
            neighbor.distance = node.distance + 1;
            neighbor.previousNode = node;
        }
    };

    // Start pathfinding
    const visualizeAlgorithm = () => {
        if (isPathfinding || !startNode || !endNode) return;

        // Reset the grid but keep walls, start, and end
        resetBoard();
        setIsPathfinding(true);

        setTimeout(() => {
            let result;

            switch (selectedAlgorithm) {
                case 'dijkstra':
                    result = dijkstra();
                    break;
                case 'astar':
                    result = astar();
                    break;
                case 'bfs':
                    result = bfs();
                    break;
                case 'dfs':
                    result = dfs();
                    break;
                default:
                    result = { visitedNodesInOrder: [], nodesInShortestPathOrder: [] };
            }

            const { visitedNodesInOrder, nodesInShortestPathOrder } = result;
            animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder);
        }, 100);
    };

    // Algorithm information
    const algorithmInfo = {
        dijkstra: {
            title: "Dijkstra's Algorithm",
            description:
                'A weighted algorithm that guarantees the shortest path. It works by visiting nodes in order of increasing distance from the start node.',
            timeComplexity: 'O((V + E) log V)',
            spaceComplexity: 'O(V)',
            guaranteedShortest: true,
            weightedAlgorithm: true,
        },
        astar: {
            title: 'A* Search',
            description:
                'A heuristic-based algorithm that uses a best-first search approach. It uses both the cost to reach a node and the estimated cost to the goal.',
            timeComplexity: 'O(E)',
            spaceComplexity: 'O(V)',
            guaranteedShortest: true,
            weightedAlgorithm: true,
        },
        bfs: {
            title: 'Breadth-First Search',
            description:
                'An unweighted algorithm that explores all neighbor nodes at the present depth before moving to nodes at the next depth level.',
            timeComplexity: 'O(V + E)',
            spaceComplexity: 'O(V)',
            guaranteedShortest: true,
            weightedAlgorithm: false,
        },
        dfs: {
            title: 'Depth-First Search',
            description:
                'An unweighted algorithm that explores as far as possible along each branch before backtracking. Does not guarantee the shortest path.',
            timeComplexity: 'O(V + E)',
            spaceComplexity: 'O(V)',
            guaranteedShortest: false,
            weightedAlgorithm: false,
        },
    };

    // Calculate cell size based on grid dimensions
    const calculateCellSize = () => {
        const { cols } = gridSizes[gridSize];
        // Ensuring cells are square but fit properly in the container
        const maxWidth = Math.min(30, Math.floor(600 / cols)); // 600px is approximate container width
        return maxWidth;
    };

    return (
        <UtilitiesLayout currentUtility="Algorithm Visualizer">
            <Head title="Pathfinding Algorithm Visualizer | Developer Utilities" />

            <div className="mx-auto max-w-7xl">
                <h1 className="mb-6 text-3xl font-bold">Pathfinding Algorithm Visualizer</h1>
                <p className="mb-8 text-lg text-[#706f6c] dark:text-[#A1A09A]">
                    Visualize how different pathfinding algorithms find routes through a maze.
                </p>
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Main visualization area */}
                    <div className="lg:col-span-2">
                        <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-[#5E4290]/20 dark:bg-[#161615]">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-xl font-semibold">Grid Visualization</h2>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={resetBoard}
                                        disabled={isPathfinding}
                                        className={`rounded-md border px-3 py-1.5 text-sm font-medium ${
                                            isPathfinding
                                                ? 'cursor-not-allowed opacity-50'
                                                : 'border-[#8847BB] text-[#8847BB] hover:bg-[#8847BB]/10 dark:border-[#F9BAEE] dark:text-[#F9BAEE] dark:hover:bg-[#F9BAEE]/10'
                                        }`}
                                    >
                                        Reset
                                    </button>
                                    <button
                                        onClick={clearBoard}
                                        disabled={isPathfinding}
                                        className={`rounded-md border px-3 py-1.5 text-sm font-medium ${
                                            isPathfinding
                                                ? 'cursor-not-allowed opacity-50'
                                                : 'border-[#8847BB] text-[#8847BB] hover:bg-[#8847BB]/10 dark:border-[#F9BAEE] dark:text-[#F9BAEE] dark:hover:bg-[#F9BAEE]/10'
                                        }`}
                                    >
                                        Clear All
                                    </button>
                                    <button
                                        onClick={visualizeAlgorithm}
                                        disabled={isPathfinding}
                                        className={`rounded-md px-3 py-1.5 text-sm font-medium ${
                                            isPathfinding
                                                ? 'cursor-not-allowed bg-[#8847BB]/50 text-white'
                                                : 'bg-[#8847BB] text-white hover:bg-[#8847BB]/90 dark:bg-[#5E4290] dark:hover:bg-[#5E4290]/90'
                                        }`}
                                    >
                                        {isPathfinding ? 'Visualizing...' : 'Start Visualization'}
                                    </button>
                                </div>
                            </div>

                            {/* Algorithm Statistics */}
                            <div className="mb-4 grid grid-cols-3 gap-2">
                                <div className="rounded-md bg-[#8847BB]/10 p-2 text-center dark:bg-[#5E4290]/20">
                                    <div className="text-xs uppercase">Nodes Visited</div>
                                    <div className="font-mono text-lg font-semibold">{nodesVisited}</div>
                                </div>
                                <div className="rounded-md bg-[#8847BB]/10 p-2 text-center dark:bg-[#5E4290]/20">
                                    <div className="text-xs uppercase">Path Length</div>
                                    <div className="font-mono text-lg font-semibold">{pathLength}</div>
                                </div>
                                <div className="rounded-md bg-[#8847BB]/10 p-2 text-center dark:bg-[#5E4290]/20">
                                    <div className="text-xs uppercase">Grid Size</div>
                                    <div className="font-mono text-lg font-semibold">
                                        {gridSizes[gridSize].rows}×{gridSizes[gridSize].cols}
                                    </div>
                                </div>
                            </div>

                            {/* Current Step Display */}
                            <div className="mb-4 h-8 rounded-md bg-[#8847BB]/5 p-2 text-center text-sm dark:bg-[#5E4290]/10">
                                {currentStep || 'Select algorithm and click "Start Visualization"'}
                            </div>

                            {/* Tool Selection */}
                            <div className="mb-4 flex space-x-2">
                                <button
                                    onClick={() => setCurrentTool('wall')}
                                    className={`flex-1 rounded-md px-3 py-1 text-xs font-medium ${
                                        currentTool === 'wall'
                                            ? 'bg-[#8847BB] text-white dark:bg-[#5E4290]'
                                            : 'bg-[#8847BB]/10 text-[#8847BB] hover:bg-[#8847BB]/20 dark:bg-[#5E4290]/20 dark:text-[#F9BAEE] dark:hover:bg-[#5E4290]/30'
                                    }`}
                                    disabled={isPathfinding}
                                >
                                    <span className="flex items-center justify-center">
                                        <span className="mr-1 inline-block h-3 w-3 rounded-sm bg-[#333] dark:bg-[#555]"></span>
                                        Wall
                                    </span>
                                </button>
                                <button
                                    onClick={() => setCurrentTool('start')}
                                    className={`flex-1 rounded-md px-3 py-1 text-xs font-medium ${
                                        currentTool === 'start'
                                            ? 'bg-[#8847BB] text-white dark:bg-[#5E4290]'
                                            : 'bg-[#8847BB]/10 text-[#8847BB] hover:bg-[#8847BB]/20 dark:bg-[#5E4290]/20 dark:text-[#F9BAEE] dark:hover:bg-[#5E4290]/30'
                                    }`}
                                    disabled={isPathfinding}
                                >
                                    <span className="flex items-center justify-center">
                                        <span className="mr-1 inline-block h-3 w-3 rounded-sm bg-green-500"></span>
                                        Start
                                    </span>
                                </button>
                                <button
                                    onClick={() => setCurrentTool('end')}
                                    className={`flex-1 rounded-md px-3 py-1 text-xs font-medium ${
                                        currentTool === 'end'
                                            ? 'bg-[#8847BB] text-white dark:bg-[#5E4290]'
                                            : 'bg-[#8847BB]/10 text-[#8847BB] hover:bg-[#8847BB]/20 dark:bg-[#5E4290]/20 dark:text-[#F9BAEE] dark:hover:bg-[#5E4290]/30'
                                    }`}
                                    disabled={isPathfinding}
                                >
                                    <span className="flex items-center justify-center">
                                        <span className="mr-1 inline-block h-3 w-3 rounded-sm bg-red-500"></span>
                                        End
                                    </span>
                                </button>
                            </div>

                            {/* Grid */}
                            <div
                                className="grid-wrapper mb-4 overflow-auto rounded-md border shadow-inner dark:border-[#5E4290]/20"
                                style={{ maxHeight: '60vh' }}
                            >
                                <div
                                    className="grid"
                                    style={{
                                        display: 'grid',
                                        gridTemplateRows: `repeat(${gridSizes[gridSize].rows}, ${calculateCellSize()}px)`,
                                        gridTemplateColumns: `repeat(${gridSizes[gridSize].cols}, ${calculateCellSize()}px)`,
                                        gap: '1px',
                                        padding: '2px',
                                    }}
                                    onMouseLeave={handleMouseUp}
                                >
                                    {grid.map((row, rowIdx) =>
                                        row.map((node, colIdx) => {
                                            const { type, row, col } = node;

                                            let cellClass = '';

                                            switch (type) {
                                                case 'start':
                                                    cellClass = 'bg-green-500 hover:bg-green-600';
                                                    break;
                                                case 'end':
                                                    cellClass = 'bg-red-500 hover:bg-red-600';
                                                    break;
                                                case 'wall':
                                                    cellClass = 'bg-[#333] hover:bg-[#444] dark:bg-[#555] dark:hover:bg-[#666]';
                                                    break;
                                                case 'visited':
                                                    cellClass =
                                                        'bg-[#8847BB]/40 hover:bg-[#8847BB]/50 dark:bg-[#5E4290]/40 dark:hover:bg-[#5E4290]/50';
                                                    break;
                                                case 'visiting':
                                                    cellClass = 'bg-yellow-300 hover:bg-yellow-400 dark:bg-yellow-400 dark:hover:bg-yellow-500';
                                                    break;
                                                case 'path':
                                                    cellClass = 'bg-[#F9BAEE] hover:bg-[#F9BAEE]/80 dark:bg-[#F9BAEE] dark:hover:bg-[#F9BAEE]/80';
                                                    break;
                                                default:
                                                    cellClass = 'bg-white hover:bg-gray-100 dark:bg-[#1E1E1D] dark:hover:bg-[#2A2A29]';
                                            }

                                            return (
                                                <div
                                                    key={`${rowIdx}-${colIdx}`}
                                                    className={`node transition-colors duration-100 ${cellClass} border border-gray-100 dark:border-gray-800`}
                                                    style={{
                                                        width: `${calculateCellSize()}px`,
                                                        height: `${calculateCellSize()}px`,
                                                    }}
                                                    onMouseDown={() => handleMouseDown(row, col)}
                                                    onMouseEnter={() => handleMouseEnter(row, col)}
                                                    onMouseUp={handleMouseUp}
                                                ></div>
                                            );
                                        }),
                                    )}
                                </div>
                            </div>

                            {/* Legend */}
                            <div className="mt-4 flex flex-wrap gap-3 text-xs">
                                <div className="flex items-center">
                                    <div className="mr-1 h-3 w-3 rounded-sm bg-white dark:bg-[#1E1E1D]"></div>
                                    Unvisited
                                </div>
                                <div className="flex items-center">
                                    <div className="mr-1 h-3 w-3 rounded-sm bg-[#333] dark:bg-[#555]"></div>
                                    Wall
                                </div>
                                <div className="flex items-center">
                                    <div className="mr-1 h-3 w-3 rounded-sm bg-green-500"></div>
                                    Start
                                </div>
                                <div className="flex items-center">
                                    <div className="mr-1 h-3 w-3 rounded-sm bg-red-500"></div>
                                    End
                                </div>
                                <div className="flex items-center">
                                    <div className="mr-1 h-3 w-3 rounded-sm bg-yellow-300 dark:bg-yellow-400"></div>
                                    Visiting
                                </div>
                                <div className="flex items-center">
                                    <div className="mr-1 h-3 w-3 rounded-sm bg-[#8847BB]/40 dark:bg-[#5E4290]/40"></div>
                                    Visited
                                </div>
                                <div className="flex items-center">
                                    <div className="mr-1 h-3 w-3 rounded-sm bg-[#F9BAEE]"></div>
                                    Path
                                </div>
                            </div>
                        </div>

                        {/* Algorithm Description */}
                        <div className="mt-8 rounded-lg border bg-white p-6 shadow-sm dark:border-[#5E4290]/20 dark:bg-[#161615]">
                            <h2 className="mb-4 text-xl font-semibold">{algorithmInfo[selectedAlgorithm].title}</h2>

                            <p className="mb-4 text-[#706f6c] dark:text-[#A1A09A]">{algorithmInfo[selectedAlgorithm].description}</p>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <h3 className="mb-1 text-sm font-medium">Time Complexity</h3>
                                    <p className="font-mono text-[#8847BB] dark:text-[#F9BAEE]">{algorithmInfo[selectedAlgorithm].timeComplexity}</p>
                                </div>

                                <div>
                                    <h3 className="mb-1 text-sm font-medium">Space Complexity</h3>
                                    <p className="font-mono text-[#8847BB] dark:text-[#F9BAEE]">{algorithmInfo[selectedAlgorithm].spaceComplexity}</p>
                                </div>

                                <div>
                                    <h3 className="mb-1 text-sm font-medium">Shortest Path</h3>
                                    <p className={algorithmInfo[selectedAlgorithm].guaranteedShortest ? 'text-green-600' : 'text-red-600'}>
                                        {algorithmInfo[selectedAlgorithm].guaranteedShortest ? 'Guaranteed' : 'Not Guaranteed'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Controls Panel */}
                    <div>
                        <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-[#5E4290]/20 dark:bg-[#161615]">
                            <h2 className="mb-4 text-xl font-semibold">Controls</h2>

                            {/* Algorithm Selection */}
                            <div className="mb-6">
                                <label className="mb-2 block text-sm font-medium">Algorithm</label>
                                <div className="grid grid-cols-1 gap-2">
                                    {(['dijkstra', 'astar', 'bfs', 'dfs'] as AlgorithmName[]).map((algo) => (
                                        <button
                                            key={algo}
                                            onClick={() => setSelectedAlgorithm(algo)}
                                            disabled={isPathfinding}
                                            className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                                                selectedAlgorithm === algo
                                                    ? 'bg-[#8847BB] text-white dark:bg-[#5E4290]'
                                                    : 'border border-[#8847BB]/30 bg-transparent text-[#8847BB] hover:bg-[#8847BB]/10 dark:border-[#F9BAEE]/30 dark:text-[#F9BAEE] dark:hover:bg-[#F9BAEE]/10'
                                            } ${isPathfinding ? 'cursor-not-allowed opacity-50' : ''}`}
                                        >
                                            {algorithmInfo[algo].title}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Grid Size Control */}
                            <div className="mb-6">
                                <label className="mb-2 block text-sm font-medium">Grid Size</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {(['small', 'medium', 'large'] as GridSize[]).map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setGridSize(size)}
                                            disabled={isPathfinding}
                                            className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                                                gridSize === size
                                                    ? 'bg-[#8847BB] text-white dark:bg-[#5E4290]'
                                                    : 'border border-[#8847BB]/30 bg-transparent text-[#8847BB] hover:bg-[#8847BB]/10 dark:border-[#F9BAEE]/30 dark:text-[#F9BAEE] dark:hover:bg-[#F9BAEE]/10'
                                            } ${isPathfinding ? 'cursor-not-allowed opacity-50' : ''}`}
                                        >
                                            {size.charAt(0).toUpperCase() + size.slice(1)}
                                        </button>
                                    ))}
                                </div>
                                <div className="mt-2 text-xs text-[#706f6c] dark:text-[#A1A09A]">
                                    Small: {gridSizes.small.rows}×{gridSizes.small.cols} • Medium: {gridSizes.medium.rows}×{gridSizes.medium.cols} •
                                    Large: {gridSizes.large.rows}×{gridSizes.large.cols}
                                </div>
                            </div>

                            {/* Animation Speed Control */}
                            <div className="mb-6">
                                <label className="mb-2 block text-sm font-medium">Animation Speed</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {(['slow', 'medium', 'fast'] as Speed[]).map((speedOption) => (
                                        <button
                                            key={speedOption}
                                            onClick={() => setSpeed(speedOption)}
                                            disabled={isPathfinding}
                                            className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                                                speed === speedOption
                                                    ? 'bg-[#8847BB] text-white dark:bg-[#5E4290]'
                                                    : 'border border-[#8847BB]/30 bg-transparent text-[#8847BB] hover:bg-[#8847BB]/10 dark:border-[#F9BAEE]/30 dark:text-[#F9BAEE] dark:hover:bg-[#F9BAEE]/10'
                                            } ${isPathfinding ? 'cursor-not-allowed opacity-50' : ''}`}
                                        >
                                            {speedOption.charAt(0).toUpperCase() + speedOption.slice(1)}
                                        </button>
                                    ))}
                                </div>
                                <div className="mt-2 text-xs text-[#706f6c] dark:text-[#A1A09A]">
                                    Slow: {speedValues.slow}ms • Medium: {speedValues.medium}ms • Fast: {speedValues.fast}ms
                                </div>
                            </div>

                            {/* Maze Generation */}
                            <div className="mb-6">
                                <label className="mb-2 block text-sm font-medium">Maze Generation</label>

                                <div className="mb-3 grid grid-cols-3 gap-2">
                                    {(['low', 'medium', 'high'] as ('low' | 'medium' | 'high')[]).map((density) => (
                                        <button
                                            key={density}
                                            onClick={() => setMazeDensity(density)}
                                            disabled={isPathfinding}
                                            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                                                mazeDensity === density
                                                    ? 'bg-[#8847BB]/20 text-[#8847BB] dark:bg-[#5E4290]/20 dark:text-[#F9BAEE]'
                                                    : 'bg-transparent text-[#706f6c] hover:bg-[#8847BB]/5 dark:text-[#A1A09A] dark:hover:bg-[#5E4290]/10'
                                            } ${isPathfinding ? 'cursor-not-allowed opacity-50' : ''}`}
                                        >
                                            {density.charAt(0).toUpperCase() + density.slice(1)} Density
                                        </button>
                                    ))}
                                </div>

                                <div className="space-y-2">
                                    <button
                                        onClick={generateRandomMaze}
                                        disabled={isPathfinding}
                                        className={`w-full rounded-md border border-[#8847BB]/30 bg-transparent px-3 py-2 text-sm font-medium text-[#8847BB] transition-colors hover:bg-[#8847BB]/10 dark:border-[#F9BAEE]/30 dark:text-[#F9BAEE] dark:hover:bg-[#F9BAEE]/10 ${
                                            isPathfinding ? 'cursor-not-allowed opacity-50' : ''
                                        }`}
                                    >
                                        Generate Random Maze
                                    </button>

                                    <button
                                        onClick={generateMaze}
                                        disabled={isPathfinding}
                                        className={`w-full rounded-md border border-[#8847BB]/30 bg-transparent px-3 py-2 text-sm font-medium text-[#8847BB] transition-colors hover:bg-[#8847BB]/10 dark:border-[#F9BAEE]/30 dark:text-[#F9BAEE] dark:hover:bg-[#F9BAEE]/10 ${
                                            isPathfinding ? 'cursor-not-allowed opacity-50' : ''
                                        }`}
                                    >
                                        Generate Recursive Maze
                                    </button>
                                </div>
                            </div>

                            {/* Algorithm Explanation */}
                            <div className="rounded-md bg-[#8847BB]/5 p-4 dark:bg-[#5E4290]/10">
                                <h3 className="mb-2 text-sm font-medium">How {algorithmInfo[selectedAlgorithm].title} Works</h3>
                                <div className="mb-4 text-xs text-[#706f6c] dark:text-[#A1A09A]">
                                    {selectedAlgorithm === 'dijkstra' && (
                                        <>
                                            <p className="mb-2">
                                                Dijkstra's algorithm finds the shortest path in a weighted graph by greedily selecting the node with
                                                the smallest known distance.
                                            </p>
                                            <ol className="ml-4 list-decimal space-y-1">
                                                <li>Assign distance = 0 to start node and infinity to all other nodes</li>
                                                <li>Visit the unvisited node with the smallest distance</li>
                                                <li>For each neighbor, calculate distance through current node</li>
                                                <li>If new distance is smaller, update the neighbor's distance</li>
                                                <li>Mark current node as visited</li>
                                                <li>Repeat until end node is reached or all reachable nodes are visited</li>
                                            </ol>
                                        </>
                                    )}

                                    {selectedAlgorithm === 'astar' && (
                                        <>
                                            <p className="mb-2">
                                                A* is a best-first search algorithm that uses a heuristic to guide its search toward the goal more
                                                efficiently.
                                            </p>
                                            <ol className="ml-4 list-decimal space-y-1">
                                                <li>Each node has f(n) = g(n) + h(n) where:</li>
                                                <li>g(n) is the cost from start to the current node</li>
                                                <li>h(n) is the estimated cost from current to goal (heuristic)</li>
                                                <li>Start with the node having the lowest f(n)</li>
                                                <li>Explore neighbors and update their values if better paths found</li>
                                                <li>Continue until goal is reached or no path exists</li>
                                            </ol>
                                        </>
                                    )}

                                    {selectedAlgorithm === 'bfs' && (
                                        <>
                                            <p className="mb-2">
                                                Breadth-First Search explores all neighbors at the current depth before moving to nodes at the next
                                                depth level.
                                            </p>
                                            <ol className="ml-4 list-decimal space-y-1">
                                                <li>Start at the root node and explore all neighbors</li>
                                                <li>Then for each neighbor, explore their neighbors</li>
                                                <li>Use a queue to keep track of nodes to visit</li>
                                                <li>For unweighted graphs, this guarantees the shortest path</li>
                                                <li>Continue until goal is found or entire graph is explored</li>
                                            </ol>
                                        </>
                                    )}

                                    {selectedAlgorithm === 'dfs' && (
                                        <>
                                            <p className="mb-2">
                                                Depth-First Search explores as far as possible along each branch before backtracking.
                                            </p>
                                            <ol className="ml-4 list-decimal space-y-1">
                                                <li>Start at the root node and explore each branch completely</li>
                                                <li>Go as far as possible down one path before backtracking</li>
                                                <li>Use a stack or recursion to implement</li>
                                                <li>Does not guarantee the shortest path</li>
                                                <li>Better for maze generation than pathfinding</li>
                                            </ol>
                                        </>
                                    )}
                                </div>
                                <div className="mt-4 text-center">
                                    <a
                                        href={`https://en.wikipedia.org/wiki/${algorithmInfo[selectedAlgorithm].title.replace(' ', '_').replace("'s", '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs font-medium text-[#8847BB] hover:underline dark:text-[#F9BAEE]"
                                    >
                                        Learn more about {algorithmInfo[selectedAlgorithm].title}
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Comparison Table */}
                        <div className="mt-8 rounded-lg border bg-white p-6 shadow-sm dark:border-[#5E4290]/20 dark:bg-[#161615]">
                            <h2 className="mb-4 text-xl font-semibold">Algorithm Comparison</h2>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead>
                                        <tr>
                                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Algorithm</th>
                                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Weighted</th>
                                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Speed</th>
                                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Shortest</th>
                                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Use Case</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        <tr className={selectedAlgorithm === 'dijkstra' ? 'bg-[#8847BB]/10 dark:bg-[#5E4290]/20' : ''}>
                                            <td className="px-3 py-2 text-xs font-medium whitespace-nowrap">Dijkstra's</td>
                                            <td className="px-3 py-2 text-xs whitespace-nowrap text-green-500">Yes</td>
                                            <td className="px-3 py-2 text-xs whitespace-nowrap">Moderate</td>
                                            <td className="px-3 py-2 text-xs whitespace-nowrap text-green-500">Yes</td>
                                            <td className="px-3 py-2 text-xs whitespace-nowrap">GPS, Network Routing</td>
                                        </tr>
                                        <tr className={selectedAlgorithm === 'astar' ? 'bg-[#8847BB]/10 dark:bg-[#5E4290]/20' : ''}>
                                            <td className="px-3 py-2 text-xs font-medium whitespace-nowrap">A* Search</td>
                                            <td className="px-3 py-2 text-xs whitespace-nowrap text-green-500">Yes</td>
                                            <td className="px-3 py-2 text-xs whitespace-nowrap">Fast</td>
                                            <td className="px-3 py-2 text-xs whitespace-nowrap text-green-500">Yes</td>
                                            <td className="px-3 py-2 text-xs whitespace-nowrap">Games, Robotics</td>
                                        </tr>
                                        <tr className={selectedAlgorithm === 'bfs' ? 'bg-[#8847BB]/10 dark:bg-[#5E4290]/20' : ''}>
                                            <td className="px-3 py-2 text-xs font-medium whitespace-nowrap">BFS</td>
                                            <td className="px-3 py-2 text-xs whitespace-nowrap text-red-500">No</td>
                                            <td className="px-3 py-2 text-xs whitespace-nowrap">Moderate</td>
                                            <td className="px-3 py-2 text-xs whitespace-nowrap text-green-500">Yes*</td>
                                            <td className="px-3 py-2 text-xs whitespace-nowrap">Web Crawling, Social Networks</td>
                                        </tr>
                                        <tr className={selectedAlgorithm === 'dfs' ? 'bg-[#8847BB]/10 dark:bg-[#5E4290]/20' : ''}>
                                            <td className="px-3 py-2 text-xs font-medium whitespace-nowrap">DFS</td>
                                            <td className="px-3 py-2 text-xs whitespace-nowrap text-red-500">No</td>
                                            <td className="px-3 py-2 text-xs whitespace-nowrap">Fast</td>
                                            <td className="px-3 py-2 text-xs whitespace-nowrap text-red-500">No</td>
                                            <td className="px-3 py-2 text-xs whitespace-nowrap">Maze Generation, Cycle Detection</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="mt-2 text-xs text-[#706f6c] dark:text-[#A1A09A]">
                                * BFS guarantees shortest path only in unweighted graphs
                            </div>
                        </div>
                    </div>
                </div>

                {/* Use Cases */}
                <div className="mt-16 rounded-lg border bg-white p-8 shadow-sm dark:border-[#5E4290]/20 dark:bg-[#161615]">
                    <h2 className="mb-6 text-2xl font-bold">Real-World Applications of Pathfinding Algorithms</h2>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <div className="rounded-lg bg-[#8847BB]/5 p-5 dark:bg-[#5E4290]/10">
                            <h3 className="mb-3 text-lg font-medium">Navigation Systems</h3>
                            <p className="text-[#706f6c] dark:text-[#A1A09A]">
                                GPS and map applications use <span className="font-medium text-[#8847BB] dark:text-[#F9BAEE]">Dijkstra's</span> and
                                <span className="font-medium text-[#8847BB] dark:text-[#F9BAEE]"> A*</span> algorithms to find the shortest or fastest
                                routes between locations, considering factors like distance, traffic, and road conditions.
                            </p>
                        </div>

                        <div className="rounded-lg bg-[#8847BB]/5 p-5 dark:bg-[#5E4290]/10">
                            <h3 className="mb-3 text-lg font-medium">Robotics</h3>
                            <p className="text-[#706f6c] dark:text-[#A1A09A]">
                                Autonomous robots use <span className="font-medium text-[#8847BB] dark:text-[#F9BAEE]">A*</span> and other pathfinding
                                algorithms to navigate physical spaces, avoid obstacles, and reach targets efficiently in warehouses, hospitals, and
                                factories.
                            </p>
                        </div>

                        <div className="rounded-lg bg-[#8847BB]/5 p-5 dark:bg-[#5E4290]/10">
                            <h3 className="mb-3 text-lg font-medium">Video Games</h3>
                            <p className="text-[#706f6c] dark:text-[#A1A09A]">
                                Game developers implement pathfinding to control how NPCs navigate game worlds.
                                <span className="font-medium text-[#8847BB] dark:text-[#F9BAEE]"> A*</span> is particularly popular for its efficiency
                                and flexibility in dynamic environments.
                            </p>
                        </div>

                        <div className="rounded-lg bg-[#8847BB]/5 p-5 dark:bg-[#5E4290]/10">
                            <h3 className="mb-3 text-lg font-medium">Network Routing</h3>
                            <p className="text-[#706f6c] dark:text-[#A1A09A]">
                                Internet traffic is routed using algorithms similar to
                                <span className="font-medium text-[#8847BB] dark:text-[#F9BAEE]"> Dijkstra's</span> to find efficient paths through
                                the network, considering bandwidth, latency, and network congestion.
                            </p>
                        </div>

                        <div className="rounded-lg bg-[#8847BB]/5 p-5 dark:bg-[#5E4290]/10">
                            <h3 className="mb-3 text-lg font-medium">Logistics & Delivery</h3>
                            <p className="text-[#706f6c] dark:text-[#A1A09A]">
                                Shipping companies optimize delivery routes using variations of
                                <span className="font-medium text-[#8847BB] dark:text-[#F9BAEE]"> A*</span> and other algorithms to minimize time,
                                fuel consumption, and costs while delivering packages.
                            </p>
                        </div>

                        <div className="rounded-lg bg-[#8847BB]/5 p-5 dark:bg-[#5E4290]/10">
                            <h3 className="mb-3 text-lg font-medium">Web Crawlers</h3>
                            <p className="text-[#706f6c] dark:text-[#A1A09A]">
                                Search engines use <span className="font-medium text-[#8847BB] dark:text-[#F9BAEE]">BFS</span> to discover and index
                                web pages by following links from page to page, efficiently exploring the web graph structure.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Tips for Understanding */}
                <div className="mt-8 rounded-lg border bg-white p-8 shadow-sm dark:border-[#5E4290]/20 dark:bg-[#161615]">
                    <h2 className="mb-6 text-2xl font-bold">Tips for Understanding Pathfinding</h2>

                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="rounded-lg bg-[#8847BB]/5 p-5 dark:bg-[#5E4290]/10">
                            <h3 className="mb-3 text-lg font-medium">Visualize Node Expansion</h3>
                            <p className="text-[#706f6c] dark:text-[#A1A09A]">
                                Pay attention to how each algorithm expands nodes differently. Dijkstra's and BFS expand in all directions, while A*
                                focuses its search toward the goal using its heuristic. DFS follows deep paths first.
                            </p>
                        </div>

                        <div className="rounded-lg bg-[#8847BB]/5 p-5 dark:bg-[#5E4290]/10">
                            <h3 className="mb-3 text-lg font-medium">Create Different Maze Types</h3>
                            <p className="text-[#706f6c] dark:text-[#A1A09A]">
                                Try both random mazes and recursive division mazes. The recursive division creates more corridor-like structures,
                                while random mazes create more open spaces with scattered obstacles.
                            </p>
                        </div>

                        <div className="rounded-lg bg-[#8847BB]/5 p-5 dark:bg-[#5E4290]/10">
                            <h3 className="mb-3 text-lg font-medium">Test Edge Cases</h3>
                            <p className="text-[#706f6c] dark:text-[#A1A09A]">
                                Place start and end points on opposite sides with walls between them. See how each algorithm handles when no path
                                exists, or when the shortest path requires a very roundabout route.
                            </p>
                        </div>

                        <div className="rounded-lg bg-[#8847BB]/5 p-5 dark:bg-[#5E4290]/10">
                            <h3 className="mb-3 text-lg font-medium">Speed vs. Accuracy Tradeoff</h3>
                            <p className="text-[#706f6c] dark:text-[#A1A09A]">
                                Notice how A* typically visits fewer nodes than Dijkstra's yet still finds the optimal path. DFS explores quickly but
                                may find a very sub-optimal path. Each algorithm has its strengths and weaknesses.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Coming Next */}
                <div className="mt-8 rounded-lg border bg-gradient-to-br from-[#8847BB]/10 to-[#5E4290]/20 p-8 text-center dark:from-[#5E4290]/20 dark:to-[#8847BB]/10">
                    <h2 className="mb-4 text-2xl font-bold">Coming Next</h2>
                    <p className="mb-6 text-lg text-[#706f6c] dark:text-[#A1A09A]">
                        Stay tuned for more algorithm visualizations, including graph algorithms, tree traversal, and dynamic programming
                        visualizations!
                    </p>
                    <a
                        href="/utils/algo"
                        className="inline-block rounded-md bg-[#8847BB] px-6 py-3 text-white transition-colors hover:bg-[#7838a6] dark:bg-[#5E4290] dark:hover:bg-[#4e3578]"
                    >
                        Back to Algorithm Visualizers
                    </a>
                </div>
            </div>
        </UtilitiesLayout>
    );
}
