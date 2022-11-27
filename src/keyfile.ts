import { join, log } from "../deps.ts";

import { ENDPOINT } from "./api/common.ts";
import { envHOMEDIR } from "./utilities/environment.ts";

export const KEY_SUFFIX = (ENDPOINT === "https://x.nest.land")
  ? ""
  : `-${slugify(ENDPOINT)}`;

export const KEY_FILE = `.nest-api-key${KEY_SUFFIX}`;

function slugify(text: string): string {
  return String(text)
    .toLowerCase()
    .replace(/[\s ]+/g, "-")
    .replace(/[^a-z0-9-_]+/g, "")
    .replace(/[-]{2,}/g, "-")
    .replace(/^[-]+|[-]+$/g, "");
}

export async function writeAPIKey(key: string): Promise<void> {
  const keyPath = join(envHOMEDIR(), KEY_FILE);
  log.debug("Key Path:", keyPath);
  await Deno.writeTextFile(keyPath, key);
}

export async function getAPIKey(): Promise<string> {
  try {
    return await Deno.readTextFile(join(envHOMEDIR(), KEY_FILE));
  } catch (err) {
    if (!(err instanceof Deno.errors.NotFound)) {
      throw err; // something else happened, let them know
    }
    return ""; // return an empty string if file does not exist
  }
}
