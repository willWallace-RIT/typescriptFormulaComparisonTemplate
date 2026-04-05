import * as Babel from '@babel/standalone';

import {
    fmul_fast,
    fdiv_fast,
    finv_fast,
    fsqrt_fast,
    fcos_fast,
    fsine_fast,
    ftan_fast
} from "./fastmath";


   const canvas: HTMLCanvasElement = document.getElementById('plotCanvas')!;
   const ctx = canvas.getContext('2d')!;

   function getRandomColor(): string {
       const r = Math.floor(Math.random() * 256);
       const g = Math.floor(Math.random() * 256);
       const b = Math.floor(Math.random() * 256);
       return `rgba(${r}, ${g}, ${b}, 0.7)`;
   }

   function plotFormulas(formulas: string[]): void {
       ctx.clearRect(0, 0, canvas.width, canvas.height);

       formulas.forEach((formula, index) => {
           const color = getRandomColor();
           const parsedFormula = Babel.transform(formula, { presets: ['@babel/preset-env'] }).code;
           const fn = new Function('x', parsedFormula);
           const step = 2;
           ctx.strokeStyle = color;

           for (let x = -canvas.width / 2; x < canvas.width / 2; x += step) {
               const y = fn(x);
               if (typeof y === 'number') {
                   ctx.beginPath();
                   ctx.moveTo(x + canvas.width / 2, canvas.height / 2 - y * 10);
                   ctx.lineTo(x + canvas.width / 2 + step, canvas.height / 2 - fn(x + step) * 10);
                   ctx.stroke();
               }
           }
       });
   }

   const formulas = [
    'fmul_fast(x,7.6903)',
    'x*7.6903)',
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
       // Add more formulas here
   ];

   plotFormulas(formulas);