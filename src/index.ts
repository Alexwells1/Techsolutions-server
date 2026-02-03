import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./utils/db";
import registerRoutes from "./routes/register";
import adminRoutes from "./routes/adminRoutes";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/register", registerRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5000;

connectDB(process.env.MONGO_URI || "")
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error(err));
