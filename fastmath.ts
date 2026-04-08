//fast math lib by will Gardner(and others through the grapevine)
//fast math does mean fast but it doesn mean it is as accurate


const PI: number = 3.14159265359;

export function f2u(x: number): number {
  const u: number = Number.MAX_SAFE_INTEGER & x;
  return u;
}

export function u2f(u: number): number {
  const x: number = u;
  return x;
}

export function fmul_fast(a: number, b: number): number {
  const ia: number = f2u(a);
  const ib: number = f2u(b);
  const uiA = new Uint32Array(1);
  const uiB = new Uint32Array(1);
  uiA[0]=0x007FFFFF;
  uiB[0]=(ia^ib)>>>0; 
  //return u2f((ia + ib - 0x3F800000) + (((ia ^ ib) & 0x007FFFFFu) >> 4));
  return u2f((ia + ib - 0x3F800000)>>>0 + ((uiA[0]>>>0 & uiB[0]>>>0) >>> 4));
}

export function fdiv_fast(a: number, b: number): number {
  const ia: number = f2u(a);
  const ib: number = f2u(b);
  const uiA = new Uint32Array(1);
  const uiB = new Uint32Array(1);
  uiA[0]=0x007FFFFF;
  uiB[0]=ia^ib>>>0;
  //return u2f((ia - ib + 0x3F800000) - (((ia ^ ib) & 0x007FFFFFu) >> 4));
  return u2f((ia - ib + 0x3F800000)>>>0 - ((uiA[0]>>>0 & uiB[0]>>>0) >>> 4));
}

export function finv_fast(x: number): number {
  const ix = f2u(x) >>> 0;

  // exponent inversion approximation
  const base = (0x7F000000 - ix) >>> 0;

  // mantissa correction (scaled)
  const mant = (ix & 0x007FFFFF) >>> 2;

  return u2f((base>>>0 + mant>>>0) >>> 0);
}

export function fsqrt_fast(x: number): number {
  const ix: number = f2u(x);
  const uiA = new Uint32Array(1);
  uiA[0] = 0x007FFFFF;
  return u2f(((ix >>> 1) + 0x1FC00000)>>>0 + ((ix>>>0 & uiA[0]>>>0) >>> 5));
  //return u2f((ix >> 1) + 0x1FC00000 + ((ix & 0x007FFFFFu) >> 5));
}

export function frsqrt_fast(x: number): number {
  const ix: number = f2u(x);
  const uiA = new Uint32Array(1);
  uiA[0] = 0x007FFFFF;
  return u2f(((0x5F400000 - (ix >>> 1))>>>0 + ((ix>>>0 & uiA[0]>>>0) >>> 4)));
  //return u2f((0x5F400000 - (ix >> 1)) + ((ix & 0x007FFFFFu) >> 4));
}

export function fcos_fast(x: number): number {
  const x2: number = fmul_fast(x, x);
  return 1.0 + fmul_fast(x2, (-0.5 + fmul_fast(x2, (0.04166652 + fmul_fast(-0.0013854855, x2)))));
  //return 1.0 + x2 * (-0.5 + x2 * (0.04166652 + fmul_fast(-0.0013854855, x2)));
}


export function fsine_fast(x: number): number {
  const B: number = fdiv_fast(4,PI);
  //const B: number = 4 / PI;
  const C: number = fdiv_fast(-4 , fmul_fast(PI, PI));
  //const C: number = -4 / (PI * PI);

  //let y: number = B * x + C * x * Math.abs(x);
  let y: number = fmul_fast(B, x) + fmul_fast(fmul_fast(C , x), Math.abs(x));

  // #ifdef EXTRA_PRECISION
  //   const float Q = 0.775;
  //   const float P = 0.225;

  //   y = P * (y * abs(y) - y) + y;   // Q * y + P * y * abs(y)
  // #endif

  return y;
}
export function ftan_fast(x:number): number {
  let y1: number = fsine_fast(x);
  let y2: number = fcos_fast(x);
  return fdiv_fast(y1,y2); 
}