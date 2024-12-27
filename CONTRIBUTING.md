# Contributing

Contributions are welcome! Even if you’re new to open source, we’d love if you opened an issue or Pull Request. Please [see GitHub’s guide to contributing if you’ve never done this before](https://docs.github.com/en/get-started/exploring-projects-on-github/contributing-to-a-project).

This document is meant to be a quick reference for tips and recommendations to increase the chance your contribution is suggested.

## Issues

Opening issues are always welcome. Issues are great ways to contribute! Please be sure to fill out the [template](https://github.com/drwpow/html-aria/issues/new).

## Pull Requests

Opening PRs are welcome.

### Bugfixes

Bugfixes are always accepted! Please link to the relevant open issue, if any. PRs that fix bugs directly will be accepted even if there is no open issue, provided it doesn’t cause any other regressions or breaking changes. If that’s the case, please [open an issue](https://github.com/drwpow/html-aria/issues/new) first to discuss.

### Features

PRs adding features or making behavior changes will only be accepted **with a corresponding feature issue that has been approved.** Features are always welcome, but please [open an issue](https://github.com/drwpow/html-aria/issues/new) first so we all agree on the approach.

### Changesets

We use [Changesets](https://github.com/changesets/changesets) to manage versions. When you open a Pull Request, you’ll see a comment with instructions. But it involves running the following command:

```sh
pnpm exec changeset
```

Which will start an interactive prompt to describe your change in plain language that will go into a changelog. This project follows standard [semver](https://semver.org/), with the following additions for 0.x:

- `patch`: used for **bugfixes** and **features**
- `minor`: only used for **breaking changes**

### CI

This project uses GitHub Actions that runs [lint](#linting), [test](#testing), and more.

> ![WARNING]
>
> When opening a PR, make sure all checks pass! Your PR won’t be accepted with failing tests or lint checks.

## Setup

If contributing locally, you’ll need to set up this repo locally. [Fork and clone the repo](https://docs.github.com/en/get-started/exploring-projects-on-github/contributing-to-a-project) first.

Next, install Node ([fnm](https://github.com/Schniz/fnm) is highly recommended as it lets you have multiple versions of Node.js locally) and [pnpm](https://pnpm.io/). Then, in the project folder, run in a terminal:

```sh
pnpm i
```

### Linting

Linting and formatting is handled with [Biome](https://biomejs.dev/), a modern linter/formatter for TypeScript. To run the linter, run:

```sh
pnpm run lint
```

### Testing

Tests are written for [Vitest](https://vitest.dev/) and can be run with:

```sh
pnpm test
```
