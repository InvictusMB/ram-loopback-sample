/// <reference types="react-scripts" />

declare module '@ram-stack/composition-root/macro';
declare module '@ram-stack/context';

type PickInjected<T> = import('@ram-stack/context').PickInjectedDependencies<T[number]>;
type Shell = import('@ram-stack/context').Shell;
