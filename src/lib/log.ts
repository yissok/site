// src/lib/log.ts
import { get } from "svelte/store";
import { debugMode } from "./logStore";

export function dlog(...args: any[]) {
    if (get(debugMode)) {
        console.log(...args);
    }
}

export function dwarn(...args: any[]) {
    if (get(debugMode)) {
        console.warn(...args);
    }
}

export function derror(...args: any[]) {
    if (get(debugMode)) {
        console.error(...args);
    }
}
