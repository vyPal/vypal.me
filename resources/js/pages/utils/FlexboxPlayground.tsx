import UtilitiesLayout from '@/layouts/UtilitiesLayout';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';

interface FlexItemProps {
    number: number;
    order: number;
    flexGrow: number;
    flexShrink: number;
    flexBasis: string;
    alignSelf: string;
}

type FlexDirection = 'column' | 'inherit' | '-moz-initial' | 'initial' | 'revert' | 'unset' | 'column-reverse' | 'row' | 'row-reverse' | undefined;
type FlexWrap = 'nowrap' | 'wrap' | 'wrap-reverse' | undefined;

export default function FlexboxPlayground() {
    // Container properties
    const [flexDirection, setFlexDirection] = useState('row');
    const [flexWrap, setFlexWrap] = useState('nowrap');
    const [justifyContent, setJustifyContent] = useState('flex-start');
    const [alignItems, setAlignItems] = useState('stretch');
    const [alignContent, setAlignContent] = useState('normal');
    const [gap, setGap] = useState(0);

    // Items
    const [flexItems, setFlexItems] = useState<FlexItemProps[]>([
        { number: 1, order: 0, flexGrow: 0, flexShrink: 1, flexBasis: 'auto', alignSelf: 'auto' },
        { number: 2, order: 0, flexGrow: 0, flexShrink: 1, flexBasis: 'auto', alignSelf: 'auto' },
        { number: 3, order: 0, flexGrow: 0, flexShrink: 1, flexBasis: 'auto', alignSelf: 'auto' },
    ]);

    // Container dimensions
    const [containerWidth, setContainerWidth] = useState(500);
    const [containerHeight, setContainerHeight] = useState(300);

    // Selected item for editing
    const [selectedItem, setSelectedItem] = useState<number | null>(null);

    // Generated CSS
    const [containerCSS, setContainerCSS] = useState('');
    const [itemsCSS, setItemsCSS] = useState('');

    // Generate CSS code
    useEffect(() => {
        // Container CSS
        let css = `.container {\n`;
        css += `  display: flex;\n`;
        css += `  flex-direction: ${flexDirection};\n`;
        css += `  flex-wrap: ${flexWrap};\n`;
        css += `  justify-content: ${justifyContent};\n`;
        css += `  align-items: ${alignItems};\n`;

        if (alignContent !== 'normal') {
            css += `  align-content: ${alignContent};\n`;
        }

        if (gap > 0) {
            css += `  gap: ${gap}px;\n`;
        }

        css += `  width: ${containerWidth}px;\n`;
        css += `  height: ${containerHeight}px;\n`;
        css += `}`;

        setContainerCSS(css);

        // Items CSS
        let itemsCss = '';
        flexItems.forEach((item) => {
            if (item.order !== 0 || item.flexGrow !== 0 || item.flexShrink !== 1 || item.flexBasis !== 'auto' || item.alignSelf !== 'auto') {
                itemsCss += `.item-${item.number} {\n`;

                if (item.order !== 0) {
                    itemsCss += `  order: ${item.order};\n`;
                }

                if (item.flexGrow !== 0 || item.flexShrink !== 1 || item.flexBasis !== 'auto') {
                    itemsCss += `  flex: ${item.flexGrow} ${item.flexShrink} ${item.flexBasis};\n`;
                }

                if (item.alignSelf !== 'auto') {
                    itemsCss += `  align-self: ${item.alignSelf};\n`;
                }

                itemsCss += `}\n\n`;
            }
        });

        setItemsCSS(itemsCss);
    }, [flexDirection, flexWrap, justifyContent, alignItems, alignContent, gap, flexItems, containerWidth, containerHeight]);

    // Add a new flex item
    const addFlexItem = () => {
        const newNumber = Math.max(...flexItems.map((item) => item.number), 0) + 1;
        setFlexItems([...flexItems, { number: newNumber, order: 0, flexGrow: 0, flexShrink: 1, flexBasis: 'auto', alignSelf: 'auto' }]);
    };

    // Remove a flex item
    const removeFlexItem = (index: number) => {
        if (flexItems.length <= 1) return;
        const newItems = [...flexItems];
        newItems.splice(index, 1);
        setFlexItems(newItems);
        if (selectedItem === index) {
            setSelectedItem(null);
        }
    };

    // Update a property of a specific flex item
    const updateFlexItem = (index: number, property: keyof FlexItemProps, value: number | string) => {
        const newItems = [...flexItems];
        newItems[index] = { ...newItems[index], [property]: value };
        setFlexItems(newItems);
    };

    // Reset all settings
    const resetSettings = () => {
        setFlexDirection('row');
        setFlexWrap('nowrap');
        setJustifyContent('flex-start');
        setAlignItems('stretch');
        setAlignContent('normal');
        setGap(0);
        setContainerWidth(500);
        setContainerHeight(300);
        setFlexItems([
            { number: 1, order: 0, flexGrow: 0, flexShrink: 1, flexBasis: 'auto', alignSelf: 'auto' },
            { number: 2, order: 0, flexGrow: 0, flexShrink: 1, flexBasis: 'auto', alignSelf: 'auto' },
            { number: 3, order: 0, flexGrow: 0, flexShrink: 1, flexBasis: 'auto', alignSelf: 'auto' },
        ]);
        setSelectedItem(null);
    };

    // Copy CSS to clipboard
    const copyCSS = () => {
        const css = containerCSS + '\n\n' + itemsCSS;
        navigator.clipboard.writeText(css);
        alert('CSS copied to clipboard!');
    };

    // Get color for a flex item
    const getItemColor = (number: number) => {
        const colors = [
            'bg-primary/80',
            'bg-secondary/80',
            'bg-accent/80',
            'bg-[#8847BB]/80',
            'bg-[#5E4290]/80',
            'bg-[#F9BAEE]/80',
            'bg-blue-500/80',
            'bg-green-500/80',
            'bg-yellow-500/80',
            'bg-purple-500/80',
        ];

        return colors[(number - 1) % colors.length];
    };

    return (
        <UtilitiesLayout currentUtility="CSS Flexbox Playground">
            <Head title="CSS Flexbox Playground | Utilities" />

            <div className="mx-auto max-w-7xl">
                <h1 className="mb-6 text-3xl font-bold">CSS Flexbox Playground</h1>
                <p className="text-muted-foreground mb-8 text-lg">
                    Interactively experiment with CSS Flexbox properties and see the results in real-time.
                </p>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
                    {/* Controls Panel */}
                    <div className="lg:col-span-2">
                        <div className="bg-card rounded-lg border p-6 shadow-sm">
                            <h2 className="mb-4 text-xl font-semibold">Container Properties</h2>

                            {/* Container Controls */}
                            <div className="mb-8 space-y-4">
                                <div>
                                    <label className="mb-2 block text-sm font-medium">flex-direction</label>
                                    <select
                                        value={flexDirection}
                                        onChange={(e) => setFlexDirection(e.target.value)}
                                        className="border-border bg-background w-full rounded-md px-3 py-2 text-sm"
                                    >
                                        <option value="row">row</option>
                                        <option value="row-reverse">row-reverse</option>
                                        <option value="column">column</option>
                                        <option value="column-reverse">column-reverse</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium">flex-wrap</label>
                                    <select
                                        value={flexWrap}
                                        onChange={(e) => setFlexWrap(e.target.value)}
                                        className="border-border bg-background w-full rounded-md px-3 py-2 text-sm"
                                    >
                                        <option value="nowrap">nowrap</option>
                                        <option value="wrap">wrap</option>
                                        <option value="wrap-reverse">wrap-reverse</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium">justify-content</label>
                                    <select
                                        value={justifyContent}
                                        onChange={(e) => setJustifyContent(e.target.value)}
                                        className="border-border bg-background w-full rounded-md px-3 py-2 text-sm"
                                    >
                                        <option value="flex-start">flex-start</option>
                                        <option value="flex-end">flex-end</option>
                                        <option value="center">center</option>
                                        <option value="space-between">space-between</option>
                                        <option value="space-around">space-around</option>
                                        <option value="space-evenly">space-evenly</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium">align-items</label>
                                    <select
                                        value={alignItems}
                                        onChange={(e) => setAlignItems(e.target.value)}
                                        className="border-border bg-background w-full rounded-md px-3 py-2 text-sm"
                                    >
                                        <option value="stretch">stretch</option>
                                        <option value="flex-start">flex-start</option>
                                        <option value="flex-end">flex-end</option>
                                        <option value="center">center</option>
                                        <option value="baseline">baseline</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium">align-content</label>
                                    <select
                                        value={alignContent}
                                        onChange={(e) => setAlignContent(e.target.value)}
                                        className="border-border bg-background w-full rounded-md px-3 py-2 text-sm"
                                    >
                                        <option value="normal">normal</option>
                                        <option value="flex-start">flex-start</option>
                                        <option value="flex-end">flex-end</option>
                                        <option value="center">center</option>
                                        <option value="space-between">space-between</option>
                                        <option value="space-around">space-around</option>
                                        <option value="space-evenly">space-evenly</option>
                                        <option value="stretch">stretch</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium">gap: {gap}px</label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="50"
                                        value={gap}
                                        onChange={(e) => setGap(parseInt(e.target.value))}
                                        className="w-full"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="mb-2 block text-sm font-medium">Width: {containerWidth}px</label>
                                        <input
                                            type="range"
                                            min="200"
                                            max="800"
                                            value={containerWidth}
                                            onChange={(e) => setContainerWidth(parseInt(e.target.value))}
                                            className="w-full"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium">Height: {containerHeight}px</label>
                                        <input
                                            type="range"
                                            min="100"
                                            max="500"
                                            value={containerHeight}
                                            onChange={(e) => setContainerHeight(parseInt(e.target.value))}
                                            className="w-full"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Item Controls */}
                            <div className="mb-6">
                                <div className="mb-3 flex items-center justify-between">
                                    <h2 className="text-xl font-semibold">Flex Items</h2>
                                    <button
                                        onClick={addFlexItem}
                                        className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-3 py-1.5 text-sm font-medium"
                                    >
                                        Add Item
                                    </button>
                                </div>

                                <div className="mb-4 flex flex-wrap gap-2">
                                    {flexItems.map((item, index) => (
                                        <button
                                            key={item.number}
                                            onClick={() => setSelectedItem(index)}
                                            className={`flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium ${
                                                selectedItem === index
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'bg-secondary/20 hover:bg-secondary/30'
                                            }`}
                                        >
                                            {item.number}
                                        </button>
                                    ))}
                                </div>

                                {selectedItem !== null && (
                                    <div className="rounded-md border p-4">
                                        <div className="mb-4 flex items-center justify-between">
                                            <h3 className="font-medium">Item {flexItems[selectedItem].number}</h3>
                                            <button
                                                onClick={() => removeFlexItem(selectedItem)}
                                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-md px-2 py-1 text-xs font-medium"
                                            >
                                                Remove
                                            </button>
                                        </div>

                                        <div className="space-y-3">
                                            <div>
                                                <label className="mb-1 block text-xs font-medium">order</label>
                                                <input
                                                    type="number"
                                                    value={flexItems[selectedItem].order}
                                                    onChange={(e) => updateFlexItem(selectedItem, 'order', parseInt(e.target.value))}
                                                    className="border-border bg-background w-full rounded-md px-3 py-1.5 text-sm"
                                                />
                                            </div>

                                            <div className="grid grid-cols-3 gap-2">
                                                <div>
                                                    <label className="mb-1 block text-xs font-medium">flex-grow</label>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        step="1"
                                                        value={flexItems[selectedItem].flexGrow}
                                                        onChange={(e) => updateFlexItem(selectedItem, 'flexGrow', parseFloat(e.target.value))}
                                                        className="border-border bg-background w-full rounded-md px-3 py-1.5 text-sm"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="mb-1 block text-xs font-medium">flex-shrink</label>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        step="1"
                                                        value={flexItems[selectedItem].flexShrink}
                                                        onChange={(e) => updateFlexItem(selectedItem, 'flexShrink', parseFloat(e.target.value))}
                                                        className="border-border bg-background w-full rounded-md px-3 py-1.5 text-sm"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="mb-1 block text-xs font-medium">flex-basis</label>
                                                    <input
                                                        type="text"
                                                        value={flexItems[selectedItem].flexBasis}
                                                        onChange={(e) => updateFlexItem(selectedItem, 'flexBasis', e.target.value)}
                                                        className="border-border bg-background w-full rounded-md px-3 py-1.5 text-sm"
                                                        placeholder="auto, 100px, 50%..."
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="mb-1 block text-xs font-medium">align-self</label>
                                                <select
                                                    value={flexItems[selectedItem].alignSelf}
                                                    onChange={(e) => updateFlexItem(selectedItem, 'alignSelf', e.target.value)}
                                                    className="border-border bg-background w-full rounded-md px-3 py-1.5 text-sm"
                                                >
                                                    <option value="auto">auto</option>
                                                    <option value="flex-start">flex-start</option>
                                                    <option value="flex-end">flex-end</option>
                                                    <option value="center">center</option>
                                                    <option value="baseline">baseline</option>
                                                    <option value="stretch">stretch</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex space-x-3">
                                <button
                                    onClick={resetSettings}
                                    className="border-border hover:bg-secondary/10 rounded-md border px-4 py-2 text-sm font-medium"
                                >
                                    Reset All
                                </button>

                                <button
                                    onClick={copyCSS}
                                    className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 text-sm font-medium"
                                >
                                    Copy CSS
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Preview Panel */}
                    <div className="lg:col-span-3">
                        <div className="bg-card rounded-lg border p-6 shadow-sm">
                            <h2 className="mb-4 text-xl font-semibold">Preview</h2>

                            {/* Flex Container Preview */}
                            <div className="border-border bg-background mb-8 overflow-auto rounded-md border p-4">
                                <div
                                    className="flex items-start"
                                    style={{
                                        flexDirection: flexDirection as FlexDirection,
                                        flexWrap: flexWrap as FlexWrap,
                                        justifyContent: justifyContent,
                                        alignItems: alignItems,
                                        alignContent: alignContent,
                                        gap: `${gap}px`,
                                        width: `${containerWidth}px`,
                                        height: `${containerHeight}px`,
                                        background:
                                            'repeating-linear-gradient(45deg, var(--secondary), var(--secondary) 10px, var(--card) 10px, var(--card) 20px)',
                                        backgroundSize: '20px 20px',
                                        border: '1px dashed var(--border)',
                                        position: 'relative',
                                        padding: '4px',
                                    }}
                                >
                                    {flexItems.map((item, index) => (
                                        <div
                                            key={item.number}
                                            className={`flex cursor-pointer items-center justify-center rounded p-4 text-white transition-all ${getItemColor(item.number)} ${selectedItem === index ? 'ring-primary ring-2' : ''}`}
                                            style={{
                                                order: item.order,
                                                flexGrow: item.flexGrow,
                                                flexShrink: item.flexShrink,
                                                flexBasis: item.flexBasis,
                                                alignSelf: item.alignSelf,
                                                minWidth: '60px',
                                                minHeight: '60px',
                                            }}
                                            onClick={() => setSelectedItem(index)}
                                        >
                                            {item.number}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Generated CSS */}
                            <h2 className="mb-3 text-xl font-semibold">Generated CSS</h2>
                            <div className="border-border overflow-hidden rounded-md border">
                                <div className="bg-secondary/10 flex items-center justify-between px-4 py-2">
                                    <span className="text-sm font-medium">CSS Code</span>
                                    <button onClick={copyCSS} className="text-primary text-xs hover:underline">
                                        Copy to Clipboard
                                    </button>
                                </div>
                                <pre className="bg-card overflow-auto p-4 text-xs leading-relaxed">
                                    <code>{containerCSS}</code>
                                    {itemsCSS && (
                                        <>
                                            <code>{'\n\n'}</code>
                                            <code>{itemsCSS}</code>
                                        </>
                                    )}
                                </pre>
                            </div>
                        </div>

                        {/* Flexbox Explanation */}
                        <div className="bg-card mt-8 rounded-lg border p-6 shadow-sm">
                            <h2 className="mb-4 text-xl font-semibold">Understanding Flexbox</h2>

                            <div className="space-y-4 text-sm">
                                <p>
                                    <strong>Flexbox</strong> is a one-dimensional layout method for arranging items in rows or columns. Items flex to
                                    fill additional space and shrink to fit into smaller spaces.
                                </p>

                                <div>
                                    <h3 className="mb-2 font-medium">Container Properties:</h3>
                                    <ul className="ml-5 list-disc space-y-1">
                                        <li>
                                            <strong>flex-direction</strong>: Sets the direction of the flex items (row, row-reverse, column,
                                            column-reverse)
                                        </li>
                                        <li>
                                            <strong>flex-wrap</strong>: Specifies whether items should wrap if necessary
                                        </li>
                                        <li>
                                            <strong>justify-content</strong>: Aligns items along the main axis
                                        </li>
                                        <li>
                                            <strong>align-items</strong>: Aligns items along the cross axis
                                        </li>
                                        <li>
                                            <strong>align-content</strong>: Distributes space between lines when wrapping
                                        </li>
                                        <li>
                                            <strong>gap</strong>: Sets the spacing between flex items
                                        </li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="mb-2 font-medium">Item Properties:</h3>
                                    <ul className="ml-5 list-disc space-y-1">
                                        <li>
                                            <strong>order</strong>: Controls the order in which the item appears
                                        </li>
                                        <li>
                                            <strong>flex-grow</strong>: Determines how much the item will grow relative to other items
                                        </li>
                                        <li>
                                            <strong>flex-shrink</strong>: Specifies how much the item will shrink relative to others
                                        </li>
                                        <li>
                                            <strong>flex-basis</strong>: Sets the initial main size of the item
                                        </li>
                                        <li>
                                            <strong>align-self</strong>: Overrides the container's align-items property
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </UtilitiesLayout>
    );
}
