import { config } from "dotenv";
import express from "express";
import morgan from 'morgan';
import loadClient from "./grpcClient.js";
import billingRouter from "./src/routes/billingRouter.js";
import videosRouter from "./src/routes/videosRouter.js";
import authRouter from "./src/routes/authRouter.js";

config({ path: ".env" });
const app = express();

app.use(express.json());
app.use(morgan('dev'));

app.get("/", (req, res) => {
    console.log("Received a request at the root endpoint");
    res.status(200).send("OK");
});

loadClient(app);

app.use("/billing", billingRouter);
app.use("/videos", videosRouter);
app.use("/auth", authRouter);

app.listen(process.env.PORT, () => {
  console.log(`- Entorno:      ${process.env.NODE_ENV}`);
  console.log(`- Puerto:       ${process.env.PORT}`);
  console.log(`- URL:          http://localhost:${process.env.PORT}`);
});