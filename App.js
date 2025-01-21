import express from "express"
import "./src/CronJobs/functioncron.js"
import Router from "./src/Router/RouterEmail.js";
const app = express();

app.use(express.json());

app.use("/email", Router)
app.use("/", Router)
app.use("/create", Router)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
