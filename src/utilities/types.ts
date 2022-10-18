import {
  // EggJson,
  EnumType,
  ITypeInfo,
  LogLevels,
  semver,
} from "../../deps.ts";

/* cliffy custom command line types */

/** Permitted log level names (type alias) */
export type LogLevelNames = ["error", "debug", "info", "warning"];

/** Permitted log level names (constant) */
export const LogLevelNames = Object.keys(LogLevels)
  .filter((k) => isNaN(Number(k))) as LogLevelNames;

/** Permitted log level names (cliffy enumtype) */
export const logLevelType = new EnumType(LogLevelNames);

// ReleaseType for 'releaseType' / 'bump' fields in egg.json
export const releases: [
  "major",
  "minor",
  "patch",
  "pre",
  "premajor",
  "preminor",
  "prepatch",
  "prerelease",
] = [
  "major",
  "minor",
  "patch",
  "pre",
  "premajor",
  "preminor",
  "prepatch",
  "prerelease",
];

export const releaseTypes = releases;

export type ReleaseType = (typeof releases)[number];

export function validateRelease(value: string): value is ReleaseType {
  return (releases as string[]).includes(value);
}
export function assertReleaseType(
  name: string,
  value: string,
): asserts value is ReleaseType {
  if (!validateRelease(value)) {
    throw new Error(
      `Option --${name} must be a valid ReleaseType as defined by Semantic Versioning 2.0.\n\nValue received: ${value}.\nValues accepted:\n\t${
        releases.join(", ")
      }.`,
    );
  }
}
export function releaseType({ name, value }: ITypeInfo): ReleaseType {
  // normalize the value's case and whitespace
  value = String(value).trim().toLowerCase();
  // assert its validity
  assertReleaseType(name, value);
  // spit it out
  return value as ReleaseType;
}

// version type with semver validation

export function validateVersion(value: string): boolean {
  return !!semver.valid(value);
}

export function versionType({ name, value }: ITypeInfo): string {
  if (!validateVersion(value)) {
    throw new Error(
      `Option --${name} must be a valid version but got: ${value}.\nVersion must follow Semantic Versioning 2.0.0.`,
    );
  }
  return value;
}

// url type with regex validation

export function validateURL(value: string): boolean {
  const urlRegex =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*)/;
  return !!value.match(urlRegex);
}

export function urlType({ name, value }: ITypeInfo): string {
  try {
    return new URL(value).toString();
  } catch {
    throw new Error(
      `Option --${name} must be a valid url but got: ${value}.`,
    );
  }
}
