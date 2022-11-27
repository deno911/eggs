import { Command, log } from "../../deps.ts";
import type { DefaultOptions } from "../commands.ts";
import { KEY_FILE, writeAPIKey } from "../keyfile.ts";
import { version } from "../version.ts";
import { setupLog } from "../utilities/log.ts";

/** Link Command.
 * Provided a key, the `link` commands creates
 * a persistent file on the host os to save
 * the API key to. */
export async function link(option: void | Options, key: string) {
  const options = {
    debug: linkCommand.getGlobalOption("debug"),
    ...(option || {}),
  } as Options;
  await setupLog(options.debug);

  log.debug("Key: ", key);
  await writeAPIKey(key);
  log.info(`Successfully updated ${KEY_FILE} with your key!`);
}

export type Options = Record<string, unknown> & DefaultOptions;
export type Arguments = [string];

export const linkCommand = new Command()
  .version(version)
  .description("Links your nest.land API key to the CLI")
  .arguments("<key:string>")
  .action(link);

export default linkCommand;
