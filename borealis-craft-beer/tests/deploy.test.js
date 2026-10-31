const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

describe('Borealis Cold IPA — deploy.sh Contract Suite', () => {
  const projectRoot = path.join(__dirname, '..');
  const tempOutputDir = path.join(os.tmpdir(), `borealis-demo-test-${Date.now()}`);

  afterAll(() => {
    if (fs.existsSync(tempOutputDir)) {
      fs.rmSync(tempOutputDir, { recursive: true, force: true });
    }
  });

  it('runs deploy.sh and builds static site into $OUTPUT_DIR without errors', () => {
    const cmd = `OUTPUT_DIR="${tempOutputDir}" BASE_PATH="/" bash deploy.sh`;
    execSync(cmd, { cwd: projectRoot, stdio: 'pipe' });

    const indexFile = path.join(tempOutputDir, 'index.html');
    const cssFile = path.join(tempOutputDir, 'styles.css');
    const jsFile = path.join(tempOutputDir, 'main.js');

    expect(fs.existsSync(indexFile)).toBe(true);
    expect(fs.existsSync(cssFile)).toBe(true);
    expect(fs.existsSync(jsFile)).toBe(true);

    const workerFile = path.join(tempOutputDir, '_worker.js');
    expect(fs.existsSync(workerFile)).toBe(false);

    const builtHtml = fs.readFileSync(indexFile, 'utf8');
    expect(builtHtml).toContain('/v1/automat.js');
    expect(builtHtml).toContain('data-project="borealis-craft-beer"');
  });
});
