import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const tasksRouter = createTRPCRouter({
  tasks: protectedProcedure.query(async ({ ctx }) => {
    return await prisma.task.findMany({
      where: { userId: ctx.session.user.id },
    });
  }),
  addTask: protectedProcedure
    .input(z.object({ message: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const newTask = await prisma.task.create({
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
      const updatedTask = await prisma.task.update({
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
      const deletedTask = await prisma.task.delete({
        where: { id: input.id },
      });
      return deletedTask;
    }),
});