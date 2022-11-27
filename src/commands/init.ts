import {
  basename,
  Command,
  Confirm,
  Input,
  List,
  log,
  Select,
} from "../../deps.ts";
import {
  type Config,
  ConfigFormat,
  configFormat,
  defaultConfig,
  readConfig,
  writeConfig,
} from "../context/config.ts";
import type { semver } from "../../deps.ts";
import { validateURL, validateVersion } from "../utilities/types.ts";
import { fetchModule } from "../api/fetch.ts";
import type { DefaultOptions } from "../commands.ts";
import { version as eggsVersion } from "../version.ts";
import { setupLog } from "../utilities/log.ts";

/**
 * Init Command.
 *
 * `init` creates (or overrides) config in the cwd with interactive prompt.
 */
export async function init(option: void | Options) {
  const options: Options = {
    ...initCommand.getGlobalOptions(true),
    ...option
  };

  await setupLog(options.debug);

  let currentConfig: Partial<Config> = {};

  const configPath = await defaultConfig();
  if (configPath) {
    log.warning("An egg config file already exists...");
    const override = await Confirm.prompt("Do you want to override it?");
    if (!override) return;
    currentConfig = await readConfig(configPath);
  }

  const name: string = await Input.prompt({
    message: "Name:",
    default: currentConfig.name || basename(Deno.cwd()),
    minLength: 2,
    maxLength: 40,
  });

  const existing = await fetchModule(name);

  const entry: string | undefined = await Input.prompt({
    message: "Entry file:",
    default: currentConfig.entry ?? "./mod.ts",
  });

  const description: string | undefined = await Input.prompt({
    message: "Description:",
    default: currentConfig.description ?? existing?.description ?? "",
  });

  const homepage: string | undefined = await Input.prompt({
    message: "Module homepage:",
    default: currentConfig.homepage ?? existing?.repository ?? "",
    validate: (value: string) => value === "" || validateURL(value),
  });

  let releaseType: string | null | undefined = await Select.prompt({
    message: "Automatic semver increment:",
    options: [
      { name: "disabled", value: "none" },
      Select.separator("--------"),
      { name: "patch", value: "patch" },
      { name: "minor", value: "minor" },
      { name: "major", value: "major" },
      Select.separator("--------"),
      { name: "pre", value: "pre" },
      { name: "prepatch", value: "prepatch" },
      { name: "preminor", value: "preminor" },
      { name: "premajor", value: "premajor" },
      { name: "prerelease", value: "prerelease" },
    ],
    default: "none",
    keys: {
      previous: ["up", "8", "u", "k"],
      next: ["down", "2", "d", "j"],
    },
  });
  if (releaseType === "none") releaseType = null;

  const version: string | undefined = await Input.prompt({
    message: "Version:",
    default: currentConfig.version ?? existing?.getLatestVersion() ?? "",
    validate: (value: string) => value === "" || validateVersion(value),
  });

  const unstable: boolean | undefined = await Confirm.prompt({
    message: "Is this an unstable version?",
    default: currentConfig.unstable ?? false,
  });

  const unlisted: boolean | undefined = await Confirm.prompt({
    message: "Should this module be hidden in the gallery?",
    default: currentConfig.unlisted ?? false,
  });

  let files: string[] | undefined = await List.prompt({
    message:
      "Relative glob patterns for files/folders to ignore, separated by commas:",
    default: currentConfig.files ?? [],
  });
  if (files?.length === 1 && files[0] === "") files = [];
  files = files.filter((f) => !/^(?:\.\/|)\*\*\/\*\/?$/.test(f));

  let ignore: string[] | undefined = await List.prompt({
    message:
      "Relative glob patterns for files/folders to ignore, separated by commas:",
    default: currentConfig.ignore ?? [],
  });
  if (ignore?.length === 1 && ignore[0] === "") ignore = [];

  const check: boolean | undefined = await Confirm.prompt({
    message:
      "Enable all checks before publication? (format, lint, tests, installation)",
    default: currentConfig.check ?? false,
  });
  const noCheck = !check;

  let checkFormat: boolean | string | undefined = noCheck &&
      (await Confirm.prompt({
        message: "Check source files formatting before publication?",
        default: !!currentConfig.checkFormat ?? false,
      }))
    ? await Input.prompt({
      message: "Formatting command (leave blank for default):",
      default: typeof currentConfig.checkFormat === "string"
        ? currentConfig.checkFormat
        : undefined,
    })
    : false;
  if (checkFormat === "") checkFormat = true;

  let checkTests: boolean | string | undefined = noCheck &&
      (await Confirm.prompt({
        message: "Test code before publication?",
        default: !!currentConfig.checkTests ?? false,
      }))
    ? await Input.prompt({
      message: "Testing command (leave blank for default):",
      default: typeof currentConfig.checkTests === "string"
        ? currentConfig.checkTests
        : undefined,
    })
    : false;
  if (checkTests === "") checkTests = true;

  const checkInstallation: boolean | undefined = noCheck &&
    (await Confirm.prompt({
      message: "Install module and check for missing files before publication?",
      default: currentConfig.checkInstallation ?? false,
    }));

  const format = await Select.prompt({
    message: "Config file format: ",
    default: configPath
      ? configFormat(configPath).toUpperCase()
      : ConfigFormat.JSON,
    options: [
      { name: "YAML", value: ConfigFormat.YAML },
      { name: "JSON", value: ConfigFormat.JSON },
    ],
    keys: {
      previous: ["up", "8", "u", "k"],
      next: ["down", "2", "d", "j"],
    },
  });

  const config: Partial<Config> = {
    $schema: `https://x.nest.land/eggs@0.3.10/src/schema.json`,
    name,
    entry,
    description,
    homepage,
    version,
    releaseType: releaseType as semver.ReleaseType,
    unstable,
    unlisted,
    files,
    ignore,
    checkFormat,
    checkTests,
    checkInstallation,
    check,
  };

  log.debug("Config: ", config, format);

  await writeConfig(config, format as ConfigFormat);

  log.info("Successfully created config file.");
}

export type Options = DefaultOptions & Record<string, unknown>;
export type Arguments = [];

export const initCommand = new Command()
  .version(eggsVersion)
  .description("Initiates a new module for the nest.land registry.")
  .action(init);

export default initCommand;
