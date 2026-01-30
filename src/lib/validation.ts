import { z } from "zod";

export const taskCreateSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  status: z.enum(["BACKLOG", "TODO", "DOING", "DONE"]).optional(),
  priority: z.number().int().min(1).max(5).optional(),
});

export const taskUpdateSchema = z.object({
  title: z.string().min(2).optional(),
  description: z.string().optional().nullable(),
  status: z.enum(["BACKLOG", "TODO", "DOING", "DONE"]).optional(),
  priority: z.number().int().min(1).max(5).optional(),
});

export const incidentCreateSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  status: z.enum(["OPEN", "INVESTIGATING", "MITIGATED", "RESOLVED"]).optional(),
  severity: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
  runbook: z.string().optional(),
});

export const incidentUpdateSchema = z.object({
  title: z.string().min(2).optional(),
  description: z.string().optional().nullable(),
  status: z.enum(["OPEN", "INVESTIGATING", "MITIGATED", "RESOLVED"]).optional(),
  severity: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
  runbook: z.string().optional().nullable(),
});

export const logCreateSchema = z.object({
  message: z.string().min(2),
  level: z.enum(["INFO", "WARN", "ERROR"]).optional(),
  source: z.string().optional(),
  incidentId: z.string().optional().nullable(),
});

export const alertCreateSchema = z.object({
  title: z.string().min(2),
  severity: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
  incidentId: z.string().optional().nullable(),
});
