import { Router } from "express";
import prismaClient from "../database";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import envVars from "../envVars";
import { Request } from "../types";
import auth from "../middlewares/auth";

const UserRouter = Router({ mergeParams: true });
const { JWT_SECRET_TOKEN, JWT_LIFETIME } = envVars


function create_access_token({ id, email }: { id: number, email: string }) {
  return jwt.sign({ id: id, email: email },
    JWT_SECRET_TOKEN, { expiresIn: JWT_LIFETIME }
  )
}


UserRouter.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body
    if (!(email && password)) {
      return res.status(400).send({ detail: "Email and password are required." })
    }

    const registered = await prismaClient.user.findFirst({ where: { email: email } })

    if (registered) {
      return res.status(409).send("User Already Exist. Please Login")
    }

    const passwordHash = await bcrypt.hash(password, 10) // 10 salt rounds

    const user = await prismaClient.user.create({
      data: {
        email: email,
        passwordHash: passwordHash
      }
    })

    const token = create_access_token(user)

    res.status(201).json({ email: user.email, token: token })

  } catch (err) {
    console.log(err)
  }
})


UserRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!(email && password)) {
      return res.status(400).send({ detail: "Email and password are required." })
    }

    const user = await prismaClient.user.findFirst({ where: { email: email } })

    if (!(user && (await bcrypt.compare(password, user.passwordHash)))) {
      return res.status(400).send("Invalid Credentials");
    }

    const token = create_access_token(user)

    return res.status(200).json({ email: user.email, token: token })

  } catch (err) {
    console.log(err)
  }
})


UserRouter.delete("/delete_account", auth, async (req: Request, res) => {
  const { password }: { password: string } = req.body;
  const user = await prismaClient.user.findFirst({where:{id:req.user?.id}}) || null;
  if (!(user)) {
    return res.sendStatus(403)
  }
  if (!(password)|| !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(400).send("Invalid Credentials");
  }

  try {
    const deleted = await prismaClient.user.delete({where:{id:user.id}})
    return res.sendStatus(204)
  } catch (err) {
    return res.status(409).send("Please delete all shorteners first")
  }
})


UserRouter.get("/dash", auth, async (req: Request, res) => {
  if (req.user === undefined) {
    return res.sendStatus(403)
  }
  const user = await prismaClient.user.findFirst({ where: { id: req.user.id }, include: { shorteners: true } })
  if (!(user)) {
    return res.sendStatus(403)
  }
  res.json({ id: user?.id, email: user?.email, shorteners: user?.shorteners })
})


export default UserRouter;
