"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const child_process = __importStar(require("child_process"));
// Activar la extensión
function activate(context) {
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
        }
        else if (languageId === 'python') {
            runPylint(filePath);
        }
        else {
            vscode.window.showWarningMessage('Este lenguaje no es compatible con la extensión.');
        }
    });
    context.subscriptions.push(disposable);
    // Registrar el CodeActionProvider para correcciones automáticas
    context.subscriptions.push(vscode.languages.registerCodeActionsProvider({ scheme: 'file', language: 'javascript' }, new LinterCodeActionProvider(), {
        providedCodeActionKinds: [vscode.CodeActionKind.QuickFix]
    }));
}
// Función para ejecutar ESLint y mostrar errores
function runESLint(filePath) {
    child_process.exec(`npx eslint "${filePath}" --format compact`, (_, stdout, stderr) => {
        if (stderr) {
            vscode.window.showErrorMessage(`Error al ejecutar ESLint: ${stderr}`);
            return;
        }
        if (stdout) {
            vscode.window.showErrorMessage(`ESLint encontró problemas:\n${stdout}`);
        }
        else {
            vscode.window.showInformationMessage('No se encontraron problemas con ESLint.');
        }
    });
}
// Función para ejecutar Pylint y mostrar errores
function runPylint(filePath) {
    child_process.exec(`pylint "${filePath}" --output-format=parseable`, (_, stdout, stderr) => {
        if (stderr) {
            vscode.window.showErrorMessage(`Error al ejecutar Pylint: ${stderr}`);
            return;
        }
        if (stdout) {
            vscode.window.showErrorMessage(`Pylint encontró problemas:\n${stdout}`);
        }
        else {
            vscode.window.showInformationMessage('No se encontraron problemas con Pylint.');
        }
    });
}
// Implementación de CodeActionProvider para sugerencias y correcciones
class LinterCodeActionProvider {
    provideCodeActions(document, _range, context, _token) {
        const actions = [];
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
function deactivate() { }
//# sourceMappingURL=extension.js.map