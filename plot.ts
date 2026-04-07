import {
    fmul_fast,
    fdiv_fast,
    finv_fast,
    fsqrt_fast,
    fcos_fast,
    fsine_fast,
    ftan_fast
} from "./fastmath";

const canvas = document.getElementById('plotCanvas')!;
const ctx = canvas.getContext('2d')!;

function getRandomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgba(${r}, ${g}, ${b}, 0.7)`;
}

function plotFormulas(formulas) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

   const deps = [fmul_fast, fdiv_fast, finv_fast, fsqrt_fast, fcos_fast, fsine_fast, ftan_fast];

formulas.forEach((formula) => {
    const color = getRandomColor();

    const fn = new Function(
        'x',
        'fmul_fast',
        'fdiv_fast',
        'finv_fast',
        'fsqrt_fast',
        'fcos_fast',
        'fsine_fast',
        'ftan_fast',
        `return ${formula};`
    );

    const step = 2;
    ctx.strokeStyle = color;

    for (let x = -canvas.width / 2; x < canvas.width / 2; x += step) {
        const y1 = fn(x, ...deps);
        const y2 = fn(x + step, ...deps);

        if (!Number.isFinite(y1) || !Number.isFinite(y2)) continue;
        if (Math.abs(y2 - y1) > 1000) continue;

        ctx.beginPath();
        ctx.moveTo(x + canvas.width / 2, canvas.height / 2 - y1 * 10);
        ctx.lineTo(x + canvas.width / 2 + step, canvas.height / 2 - y2 * 10);
        ctx.stroke();
    }
});
}

const formulas = [
    'fmul_fast(x,7.6903)',
    'x*7.6903',
    'fdiv_fast(x,2.485)',
    'x/2.485',
    'finv_fast(x)',
    '1.0/x',
    'fsqrt_fast(x)',
    'Math.sqrt(x)',
    'fcos_fast(x)',
    'Math.cos(x)',
    'fsine_fast(x)',
    'Math.sin(x)',
    'ftan_fast(x)',
    'Math.tan(x)',
];

plotFormulas(formulas);