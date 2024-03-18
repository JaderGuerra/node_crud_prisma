import { Request, Response } from "express";
import { prisma } from "../../data/postgres";
import { CreateTodosDts,UpdatedTodoDto } from "../../domain/dtos";

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
    const [error, createTodosDts] = CreateTodosDts.create(request.body);

    if (error) return response.status(400).json();

    const todo = await prisma.todo.create({ data: createTodosDts! });
    response.json(todo);
  };

  public updated = async (request: Request, response: Response) => {
    const id = +request.params.id;
    const [error, updatedTodoDto] = UpdatedTodoDto.create({...request.body,id});

    if (error) return response.status(400).json({ error });

    const todo = await prisma.todo.findFirst({ where: { id } });

    if (!todo) return response.status(404).json({ error: `TODO with id ${id} not found` });
    
    const updatedTodo = await prisma.todo.update({
      where: { id },
      data: updatedTodoDto!.values,
    });

    response.json( updatedTodo );
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
