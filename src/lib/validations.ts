import { z } from "zod";

export const baseBlogPostSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  description: z
    .string()
    .min(150, "Description must be at least 250 characters")
    .max(500, "Description must be less than 500 characters"),
  content: z
    .string()
    .min(300, "Content must be at least 300 characters")
    .max(50000, "Content must be less than 50,000 characters"),
  tags: z
    .array(z.string())
    .min(2, "At least two tag is required")
    .max(10, "Maximum of 10 tags allowed"),
  featured: z
    .boolean()
    .default(false)
    .transform((val) => Boolean(val)),
});

export const createBlogPostSchema = baseBlogPostSchema.extend({
  file: z.custom<File | null>().refine(
    (file) => {
      return (
        file instanceof File && file.size > 0 && file.type.startsWith("image/")
      );
    },
    {
      message: "Valid image file is required",
    }
  ),
});

export const updateBlogPostSchema = baseBlogPostSchema.extend({
  file: z
    .custom<File | null>()
    .optional()
    .refine(
      (file) => {
        return (
          file === null ||
          (file instanceof File &&
            file.size > 0 &&
            file.type.startsWith("image/"))
        );
      },
      {
        message: "Valid image file is required",
      }
    ),
});

export type BlogPostFormValues = z.infer<typeof createBlogPostSchema>;
export type UpdateBlogPostFormValues = z.infer<typeof updateBlogPostSchema>;

export const deleteBlogPostSchema = z.object({
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Invalid slug format, please try again")
    .max(100, "Slug must be less than 100 characters")
    .refine(
      (val) => !val.includes(" "),
      "Invalid slug format, please try again"
    ),
  delSecretKey: z
    .string()
    .min(1, "Secret key is required")
    .max(100, "Secret key must be less than 100 characters")
    .refine(
      (val) => !val.includes(" "),
      "Invalid secret key format, please try again"
    ),
});
