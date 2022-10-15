<br />
<p align="center">
  <a href="https://github.com/nestdotland/nest.land">
    <img
       src="https://raw.githubusercontent.com/nestdotland/nest.land/master/public/images/nest.land/logo_light.svg"
       alt="logo"
       width="110"
    >
  </a>

<h3 align="center">Eggs CLI</h3>
<p align="center">
    The CLI used to publish and update modules on nest.land.
  </p>
<p align="center">
 <em> <strong>
  Since the official CLI is apparently unmaintained, and is incompatible<br>
  with recent versions of Deno, this unofficial</strong> <small>(and unstable)</small>  <strong>fork was born.</strong></em><br>
</p>
  <p align="center">
    <a href="https://nest.land/package/eggs">
      <img src="https://nest.land/badge.svg" alt="nest.land badge">
    </a>
    <img
      src="https://github.com/nestdotland/eggs/workflows/Lint/badge.svg"
      alt="Eggs lint"
    >
    <img
      src="https://github.com/nestdotland/eggs/workflows/Test/badge.svg"
      alt="Eggs test"
    >
    <img
      src="https://github.com/nestdotland/eggs/workflows/Ship/badge.svg"
      alt="Eggs ship"
    >
    <a href="https://discord.gg/hYUsX3H">
      <img
        src="https://img.shields.io/discord/722823139960291328?label=Discord&logo=discord"
        alt="Discord"
      >
    </a>
  </p>
</p>

# Contents

- [Contents](#contents)
  - [Installation](#installation)
  - [List Of Commands](#list-of-commands)
    - [link](#link)
    - [init](#init)
    - [publish](#publish)
    - [update](#update)
    - [install](#install)
    - [upgrade](#upgrade)
  - [Contributing](#contributing)

## Installation

**Warning**: You need to upgrade to Deno v1.25 or newer in order to use this
version of CLI.

```bash
deno install -Afq --unstable https://deno.land/eggs@0.3.30/eggs.ts
```

For more information, see the [documentation](https://docs.nest.land/).

## List Of Commands

### link

Before publishing a package to our registry, you'll need to get an API key.
Visit [nest.land](https://nest.land/#start) to generate one.

Then, use the `link` command to add it to the CLI:

```bash
eggs link <key>
```

Alternatively, you can manually create a `.nest-api-key` file in your home dir.

### init

The easiest path to publish a package on Nest.land is to create an `egg.json` or
`egg.yaml` file at the root of your project. Otherwise you'll have to manually
specify the project details via command line arguments every time you publish.

The good news is the `eggs` CLI comes with a built-in tool to help jump start
your new projects!

```bash
eggs init
```

> **Note**: If you'd like to specify a version that you'll publish to, you can
> include a `version` variable in `egg.json`.

### publish

After you've filled in the information located in `egg.json`, you can publish
your package to our registry with this command:

```bash
eggs publish
```

You'll receive a link to your package on our registry, along with an import URL
for others to import your package from the Arweave blockchain!

> **Note**: It may take some time for the transaction to process in Arweave.
> Until then, we upload your files to our server, where they are served for 20
> minutes to give the transaction time to process.

### update

You can easily update your dependencies and global scripts with the `update`
command.

```bash
eggs update [...deps] [options]
```

Your dependencies are by default checked in the `deps.ts` file (current working
directory). You can change this with the `--file` option.

```bash
eggs update # default to deps.ts
eggs update --file dependencies.ts
```

In regular mode, all your dependencies are updated. You can choose which ones
will be modified by adding them as arguments.

```bash
eggs update # Updates everything
eggs update http fs eggs # Updates only http, fs, eggs
```

Several registries are supported:

- [x] [`x.nest.land`](https://nest.land)
- [x] [`deno.land/x`](https://deno.land/x)
- [x] [`deno.land/std`](https://deno.land/std)
- [x] [`denopkg.com`](https://denopkg.com)
- [x] [`raw.githubusercontent.com`](https://github.com)

If you want to add a registry, open an Issue by specifying the Registry URL and
we'll add it.

An example dependency file, prior to updating:

```ts
import * as colors from "https://deno.land/std@0.144.0/fmt/colors.ts";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.2.0/mod.ts";
import "https://deno.land/x/this@0.153.0/mod.ts";
```

After `eggs update`:

```ts
import * as colors from "https://deno.land/std@0.159.0/fmt/colors.ts";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.2.1/mod.ts";
import "https://deno.land/x/this@0.159.0/mod.ts";
```

### install

Just like `deno install`, you can install scripts globally with eggs. By
installing it this way, you will be notified if an update is available for your
script.

The verification is smart, it can't be done more than once a day. To install a
script, simply replace `deno` with `eggs`.

```bash
deno install --allow-write --allow-read -n [NAME] https://x.nest.land/[MODULE]@[VERSION]/cli.ts
```

Becomes:

```bash
eggs install --allow-write --allow-read -n [NAME] https://x.nest.land/[MODULE]@[VERSION]/cli.ts
```

The supported registries are the same as the update command.

### upgrade

Upgrading the `eggs` CLI is pretty straightforward:

```bash
eggs upgrade
```

## Contributing

All contributions are welcome! If you can think of a command or feature that
might benefit nest.land, fork this repository and make a pull request from your
branch with the additions. Make sure to use
[Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)

[Contribution guide](.github/CONTRIBUTING.md)
