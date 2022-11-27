import { Command, CompletionsCommand, HelpCommand } from "../deps.ts";
import { type LogLevelNames } from "./utilities/types.ts";

export { default as info } from "./commands/info.ts";
export { default as init } from "./commands/init.ts";
export { default as install } from "./commands/install.ts";
export { default as link } from "./commands/link.ts";
export { default as publish } from "./commands/publish.ts";
export { default as update } from "./commands/update.ts";
export { default as upgrade } from "./commands/upgrade.ts";

export const help = new HelpCommand();
export const completions = new CompletionsCommand();

export { Command };

export * from "./utilities/types.ts";

export interface DefaultOptions {
  debug?: boolean;
  outputLog?: boolean;
  logLevel?: LogLevelNames;
  quiet?: boolean;
}

export const defaultOptions: DefaultOptions = {
  debug: false,
  outputLog: true,
  logLevel: "info",
  quiet: false,
};
