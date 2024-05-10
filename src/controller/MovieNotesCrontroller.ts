import { Request, Response } from "express";

class MovieNotesController {
  async create(req: Request, res: Response) {
    const { title, description, rating, user_id } = req.body;

    
  }
}