import { createApplicationTools } from "../../tools/application.tools.js";

export class ApplicationRuntime {
  constructor(state) {
    this.state = state;
    this.tools = createApplicationTools();
  }

  async executeAction(action) {
    switch (action.action) {
      case "inspect_project":
        return await this.executeInspectProject(action);

      case "list_directory":
        return await this.executeListDirectory(action);

      case "list_directory_tree":
        return await this.executeListDirectoryTree(action);

      case "search_files":
        return await this.executeSearchFiles(action);

      case "read_file":
        return await this.executeReadFile(action);

      case "create_directory":
        return await this.executeCreateDirectory(action);

      case "write_file":
        return await this.executeWriteFile(action);

      case "edit_file":
        return await this.executeEditFile(action);

      case "delete_file":
        return await this.executeDeleteFile(action);

      case "install_dependencies":
        throw new Error(
          "install_dependencies is not implemented yet.",
        );

      case "run_command":
        throw new Error(
          "run_command is not implemented yet.",
        );

      case "run_project":
        throw new Error(
          "run_project is not implemented yet.",
        );

      case "stop_project":
        throw new Error(
          "stop_project is not implemented yet.",
        );

      case "restart_project":
        throw new Error(
          "restart_project is not implemented yet.",
        );

      case "get_project_status":
        throw new Error(
          "get_project_status is not implemented yet.",
        );

      case "get_project_logs":
        throw new Error(
          "get_project_logs is not implemented yet.",
        );

      case "build_project":
        throw new Error(
          "build_project is not implemented yet.",
        );

      case "test_project":
        throw new Error(
          "test_project is not implemented yet.",
        );

      case "finish":
        return await this.executeFinish(action);

      default:
        throw new Error(
          `Unknown application action: ${action.action}`,
        );
    }
  }

  async executeInspectProject(action) {
    return await this.tools.inspectProject();
  }

  async executeListDirectory(action) {
    return await this.tools.listDirectory(
      action.path ?? ".",
    );
  }

  async executeListDirectoryTree(action) {
    return await this.tools.listDirectoryTree(
      action.path ?? ".",
    );
  }

  async executeSearchFiles(action) {
    return await this.tools.searchFiles(
      action.query,
      action.path ?? ".",
    );
  }

  async executeReadFile(action) {
    return await this.tools.readFile(
      action.path,
    );
  }

  async executeCreateDirectory(action) {
    return await this.tools.createDirectory(
      action.path,
    );
  }

  async executeWriteFile(action) {
    return await this.tools.writeFile(
      action.path,
      action.content,
    );
  }

  async executeEditFile(action) {
    return await this.tools.editFile(
      action.path,
      action.oldText,
      action.newText,
    );
  }

  async executeDeleteFile(action) {
    return await this.tools.deleteFile(
      action.path,
    );
  }

  async executeFinish(action) {
    return {
      success: true,
      operation: "finish",
      response:
        action.response ??
        "Application task completed.",
    };
  }
  
}