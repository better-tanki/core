export type Nullable<T> = T | null;
export type Constructor<T> = { new (): T; };

export interface HasPartial<P> { partial(): P; }
export interface HasInfo<I> { info(): I; }
