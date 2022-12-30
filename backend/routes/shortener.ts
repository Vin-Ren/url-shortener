import { Router } from "express";
import prismaClient from "../database";
import { Request } from "../types";
import auth from "../middlewares/auth";
import { Prisma } from "@prisma/client";


const ShortenerRouter = Router({ caseSensitive: true, mergeParams: true });

// For alphanumerics ref: https://stackoverflow.com/questions/388996/regex-for-javascript-to-allow-only-alphanumeric
// Added '-' symbol subtitute for space
const ALPHANUMERICS_REGEX = /^[a-z0-9-_]+$/i
const WEB_SCHEMA_REGEX = /^(?:https?):/i


ShortenerRouter.get("/s/:suffix", async (req, res) => {
  const suffix = req.params.suffix
  if (!(suffix)) {
    return res.sendStatus(404)
  }
  const shortener = await prismaClient.shortener.findFirst({ where: { suffix: suffix } })
  if (!(shortener)) {
    return res.sendStatus(404)
  }

  // Can be cached probably
  await prismaClient.shortener.update({ where: { suffix: suffix }, data: { hits: { increment: 1 } } })

  res.redirect(shortener.target)
})


ShortenerRouter.get("/info/:id", auth, async (req: Request, res) => {
  let id = parseInt(req.params.id || '0')
  if (!(id)) {
    return res.sendStatus(400)
  }

  const shortener = await prismaClient.shortener.findFirst({ where: { id: id } });
  if (!(shortener?.creatorId === req.user?.id) && shortener !== null) { // not the creator
    return res.sendStatus(403)
  }
  return res.json(shortener)
})


ShortenerRouter.post("/create", auth, async (req: Request, res) => {
  let { suffix, target }: { suffix: string, target: string } = req.body;
  const creatorId = req.user?.id;

  if (suffix.includes('/')) suffix = suffix.replace('/', '');

  if (!(WEB_SCHEMA_REGEX.test(target))) {
    target = "https://" + target;
  }

  if (!(ALPHANUMERICS_REGEX.test(suffix))) {
    return res.sendStatus(400)
  }

  if (!creatorId) {
    return res.sendStatus(403)
  }

  try {
    const shortener = await prismaClient.shortener.create({ data: { suffix: suffix, target: target, creatorId: creatorId } })
    return res.json(shortener);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        res.sendStatus(409)
      }
    } else {
      return res.sendStatus(400)
    }
  }
})


ShortenerRouter.patch("/edit/:id", auth, async (req: Request, res) => {
  let id = parseInt(req.params.id || '0')
  const updater: { suffix?: string, target?: string } = req.body
  if (!(id && (updater.suffix || updater.target))) {
    return res.sendStatus(400)
  }

  const shortener = await prismaClient.shortener.findFirst({ where: { id: id } });
  if (!(shortener?.creatorId === req.user?.id) && shortener !== null) { // not the creator
    return res.sendStatus(403)
  }

  try {
    const updated = await prismaClient.shortener.update({ where: { id: id }, data: updater })
    return res.json(updated)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        res.sendStatus(409)
      }
    }
  }
})


ShortenerRouter.delete("/delete/:id", auth, async (req: Request, res) => {
  const shortenerId = parseInt((req.params.id as any) || '0')
  const creatorId = parseInt((req.user?.id as any) || '0')
  if (!(shortenerId)) {
    return res.sendStatus(404)
  } else if (!(creatorId)) {
    return res.sendStatus(403)
  }

  const shortener = await prismaClient.shortener.findFirst({ where: { id: shortenerId } });

  if (!(shortener?.creatorId === creatorId) || shortener === null) {
    return res.sendStatus(403)
  }

  const deleted = await prismaClient.shortener.delete({ where: { id: shortenerId } })
  return res.status(200).send(deleted)
})


export default ShortenerRouter
