import SEO from '@/components/SEO';
import UtilitiesLayout from '@/layouts/UtilitiesLayout';
import { useState } from 'react';

export default function ColorPalette() {
    const [baseColor, setBaseColor] = useState('#8847BB');
    const [palettes, setPalettes] = useState<{ name: string; colors: string[] }[]>([]);

    const generatePalette = () => {
        // Implement color palette generation logic
        // This is just a placeholder implementation
        const complementary = invertColor(baseColor);
        const analogous1 = shiftHue(baseColor, 30);
        const analogous2 = shiftHue(baseColor, -30);
        const triadic1 = shiftHue(baseColor, 120);
        const triadic2 = shiftHue(baseColor, -120);

        setPalettes([
            { name: 'Complementary', colors: [baseColor, complementary] },
            { name: 'Analogous', colors: [analogous2, baseColor, analogous1] },
            { name: 'Triadic', colors: [baseColor, triadic1, triadic2] },
        ]);
    };

    // Helper function to invert a color (complementary)
    const invertColor = (hex: string) => {
        // Remove the # if present
        hex = hex.replace('#', '');

        // Convert to RGB
        let r = parseInt(hex.substring(0, 2), 16);
        let g = parseInt(hex.substring(2, 4), 16);
        let b = parseInt(hex.substring(4, 6), 16);

        // Invert the colors
        r = 255 - r;
        g = 255 - g;
        b = 255 - b;

        // Convert back to hex
        return '#' + r.toString(16).padStart(2, '0') + g.toString(16).padStart(2, '0') + b.toString(16).padStart(2, '0');
    };

    const shiftHue = (hex: string, degrees: number): string => {
        // Remove the hash if it exists
        hex = hex.replace(/^#/, '');

        // Convert hex to RGB
        const r = parseInt(hex.substring(0, 2), 16) / 255;
        const g = parseInt(hex.substring(2, 4), 16) / 255;
        const b = parseInt(hex.substring(4, 6), 16) / 255;

        // Convert RGB to HSL
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h = 0; // Hue
        let s = 0; // Saturation
        const l = (max + min) / 2; // Lightness

        if (max === min) {
            h = 0; // Achromatic
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
            }
            h /= 6;
        }

        // Shift the hue
        h = (h + degrees / 360) % 1;
        if (h < 0) {
            h += 1;
        }

        // Convert HSL back to RGB
        let r1, g1, b1;

        if (s === 0) {
            r1 = g1 = b1 = l; // Achromatic
        } else {
            const hue2rgb = (p: number, q: number, t: number) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            };

            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;

            r1 = hue2rgb(p, q, h + 1 / 3);
            g1 = hue2rgb(p, q, h);
            b1 = hue2rgb(p, q, h - 1 / 3);
        }

        // Convert RGB back to hex
        const toHex = (c: number) => {
            const hex = Math.round(c * 255).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };

        const finalHex = `#${toHex(r1)}${toHex(g1)}${toHex(b1)}`;

        return finalHex.toUpperCase(); // Return in uppercase for consistency
    };

    return (
        <UtilitiesLayout currentUtility="Color Palette Generator">
            <SEO
                title="Color Palette Generator | vyPal.me Utilities"
                description="Create harmonious color schemes for your design projects. Generate complementary, analogous and triadic color palettes with ease."
                keywords="color palette, design tools, web design, color scheme, color theory, harmonious colors"
                tags={['colors', 'design', 'palette', 'web design', 'color scheme']}
                url="https://vypal.me/utils/color-palette"
            />

            <div className="mx-auto max-w-4xl">
                <h1 className="mb-6 text-3xl font-bold">Color Palette Generator</h1>
                <p className="mb-8 text-lg text-[#706f6c] dark:text-[#A1A09A]">
                    Generate harmonious color palettes for your designs. Choose a base color to get started.
                </p>

                <div className="mb-10 rounded-lg border bg-white p-6 shadow-sm dark:border-[#3E3E3A] dark:bg-[#161615]">
                    <div className="mb-6 flex flex-wrap items-center gap-4">
                        <div>
                            <label htmlFor="color-picker" className="mb-2 block text-sm font-medium">
                                Base Color
                            </label>
                            <div className="flex items-center">
                                <input
                                    type="color"
                                    id="color-picker"
                                    value={baseColor}
                                    onChange={(e) => setBaseColor(e.target.value)}
                                    className="h-10 w-16 cursor-pointer rounded border-0"
                                />
                                <input
                                    type="text"
                                    value={baseColor}
                                    onChange={(e) => setBaseColor(e.target.value)}
                                    className="ml-3 w-28 rounded-md border border-[#e3e3e0] px-3 py-2 dark:border-[#3E3E3A] dark:bg-[#0a0a0a]"
                                />
                            </div>
                        </div>

                        <button
                            onClick={generatePalette}
                            className="mt-6 rounded-md bg-[#1b1b18] px-5 py-2 text-white hover:bg-black dark:bg-[#eeeeec] dark:text-[#1C1C1A] dark:hover:bg-white"
                        >
                            Generate Palette
                        </button>
                    </div>

                    {palettes.length > 0 && (
                        <div className="space-y-8">
                            {palettes.map((palette, index) => (
                                <div key={index}>
                                    <h3 className="mb-3 text-lg font-medium">{palette.name} Palette</h3>
                                    <div className="flex overflow-hidden rounded-md">
                                        {palette.colors.map((color, colorIndex) => (
                                            <div key={colorIndex} className="flex-1">
                                                <div className="h-24 w-full" style={{ backgroundColor: color }}></div>
                                                <div className="bg-white p-2 text-center text-xs dark:bg-[#1C1C1A]">{color.toUpperCase()}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-[#3E3E3A] dark:bg-[#161615]">
                    <h2 className="mb-4 text-xl font-medium">How to Use Color Palettes</h2>
                    <p className="mb-4 text-[#706f6c] dark:text-[#A1A09A]">
                        Color palettes help create visually appealing designs by using colors that work well together. Here are some common color
                        harmony patterns:
                    </p>

                    <ul className="ml-6 list-disc space-y-2 text-[#706f6c] dark:text-[#A1A09A]">
                        <li>
                            <strong>Complementary:</strong> Colors from opposite sides of the color wheel, creating high contrast.
                        </li>
                        <li>
                            <strong>Analogous:</strong> Colors that are adjacent on the color wheel, creating harmony.
                        </li>
                        <li>
                            <strong>Triadic:</strong> Three colors evenly spaced on the color wheel, creating balance and contrast.
                        </li>
                    </ul>
                </div>
            </div>
        </UtilitiesLayout>
    );
}
