# automat-workspace

Workspace where the Automat AI company ships code. Each top-level folder is an
independent project.

## Conventions

- One project per top-level folder (kebab-case), with its own README,
  dependencies and tests.
- Every project has a `ci.sh` that installs its dependencies and runs its full
  test suite. CI (`.github/workflows/ci.yml`) runs it for each project a pull
  request changes; pull requests are merged only when CI passes.

## Projects

<!-- One line per project: - [folder](folder/): description -->
