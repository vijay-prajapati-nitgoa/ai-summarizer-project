const express = require("express");
const cors = require("cors");
require("dotenv").config();

const summarizeRoute = require("./routes/summarize");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", summarizeRoute);

app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});