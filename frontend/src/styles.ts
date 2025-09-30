import { twMerge } from "tailwind-merge";

export function cls(...args: unknown[]) {
  return twMerge(args.filter((a) => a && typeof a === "string").join(" "));
}
