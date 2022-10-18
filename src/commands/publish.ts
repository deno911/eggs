import {
  basename,
  bold,
  Command,
  Confirm,
  dependencyTree,
  dim,
  dirname,
  existsSync,
  globToRegExp,
  gray,
  green,
  isVersionUnstable,
  italic,
  join,
  log,
  normalizePath,
  relative,
  semver,
  underline,
} from "../../deps.ts";
import type { DefaultOptions } from "../commands.ts";
import { releaseType, urlType, versionType } from "../utilities/types.ts";
import { ENDPOINT } from "../api/common.ts";
import { fetchModule } from "../api/fetch.ts";
import { postPieces, postPublishModule, PublishModule } from "../api/post.ts";
import {
  type Config,
  configFormat,
  defaultConfig,
  writeConfig,
} from "../context/config.ts";
import { gatherContext } from "../context/context.ts";
import { extendsIgnore, parseIgnore } from "../context/ignore.ts";
import type { Ignore } from "../context/ignore.ts";
import { MatchedFile, matchFiles, readFiles } from "../context/files.ts";
import { getAPIKey } from "../keyfile.ts";
import { version } from "../version.ts";
import { highlight, setupLog, spinner } from "../utilities/log.ts";

function ensureCompleteConfig(
  config: Partial<Config>,
  ignore: Ignore | undefined,
): config is Config {
  let isConfigComplete = true;

  if (!config.name) {
    log.error("Your module configuration must provide a module name.");
    isConfigComplete = false;
  }

  if (!config.version && !config.releaseType) {
    log.error(
      "Your module configuration must provide a version or release type.",
    );
    isConfigComplete = false;
  }

  if (!config.files && !ignore && !config.entry) {
    log.error(
      `Your module configuration must provide files to upload in the form of a ${
        italic("files")
      } field and/or ${
        italic("ignore")
      } field in the config or in an .eggignore file.`,
    );
    isConfigComplete = false;
  }

  config.entry ||= "./mod.ts";
  config.description ||= "";
  config.homepage ||= "";
  config.ignore ||= [];
  config.unlisted ||= false;
  config.check ||= true;
  config.checkAll ||= true;

  return isConfigComplete;
}

function normalize(path: string) {
  path = relative(Deno.cwd(), path).replace(/\\/g, "/");

  return `./${normalizePath(path).replace(/^\.\/|\//g, "")}`;
}

function ensureFiles(config: Config, matched: MatchedFile[]): boolean {
  if (!existsSync("README.md")) {
    log.warning("No README found at project root, continuing without one...");
  }

  config.entry = normalize(config.entry);
  const entryRegExp = globToRegExp(config.entry);

  if (!matched.find((e) => entryRegExp.test(e.path))) {
    log.error(`${config.entry} was not found. This file is required.`);
    return false;
  }
  return true;
}

async function deprecationWarnings(_config: Config) {
  // no deprecated feature for the time being :)
}

function gatherOptions(
  options: Options,
  name?: string,
): Partial<Config> | undefined {
  try {
    const cfg: Partial<Config> = {};
    // TODO(@oganexon): find a more elegant way to remove undefined fields
    name && (cfg.name = name);
    options.version &&
      (cfg.version = versionType(
        { name: "version", value: options.version, label: "", type: "" },
      ));
    options.releaseType &&
      (cfg.releaseType = releaseType(
        { name: "bump", value: options.releaseType, label: "", type: "" },
      ));
    options.description && (cfg.description = options.description);
    options.entry && (cfg.entry = options.entry);
    options.unstable !== undefined && (cfg.unstable = options.unstable);
    options.unlisted !== undefined && (cfg.unlisted = options.unlisted);
    options.homepage &&
      (cfg.homepage = urlType(
        { name: "homepage", value: options.homepage, label: "", type: "" },
      ));
    options.files && (cfg.files = options.files);
    options.ignore && (cfg.ignore = options.ignore);
    options.checkFormat !== undefined &&
      (cfg.checkFormat = options.checkFormat);
    options.checkTests !== undefined && (cfg.checkTests = options.checkTests);
    options.checkInstallation !== undefined &&
      (cfg.checkInstallation = options.checkInstallation);
    options.check !== undefined && (cfg.check = options.check);
    options.yes !== undefined && (cfg.yes = options.yes);
    return cfg;
  } catch (err) {
    log.error(err);
    return;
  }
}

async function checkUp(
  config: Config,
  matched: MatchedFile[],
): Promise<boolean> {
  if (config.checkFormat ?? config.check) {
    const wait = spinner.info("Checking if the source files are formatted...");
    const process = Deno.run(
      {
        cmd: typeof config.checkFormat === "string"
          ? config.checkFormat?.split(" ")
          : ["deno", "fmt", "--check"].concat(
            matched.map((file) => file.fullPath).filter(
              (path) => path.match(/\.(js|jsx|ts|tsx|json)$/),
            ),
          ),
        stderr: "piped",
        stdout: "piped",
      },
    );
    const status = await process.status();
    const stdout = new TextDecoder("utf-8").decode(await process.output());
    const stderr = new TextDecoder("utf-8").decode(
      await process.stderrOutput(),
    );
    wait.stop();
    if (status.success) {
      log.info("Source files are formatted.");
    } else {
      log.error("Some source files are not properly formatted.");
      log.error(stdout);
      log.error(stderr);
      return false;
    }
  }

  if (config.checkTests ?? config.check) {
    const wait = spinner.info("Testing your code...");
    const process = Deno.run(
      {
        cmd: typeof config.checkTests === "string"
          ? config.checkTests?.split(" ")
          : ["deno", "test", "-A", "--unstable", "--no-check"],
        stderr: "piped",
        stdout: "piped",
      },
    );
    const status = await process.status();
    const stdout = new TextDecoder("utf-8").decode(await process.output());
    const stderr = new TextDecoder("utf-8").decode(
      await process.stderrOutput(),
    );
    wait.stop();
    if (status.success) {
      log.info("Tests passed successfully.");
    } else {
      if (stdout.match(/^No matching test modules found/)) {
        log.info("No matching test modules found, tests skipped.");
      } else {
        log.error("Some tests were not successful.");
        log.error(stdout);
        log.error(stderr);
        return false;
      }
    }
  }

  // Test disabled: analyzer is still unstable
  if (config.checkInstallation ?? config.check) {
    const wait = spinner.info("Test installation...");
    const tempDir = await Deno.makeTempDir();
    for (let i = 0; i < matched.length; i++) {
      const file = matched[i];
      const dir = join(tempDir, dirname(file.path));
      try {
        await Deno.mkdir(dir, { recursive: true });
      } catch (err) {
        if (!(err instanceof Deno.errors.AlreadyExists)) {
          throw err;
        }
      }
      await Deno.copyFile(file.fullPath, join(tempDir, file.path));
    }
    const entry = join(tempDir, config.entry);
    const deps = await dependencyTree(entry);
    await Deno.remove(tempDir, { recursive: true });
    wait.stop();
    if (deps.errors.length === 0) {
      log.info("No errors detected when installing the module.");
    } else {
      log.error(
        "Some files could not be resolved during the test installation. They are probably missing, you should include them.",
      );
      for (let i = 0; i < deps.errors.length; i++) {
        const [path, error] = deps.errors[i];
        const relativePath = path.split(basename(tempDir))[1] || path;
        log.error(`${bold(relativePath)} : ${error}`);
      }
      return false;
    }
  }

  return true;
}

export async function publish(options: Options, name: unknown) {
  await setupLog(options.debug);

  const apiKey = await getAPIKey();
  if (!apiKey) {
    log.error(
      `No API Key file found. You can add one using ${
        italic("eggs link <api key>")
      }. You can create one on ${highlight("https://nest.land")}`,
    );
    return;
  }

  const [gatheredContext, contextIgnore] = await gatherContext();
  log.debug("Options:", options);
  const gatheredOptions = gatherOptions(options, name as string);
  if (!gatheredContext || !gatheredOptions) return;

  const egg: Partial<Config> = {
    ...gatheredContext,
    ...gatheredOptions,
  };

  log.debug("Raw config:", egg);

  const ignore = contextIgnore ||
    egg.ignore && await extendsIgnore(parseIgnore(egg.ignore.join()));

  if (!ensureCompleteConfig(egg, ignore)) return;

  log.debug("Ignore:", ignore);

  const matched = matchFiles(egg, ignore);
  if (!matched) return;
  const matchedContent = readFiles(matched);

  log.debug("Matched files:", matched);

  if (!ensureFiles(egg, matched)) return;
  if (!await checkUp(egg, matched)) return;
  await deprecationWarnings(egg);

  log.debug("Config:", egg);

  const existing = await fetchModule(egg.name);

  let latest = "0.0.0";
  if (existing) {
    latest = existing.getLatestVersion();
    egg.description = egg.description || existing.description;
    egg.homepage = egg.homepage || existing.repository || "";
    egg.repository = existing.repository || egg.homepage || "";
  }

  egg.releaseType ??= egg.bump ?? "patch";
  if (egg.releaseType) {
    egg.version = semver.inc(egg.version || latest, egg.releaseType) as string;
  }

  if (
    existing &&
    existing.packageUploadNames.indexOf(`${egg.name}@${egg.version}`) !== -1
  ) {
    log.error(
      "This version was already published. Please increment the version in your configuration.",
    );
    return;
  }

  if (!egg.description) {
    log.warning(
      "You haven't provided a description for your module, continuing without one...",
    );
  }

  const module: PublishModule = {
    name: egg.name,
    version: egg.version,
    description: egg.description,
    repository: egg.repository,
    unlisted: egg.unlisted,
    stable: !(egg.unstable ?? isVersionUnstable(egg.version)),
    upload: true,
    latest: semver.compare(egg.version, latest) === 1,
    entry: normalize(egg.entry),
    // TODO(@oganexon): make this format consistent between eggs & website
    // (here we need to have "/" at the start of the string, where in the website "/" is removed)
  };

  log.info(
    `${bold("The resulting module is:")} ${
      Deno.inspect(module, { colors: true })
        .replace(/^\s*{([\s\S]*)\n}\s*$/, "$1")
        .replace(/\n\s{2}/g, "\n        - ")
    }`,
  );

  const filesToPublish = matched.reduce(
    (previous, current) => {
      return `${previous}\n        - ${dim(current.path)}  ${
        gray(dim("(" + (current.lstat.size / 1000000).toString() + "MB)"))
      }`;
    },
    "Files to publish:",
  );
  log.info(filesToPublish);

  if (!options.yes) {
    const confirmation: boolean = await Confirm.prompt({
      message: "Are you sure you want to publish this module?",
      default: false,
    });

    if (!confirmation) {
      log.info("Publish cancelled.");
      return;
    }
  }

  if (options.dryRun) {
    return;
  }

  const uploadResponse = await postPublishModule(apiKey, module);
  if (!uploadResponse) {
    // TODO(@qu4k): provide better error reporting
    throw new Error("Something broke when publishing... ");
  }

  const pieceResponse = await postPieces(
    uploadResponse.token,
    Object.entries(matchedContent).reduce((prev, [key, value]) => {
      prev[key.slice(1)] = value;
      return prev;
    }, {} as Record<string, string>),
  );
  // TODO(@oganexon): same, needs consistency

  if (!pieceResponse) {
    // TODO(@qu4k): provide better error reporting
    throw new Error("Something broke when sending pieces... ");
  }

  const configPath = await defaultConfig();
  if (configPath) {
    await writeConfig(egg, configFormat(configPath));
    log.debug("Updated configuration.");
  }

  log.info(
    `🎉 Successfully published ${bold(egg.name)} @ ${bold(egg.version)} to ${
      underline("Nest.land")
    } 🥚`,
  );

  const files = Object.entries(pieceResponse.files).reduce(
    (previous, current) => {
      return `${previous}\n        - ${current[0]} -> ${
        bold(`${ENDPOINT}/${egg.name}@${egg.version}${current[0]}`)
      }`;
    },
    "Files uploaded: ",
  );
  log.info(files);

  log.info("");
  log.info(
    green(
      `You can now find your module on our registry at ${
        highlight(`https://nest.land/package/${egg.name}`)
      }`,
    ),
  );
  log.info("");
  log.info("Now you can showcase your module on our GitHub Discussions!");
  log.info(highlight("https://github.com/nestdotland/nest.land/discussions"));
}

export interface Options extends DefaultOptions, Partial<Config> {
  dryRun?: boolean;
  yes?: boolean;
}
export type Arguments = [string];

export const publishCommand = new Command()
  .version(version)
  .description("Publishes your module to the nest.land registry.")
  .type("url", urlType)
  .type("release", releaseType)
  .type("version", versionType)
  .arguments("[name: string]")
  .option(
    "-d, --dry-run",
    "No changes will actually be made, reports the details of what would have been published.",
  )
  .option("-Y, --yes", "Disable confirmation prompts.")
  .option(
    "--description <value:string>",
    "A description of your module that will appear on the gallery.",
  )
  .option(
    "--release-type <value:release>",
    "Increment the version by semver release type.",
  )
  .option("--version <value:version>", "Set the version.")
  .option("--entry <value:string>", "The main entry point of your project.")
  .option("--unstable", "Flag this version as unstable.")
  .option("--unlisted", "Hide this module/version on the gallery.")
  .option(
    "--homepage <value:url>",
    "URL to your project homepage. Usually a repository.",
  )
  .option(
    "--files <values...:string>",
    "Glob patterns for files to include in the upload to nest.land.",
  )
  .option(
    "--ignore <values...:string>",
    "All the files that should be ignored when uploading to nest.land. Supports file globbing.",
  )
  .option(
    "--check-format [value:string]",
    "Automatically format your code before publishing",
  )
  .option("--check-tests [value:string]", "Test your code.")
  .option(
    "--check-installation",
    "Simulates a dummy installation and check for missing files in the dependency tree.",
  )
  .option("--no-check", "Use this option to not perform any check.")
  .action(publish);

export default publishCommand;
