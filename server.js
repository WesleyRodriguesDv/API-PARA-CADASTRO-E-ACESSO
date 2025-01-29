import express from "express";
import publicRoutes from "./routes/public.js";
import privateRoutes from "./routes/private.js";
import auth from "./middlewares/auth.js";
import swaggerUi from "swagger-ui-express";
import { readFile } from "fs/promises";

// Configuração para forçar a leitura do arquivo .json
const swaggerFile = JSON.parse(
  await readFile(new URL("./swagger_output.json", import.meta.url))
);

const app = express();

app.use(express.json());

// Configuração do Swagger
app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile)); // Rota para a doc

// Rotas da API
app.use("/", publicRoutes);
app.use("/", auth, privateRoutes);

app.listen(3000, () => console.log("Servidor rodando!"));
console.log("Documentação disponível em http://localhost:3000/doc");
