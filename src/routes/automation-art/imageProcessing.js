export function getPixelHexColors(ctx, width, height, step = 8) {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const hexColors = [];

    for (let y = 0; y < height; y++) {
        const row = [];
        for (let x = 0; x < width; x++) {
            const index = (y * width + x) * 4;
            let r = data[index];
            let g = data[index + 1];
            let b = data[index + 2];

            // Quantize each channel
            r = Math.min(255, Math.round(r / step) * step);
            g = Math.min(255, Math.round(g / step) * step);
            b = Math.min(255, Math.round(b / step) * step);

            const hex = rgbToHex(r, g, b);
            row.push(hex);
        }
        hexColors.push(row);
    }

    return hexColors;
}

export function hexToRgb(hex) {
    const h = hex.replace('#', '');
    const bigint = parseInt(h, 16);
    return [
        (bigint >> 16) & 255,
        (bigint >> 8) & 255,
        bigint & 255
    ];
}

export function rgbToHex(r, g, b) {
    return "#" + r.toString(16).padStart(2, "0") + g.toString(16).padStart(2, "0") + b.toString(16).padStart(2, "0");
}

export function colorDistance(rgb1, rgb2) {
    const dr = rgb1[0] - rgb2[0];
    const dg = rgb1[1] - rgb2[1];
    const db = rgb1[2] - rgb2[2];
    return dr * dr + dg * dg + db * db;
}

export function closestNamedColor(hex, current_well_colors, well_colors, color_mapping) {
    const target = hexToRgb(hex);
    let minDist = Infinity;
    let closest = null;

    for (const [name, val] of Object.entries(current_well_colors)) {
        if (!val) continue;
        const mapped = color_mapping[name];
        const dist = colorDistance(target, hexToRgb(well_colors[mapped]));
        if (dist < minDist) {
            minDist = dist;
            closest = name;
        }
    }

    return closest;
}

export function getColorMapping(well_colors, randomize) {
    const keys = Object.keys(well_colors);

    // fixed keys that should never change
    const FIXED_KEYS = ["White", "Erase"];

    if (!randomize) {
        const identity = {};
        for (const k of keys) identity[k] = k;
        return identity;
    }

    // keys that can be remapped
    const movable = keys.filter(k => !FIXED_KEYS.includes(k));

    // available targets for remapping (exclude fixed keys)
    const targets = [...movable];

    // shuffle targets
    for (let i = targets.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [targets[i], targets[j]] = [targets[j], targets[i]];
    }

    // build mapping, fixed keys map to themselves
    const mapping = {};
    for (const fk of FIXED_KEYS) {
        mapping[fk] = fk;
    }
    movable.forEach((k, i) => {
        mapping[k] = targets[i];
    });

    return mapping;
}