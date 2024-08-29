const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const { generateAccessToken } = require("./middleware.js/token.middleware");
const mainRouter = require("./controller/main.Controller");
app.use(express.json());
const cors = require('cors');
app.use(cors());

app.use("/api", generateAccessToken, mainRouter);

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
