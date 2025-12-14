export function shiftPoints(direction, new_spacing, old_spacing, radius_mm, point_colors, grid_style) {
    let dx = 0, dy = 0;

    // Echo 384
    const rows384 = 16;
    const cols384 = 24;
    const echoXSpacing = 5;
    const echoYSpacing = 5;
    const maxX384 = (cols384 - 1) * echoXSpacing;
    const maxY384 = (rows384 - 1) * echoYSpacing;

    // Echo 1536
    const Echo1536XSpacing = 2.5;
    const Echo1536YSpacing = 2.5;

    // -------------------------
    // Direction → shift amount
    // -------------------------
    if (grid_style === "Echo384" || grid_style === "Echo384Image") {
        if (direction === "up") dy = -echoYSpacing;
        else if (direction === "down") dy = echoYSpacing;
        else if (direction === "left") dx = -echoXSpacing;
        else if (direction === "right") dx = echoXSpacing;
    } 
    else if (grid_style === "Echo1536" || grid_style === "Echo1536Image") {
        if (direction === "up") dy = -Echo1536YSpacing;
        else if (direction === "down") dy = Echo1536YSpacing;
        else if (direction === "left") dx = -Echo1536XSpacing;
        else if (direction === "right") dx = Echo1536XSpacing;
    }
    else {
        if (direction === "up") dy = new_spacing;
        else if (direction === "down") dy = -new_spacing;
        else if (direction === "left") dx = -new_spacing;
        else if (direction === "right") dx = new_spacing;
    }

    let shifted = {};

    // --------------------------------------------------
    // MODE: full regrid (direction === "all")
    // --------------------------------------------------
    if (direction === "all") {
        for (const key in point_colors) {
            const [xStr, yStr] = key.split(",").map(s => s.trim());
            const x = Number(xStr);
            const y = Number(yStr);

            let newX, newY;

            if (grid_style.startsWith("Echo384")) {
                const i = Math.round(x / echoXSpacing);
                const j = Math.round(y / echoYSpacing);

                newX = Math.max(0, Math.min(i * echoXSpacing, maxX384));
                newY = Math.max(0, Math.min(j * echoYSpacing, maxY384));
            }
            else if (grid_style.startsWith("Echo1536")) {
                const i = Math.round(x / Echo1536XSpacing);
                const j = Math.round(y / Echo1536YSpacing);

                newX = i * Echo1536XSpacing;
                newY = j * Echo1536YSpacing;
            }
            else {
                const i = Math.round(x / old_spacing);
                const j = Math.round(y / old_spacing);

                newX = i * new_spacing;
                newY = j * new_spacing;
            }

            shifted[`${newX.toFixed(3)}, ${newY.toFixed(3)}`] = point_colors[key];
        }

        return shifted;
    }

    // --------------------------------------------------
    // MODE: shift by vector (dx, dy)
    // --------------------------------------------------
    for (const key in point_colors) {
        const [xStr, yStr] = key.split(",").map(s => s.trim());
        const x = Number(xStr);
        const y = Number(yStr);

        let newX = x + dx;
        let newY = y + dy;

        if (grid_style.startsWith("Echo384") || grid_style.startsWith("Echo1536")) {
            const maxX1536 = (48 - 1) * Echo1536XSpacing;
            const maxY1536 = (32 - 1) * Echo1536YSpacing;

            newX = Math.max(0, Math.min(newX, maxX1536));
            newY = Math.max(0, Math.min(newY, maxY1536));
        }
        else {
            // radial limit
            if (Math.sqrt(newX * newX + newY * newY) > radius_mm)
                continue;
        }

        shifted[`${newX.toFixed(3)}, ${newY.toFixed(3)}`] = point_colors[key];
    }

    return shifted;
}


export function roundPoint(p) {
    return Math.round(parseFloat(p) * 1000) / 1000;
}