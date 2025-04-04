import * as vscode from 'vscode';
import { execSync } from 'child_process';  // Para ejecutar comandos del sistema

// Esta función es llamada cuando tu extensión es activada
export function activate(context: vscode.ExtensionContext) {
    console.log('¡La extensión "code-error-detector" está activa!');

    // Registrar el comando para ejecutar linting
    let disposable = vscode.commands.registerCommand('code-error-detector.lintCode', async function () {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return; // No hacer nada si no hay editor activo

        const document = editor.document;
        const diagnostics: vscode.Diagnostic[] = []; // Array para almacenar los errores de linting

        // Solo ejecutar Pylint si el archivo es Python
        if (document.languageId === 'python') {
            const filePath = document.uri.fsPath;
            try {
                // Ejecutar Pylint en el archivo Python
                const pylintOutput = execSync(`pylint ${filePath}`).toString();
                
                // Procesar la salida de Pylint
                const pylintLines = pylintOutput.split('\n');
                pylintLines.forEach(line => {
                    const regex = /(\d+):(\d+): (.*)$/;
                    const match = line.match(regex);
                    if (match) {
                        const lineNumber = parseInt(match[1], 10) - 1; // Ajuste de la línea (índice 0)
                        const columnNumber = parseInt(match[2], 10) - 1;
                        const message = match[3];

                        // Crear un diagnóstico de VS Code
                        const diagnostic = new vscode.Diagnostic(
                            new vscode.Range(lineNumber, columnNumber, lineNumber, columnNumber + 1),
                            message,
                            vscode.DiagnosticSeverity.Warning
                        );
                        diagnostics.push(diagnostic);
                    }
                });
                
                // Mostrar los problemas en el panel de problemas
                const diagnosticCollection = vscode.languages.createDiagnosticCollection('pylint');
                diagnosticCollection.set(document.uri, diagnostics);
                
                vscode.window.showInformationMessage('Linting completado con Pylint!');
            } catch (error) {
                vscode.window.showErrorMessage('Error al ejecutar Pylint: ' + error.message);
            }
        }
    });

    context.subscriptions.push(disposable);
}

// Esta función es llamada cuando tu extensión es desactivada
export function deactivate() {}

