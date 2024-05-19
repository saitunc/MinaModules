export { getProfiler };
declare function getProfiler(name: string): {
    readonly times: Record<string, any>;
    start(label_: string): void;
    stop(): any;
    store(): void;
};
