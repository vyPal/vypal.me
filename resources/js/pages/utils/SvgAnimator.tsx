import SEO from '@/components/SEO';
import UtilitiesLayout from '@/layouts/UtilitiesLayout';
import React, { useCallback, useEffect, useRef, useState } from 'react';

interface Point {
    x: number;
    y: number;
    type: 'line' | 'curve';
    control1?: { x: number; y: number };
    control2?: { x: number; y: number };
}

interface Animation {
    duration: number;
    delay: number;
    easing: string;
    direction: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
    iterations: number | 'infinite';
    fillMode: 'none' | 'forwards' | 'backwards' | 'both';
}

export default function SvgAnimator() {
    // Canvas dimensions
    const [canvasWidth, setCanvasWidth] = useState(600);
    const [canvasHeight, setCanvasHeight] = useState(400);

    // SVG path editor
    const [points, setPoints] = useState<Point[]>([]);
    const [isDrawing, setIsDrawing] = useState(false);
    const [selectedPointIndex, setSelectedPointIndex] = useState<number | null>(null);
    const [selectedControlPoint, setSelectedControlPoint] = useState<'control1' | 'control2' | null>(null);
    const [pathColor, setPathColor] = useState('#8847BB');
    const [strokeWidth, setStrokeWidth] = useState(4);
    const [currentTool, setCurrentTool] = useState<'line' | 'curve'>('line');
    const [pathFill, setPathFill] = useState('none');
    const [isClosed, setIsClosed] = useState(false);

    // Animation settings
    const [animationSettings, setAnimationSettings] = useState<Animation>({
        duration: 2,
        delay: 0,
        easing: 'ease',
        direction: 'normal',
        iterations: 'infinite',
        fillMode: 'forwards',
    });
    const [isAnimating, setIsAnimating] = useState(false);
    const [animationType, setAnimationType] = useState<'draw' | 'move'>('draw');
    const [translateX, setTranslateX] = useState(0);
    const [translateY, setTranslateY] = useState(0);
    const [rotate, setRotate] = useState(0);
    const [scale, setScale] = useState(1);

    // Generated code
    const [svgCode, setSvgCode] = useState('');
    const [cssCode, setCssCode] = useState('');

    // References
    const svgRef = useRef<SVGSVGElement>(null);
    const pathRef = useRef<SVGPathElement>(null);

    // Generate path - wrapped in useCallback to prevent dependency array issues
    const generatePath = useCallback(() => {
        if (points.length === 0) return '';

        let path = `M ${points[0].x} ${points[0].y}`;

        for (let i = 1; i < points.length; i++) {
            const point = points[i];

            if (point.type === 'line') {
                path += ` L ${point.x} ${point.y}`;
            } else if (point.type === 'curve' && point.control1 && point.control2) {
                path += ` C ${point.control1.x} ${point.control1.y}, ${point.control2.x} ${point.control2.y}, ${point.x} ${point.y}`;
            }
        }

        if (isClosed) {
            path += ' Z';
        }

        return path;
    }, [points, isClosed]);

    // Handle canvas click for adding points
    const handleCanvasClick = (e: React.MouseEvent<SVGSVGElement>) => {
        if (isAnimating) return;

        const svgElement = svgRef.current;
        if (!svgElement) return;

        const rect = svgElement.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (isDrawing) {
            // Add a new point
            if (currentTool === 'line') {
                setPoints([...points, { x, y, type: 'line' }]);
            } else if (currentTool === 'curve') {
                // For bezier curves, add control points
                const lastPoint = points[points.length - 1];
                if (!lastPoint) {
                    setPoints([...points, { x, y, type: 'curve' }]);
                }

                // Calculate control points
                const control1X = lastPoint.x + (x - lastPoint.x) / 3;
                const control1Y = lastPoint.y + (y - lastPoint.y) / 3;
                const control2X = lastPoint.x + (2 * (x - lastPoint.x)) / 3;
                const control2Y = lastPoint.y + (2 * (y - lastPoint.y)) / 3;

                setPoints([
                    ...points,
                    {
                        x,
                        y,
                        type: 'curve',
                        control1: { x: control1X, y: control1Y },
                        control2: { x: control2X, y: control2Y },
                    },
                ]);
            }
        }
    };

    // Handle mouse down on point for drag operations
    const handlePointMouseDown = (index: number) => {
        if (isAnimating) return;
        setSelectedPointIndex(index);
    };

    // Handle mouse down on control point
    const handleControlPointMouseDown = (index: number, control: 'control1' | 'control2', e: React.MouseEvent) => {
        if (isAnimating) return;
        e.stopPropagation();
        setSelectedPointIndex(index);
        setSelectedControlPoint(control);
    };

    // Handle mouse move for dragging points
    const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
        if (isAnimating || (selectedPointIndex === null && selectedControlPoint === null)) return;

        const svgElement = svgRef.current;
        if (!svgElement) return;

        const rect = svgElement.getBoundingClientRect();
        const x = Math.max(0, Math.min(canvasWidth, e.clientX - rect.left));
        const y = Math.max(0, Math.min(canvasHeight, e.clientY - rect.top));

        if (selectedPointIndex !== null) {
            const newPoints = [...points];

            if (selectedControlPoint === null) {
                // Moving the main point
                newPoints[selectedPointIndex] = {
                    ...newPoints[selectedPointIndex],
                    x,
                    y,
                };
            } else if (selectedControlPoint === 'control1' && newPoints[selectedPointIndex].control1) {
                // Moving control point 1
                newPoints[selectedPointIndex] = {
                    ...newPoints[selectedPointIndex],
                    control1: { x, y },
                };
            } else if (selectedControlPoint === 'control2' && newPoints[selectedPointIndex].control2) {
                // Moving control point 2
                newPoints[selectedPointIndex] = {
                    ...newPoints[selectedPointIndex],
                    control2: { x, y },
                };
            }

            setPoints(newPoints);
        }
    };

    // Handle mouse up to end drag operations
    const handleMouseUp = () => {
        setSelectedPointIndex(null);
        setSelectedControlPoint(null);
    };

    // Delete a point
    const deletePoint = (index: number) => {
        const newPoints = [...points];
        newPoints.splice(index, 1);
        setPoints(newPoints);
    };

    // Clear all points
    const clearPath = () => {
        setPoints([]);
        setIsDrawing(false);
        setSelectedPointIndex(null);
        setSelectedControlPoint(null);
        setIsAnimating(false);
    };

    // Start drawing mode
    const startDrawing = () => {
        setIsDrawing(true);
        setSelectedPointIndex(null);
        setSelectedControlPoint(null);
    };

    // Finish drawing mode
    const finishDrawing = () => {
        setIsDrawing(false);
    };

    // Toggle animation
    const toggleAnimation = () => {
        setIsAnimating(!isAnimating);
    };

    // Update animation parameter
    const updateAnimation = (key: keyof Animation, value: Animation[keyof Animation]) => {
        setAnimationSettings({
            ...animationSettings,
            [key]: value,
        });
    };

    // Generate the SVG and CSS code
    useEffect(() => {
        // SVG Code
        const pathD = generatePath();

        if (!pathD) {
            setSvgCode('');
            setCssCode('');
            return;
        }

        let svgOutput = `<svg width="${canvasWidth}" height="${canvasHeight}" viewBox="0 0 ${canvasWidth} ${canvasHeight}" xmlns="http://www.w3.org/2000/svg">\n`;

        // Add the path
        svgOutput += `  <path\n`;
        svgOutput += `    d="${pathD}"\n`;
        svgOutput += `    fill="${pathFill}"\n`;
        svgOutput += `    stroke="${pathColor}"\n`;
        svgOutput += `    stroke-width="${strokeWidth}"\n`;

        if (isAnimating) {
            if (animationType === 'draw') {
                svgOutput += `    class="animated-path"\n`;
            } else {
                svgOutput += `    class="animated-path-transform"\n`;
            }
        }

        svgOutput += `  />\n`;
        svgOutput += `</svg>`;

        setSvgCode(svgOutput);

        // CSS Code for animation
        let cssOutput = '';

        if (isAnimating) {
            if (animationType === 'draw') {
                // Calculate path length for stroke animation
                const pathLength = pathRef.current?.getTotalLength() || 1000;

                cssOutput += `.animated-path {\n`;
                cssOutput += `  stroke-dasharray: ${pathLength};\n`;
                cssOutput += `  stroke-dashoffset: ${pathLength};\n`;
                cssOutput += `  animation: draw-path ${animationSettings.duration}s ${animationSettings.easing} ${animationSettings.delay}s ${animationSettings.iterations === 'infinite' ? 'infinite' : animationSettings.iterations} ${animationSettings.direction} ${animationSettings.fillMode};\n`;
                cssOutput += `}\n\n`;

                cssOutput += `@keyframes draw-path {\n`;
                cssOutput += `  0% {\n`;
                cssOutput += `    stroke-dashoffset: ${pathLength};\n`;
                cssOutput += `  }\n`;
                cssOutput += `  100% {\n`;
                cssOutput += `    stroke-dashoffset: 0;\n`;
                cssOutput += `  }\n`;
                cssOutput += `}`;
            } else {
                // Transform animation
                cssOutput += `.animated-path-transform {\n`;
                cssOutput += `  animation: move-path ${animationSettings.duration}s ${animationSettings.easing} ${animationSettings.delay}s ${animationSettings.iterations === 'infinite' ? 'infinite' : animationSettings.iterations} ${animationSettings.direction} ${animationSettings.fillMode};\n`;
                cssOutput += `  transform-origin: center;\n`;
                cssOutput += `}\n\n`;

                cssOutput += `@keyframes move-path {\n`;
                cssOutput += `  0% {\n`;
                cssOutput += `    transform: translate(0, 0) rotate(0deg) scale(1);\n`;
                cssOutput += `  }\n`;
                cssOutput += `  100% {\n`;
                cssOutput += `    transform: translate(${translateX}px, ${translateY}px) rotate(${rotate}deg) scale(${scale});\n`;
                cssOutput += `  }\n`;
                cssOutput += `}`;
            }
        }

        setCssCode(cssOutput);
    }, [
        generatePath,
        pathColor,
        strokeWidth,
        pathFill,
        isAnimating,
        animationSettings,
        animationType,
        translateX,
        translateY,
        rotate,
        scale,
        canvasWidth,
        canvasHeight,
    ]);

    // Apply animation style dynamically
    useEffect(() => {
        if (!pathRef.current || !isAnimating) return;

        const path = pathRef.current;

        let animationInstance;

        if (animationType === 'draw') {
            const pathLength = path.getTotalLength();
            path.style.strokeDasharray = `${pathLength}`;
            path.style.strokeDashoffset = `${pathLength}`;

            animationInstance = path.animate([{ strokeDashoffset: pathLength }, { strokeDashoffset: 0 }], {
                duration: animationSettings.duration * 1000,
                delay: animationSettings.delay * 1000,
                easing: animationSettings.easing,
                iterations: animationSettings.iterations === 'infinite' ? Infinity : Number(animationSettings.iterations),
                direction: animationSettings.direction,
                fill: animationSettings.fillMode,
            });
        } else {
            animationInstance = path.animate(
                [
                    { transform: 'translate(0, 0) rotate(0deg) scale(1)' },
                    { transform: `translate(${translateX}px, ${translateY}px) rotate(${rotate}deg) scale(${scale})` },
                ],
                {
                    duration: animationSettings.duration * 1000,
                    delay: animationSettings.delay * 1000,
                    easing: animationSettings.easing,
                    iterations: animationSettings.iterations === 'infinite' ? Infinity : Number(animationSettings.iterations),
                    direction: animationSettings.direction,
                    fill: animationSettings.fillMode,
                },
            );
        }

        return () => {
            if (animationInstance) {
                animationInstance.cancel();
            }
        };
    }, [isAnimating, animationType, points, animationSettings, translateX, translateY, rotate, scale]);

    // Copy to clipboard
    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert('Copied to clipboard!');
    };

    return (
        <UtilitiesLayout currentUtility="SVG Path Animator">
            <SEO
                title="SVG Path Animator | vyPal.me Utilities"
                description="Create and animate SVG paths with an interactive editor. Design, customize, and generate code for your SVG animations with real-time preview."
                keywords="SVG, animation, path editor, interactive, web animation, SVG code generator, creative tools"
                tags={['svg', 'animation', 'design', 'path', 'interactive', 'code generator']}
            />

            <div className="mx-auto max-w-7xl">
                <h1 className="mb-6 text-3xl font-bold">SVG Path Animator</h1>
                <p className="text-muted-foreground mb-8 text-lg">
                    Create and animate SVG paths with an interactive editor. Draw, customize, and generate code for your SVG animations.
                </p>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* SVG Canvas */}
                    <div className="lg:col-span-2">
                        <div className="bg-card rounded-lg border p-6 shadow-sm">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-xl font-semibold">Canvas</h2>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={clearPath}
                                        className="border-border hover:bg-secondary/10 rounded-md border px-3 py-1.5 text-sm font-medium"
                                    >
                                        Clear
                                    </button>
                                    {isDrawing ? (
                                        <button
                                            onClick={finishDrawing}
                                            className="border-destructive text-destructive hover:bg-destructive/10 rounded-md border px-3 py-1.5 text-sm font-medium"
                                        >
                                            Finish Drawing
                                        </button>
                                    ) : (
                                        <button
                                            onClick={startDrawing}
                                            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-3 py-1.5 text-sm font-medium"
                                        >
                                            Start Drawing
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Canvas size controls */}
                            <div className="mb-4 grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1 block text-sm font-medium">Width: {canvasWidth}px</label>
                                    <input
                                        type="range"
                                        min="300"
                                        max="1000"
                                        value={canvasWidth}
                                        onChange={(e) => setCanvasWidth(parseInt(e.target.value))}
                                        className="w-full"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium">Height: {canvasHeight}px</label>
                                    <input
                                        type="range"
                                        min="200"
                                        max="800"
                                        value={canvasHeight}
                                        onChange={(e) => setCanvasHeight(parseInt(e.target.value))}
                                        className="w-full"
                                    />
                                </div>
                            </div>

                            {/* SVG Canvas */}
                            <div className="border-border relative overflow-hidden rounded border">
                                <svg
                                    ref={svgRef}
                                    width={canvasWidth}
                                    height={canvasHeight}
                                    viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
                                    className="relative cursor-crosshair"
                                    onClick={handleCanvasClick}
                                    onMouseMove={handleMouseMove}
                                    onMouseUp={handleMouseUp}
                                    onMouseLeave={handleMouseUp}
                                >
                                    {/* Background grid for better visibility */}
                                    <defs>
                                        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                                            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="0.5" />
                                        </pattern>
                                    </defs>
                                    <rect width="100%" height="100%" fill="url(#grid)" />

                                    {/* The path being created */}
                                    {points.length > 0 && (
                                        <path
                                            ref={pathRef}
                                            d={generatePath()}
                                            fill={pathFill}
                                            stroke={pathColor}
                                            strokeWidth={strokeWidth}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    )}

                                    {/* Draw control points for curves */}
                                    {!isAnimating &&
                                        points.map((point, index) => {
                                            // For curves, draw the control points and lines
                                            if (point.type === 'curve' && index > 0) {
                                                const prevPoint = points[index - 1];
                                                return (
                                                    <g key={`control-${index}`}>
                                                        {/* Control point 1 */}
                                                        {point.control1 && (
                                                            <>
                                                                <line
                                                                    x1={prevPoint.x}
                                                                    y1={prevPoint.y}
                                                                    x2={point.control1.x}
                                                                    y2={point.control1.y}
                                                                    stroke="#aaa"
                                                                    strokeWidth="1"
                                                                    strokeDasharray="5,5"
                                                                />
                                                                <circle
                                                                    cx={point.control1.x}
                                                                    cy={point.control1.y}
                                                                    r="4"
                                                                    fill="#8847BB"
                                                                    stroke="white"
                                                                    strokeWidth="1"
                                                                    onMouseDown={(e) => handleControlPointMouseDown(index, 'control1', e)}
                                                                    style={{ cursor: 'move' }}
                                                                />
                                                            </>
                                                        )}

                                                        {/* Control point 2 */}
                                                        {point.control2 && (
                                                            <>
                                                                <line
                                                                    x1={point.x}
                                                                    y1={point.y}
                                                                    x2={point.control2.x}
                                                                    y2={point.control2.y}
                                                                    stroke="#aaa"
                                                                    strokeWidth="1"
                                                                    strokeDasharray="5,5"
                                                                />
                                                                <circle
                                                                    cx={point.control2.x}
                                                                    cy={point.control2.y}
                                                                    r="4"
                                                                    fill="#F9BAEE"
                                                                    stroke="white"
                                                                    strokeWidth="1"
                                                                    onMouseDown={(e) => handleControlPointMouseDown(index, 'control2', e)}
                                                                    style={{ cursor: 'move' }}
                                                                />
                                                            </>
                                                        )}
                                                    </g>
                                                );
                                            }
                                            return null;
                                        })}

                                    {/* Draw points */}
                                    {!isAnimating &&
                                        points.map((point, index) => (
                                            <g key={`point-${index}`}>
                                                <circle
                                                    cx={point.x}
                                                    cy={point.y}
                                                    r="6"
                                                    fill={selectedPointIndex === index ? '#5E4290' : '#aaa'}
                                                    stroke="white"
                                                    strokeWidth="2"
                                                    onMouseDown={() => handlePointMouseDown(index)}
                                                    style={{ cursor: 'move' }}
                                                    className="hover:fill-primary"
                                                />
                                                {isDrawing && index === points.length - 1 && (
                                                    <text x={point.x + 10} y={point.y - 10} fontSize="12" fill="#666">
                                                        {`Click to add ${currentTool}`}
                                                    </text>
                                                )}
                                            </g>
                                        ))}
                                </svg>
                            </div>
                        </div>

                        {/* Generated Code */}
                        <div className="bg-card mt-8 rounded-lg border p-6 shadow-sm">
                            <h2 className="mb-4 text-xl font-semibold">Generated Code</h2>

                            <div className="mb-6 space-y-4">
                                <div>
                                    <div className="mb-2 flex items-center justify-between">
                                        <h3 className="font-medium">SVG Code</h3>
                                        <button
                                            onClick={() => copyToClipboard(svgCode)}
                                            className="text-primary text-xs hover:underline"
                                            disabled={!svgCode}
                                        >
                                            Copy to Clipboard
                                        </button>
                                    </div>
                                    <pre className="bg-secondary/10 overflow-auto rounded-md p-4 text-xs">
                                        <code>{svgCode || 'Draw a path to generate SVG code.'}</code>
                                    </pre>
                                </div>

                                <div>
                                    <div className="mb-2 flex items-center justify-between">
                                        <h3 className="font-medium">CSS Animation</h3>
                                        <button
                                            onClick={() => copyToClipboard(cssCode)}
                                            className="text-primary text-xs hover:underline"
                                            disabled={!cssCode}
                                        >
                                            Copy to Clipboard
                                        </button>
                                    </div>
                                    <pre className="bg-secondary/10 overflow-auto rounded-md p-4 text-xs">
                                        <code>{cssCode || 'Enable animation to generate CSS code.'}</code>
                                    </pre>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Controls Panel */}
                    <div>
                        <div className="bg-card rounded-lg border p-6 shadow-sm">
                            <h2 className="mb-4 text-xl font-semibold">Path Settings</h2>

                            {/* Drawing tools */}
                            <div className="mb-6">
                                <label className="mb-2 block text-sm font-medium">Drawing Tool</label>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => setCurrentTool('line')}
                                        className={`flex-1 rounded-md px-3 py-2 text-sm font-medium ${
                                            currentTool === 'line'
                                                ? 'bg-primary text-primary-foreground'
                                                : 'border-border hover:bg-secondary/10 border'
                                        }`}
                                    >
                                        Line
                                    </button>
                                    <button
                                        onClick={() => setCurrentTool('curve')}
                                        className={`flex-1 rounded-md px-3 py-2 text-sm font-medium ${
                                            currentTool === 'curve'
                                                ? 'bg-primary text-primary-foreground'
                                                : 'border-border hover:bg-secondary/10 border'
                                        }`}
                                    >
                                        Bezier Curve
                                    </button>
                                </div>
                            </div>

                            {/* Path appearance */}
                            <div className="mb-6 space-y-4">
                                <div>
                                    <label className="mb-2 block text-sm font-medium">Stroke Color</label>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="color"
                                            value={pathColor}
                                            onChange={(e) => setPathColor(e.target.value)}
                                            className="h-10 w-10 cursor-pointer rounded border-0"
                                        />
                                        <input
                                            type="text"
                                            value={pathColor}
                                            onChange={(e) => setPathColor(e.target.value)}
                                            className="border-border bg-background flex-1 rounded-md px-3 py-1.5 text-sm"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium">Stroke Width: {strokeWidth}px</label>
                                    <input
                                        type="range"
                                        min="1"
                                        max="20"
                                        value={strokeWidth}
                                        onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
                                        className="w-full"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium">Fill Color</label>
                                    <div className="flex items-center space-x-2">
                                        <select
                                            value={pathFill}
                                            onChange={(e) => setPathFill(e.target.value)}
                                            className="border-border bg-background w-full rounded-md px-3 py-1.5 text-sm"
                                        >
                                            <option value="none">None</option>
                                            <option value="transparent">Transparent</option>
                                            <option value="#8847BB">Purple (#8847BB)</option>
                                            <option value="#5E4290">Deep Purple (#5E4290)</option>
                                            <option value="#F9BAEE">Pink (#F9BAEE)</option>
                                            <option value="#000000">Black</option>
                                            <option value="#ffffff">White</option>
                                            <option value="custom">Custom...</option>
                                        </select>
                                        <div className="mt-2 flex items-center space-x-2">
                                            <input
                                                type="color"
                                                value={pathFill === 'none' || pathFill === 'transparent' ? '#000000' : pathFill}
                                                onChange={(e) => setPathFill(e.target.value)}
                                                className="h-8 w-8 cursor-pointer rounded border-0"
                                            />
                                            <input
                                                type="text"
                                                value={pathFill === 'none' || pathFill === 'transparent' ? '' : pathFill}
                                                onChange={(e) => setPathFill(e.target.value)}
                                                className="border-border bg-background flex-1 rounded-md px-3 py-1 text-sm"
                                                placeholder="#000000"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="close-path"
                                        checked={isClosed}
                                        onChange={(e) => setIsClosed(e.target.checked)}
                                        className="border-border h-4 w-4 rounded"
                                    />
                                    <label htmlFor="close-path" className="ml-2 text-sm">
                                        Close Path
                                    </label>
                                </div>
                            </div>

                            {/* Points list */}
                            {points.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="mb-2 text-sm font-medium">Points ({points.length})</h3>
                                    <div className="border-border max-h-40 overflow-y-auto rounded-md border">
                                        <table className="divide-border min-w-full divide-y">
                                            <thead className="bg-secondary/10">
                                                <tr>
                                                    <th className="px-3 py-2 text-left text-xs font-medium">#</th>
                                                    <th className="px-3 py-2 text-left text-xs font-medium">Type</th>
                                                    <th className="px-3 py-2 text-left text-xs font-medium">Position</th>
                                                    <th className="px-3 py-2 text-left text-xs font-medium"></th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-border divide-y">
                                                {points.map((point, index) => (
                                                    <tr key={index} className={`${selectedPointIndex === index ? 'bg-primary/10' : ''}`}>
                                                        <td className="px-3 py-2 text-xs whitespace-nowrap">{index + 1}</td>
                                                        <td className="px-3 py-2 text-xs whitespace-nowrap">{point.type}</td>
                                                        <td className="px-3 py-2 text-xs whitespace-nowrap">
                                                            {Math.round(point.x)}, {Math.round(point.y)}
                                                        </td>
                                                        <td className="px-3 py-2 text-right text-xs whitespace-nowrap">
                                                            <button
                                                                onClick={() => deletePoint(index)}
                                                                className="text-destructive hover:text-destructive/80"
                                                                disabled={isAnimating}
                                                            >
                                                                Delete
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            <h2 className="mb-4 text-xl font-semibold">Animation</h2>

                            <div className="mb-6 space-y-4">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium">Enable Animation</label>
                                    <button
                                        onClick={toggleAnimation}
                                        className={`rounded-full px-4 py-1 text-xs font-medium ${
                                            isAnimating ? 'bg-destructive text-destructive-foreground' : 'bg-primary text-primary-foreground'
                                        }`}
                                    >
                                        {isAnimating ? 'Stop' : 'Start'} Animation
                                    </button>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium">Animation Type</label>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => setAnimationType('draw')}
                                            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium ${
                                                animationType === 'draw'
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'border-border hover:bg-secondary/10 border'
                                            }`}
                                        >
                                            Draw
                                        </button>
                                        <button
                                            onClick={() => setAnimationType('move')}
                                            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium ${
                                                animationType === 'move'
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'border-border hover:bg-secondary/10 border'
                                            }`}
                                        >
                                            Transform
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium">Duration: {animationSettings.duration}s</label>
                                    <input
                                        type="range"
                                        min="0.1"
                                        max="10"
                                        step="0.1"
                                        value={animationSettings.duration}
                                        onChange={(e) => updateAnimation('duration', parseFloat(e.target.value))}
                                        className="w-full"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium">Delay: {animationSettings.delay}s</label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="5"
                                        step="0.1"
                                        value={animationSettings.delay}
                                        onChange={(e) => updateAnimation('delay', parseFloat(e.target.value))}
                                        className="w-full"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium">Easing</label>
                                    <select
                                        value={animationSettings.easing}
                                        onChange={(e) => updateAnimation('easing', e.target.value)}
                                        className="border-border bg-background w-full rounded-md px-3 py-1.5 text-sm"
                                    >
                                        <option value="ease">ease</option>
                                        <option value="ease-in">ease-in</option>
                                        <option value="ease-out">ease-out</option>
                                        <option value="ease-in-out">ease-in-out</option>
                                        <option value="linear">linear</option>
                                        <option value="cubic-bezier(0.68, -0.55, 0.27, 1.55)">bounce</option>
                                        <option value="cubic-bezier(0.25, 0.46, 0.45, 0.94)">ease-out-quad</option>
                                        <option value="cubic-bezier(0.55, 0.06, 0.68, 0.19)">ease-in-quad</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium">Direction</label>
                                    <select
                                        value={animationSettings.direction}
                                        onChange={(e) => updateAnimation('direction', e.target.value)}
                                        className="border-border bg-background w-full rounded-md px-3 py-1.5 text-sm"
                                    >
                                        <option value="normal">normal</option>
                                        <option value="reverse">reverse</option>
                                        <option value="alternate">alternate</option>
                                        <option value="alternate-reverse">alternate-reverse</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium">Iterations</label>
                                    <select
                                        value={animationSettings.iterations}
                                        onChange={(e) =>
                                            updateAnimation('iterations', e.target.value === 'infinite' ? 'infinite' : parseInt(e.target.value))
                                        }
                                        className="border-border bg-background w-full rounded-md px-3 py-1.5 text-sm"
                                    >
                                        <option value="infinite">infinite</option>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="5">5</option>
                                        <option value="10">10</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium">Fill Mode</label>
                                    <select
                                        value={animationSettings.fillMode}
                                        onChange={(e) => updateAnimation('fillMode', e.target.value)}
                                        className="border-border bg-background w-full rounded-md px-3 py-1.5 text-sm"
                                    >
                                        <option value="none">none</option>
                                        <option value="forwards">forwards</option>
                                        <option value="backwards">backwards</option>
                                        <option value="both">both</option>
                                    </select>
                                </div>

                                {animationType === 'move' && (
                                    <div className="border-border space-y-4 rounded-md border p-4">
                                        <h3 className="text-sm font-medium">Transform Settings</h3>

                                        <div>
                                            <label className="mb-1 block text-xs font-medium">Translate X: {translateX}px</label>
                                            <input
                                                type="range"
                                                min="-100"
                                                max="100"
                                                value={translateX}
                                                onChange={(e) => setTranslateX(parseInt(e.target.value))}
                                                className="w-full"
                                            />
                                        </div>

                                        <div>
                                            <label className="mb-1 block text-xs font-medium">Translate Y: {translateY}px</label>
                                            <input
                                                type="range"
                                                min="-100"
                                                max="100"
                                                value={translateY}
                                                onChange={(e) => setTranslateY(parseInt(e.target.value))}
                                                className="w-full"
                                            />
                                        </div>

                                        <div>
                                            <label className="mb-1 block text-xs font-medium">Rotate: {rotate}°</label>
                                            <input
                                                type="range"
                                                min="-360"
                                                max="360"
                                                value={rotate}
                                                onChange={(e) => setRotate(parseInt(e.target.value))}
                                                className="w-full"
                                            />
                                        </div>

                                        <div>
                                            <label className="mb-1 block text-xs font-medium">Scale: {scale.toFixed(1)}x</label>
                                            <input
                                                type="range"
                                                min="0.1"
                                                max="3"
                                                step="0.1"
                                                value={scale}
                                                onChange={(e) => setScale(parseFloat(e.target.value))}
                                                className="w-full"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* SVG Path Reference */}
                        <div className="bg-card mt-8 rounded-lg border p-6 shadow-sm">
                            <h2 className="mb-4 text-xl font-semibold">SVG Path Commands</h2>
                            <div className="text-sm">
                                <p className="mb-4">Learn how SVG paths work with this quick reference guide:</p>

                                <div className="mb-6 space-y-2">
                                    <div className="flex items-start">
                                        <span className="bg-primary/20 mr-2 inline-block w-10 rounded-sm px-2 py-1 text-center font-mono text-xs">
                                            M
                                        </span>
                                        <div>
                                            <span className="font-medium">Move To</span>
                                            <p className="text-muted-foreground text-xs">Start a new sub-path at the given (x,y) coordinates.</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <span className="bg-primary/20 mr-2 inline-block w-10 rounded-sm px-2 py-1 text-center font-mono text-xs">
                                            L
                                        </span>
                                        <div>
                                            <span className="font-medium">Line To</span>
                                            <p className="text-muted-foreground text-xs">Draw a straight line from the current point to (x,y).</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <span className="bg-primary/20 mr-2 inline-block w-10 rounded-sm px-2 py-1 text-center font-mono text-xs">
                                            C
                                        </span>
                                        <div>
                                            <span className="font-medium">Cubic Bezier</span>
                                            <p className="text-muted-foreground text-xs">
                                                Draw a cubic Bézier curve with control points (x1,y1), (x2,y2), ending at (x,y).
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <span className="bg-primary/20 mr-2 inline-block w-10 rounded-sm px-2 py-1 text-center font-mono text-xs">
                                            Z
                                        </span>
                                        <div>
                                            <span className="font-medium">Close Path</span>
                                            <p className="text-muted-foreground text-xs">
                                                Close the current sub-path by connecting it back to its starting point.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-secondary/10 rounded-md p-4">
                                    <h3 className="mb-2 text-sm font-medium">Animation Tips</h3>
                                    <ul className="text-muted-foreground ml-4 list-disc text-xs">
                                        <li className="mb-1">Use "Draw" animation to create drawing effects with stroke-dasharray/dashoffset.</li>
                                        <li className="mb-1">Use "Transform" animation for movement, rotation, and scaling effects.</li>
                                        <li className="mb-1">Try combining multiple SVGs with different animations for complex effects.</li>
                                        <li>The generated CSS can be easily integrated with React, Vue, or vanilla JS projects.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Examples section */}
                {points.length === 0 && (
                    <div className="bg-card mt-8 rounded-lg border p-6 shadow-sm">
                        <h2 className="mb-6 text-xl font-semibold">Example SVG Paths</h2>
                        <p className="text-muted-foreground mb-4">Get started quickly by using one of these example paths:</p>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {/* Heart Shape */}
                            <div
                                className="border-border hover:border-primary cursor-pointer rounded-lg border p-4 hover:shadow-sm"
                                onClick={() => {
                                    // Create a heart shape
                                    setPoints([
                                        { x: 300, y: 120, type: 'line' },
                                        { x: 360, y: 60, type: 'curve', control1: { x: 340, y: 100 }, control2: { x: 360, y: 60 } },
                                        { x: 420, y: 120, type: 'curve', control1: { x: 400, y: 60 }, control2: { x: 420, y: 80 } },
                                        { x: 300, y: 240, type: 'curve', control1: { x: 420, y: 180 }, control2: { x: 300, y: 240 } },
                                        { x: 180, y: 120, type: 'curve', control1: { x: 180, y: 240 }, control2: { x: 180, y: 160 } },
                                        { x: 300, y: 120, type: 'curve', control1: { x: 180, y: 60 }, control2: { x: 260, y: 100 } },
                                    ]);
                                    setIsClosed(true);
                                    setPathColor('#8847BB');
                                    setPathFill('#F9BAEE');
                                    setAnimationType('draw');
                                }}
                            >
                                <div className="h-40 w-full">
                                    <svg width="100%" height="100%" viewBox="0 0 600 400">
                                        <path
                                            d="M300 120 C340 100 360 60 360 60 C400 60 420 80 420 120 C420 180 300 240 300 240 C180 240 180 160 180 120 C180 60 260 100 300 120 Z"
                                            fill="#F9BAEE"
                                            stroke="#8847BB"
                                            strokeWidth="4"
                                        />
                                    </svg>
                                </div>
                                <h3 className="mt-2 text-center text-sm font-medium">Heart</h3>
                            </div>

                            {/* Wave Shape */}
                            <div
                                className="border-border hover:border-primary cursor-pointer rounded-lg border p-4 hover:shadow-sm"
                                onClick={() => {
                                    // Create a wave shape
                                    setPoints([
                                        { x: 50, y: 200, type: 'line' },
                                        { x: 150, y: 100, type: 'curve', control1: { x: 75, y: 100 }, control2: { x: 125, y: 100 } },
                                        { x: 250, y: 200, type: 'curve', control1: { x: 175, y: 300 }, control2: { x: 225, y: 300 } },
                                        { x: 350, y: 100, type: 'curve', control1: { x: 275, y: 100 }, control2: { x: 325, y: 100 } },
                                        { x: 450, y: 200, type: 'curve', control1: { x: 375, y: 300 }, control2: { x: 425, y: 300 } },
                                        { x: 550, y: 100, type: 'curve', control1: { x: 475, y: 100 }, control2: { x: 525, y: 100 } },
                                    ]);
                                    setIsClosed(false);
                                    setPathColor('#5E4290');
                                    setPathFill('none');
                                    setAnimationType('draw');
                                }}
                            >
                                <div className="h-40 w-full">
                                    <svg width="100%" height="100%" viewBox="0 0 600 400">
                                        <path
                                            d="M50 200 C75 100 125 100 150 100 C175 300 225 300 250 200 C275 100 325 100 350 100 C375 300 425 300 450 200 C475 100 525 100 550 100"
                                            fill="none"
                                            stroke="#5E4290"
                                            strokeWidth="4"
                                        />
                                    </svg>
                                </div>
                                <h3 className="mt-2 text-center text-sm font-medium">Wave</h3>
                            </div>

                            {/* Spiral Shape */}
                            <div
                                className="border-border hover:border-primary cursor-pointer rounded-lg border p-4 hover:shadow-sm"
                                onClick={() => {
                                    // Create a spiral shape
                                    setPoints([
                                        { x: 300, y: 200, type: 'line' },
                                        { x: 340, y: 160, type: 'curve', control1: { x: 330, y: 190 }, control2: { x: 340, y: 175 } },
                                        { x: 320, y: 120, type: 'curve', control1: { x: 340, y: 140 }, control2: { x: 330, y: 120 } },
                                        { x: 270, y: 140, type: 'curve', control1: { x: 300, y: 120 }, control2: { x: 280, y: 130 } },
                                        { x: 260, y: 190, type: 'curve', control1: { x: 260, y: 160 }, control2: { x: 255, y: 175 } },
                                        { x: 290, y: 230, type: 'curve', control1: { x: 270, y: 215 }, control2: { x: 280, y: 230 } },
                                        { x: 350, y: 220, type: 'curve', control1: { x: 310, y: 230 }, control2: { x: 330, y: 230 } },
                                        { x: 370, y: 170, type: 'curve', control1: { x: 370, y: 210 }, control2: { x: 375, y: 190 } },
                                    ]);
                                    setIsClosed(false);
                                    setPathColor('#F9BAEE');
                                    setPathFill('none');
                                    setAnimationType('draw');
                                }}
                            >
                                <div className="h-40 w-full">
                                    <svg width="100%" height="100%" viewBox="0 0 600 400">
                                        <path
                                            d="M300 200 C330 190 340 175 340 160 C340 140 330 120 320 120 C300 120 280 130 270 140 C260 160 255 175 260 190 C270 215 280 230 290 230 C310 230 330 230 350 220 C370 210 375 190 370 170"
                                            fill="none"
                                            stroke="#F9BAEE"
                                            strokeWidth="4"
                                        />
                                    </svg>
                                </div>
                                <h3 className="mt-2 text-center text-sm font-medium">Spiral</h3>
                            </div>

                            {/* Star Shape */}
                            <div
                                className="border-border hover:border-primary cursor-pointer rounded-lg border p-4 hover:shadow-sm"
                                onClick={() => {
                                    // Create a star shape
                                    setPoints([
                                        { x: 300, y: 100, type: 'line' },
                                        { x: 330, y: 180, type: 'line' },
                                        { x: 410, y: 180, type: 'line' },
                                        { x: 350, y: 230, type: 'line' },
                                        { x: 380, y: 310, type: 'line' },
                                        { x: 300, y: 260, type: 'line' },
                                        { x: 220, y: 310, type: 'line' },
                                        { x: 250, y: 230, type: 'line' },
                                        { x: 190, y: 180, type: 'line' },
                                        { x: 270, y: 180, type: 'line' },
                                        { x: 300, y: 100, type: 'line' },
                                    ]);
                                    setIsClosed(true);
                                    setPathColor('#8847BB');
                                    setPathFill('#5E4290');
                                    setAnimationType('move');
                                    setRotate(360);
                                    setScale(1.2);
                                }}
                            >
                                <div className="h-40 w-full">
                                    <svg width="100%" height="100%" viewBox="0 0 600 400">
                                        <path
                                            d="M300 100 L330 180 L410 180 L350 230 L380 310 L300 260 L220 310 L250 230 L190 180 L270 180 L300 100 Z"
                                            fill="#5E4290"
                                            stroke="#8847BB"
                                            strokeWidth="4"
                                        />
                                    </svg>
                                </div>
                                <h3 className="mt-2 text-center text-sm font-medium">Star</h3>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </UtilitiesLayout>
    );
}
