export function generateGradientColors(hexColor: string): string[] {
    const originalColor = hexColor.replace(/^#/, '');
    const originalRGB = {
        r: parseInt(originalColor.slice(0, 2), 16),
        g: parseInt(originalColor.slice(2, 4), 16),
        b: parseInt(originalColor.slice(4, 6), 16),
    };

    const gradientColors = [hexColor];

    // Calculate the differences between the original RGB and black (0, 0, 0)
    const diffR = originalRGB.r;
    const diffG = originalRGB.g;
    const diffB = originalRGB.b;

    // Calculate the gradient steps
    const stepR = diffR / 3;
    const stepG = diffG / 3;
    const stepB = diffB / 3;

    for (let i = 1; i <= 3; i++) {
        const newRGB = {
            r: Math.round(originalRGB.r - stepR * i),
            g: Math.round(originalRGB.g - stepG * i),
            b: Math.round(originalRGB.b - stepB * i),
        };

        const newHex = `#${newRGB.r.toString(16).padStart(2, '0')}${newRGB.g.toString(16).padStart(2, '0')}${newRGB.b.toString(16).padStart(2, '0')}`;
        gradientColors.push(newHex);
    }

    return gradientColors;
}