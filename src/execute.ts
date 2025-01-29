import * as vscode from "vscode";

import * as path from "path";

import * as utils from "./utils";

const TERMINAL_NAME = "Bash Runner Terminal";

export async function getBashRunnerTerminal(
  bEnsureExists = true,
  bRefresh = true
): Promise<vscode.Terminal | undefined> {
  const createTerminal = async () => {
    const shellPath = await utils.getShellPath();
    if (!shellPath) {
      return undefined;
    }
    return vscode.window.createTerminal(TERMINAL_NAME, shellPath);
  };

  for (const terminal of vscode.window.terminals) {
    if (terminal.name === TERMINAL_NAME) {
      if (bRefresh) {
        terminal.dispose();
        return createTerminal();
      }
      return terminal;
    }
  }

  if (bEnsureExists) {
    return createTerminal();
  }
}

async function runBashFileInTerminal(
  file: vscode.Uri,
  args: string[] = [],
  bRoot = false
): Promise<boolean> {
  const terminal = await getBashRunnerTerminal();
  if (!terminal) return false;

  const sudo = bRoot ? "sudo" : "";
  const filepath = file.fsPath;
  const workingDirectory = path.dirname(filepath);
  const command = `${sudo} clear && "${filepath}" ${args.join(" ")}`;
  terminal.sendText(command, true);
  terminal.show();
  return true;
}

export async function runBashFile(
  filepath: vscode.Uri,
  args: string[] = [],
  bRoot = false
): Promise<boolean> {
  const config = utils.getExtensionConfig(filepath);

  if (config.get<boolean>("saveFileBeforeRun")) {
    const activeDocument = vscode.window.activeTextEditor?.document;
    if (
      activeDocument &&
      activeDocument.isDirty &&
      utils.compareUri(filepath, activeDocument.uri)
    ) {
      if (!(await activeDocument.save())) return false;
    }
  }
  return runBashFileInTerminal(filepath, args, bRoot);
}
