// This is a generator of analog clock art using ascii and basic math in TypeScript. It has absolutely no real purpose, use it to have fun or smth.

function GenerateAnalogClock(time: string): void {
    function parseTime(time: string): [number, number, number] {
        const [hours, minutes, seconds] = time.split(":").map(Number);
        return [hours % 12, minutes, seconds];
    }
    
    function drawLine(x1: number, y1: number, x2: number, y2: number, char: string): void {
        let dx = Math.abs(x2 - x1);
        let dy = Math.abs(y2 - y1);
        let sx = x1 < x2 ? 1 : -1;
        let sy = y1 < y2 ? 1 : -1;
        let err = dx - dy;
        while (true) {
            canvas[y1][x1] = char;
            if (x1 === x2 && y1 === y2) break;
            const e2 = 2 * err;
            if (e2 > -dy) {
                err -= dy;
                x1 += sx;
            }
            if (e2 < dx) {
                err += dx;
                y1 += sy;
            }
        }
    }

    function drawCircle(centerX: number, centerY: number, radiusX: number, radiusY: number, char: string): void {
        for (let angle = 0; angle < 360; angle++) {
            const x = Math.round(centerX + radiusX * Math.sin(angle * (Math.PI / 180)));
            const y = Math.round(centerY - radiusY * Math.cos(angle * (Math.PI / 180)));
            if (x >= 0 && x < 120 && y >= 0 && y < 30) canvas[y][x] = char;
        }
    }

    const t = parseTime(time);
    const centerX = 60, centerY = 15, skew = 2.3; // skew - is a parameter to fix distortion when drawing with characters in console. In VSCode console Y = 2.3 works for me.
    const canvas = Array.from({ length: 30 }, () => Array(120).fill(" "));

    drawCircle(centerX, centerY, 27, 27/skew, ".");

    const hourX = Math.round(centerX + 16 * Math.sin((t[0] * 30 + t[1] * 6/60) * (Math.PI / 180)));
    const hourY = Math.round(centerY - 16/skew * Math.cos((t[0] * 30 + t[1] * 6/60) * (Math.PI / 180)));
    drawLine(centerX, centerY, hourX, hourY, "#");

    const minuteX = Math.round(centerX + 20 * Math.sin((t[1] * 6 + t[2] * 6/60) * (Math.PI / 180)));
    const minuteY = Math.round(centerY - 20/skew * Math.cos((t[1] * 6 + t[2] * 6/60) * (Math.PI / 180)));
    drawLine(centerX, centerY, minuteX, minuteY, "I");

    const secondX = Math.round(centerX + 22 * Math.sin(t[2] * 6 * (Math.PI / 180)));
    const secondY = Math.round(centerY - 22/skew * Math.cos(t[2] * 6 * (Math.PI / 180)));
    drawLine(centerX, centerY, secondX, secondY, ",");

    const formattedTime = "("+String(t[0]).padStart(2, "0") + ":" + String(t[1]).padStart(2, "0")+")";
    for (let i = 0; i < formattedTime.length; i++) {canvas[centerY][centerX - Math.floor(formattedTime.length / 2) + i] = formattedTime[i];}

    console.log(canvas.map(row => row.join("")).join("\n"));
}

let cd = new Date(),
    curr_time = cd.getHours()+":"+cd.getMinutes()+":"+cd.getSeconds()
GenerateAnalogClock(curr_time);

// Renarde Rose
