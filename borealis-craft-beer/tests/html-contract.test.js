const fs = require('fs');
const path = require('path');

describe('Borealis Cold IPA — Landing Page Contract & Compliance', () => {
  const htmlPath = path.join(__dirname, '../public/index.html');
  const htmlContent = fs.readFileSync(htmlPath, 'utf8');

  it('includes the official Automat tracking script in the head with exact project tag', () => {
    expect(htmlContent).toContain('/v1/automat.js');
    expect(htmlContent).toContain('data-project="borealis-craft-beer"');
  });

  it('collects only email with the required one-line explanation', () => {
    expect(htmlContent).toContain('type="email"');
    expect(htmlContent).toContain("We'll only email you about Batch #001 allocation updates and canning release dates. No spam, unsubscribe anytime.");
  });

  it('clearly discloses that the beer is coming soon on all reservation triggers (no deceptive payments)', () => {
    expect(htmlContent).toMatch(/Coming Soon/i);
    expect(htmlContent).toMatch(/No payment today/i);
    expect(htmlContent).toMatch(/Reserve Batch #001 \(Coming Soon\)/i);
  });

  it('includes 21+ age verification gate for legal alcohol compliance', () => {
    expect(htmlContent).toContain('ageGateModal');
    expect(htmlContent).toContain('I Am 21 or Older');
    expect(htmlContent).toContain('I Am Under 21');
  });

  it('includes interactive components for Cold IPA sensory specs, food pairings, and quiz', () => {
    expect(htmlContent).toContain('id="specs"');
    expect(htmlContent).toContain('id="pairings"');
    expect(htmlContent).toContain('id="quiz"');
    expect(htmlContent).toContain('id="faq"');
  });
});
