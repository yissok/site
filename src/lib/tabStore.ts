import { writable } from "svelte/store";

export const activeTab = writable(3);
export const activeCellTab = writable(1);
export const backgroundColor = writable("hsl(0, 100%, 50%)"); // Default value
export const currentBackgroundColor = writable("hsl(0, 100%, 50%)"); // Default value
