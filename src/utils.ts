import * as vscode from "vscode";

import * as path from "path";

const EXTENSION_CONFIG_NAME = "bash-sh-runner";
const SHELL_PATH_CONFIG_KEY = "shellPath";

export function getExtensionConfig(filepath?: vscode.Uri) {
  let workspaceFolder: vscode.Uri | undefined;
  if (filepath)
    workspaceFolder = vscode.workspace.getWorkspaceFolder(filepath)?.uri;
  else if (vscode.window.activeTextEditor)
    workspaceFolder = vscode.workspace.getWorkspaceFolder(
      vscode.window.activeTextEditor.document.uri
    )?.uri;

  return vscode.workspace.getConfiguration(
    EXTENSION_CONFIG_NAME,
    workspaceFolder
  );
}

export async function getShellPath() {
  const shellPath = getExtensionConfig().get<string>(
    SHELL_PATH_CONFIG_KEY,
    "/bin/bash"
  );
  const shellUri = vscode.Uri.file(shellPath);

  if (!(await uriExists(shellUri))) {
    const browseButtonText = "Update path";
    vscode.window
      .showErrorMessage(
        `Shell could not be located at ${shellPath}`,
        browseButtonText
      )
      .then((clickedItem) => {
        if (clickedItem === browseButtonText) {
          const searchPath = `${EXTENSION_CONFIG_NAME}.${SHELL_PATH_CONFIG_KEY}`;
          vscode.commands.executeCommand(
            "workbench.action.openSettings",
            searchPath
          );
        }
      });

    return undefined;
  }
  return shellPath;
}

export async function uriExists(uri: vscode.Uri) {
  try {
    await vscode.workspace.fs.stat(uri);
    return true;
  } catch (e) {
    return false;
  }
}

export function compareUri(path1: vscode.Uri, path2: vscode.Uri) {
  return (
    path.normalize(path1.fsPath).toLowerCase() ===
    path.normalize(path2.fsPath).toLowerCase()
  );
}
