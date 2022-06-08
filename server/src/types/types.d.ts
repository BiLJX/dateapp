import { Request, Response } from "express";
declare type Controller = (req: Request, res: Response) => any;
