import {
  Command,
  green,
  latestVersion,
  log,
  parseURL,
  semver,
  versionSubstitute,
  yellow,
} from "../../deps.ts";
import { version } from "../version.ts";
import type { DefaultOptions } from "../commands.ts";
import { setupLog } from "../utilities/log.ts";

/** What the constructed dependency objects should contain */
interface ModuleToUpdate {
  line: string;
  versionURL: string;
  latestRelease: string;
}

export async function update(
  options: Options,
  deps: unknown | string[] = [],
): Promise<void> {
  const requestedModules = (
    Array.isArray(deps) ? deps : Object.values(deps ?? {})
  ) ?? [];

  await setupLog(options.debug);

  log.debug("Options: ", options);

  /** Gather the path to the user's dependency file using the CLI arguments */
  let pathToDepFile = "";
  try {
    pathToDepFile = await Deno.realPath("./" + options.file);
  } catch {
    // Dependency file doesn't exist
    log.warning(
      "No dependency file was found in your current working directory.",
    );
    return;
  }

  const doubleCheck = confirm(
    `This will overwrite existing versions in ${
      pathToDepFile.split("/").at(-1)
    }. Should we proceed?`,
  );

  if (!doubleCheck) {
    log.warning(
      "Aborted the dependency update process.",
    );
    return;
  }

  /** Creates an array of strings from each line inside the dependency file.
   * Only extracts lines that contain "https://" to strip out non-import lines. */
  const dependencyFileContents: string[] = (
    await Deno.readTextFile(pathToDepFile)
  ).split(/[\r\n]/).filter((line) => line.indexOf("https://") > 0);

  if (dependencyFileContents?.length === 0) {
    log.warning(
      "Your dependency file does not contain any imported modules.",
    );
    return;
  }

  log.debug("Dependency file contents: ", dependencyFileContents);

  /** For each import line in the users dependency file, collate the data ready
   * to be re-written if it can be updated.
   * Skips the dependency if it is not versioned (no need to try to update it) */
  const dependenciesToUpdate: Array<ModuleToUpdate> = [];
  for (const line of dependencyFileContents) {
    const { name, parsedURL, registry, owner, version } = parseURL(line);

    // TODO(@qu4k): edge case: dependency isn't a module, for example: from
    //  "https://x.nest.land/std@version.ts";, will return -> "version.ts";
    // Issue: "Mandarine.TS" is a module while "version.ts" isn't

    // Now we have the name, ignore dependency if requested dependencies are set and it isn't one requested
    if (
      requestedModules?.length && requestedModules?.indexOf(name) === -1
    ) {
      log.debug(name, "was not requested.");
      continue;
    }

    // Get latest release
    const latestRelease = await latestVersion(registry, name, owner);

    // Basic safety net

    if (!version || !semver.valid(version)) {
      log.debug("Invalid version", name, version);
      continue;
    }

    if (!latestRelease || !semver.valid(latestRelease)) {
      log.warning(
        `Warning: could not find the latest version of ${name}.`,
      );
      continue;
    }

    if (semver.gte(version, latestRelease)) {
      log.debug(name, "is already up to date!");
      continue;
    }

    // Collate the dependency
    dependenciesToUpdate.push({
      line,
      versionURL: parsedURL,
      latestRelease,
    });

    log.info(`${name} ${yellow(version)} → ${green(latestRelease)}`);
  }

  // If no modules are needed to update then exit
  if (dependenciesToUpdate.length === 0) {
    log.info("Your dependencies are already up to date!");
    return;
  }

  // Loop through the users dependency file, replacing the imported version with the latest release for each dep
  let dependencyFile = await Deno.readTextFile(pathToDepFile);

  for await (const dependency of dependenciesToUpdate) {
    let newURL = dependency.versionURL.replace(
      versionSubstitute,
      dependency.latestRelease,
    );
    const check = async (url: string) =>
      await fetch(url.replace(/^.*?["']([^'"]+)['"].*?$/ig, "$1")).then((r) =>
        r.ok
      ).catch(() => false);

    if (!(await check(newURL))) {
      const newURL2 = newURL.replace(
        dependency.latestRelease,
        `v${dependency.latestRelease.replace(/^v/i, "")}`,
      );
      if ((await check(newURL2))) {
        newURL = newURL2;
      } else {
        log.warning(
          `Unable to locate these files:\n  - ${newURL}\n  - ${newURL2}`,
        );
        continue;
      }
    }
    dependencyFile = dependencyFile.replace(
      dependency.line,
      newURL,
    );
  }

  // Re-write the file
  Deno.writeFileSync(
    pathToDepFile,
    new TextEncoder().encode(dependencyFile),
  );

  log.info("Updated your dependencies!");
}

export type Options = DefaultOptions & Record<string, unknown> & {
  file: string;
};
export type Arguments = [string[]];

export const updateCommand = new Command()
  .description("Update your dependencies")
  .version(version)
  .arguments("[...deps: string]")
  .option(
    "--file <file:string>",
    "Set dependency filename",
    { default: "deps.ts" },
  )
  .action(update);

export default updateCommand;
