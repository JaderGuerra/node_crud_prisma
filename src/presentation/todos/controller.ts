import { Request, Response } from "express";
import { prisma } from "../../data/postgres";

export class TodosController {
  public index = async (request: Request, response: Response) => {
    const todos = await prisma.todo.findMany();
    return todos;
  };

  public show = async (request: Request, response: Response) => {
    const id = +request.params.id;
    if (isNaN(id))
      return response.status(400).json({ error: "ID arumentis no exist" });

    const todo = await prisma.todo.findFirst({ where: { id } });
    todo
      ? response.json(todo)
      : response.status(404).json({ error: `TODO with id ${id} not found` });
    return todo;
  };

  public store = async (request: Request, response: Response) => {
    const { text } = request.body;
    if (!text)
      return response.status(400).json({ error: "Text property is required" });

    const todo = await prisma.todo.create({ data: text });
    response.json(todo);
  };

  public updated = async (request: Request, response: Response) => {
    const id = +request.params.id;
    if (isNaN(id))
      return response.status(400).json({ error: "ID arumentis no exist" });

    const todo = await prisma.todo.findFirst({ where: { id } });
    if (!todo) {
      return response
        .status(404)
        .json({ error: `TODO with id ${id} not found` });
    }

    const { text, completeAt } = request.body;

    const updatedTodo = await prisma.todo.update({
      where: { id },
      data: { text, completeAt: completeAt ? new Date(completeAt) : null },
    });

    response.json({ updatedTodo });
  };

  public destroy = async (request: Request, response: Response) => {
    const id = +request.params.id;
    const todo = await prisma.todo.findFirst({ where: { id } });

    if (!todo) {
      return response
        .status(404)
        .json({ error: `TODO with id ${id} not found` });
    }
    const deleted = await prisma.todo.delete({ where: { id } });
    deleted
      ? response.json(deleted)
      : response.status(400).json({ error: `TODO with id ${id} not found` });
  };
}
