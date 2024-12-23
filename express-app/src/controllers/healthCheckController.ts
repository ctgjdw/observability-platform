import { Request, Response } from "express";

const ping = (req: Request, res: Response): void => {
  const data = {
    uptime: process.uptime(),
    dateISO: new Date().toISOString(),
  };

  res.send({ data });
};

export default { ping };
