import app from "./src/app.js";
const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
  console.log(`Event Manager API started on http://localhost:${PORT}`);
});
