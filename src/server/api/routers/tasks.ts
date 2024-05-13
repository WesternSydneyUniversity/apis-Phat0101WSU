import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const tasksRouter = createTRPCRouter({
  tasks: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.task.findMany({
      where: { userId: ctx.session.user.id },
    });
  }),
  addTask: protectedProcedure
    .input(z.object({ message: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const newTask = await ctx.db.task.create({
        data: {
          description: input.message,
          completed: false,
          userId: ctx.session.user.id,
        },
      });
      return newTask;
    }),
  changeTask: protectedProcedure
    .input(z.object({ id: z.number(), message: z.string(), completed: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const updatedTask = await ctx.db.task.update({
        where: { id: input.id },
        data: {
          description: input.message,
          completed: input.completed,
        },
      });
      return updatedTask;
    }),
  deleteTask: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const deletedTask = await ctx.db.task.delete({
        where: { id: input.id },
      });
      return deletedTask;
    }),
});