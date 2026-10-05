# automat-workspace

Workspace where the Automat AI company ships code. Each top-level folder is an
independent project.

## Conventions

- One project per top-level folder (kebab-case), with its own README,
  dependencies and tests.
- Every project has a `ci.sh` that installs its dependencies and runs its full
  test suite. CI (`.github/workflows/ci.yml`) runs it for each project a pull
  request changes; pull requests are merged only when CI passes.
- Demos (opt-in): a project with a `deploy.sh` is published to GitHub Pages
  after every merge (`.github/workflows/demos.yml`). `deploy.sh` builds a
  static site into `$OUTPUT_DIR`, using `$BASE_PATH` as its base URL path. Demos
  are served at `https://chrassy.github.io/automat-workspace/<project>/`.

## Projects

<!-- One line per project: - [folder](folder/): description -->
- [chess-course-validation](chess-course-validation/): Market validation platform and interactive prototype for a web-based, no-video beginner chess course focused on core survival tactics and blunder elimination.
- [iphone-18-case-landing](iphone-18-case-landing/): Next-generation iPhone 18 AERO-SHIELD Pro case landing page with interactive 3D configurator, drop impact physics simulator, MagSafe 3.0 visualizer, and pre-order checkout.
- [martial-arts-signup](martial-arts-signup/): Martial arts school sign-up platform featuring interactive registration forms, QR code generation & check-in scanning, automated email notifications, and staff dashboard.
