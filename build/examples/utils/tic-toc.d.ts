/**
 * Helper for printing timings, in the spirit of Python's `tic` and `toc`.
 */
export { tic, toc };
declare function tic(label?: string): void;
declare function toc(): number;
