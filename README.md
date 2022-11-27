<br />
<div align="center">

[![nest.land logo of a dinosaur egg](https://raw.githubusercontent.com/nestdotland/nest.land/master/public/images/nest.land/logo_light.svg)](https://github.com/deno911/eggs)

# [Eggs CLI](https://github.com/deno911/eggs) <!-- omit in toc -->

<p align="center">
  <a href="https://nest.land/package/eggy">
    <img src="https://nest.land/badge-large.svg" alt="published on nest.land" height="28" />
  </a>  <a href="https://deno.land/x/eggs">
    <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='234.25' height='28' role='img' aria-label='PUBLISHED ON: DENO.LAND'%3E%3Ctitle%3EPUBLISHED ON: DENO.LAND%3C/title%3E%3Cg shape-rendering='crispEdges'%3E%3Crect width='133' height='28' fill='%23111827'/%3E%3Crect x='133' width='101.25' height='28' fill='%23111827'/%3E%3C/g%3E%3Cg fill='%23fff' text-anchor='middle' font-family='sans-serif,Geneva,DejaVu Sans,sans-serif' text-rendering='geometricPrecision' font-size='100'%3E%3Cimage x='9' y='7' width='14' height='14' xlink:href='data:image/svg+xml;base64,PHN2ZyBmaWxsPSJ3aGl0ZSIgcm9sZT0iaW1nIiB2aWV3Qm94PSIwIDAgMjQgMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHRpdGxlPkRlbm88L3RpdGxlPjxwYXRoIGQ9Ik0xMiAwYzYuNjI3IDAgMTIgNS4zNzMgMTIgMTJzLTUuMzczIDEyLTEyIDEyUzAgMTguNjI3IDAgMTIgNS4zNzMgMCAxMiAwWm0tLjQ2OSA2Ljc5M2MtMy40OSAwLTYuMjA0IDIuMTk2LTYuMjA0IDQuOTI4IDAgMi41OCAyLjQ5OCA0LjIyOCA2LjM3IDQuMTQ1bC4xMTgtLjAwMy40MjUtLjAxMi0uMTA5LjI3OS4wMTMuMDI5Yy4wMzEuMDcyLjA2LjE0NS4wODQuMjJsLjAxLjAyOC4wMTUuMDQ1LjAyMS4wNjUuMDE0LjA0NS4wMTQuMDQ3LjAxNS4wNDkuMDIxLjA3NS4wMjIuMDc5LjAxNS4wNTQuMDIzLjA4NC4wMjIuMDg4LjAyMy4wOTEuMDIzLjA5NS4wMTUuMDY1LjAyNC4xLjAyMy4xMDMuMDMyLjE0My4wMTcuMDc0LjAyNC4xMTQuMDI0LjExNy4wMjUuMTIuMDM1LjE3NC4wMjkuMTQyLjAzNy4xOTUuMDIuMS4wMjguMTU1LjAzLjE1OC4wMzkuMjE3LjA0LjIyNS4wNC4yMzEuMDQxLjI0LjA0Mi4yNDYuMDQyLjI1NC4wNDIuMjYuMDMyLjIwMS4wNTUuMzQ0LjAyMi4xNC4wNTUuMzYuMDQ1LjI5NS4wMzQuMjI3LjA0Ni4zMDguMDIzLjE1NmExMC43NTggMTAuNzU4IDAgMCAwIDYuNTI5LTMuNDEybC4wNS0uMDU1LS4yMzgtLjg5MS0uNjMzLTIuMzctLjM5NS0xLjQ3LS4zNDgtMS4yOTYtLjIxMy0uNzg3LS4xMzYtLjQ5OC0uMDgxLS4yOTctLjA3My0uMjY0LS4wMzItLjExLS4wMTgtLjA2NC0uMDEtLjAzNC0uMDA4LS4wMjZhNi4wNDIgNi4wNDIgMCAwIDAtMi4wMzgtMi45N2MtMS4xMzQtLjg4Ny0yLjU3My0xLjM1MS00LjI1Mi0xLjM1MVpNOC40NjcgMTkuM2EuNTg2LjU4NiAwIDAgMC0uNzE0LjRsLS4wMDQuMDEzLS41MjcgMS45NTNjLjMyOC4xNjMuNjY1LjMwOSAxLjAwOC40MzdsLjA4LjAzLjU3LTIuMTE0LjAwNC0uMDE1YS41ODYuNTg2IDAgMCAwLS40MTctLjcwNFptMy4yNjQtMS40M2EuNTg2LjU4NiAwIDAgMC0uNzE1LjRsLS4wMDQuMDE0LS43OTYgMi45NTMtLjAwNC4wMTRhLjU4Ni41ODYgMCAwIDAgMS4xMzEuMzA1bC4wMDQtLjAxNC43OTctMi45NTMuMDAzLS4wMTRhLjU4NS41ODUgMCAwIDAgLjAxMy0uMDY3bC4wMDItLjAyMi0uMDE5LS4wOTYtLjAyNy0uMTM4LS4wMTgtLjA4NmEuNTg0LjU4NCAwIDAgMC0uMzY3LS4yOTVabS01LjU1My0zLjA0YS41OS41OSAwIDAgMC0uMDM3LjA5bC0uMDA1LjAyLS43OTcgMi45NTMtLjAwNC4wMTRhLjU4Ni41ODYgMCAwIDAgMS4xMzEuMzA2bC4wMDQtLjAxNC43MjMtMi42NzhhNS4yOTUgNS4yOTUgMCAwIDEtMS4wMTUtLjY5MlptLTEuOS0zLjM5N2EuNTg2LjU4NiAwIDAgMC0uNzE1LjRsLS4wMDQuMDEzLS43OTcgMi45NTMtLjAwMy4wMTVhLjU4Ni41ODYgMCAwIDAgMS4xMy4zMDVsLjAwNS0uMDE0Ljc5Ny0yLjk1My4wMDMtLjAxNWEuNTg2LjU4NiAwIDAgMC0uNDE2LS43MDRabTE3Ljg2OC0uNjdhLjU4Ni41ODYgMCAwIDAtLjcxNS4zOTlsLS4wMDQuMDE0LS43OTcgMi45NTMtLjAwMy4wMTRhLjU4Ni41ODYgMCAwIDAgMS4xMy4zMDVsLjAwNS0uMDE0Ljc5Ny0yLjk1My4wMDMtLjAxNGEuNTg2LjU4NiAwIDAgMC0uNDE2LS43MDRaTTIuNTQyIDYuODJhMTAuNzA3IDEwLjcwNyAwIDAgMC0xLjI1MSAzLjkyNi41ODYuNTg2IDAgMCAwIDEuMDAyLS4yMmwuMDA0LS4wMTQuNzk3LTIuOTUzLjAwMy0uMDE0YS41ODYuNTg2IDAgMCAwLS41NTUtLjcyNVptMTcuNTg1LjAyYS41ODYuNTg2IDAgMCAwLS43MTQuNGwtLjAwNC4wMTQtLjc5NyAyLjk1My0uMDA0LjAxNGEuNTg2LjU4NiAwIDAgMCAxLjEzMS4zMDVsLjAwNC0uMDE0Ljc5Ny0yLjk1My4wMDQtLjAxNGEuNTg2LjU4NiAwIDAgMC0uNDE3LS43MDRabS03Ljg0NiAxLjkyNmEuNzUuNzUgMCAxIDEgMCAxLjUuNzUuNzUgMCAwIDEgMC0xLjVabS02LjI3LTQuNzMzYS41ODYuNTg2IDAgMCAwLS43MTUuMzk4bC0uMDA0LjAxNS0uNzk3IDIuOTUzLS4wMDQuMDE0YS41ODYuNTg2IDAgMCAwIDEuMTMyLjMwNWwuMDAzLS4wMTQuNzk3LTIuOTUzLjAwNC0uMDE0YS41ODYuNTg2IDAgMCAwLS40MTctLjcwNFptMTAuMjM4LjU1OGEuNTg2LjU4NiAwIDAgMC0uNzE0LjM5OWwtLjAwNC4wMTQtLjUzNiAxLjk4NGMuMzQ3LjE3MS42NzguMzczLjk5LjYwM2wuMDUxLjAzOC42MjYtMi4zMi4wMDQtLjAxNGEuNTg2LjU4NiAwIDAgMC0uNDE3LS43MDRabS01LjIxMS0zLjMzYy0uMzc0LjAzMy0uNzQ2LjA4Ni0xLjExNS4xNThsLS4wNzguMDE1LS43NDIgMi43NTMtLjAwNC4wMTVhLjU4Ni41ODYgMCAwIDAgMS4xMzEuMzA1bC4wMDQtLjAxNC43OTctMi45NTMuMDA0LS4wMTVhLjU4My41ODMgMCAwIDAgLjAwMy0uMjY0Wm03LjMzMiAyLjA0LS4xNTYuNTgtLjAwNC4wMTVhLjU4Ni41ODYgMCAwIDAgMS4xMzEuMzA1bC4wMDQtLjAxNC4wMTctLjA2M2ExMC44MzggMTAuODM4IDAgMCAwLS45MjMtLjc3MmwtLjA2OS0uMDUxWm0tNC42MzYtMS45NDQtLjI4MyAxLjA0OC0uMDAzLjAxNGEuNTg2LjU4NiAwIDAgMCAxLjEzLjMwNWwuMDA1LS4wMTQuMjk3LTEuMTAyYy0uMzUtLjA5Ny0uNzA1LS4xNzYtMS4wNjMtLjIzN2wtLjA4My0uMDE0WiIvPjwvc3ZnPg=='/%3E%3Ctext transform='scale(.1)' x='750' y='175' textLength='920' fill='%23fff'%3EPUBLISHED ON%3C/text%3E%3Ctext transform='scale(.1)' x='1836.25' y='175' textLength='772.5' fill='%23fff' font-weight='bold'%3EDENO.LAND%3C/text%3E%3C/g%3E%3C/svg%3E" alt="published on deno.land" height="28"/>
  </a>
  <img
    src="https://img.shields.io/github/checks-status/deno911/eggs/develop.svg?logo=github&label=Checks&style=for-the-badge"
    alt="Eggs Checks" />  <img src="https://img.shields.io/discord/722823139960291328?label=Discord&logo=discord&style=for-the-badge&color=bada55&logoColor=fff&cacheSeconds=300" alt="Discord" />
</p>

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
deno install -Afq --unstable https://deno.land/x/eggs/cli.ts
```

### `nest.land`

```bash
deno install -Afq --unstable https://x.nest.land/eggy@0.3.40/cli.ts
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
