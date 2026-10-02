const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 iPhone 18 AERO-SHIELD Landing Server running on http://localhost:${PORT}`);
});
