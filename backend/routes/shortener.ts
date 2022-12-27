import { Router } from "express";
import prismaClient from "../database";
import { Request } from "../types";
import auth from "../middlewares/auth";


const ShortenerRouter = Router({ caseSensitive: true, mergeParams: true });


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


ShortenerRouter.post("/create", auth, async (req: Request, res) => {
  const { suffix, target }: { suffix: string, target: string } = req.body;
  const creatorId = req.user?.id

  if (!creatorId) {
    return res.sendStatus(403)
  }

  try {
    const shortener = await prismaClient.shortener.create({ data: { suffix: suffix, target: target, creatorId: creatorId } })
    return res.json(shortener);
  } catch (err) {
    return res.sendStatus(400)
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

  const updated = await prismaClient.shortener.update({ where: { id: id }, data: updater })
  return res.json(updated)
})


ShortenerRouter.delete("/delete/:id", auth, async (req: Request, res) => {
  const shortenerId = parseInt((req.params.id as any)||'0')
  const creatorId = parseInt((req.user?.id as any)||'0')
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
