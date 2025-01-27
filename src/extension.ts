import * as vscode from "vscode";

import * as execute from "./execute";
import * as bashArgs from "./arguments";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "bash-runner.execBashFile",
      (uri?: vscode.Uri): Promise<boolean> => {
        const filepath = uri || vscode.window.activeTextEditor?.document.uri;
        if (!filepath) throw new Error("No file path provided");

        return execute.runBashFile(filepath, [], false);
      }
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "bash-runner.execBashFileArgs",
      async (uri?: vscode.Uri): Promise<boolean> => {
        const filepath = uri || vscode.window.activeTextEditor?.document.uri;
        if (!filepath) throw new Error("No file path provided");

        const argsToPass = await bashArgs.askForArguments(filepath);
        if (argsToPass !== undefined) {
          return execute.runBashFile(filepath, argsToPass, false);
        }

        return false;
      }
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "bash-runner.execBashFileRoot",
      (uri?: vscode.Uri): Promise<boolean> => {
        const filepath = uri || vscode.window.activeTextEditor?.document.uri;
        if (!filepath) throw new Error("No file path provided");

        return execute.runBashFile(filepath, [], true);
      }
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "bash-runner.execBashFileArgsRoot",
      async (uri?: vscode.Uri): Promise<boolean> => {
        const filepath = uri || vscode.window.activeTextEditor?.document.uri;
        if (!filepath) throw new Error("No file path provided");

        const argsToPass = await bashArgs.askForArguments(filepath);
        if (argsToPass !== undefined) {
          return execute.runBashFile(filepath, argsToPass, false);
        }

        return false;
      }
    )
  );
}

export function deactivate() {}
