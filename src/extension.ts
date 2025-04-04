import * as vscode from 'vscode';
import * as child_process from 'child_process';

// Activar la extensión
export function activate(context: vscode.ExtensionContext) {
    console.log('Extensión "code-error-detector" activada.');

    // Registrar el comando para escanear errores
    const disposable = vscode.commands.registerCommand('code-error-detector.scanErrors', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showInformationMessage('Abre un archivo para escanear errores.');
            return;
        }

        const document = editor.document;
        const filePath = document.fileName;
        const languageId = document.languageId;

        if (languageId === 'javascript' || languageId === 'typescript') {
            runESLint(filePath);
        } else if (languageId === 'python') {
            runPylint(filePath);
        } else {
            vscode.window.showWarningMessage('Este lenguaje no es compatible con la extensión.');
        }
    });

    context.subscriptions.push(disposable);

    // Registrar el CodeActionProvider para correcciones automáticas
    context.subscriptions.push(
        vscode.languages.registerCodeActionsProvider(
            { scheme: 'file', language: 'javascript' },
            new LinterCodeActionProvider(),
            {
                providedCodeActionKinds: [vscode.CodeActionKind.QuickFix]
            }
        )
    );
}

// Función para ejecutar ESLint y mostrar errores
function runESLint(filePath: string) {
    child_process.exec(`npx eslint "${filePath}" --format compact`, (_, stdout, stderr) => {
        if (stderr) {
            vscode.window.showErrorMessage(`Error al ejecutar ESLint: ${stderr}`);
            return;
        }

        if (stdout) {
            vscode.window.showErrorMessage(`ESLint encontró problemas:\n${stdout}`);
        } else {
            vscode.window.showInformationMessage('No se encontraron problemas con ESLint.');
        }
    });
}

// Función para ejecutar Pylint y mostrar errores
function runPylint(filePath: string) {
    child_process.exec(`pylint "${filePath}" --output-format=parseable`, (_, stdout, stderr) => {
        if (stderr) {
            vscode.window.showErrorMessage(`Error al ejecutar Pylint: ${stderr}`);
            return;
        }

        if (stdout) {
            vscode.window.showErrorMessage(`Pylint encontró problemas:\n${stdout}`);
        } else {
            vscode.window.showInformationMessage('No se encontraron problemas con Pylint.');
        }
    });
}

// Implementación de CodeActionProvider para sugerencias y correcciones
class LinterCodeActionProvider implements vscode.CodeActionProvider {
    public provideCodeActions(
        document: vscode.TextDocument,
        _range: vscode.Range | vscode.Selection,
        context: vscode.CodeActionContext,
        _token: vscode.CancellationToken
    ): vscode.ProviderResult<vscode.CodeAction[]> {
        const actions: vscode.CodeAction[] = [];

        // Iterar sobre los diagnósticos
        for (const diagnostic of context.diagnostics) {
            if (diagnostic.code === "no-unused-vars") {
                const fix = new vscode.CodeAction("Eliminar variable no usada", vscode.CodeActionKind.QuickFix);
                fix.edit = new vscode.WorkspaceEdit();
                fix.edit.delete(document.uri, diagnostic.range);
                actions.push(fix);
            }
        }

        return actions;
    }
}

// Desactivar la extensión
export function deactivate() {}

