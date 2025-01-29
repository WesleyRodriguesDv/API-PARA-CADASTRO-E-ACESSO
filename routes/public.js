import express from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET
const prisma = new PrismaClient();
const router = express.Router();

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Cria um novo usuário
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 */

//CADASTRO
router.post("/cadastro", async (req, res) => {
  try {
    const user = req.body;

//CRIPTOGRAFIA DA SENHA
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(user.password, salt);

//VERIFICA SE JÁ EXISTE UM EMAIL CADASTRADO
    const exist = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (exist) {
      return res
        .status(404)
        .json({ mesage: "Já existe um cadastro com esse email" });
    }

//CADASTRA UM NOVO USUÁRIO NO BANCO DE DADOS
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

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Cria um novo usuário
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 */

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
    const token = jwt.sign({id: user.id}, JWT_SECRET, {expiresIn: '1m'})

    res.status(200).json(token);
  } catch (err) {
    res.status(500).json({ message: "Erro no servidor, tente novamente." });
  }
});

export default router;
