const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`BlunderProof Chess Course Validation server listening on http://localhost:${PORT}`);
});
