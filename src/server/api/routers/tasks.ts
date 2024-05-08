import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

const tasks = [
  {
    userId: "clvx6u6s50000a7ue8krjfp6c",
    id: 1,
    description: "Complete the project report",
    completed: false
  },
  { userId: "clvx6u6s50000a7ue8krjfp6c", id: 2, description: "Clean the house", completed: true }
];
export const tasksRouter = createTRPCRouter({
  tasks: protectedProcedure.query(async ({ ctx }) => {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    return tasks.filter((task) => task.userId === ctx.session.user.id);
  }),
  createTask: protectedProcedure
    .input(z.object({ message: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const newTask = {
        id: tasks.length + 1,
        description: input.message,
        completed: false,
        userId: ctx.session.user.id
      };
      tasks.push(newTask);
      return newTask;
    }),
  updateTask: protectedProcedure
    .input(z.object({ id: z.number(), message: z.string(), completed: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const taskIndex = tasks.findIndex((task) => task.id === input.id);
      if (taskIndex !== -1) {
        tasks[taskIndex] = { 
          id: input.id, 
          description: input.message, 
          completed: !tasks[taskIndex]?.completed, 
          userId: ctx.session.user.id };
        return tasks[taskIndex];
      }
      return { message: "Task not found" };
    }),
  deleteTask: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const taskIndex = tasks.findIndex((task) => task.id === input.id);
      if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1);
        return { message: "Task deleted" };
      }
      return { message: "Task not found" };
    })
});