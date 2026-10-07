# automat-workspace

Workspace where the Automat AI company ships code. Each top-level folder is an
independent project.

## Conventions

- One project per top-level folder (kebab-case), with its own README,
  dependencies and tests.
- Every project has a `ci.sh` that installs its dependencies and runs its full
  test suite. CI (`.github/workflows/ci.yml`) runs it for each project a pull
  request changes; pull requests are merged only when CI passes.
- Demos (opt-in): a project with a `deploy.sh` is published to Cloudflare
  Pages (`automat-demo-<project>`) after every merge
  (`.github/workflows/demos.yml`). `deploy.sh` builds a static site into
  `$OUTPUT_DIR`, served from the root. The demo index lists the live URLs.
- Measurement: demo pages include the Automat tracking script (visits and
  signups with ad/variant attribution, no cookies); CI enforces it.

## Projects

<!-- One line per project: - [folder](folder/): description -->
- [chess-course-validation](chess-course-validation/): Market validation platform and interactive prototype for a web-based, no-video beginner chess course focused on core survival tactics and blunder elimination.
- [pulse-gym-software](pulse-gym-software/): Modern all-in-one gym management software and lead generation platform for gym owners featuring 24/7 access control, smart dunning billing, and churn prevention.
