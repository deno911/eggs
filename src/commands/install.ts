import {
  bold,
  brightYellow,
  Command,
  installHatcher,
  italic,
  underline,
} from "../../deps.ts";
import { type DefaultOptions, defaultOptions } from "../commands.ts";
import { version } from "../version.ts";
import { setupLog } from "../utilities/log.ts";
import { urlType } from "../utilities/types.ts";

export async function install(
  options?: Options & DefaultOptions,
  ...args: any[]
): Promise<any> {
  options = { ...defaultOptions, ...(options ?? {}) };
  await setupLog(options.debug);

  /** help option need to be parsed manually */
  if (/^[-](?:[?]|h)|[-]{0,2}help$/i.test(args[0])) {
    installCommand.showHelp();
    return;
  }

  await installHatcher(args);
}

const desc = `Add update notification to any CLI.

${
  bold(
    "Installs a script as an executable in the installation root's bin directory.",
  )
}

  eggs install -A https://x.nest.land/std/http/file_server.ts
  eggs install https://deno.land/std/examples/colors.ts

${
  bold(
    `To change the executable name, use ${underline("-n")}/${
      underline("--name")
    }`,
  )
}:

  eggs install -A -n serve https://x.nest.land/std/http/file_server.ts

${bold("The name is inferred by default, with the following logic:")}
  1. Attempt to take the file stem of the URL path.
     The above example would become 'file_server'.
  2. If the file stem is something generic like 'main',
     'mod', 'index' or 'cli', ${bold("and")} the path has no parent,
     use the ${italic("filename of the parent path")}. Otherwise
     settle with the generic name.
  3. If the resulting name has an '@...' suffix, strip it.

${bold("To change the installation root, use --root:")}

  eggs install --root=/usr/local --allow-all https://deno.land/std/http/file_server.ts

${bold("The installation root is determined, in order of precedence:")}
  1. ${bold("--root")} option
  2. ${bold("$DENO_INSTALL_ROOT")} (environment variable)
  3. ${bold("$DENO_INSTALL")} (environment variable)
  4. ${bold("$HOME/.deno")}

${
  bold(
    `${
      brightYellow("Important!")
    } These must be added to the path manually if required.`,
  )
}
`;

export type Options = Record<string, unknown> & DefaultOptions;
export type Arguments = [string[]];

export const installCommand = new Command()
  .version(version)
  .description(desc)
  .type("URL", urlType, { global: true, override: true })
  .arguments("[url:URL]")
  .option("--root <root>", "Installation root", { default: null })
  .option("-f, --force", "Force install, overwriting existing executable", {
    default: false,
  })
  .option("-A, --allow-all", "Allow all permissions", { default: false })
  .option("--allow-env=[allow-env...]", "Allow environment access", {
    default: false,
  })
  .option("--allow-hrtime", "Allow high resolution time measurement", {
    default: false,
  })
  .option("--allow-net=[allow-net...]", "Allow network access", {
    default: false,
  })
  .option("--allow-plugin", "Allow loading plugins", { default: false })
  .option("--allow-ffi=[allow-ffi...]", "Allow loading dynamic libraries", {
    default: false,
  })
  .option("--allow-read=[allow-read...]", "Allow file system read access", {
    default: false,
  })
  .option("--allow-run=[allow-run...]", "Allow running subprocesses", {
    default: false,
  })
  .option("--allow-sys=[allow-sys...]", "Allow access to system info", {
    default: false,
  })
  .option("--allow-write=[allow-write...]", "Allow file system write access", {
    default: false,
  })
  .option("--unstable", "Enable unstable APIs", { default: false })
  .option("--cert <FILE>", "Load certificate authority from PEM encoded file", {
    default: null,
  })
  /** Unknown options cannot be parsed */
  .action(install)
  .useRawArgs();

export default installCommand;
