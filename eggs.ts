#!/usr/bin/env -S deno run -A --unstable

/// <reference no-default-lib="true" />
/// <reference lib="deno.ns" />
/// <reference lib="deno.window" />
/// <reference lib="deno.unstable" />

// deno-lint-ignore-file
import {
  DenoLand,
  log,
  UpdateNotifier,
} from "./deps.ts";
import {
  Command,
  type DefaultOptions,
  completions,
  help,
  info,
  init,
  install,
  link,
  publish,
  update,
  upgrade,
} from "./src/commands.ts";
import {
  errorOccurred,
  handleError,
  setupLog,
  writeLogFile,
} from "./src/utilities/log.ts";
import { version } from "./src/version.ts";
import { LogLevelNames, logLevelType } from "./src/utilities/types.ts";

const commands = {
  help,
  completions,
  info,
  init,
  install,
  link,
  publish,
  update,
  upgrade,
};

await setupLog();

const notifier = new UpdateNotifier({
  name: "eggs",
  registry: DenoLand,
  currentVersion: version,
});

const checkForUpdates = notifier.checkForUpdates();

// @ts-ignore deep types
const eggs = new Command()
  .throwErrors()
  .name("eggs")
  .version(version)
  .description(
    "🥚 nest.land - module registry and CDN for Deno, on the permaweb",
  )
  .type("LogLevel", logLevelType, { global: true })
  .option("-D, --debug",
          "Print additional information.",
          { global: true })
  .option("-o, --output-log",
          "Create a log file after execution.",
          { global: true })
  .option("-L, --log-level <level:LogLevel>",
          `Set log level.\n`,
          { global: true, default: "info" as unknown as LogLevelNames })
  .option("-q, --quiet", "Suppress diagnostic output",
          { global: true, default: false })
  .action(() => { eggs.showHelp() });

export type CommandName = keyof typeof commands;

for (const name in commands) {
  eggs.command(name, commands[name as CommandName]);
}

try {
  const { options } = await eggs.parse(Deno.args);

  if (options.outputLog) {
    await writeLogFile();
  }
  await notification();

  if (errorOccurred) {
    Deno.exit(1);
  }

  Deno.exit();
} catch (err) {
  if (
    err.message.match(
      /^(Unknown option:|Unknown command:|Option --|Missing value for option:|Missing argument\(s\):)/,
    )
  ) {
    const command = Deno.args[0] as keyof typeof commands;
    if (command in commands) {
      commands[command].showHelp();
    } else {
      eggs.showHelp();
    }
    log.error(err.message);
  } else {
    await handleError(err);
  }

  await notification();
  Deno.exit(1);
}

async function notification() {
  await checkForUpdates;
  notifier.notify("eggs upgrade");
}
