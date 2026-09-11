import { z } from "zod";

export const applicationActionSchema = z.object({
  action: z.enum([
    "inspect_project",
    "list_directory",
    "search_files",
    "read_file",

    "create_directory",
    "write_file",
    "edit_file",
    "delete_file",

    "install_dependencies",

    "run_command",
    "run_project",
    "stop_project",
    "restart_project",
    "get_project_status",
    "get_project_logs",

    "build_project",
    "test_project",

    "finish",
  ]),

  path:z.string().nullable(),
  query:z.string().nullable(),
  content: z.string().nullable(),
  oldText: z.string().nullable(),
  newText: z.string().nullable(),
  command: z.string().nullable(),
  packages: z.array(z.string()).nullable(),
  reason: z.string().nullable(),
  response: z.string().nullable(),
});
