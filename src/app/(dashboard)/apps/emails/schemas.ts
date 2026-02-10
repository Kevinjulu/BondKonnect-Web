import * as z from "zod";

export const emailFormSchema = z.object({
  from: z.string().email("Valid email required"),
  subject: z.string().min(1, "Subject is required"),
  body: z.string().min(1, "Message body is required"),
  template_type: z.string().optional(),
  send_type: z.enum(["single", "bulk"]),
  send_to_role: z.string().optional(),
  recipients: z.array(z.string().email()).min(1, "At least one recipient is required"),
  cc: z.array(z.string().email()).optional(),
  bcc: z.array(z.string().email()).optional(),
  schedule_date: z.date().optional(),
  attachments: z.array(z.instanceof(File)).optional(),
  template: z.string().optional(),
});

export type EmailFormValues = z.infer<typeof emailFormSchema>;
