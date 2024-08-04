<br />
<div align="center">

[![nest.land logo of a dinosaur egg](https://raw.githubusercontent.com/nestdotland/nest.land/master/public/images/nest.land/logo_light.svg)](https://github.com/deno911/eggs)

# [Eggs CLI](https://github.com/deno911/eggs)  <!-- omit in toc --> 

<p align="center">
  <a href="https://nest.land/package/eggy"><img src="https://nest.land/badge-large.svg" alt="published on nest.land" height="28" /></a>
  <img
    src="https://img.shields.io/github/checks-status/deno911/eggs/develop.svg?logo=github&label=&style=for-the-badge&color=123456"
    alt="Eggs Checks" />
  <img src="https://img.shields.io/discord/722823139960291328?label=&logo=discord&style=for-the-badge&color=blue&logoColor=fff&cacheSeconds=300" alt="Discord" />
</p>

</div>

> [!IMPORTANT]
> This project is archived and no longer maintained. In the v1.4x cycle, Deno introduced
> the [JSR - "The JavaScript Registry"](https://jsr.io) as the successor to `deno.land/x`,
> and since `nest.land` itself seems to be abandoned for quite a while now, this repository
> is now archived. All open issues and pulls were closed as `wontfix`. I recommend checking
> out JSR, and all the new capabilities that come with it.
>
> Thanks for your understanding,  
> — [Nicholas Berlette](https://github.com/nberlette)

<div align="center">

##### The CLI used to manage, update, and publish modules on [nest.land](https://nest.land). <!-- omit in toc -->

> **Note**: <em><strong>Since the official CLI is no longer maintained and
> doesn't work\
> with newer Deno versions, this unofficial </strong><small>(and
> unstable)</small> <strong>fork was born.</strong></em><br>

</div>

## Contents <!-- omit in toc -->

- [**Installation**](#installation)
  - [`deno.land`](#denoland)
  - [`nest.land`](#nestland)
  - [`land` · zero install](#land--zero-install)
- [**Commands**](#commands)
  - [`completions`](#completions)
    - [bash](#bash)
    - [fish](#fish)
    - [zsh](#zsh)
  - [`link`](#link)
  - [`init`](#init)
  - [`install`](#install)
  - [`publish`](#publish)
  - [`update`](#update)
    - [Supported Registries](#supported-registries)
  - [`upgrade`](#upgrade)
- [**Contributing**](#contributing)

## **Installation**

For more information on the Nest.land Registry, see the
[**official documentation**](https://docs.nest.land/).

### `deno.land`

```bash
deno install -Afq --unstable https://deno.land/x/eggs@0.3.50/cli.ts
```

### `nest.land`

```bash
deno install -Afq --unstable https://x.nest.land/eggy0.3.50/cli.ts
```

**Warning**: You need to upgrade to Deno v1.25 or newer in order to use this
version of CLI.

### [`land`](https://deno.land/x/land) · zero install

The [**land** project](https://deno.land/x/land) is an ingenious solution for
Command Line projects on Deno. It allows you to run any program with a `cli.ts`
file, without having to install it first.

```bash
deno install -Afn land https://deno.land/x/land/cli.ts
```

Then this command is all you need to use the **eggs** CLI:

```bash
land eggs
```

The best part is never needing to upgrade - the latest version is always used.

---

## **Commands**

### `completions`

Generates shell completions for the `eggs` CLI in `bash`, `fish`, or `zsh`
environments.

#### bash

```bash
# ~/.bashrc
source <(eggs completions bash)
```

#### fish

```sh
# ~/.config/fish/config.fish
source (eggs completions fish | psub)
```

#### zsh

```sh
# ~/.zshrc
source <(eggs completions zsh)
```

---

### `link`

Before publishing a package to our registry, you'll need to get an API key.
Visit [nest.land](https://nest.land/#start) to generate one.

Then, use the `link` command to add it to the CLI:

```bash
eggs link <key>
```

Alternatively, you can manually create a `.nest-api-key` file in your home dir.

---

### `init`

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

---

### `install`

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

The supported registries are the same as the [update command](#update).

---

### `publish`

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

---

### `update`

You can easily update your dependencies and global scripts with the `update`
command.

```bash
eggs update [...deps] [options]
```

Your dependencies are checked in the `deps.ts` file by default (current working
directory). You can change this with the `--file` option.

```bash
eggs update # default to deps.ts
eggs update --file dependencies.ts
```

If you run this command with no arguments, **all dependencies are updated**.

You can pick and choose which to update by adding their name as arguments:

```bash
eggs update # Updates everything
eggs update http fs eggs # Updates only http, fs, eggs
```

#### Supported Registries

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

---

### `upgrade`

Upgrading the `eggs` CLI is pretty straightforward:

```bash
eggs upgrade
```

---

## **Contributing**

All contributions are welcome! If you can think of a command or feature that
might benefit nest.land, fork this repository and make a pull request from your
branch with the additions. Make sure to use
[**Conventional Commits**](https://www.conventionalcommits.org/en/v1.0.0).
Please also read the [Contribution Guide](.github/CONTRIBUTING.md).
