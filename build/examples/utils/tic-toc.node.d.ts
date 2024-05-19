/**
 * Helper for printing timings, in the spirit of Python's `tic` and `toc`.
 *
 * This is a slightly nicer version of './tic-toc.ts' which only works in Node.
 */
export { tic, toc };
declare function tic(label?: string): void;
declare function toc(): number;
