import * as iconNodesCollection from 'lucide-static/icon-nodes.json';
import type { IconNode as LucideReactIconNode } from 'lucide-react';

// The icon-nodes.json file structure can vary based on module interop.
// We assert the type to access its keys.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const iconsObject = ((iconNodesCollection as any).default || iconNodesCollection) as { [key: string]: unknown };

const allKeys = Object.keys(iconsObject);

// Filter out any potential non-string keys or other unexpected entries
const validIconKeys = allKeys.filter(key => 
    typeof key === 'string' && 
    key !== 'default' && // Exclude 'default' if it exists as a key
    /^[a-z0-9]+(-[a-z0-9]+)*$/.test(key) // Basic kebab-case check
);

// Create a string literal union type from the array of icon names
export type LucideIconName = typeof validIconKeys[number];

// Export the raw icon nodes object as well, typed more specifically for icon node structure
// Each icon node is an array: [tag: string, attributes: object, children?: Array<[tag: string, attributes: object]>] 
export const lucideIconNodes = iconsObject as { [key in LucideIconName]: LucideReactIconNode };

// You can add a log to verify during development, then remove
// console.log(`Loaded ${lucideIconNames.length} Lucide icon names and their nodes.`);

export const lucideIconNames: LucideIconName[] = validIconKeys; 