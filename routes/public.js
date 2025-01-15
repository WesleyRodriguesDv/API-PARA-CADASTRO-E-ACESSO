import express from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();
const router = express.Router();

//CADASTRO
router.post("/cadastro", async (req, res) => {
  try {
    const user = req.body;


    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(user.password, salt);

    const userDB = await prisma.user.create({
      data: {
        email: user.email,
        name: user.name,
        password: hashPassword,
      },
    });
    res.status(201).json(userDB);
  } catch (err) {
    res.status(500).json({ message: "Erro no servidor!" });
  }
});

//LOGIN

router.post("/login", async (req, res) => {
  try {
    const userInfo = req.body;

//Busca o usuário no banco de dados
    const user = await prisma.user.findUnique({
      where: { email: userInfo.email },
    });

//Verifica se o usuario existe e retorna um erro caso falso
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }
//Verifica se a senha é a mesma cadastrada e retorna um erro caso falso
    const isMatch = await bcrypt.compare(userInfo.password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "senha inválida" });
    }

//Gerar o token JWT
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Erro no servidor, tente novamente." });
  }
});

export default router;
