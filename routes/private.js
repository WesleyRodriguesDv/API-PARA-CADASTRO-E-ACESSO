import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Lista todos os usuários
 *     responses:
 *       200:
 *         description: Usuários listados com sucesso
 */

//Acessa o banco de dados omitindo a informação de senha;
//Com sucesso, lista todos os usuários

router.get("/listar-usuarios", async (req, res) => {
  try {
    const user = await prisma.user.findMany({ omit: { password: true } });
    res.status(200).json({ message: "Usuários listados com sucesso", user });
  } catch (err) {
    res.status(500).json({ message: "Falha no servidor" });
  }
});

export default router;
