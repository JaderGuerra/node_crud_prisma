import { Router } from "express";
import { TodosController } from "./controller";

export class TodoRoutes {
  static get routes(): Router {
    const router = Router();

    const todoController = new TodosController();

    router.get("/", todoController.index);
    router.get("/:id", todoController.show);

    router.post("/", todoController.store);
    router.put("/:id", todoController.updated);
    router.delete("/:id", todoController.destroy);

    return router;
  }
}
