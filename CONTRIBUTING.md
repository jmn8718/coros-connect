# Contributing

Thanks for your interest in contributing to coros-connect.

## How to Contribute

You can contribute by:

- reporting bugs
- proposing improvements
- submitting pull requests
- improving documentation and examples

## Before You Start

- Check existing issues and pull requests to avoid duplicates
- Keep changes focused and scoped to a single problem when possible

## Development Setup

Prerequisites:

- Node.js (same major version used in CI)
- npm

Install dependencies:

```bash
npm install
```

## Local Validation

Run all checks before opening a PR:

```bash
npm run lint:check
npm run format:check
npm run build
```

Useful commands:

- Lint: `npm run lint:check`
- Format check: `npm run format:check`
- Format fix: `npm run format:fix`
- Build: `npm run build`
- Run example: `npm run example`

## Pull Request Guidelines

1. Create a branch from `main`
2. Implement and test your changes
3. Keep commit messages clear and descriptive
4. Open a PR into `main` with:
   - a clear summary
   - why the change is needed
   - any relevant context/screenshots/logs

## Commit Guidelines

Recommended conventional-style commits:

- `feat(...)`
- `fix(...)`
- `refactor(...)`
- `docs(...)`
- `chore(...)`

Release commits must use:

- `chore(release): X.Y.Z`

Example:

- `chore(release): 0.1.7`

## CI Checks on Pull Requests

Every pull request to `main` runs:

- lint
- formatting enforcement
- build

The PR check fails if:

- lint errors are found
- formatting updates are required
- build fails

## Maintainer Setup (Required)

To block merging when checks fail, configure branch protection on `main`:

1. Go to Settings → Branches
2. Add or edit the `main` branch protection rule
3. Enable Require status checks to pass before merging
4. Require check: `PR Validation / validate`

## Community Expectations

Be respectful and constructive in issues and pull requests.

## Related Docs

- Release process: [RELEASE.md](./RELEASE.md)