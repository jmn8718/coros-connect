# Release Guide

This project supports automatic tag/release creation and package publishing from a release commit.

## Prerequisites

- You are pushing to `main`
- GitHub Actions is enabled
- Repository secrets/permissions are configured for publishing (as required by `.github/workflows/npm-publish.yml`)

## Release Commit Convention

Use this exact commit format:

- `chore(release): 0.1.7`

Supported format also includes a prefixed `v`:

- `chore(release): v0.1.7`

## What Happens Automatically

1. Push to `main` triggers `.github/workflows/release-on-commit.yml`
2. Workflow checks commit message starts with `chore(release): `
3. Workflow parses version from the commit message
4. Workflow validates parsed version matches `package.json` version
5. Workflow creates tag `vX.Y.Z` if it does not exist
6. Workflow creates a GitHub Release for that tag if it does not exist
7. Release publish event triggers `.github/workflows/npm-publish.yml`
8. Package is published

## Release Steps (Manual Actions)

1. Update package version (patch/minor/major as needed)
2. Add release notes under a new header in `CHANGELOG.md`
3. Commit using the release convention
4. Push to `main`

## Example Commands

```bash
git add package.json package-lock.json CHANGELOG.md .github/workflows/release-on-commit.yml RELEASE.md
git commit -m "chore(release): 0.1.7"
git push origin main
```

## Verification

After push, confirm these in GitHub:

- `Create Tag and Release` workflow succeeds
- Tag `v0.1.7` exists
- GitHub Release `v0.1.7` exists
- `Publish Node.js Package` workflow succeeds

## Common Failures

### Version mismatch

If `package.json` version and commit version differ, release creation fails intentionally.

Fix: align versions and push a corrected release commit.

### Wrong commit format

If commit message does not match `chore(release): X.Y.Z`, release workflow is skipped.

Fix: use the exact release commit format.

### Tag or Release already exists

Workflow is idempotent and will skip creating existing tag/release.

## Recommended Release Checklist

- [ ] `package.json` version updated
- [ ] `package-lock.json` version aligned
- [ ] `CHANGELOG.md` has matching version section
- [ ] Commit message follows `chore(release): X.Y.Z`
- [ ] Push was made to `main`
