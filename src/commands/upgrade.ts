import {
  bold,
  brightGreen,
  brightRed,
  Command,
  DenoLand,
  log,
  semver,
} from "../../deps.ts";
import type { DefaultOptions } from "../commands.ts";

import { version } from "../version.ts";
import { setupLog } from "../utilities/log.ts";

export type Options = (DefaultOptions & Record<string, unknown>);
export type Arguments = [];

export const upgradeCommand = new Command()
  .version(version)
  .description("Upgrade the eggs CLI to the latest available version.")
  .action(upgrade);

export async function upgrade(option: void | Options) {
  const options = {
    debug: upgradeCommand.getOption('debug'),
    ...(typeof option === "object" ? option : {})
  } as Options;

  await setupLog(options.debug);

  // Since this is a fork from the official CLI, we have to check a different
  // registry for updates to the CLI (we're using DenoLand for now).
  // It's also published to nest.land under the name 'eggy'.
  const newVersion = await DenoLand.latestVersion("eggs");
  if (!newVersion) {
    log.error("Could not retrieve latest version.");
    return;
  }
  if (semver.lte(newVersion, version)) {
    log.info("You are already using the latest CLI version!");
    return;
  }

  const shouldUpgrade = confirm(
    `${bold("New version of eggs is available!")} ${brightRed(version)} → ${
      bold(brightGreen(newVersion))
    }\n\nContinue with installing the new version?`,
  );

  if (!shouldUpgrade) {
    return;
  }

  const upgradeProcess = Deno.run({
    cmd: [
      "deno",
      "install",
      "--unstable",
      "-Afq",
      `https://deno.land/x/eggs@${newVersion}/cli.ts`,
    ],
    stdout: "piped",
    stderr: "piped",
  });

  const status = await upgradeProcess.status();
  upgradeProcess.close();

  const stdout = new TextDecoder("utf-8").decode(await upgradeProcess.output());
  const stderr = new TextDecoder("utf-8").decode(
    await upgradeProcess.stderrOutput(),
  );

  log.debug("stdout: ", stdout);
  log.debug("stderr: ", stderr);

  if (!status.success) {
    throw new Error("Failed to upgrade to the latest CLI version!");
  }

  log.info(`Successfully upgraded to ${bold(newVersion)}!`);
}

export default upgradeCommand;
