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
const assert = __importStar(require("assert"));
const vscode = __importStar(require("vscode"));
suite('Extension Test Suite', () => {
    vscode.window.showInformationMessage('Iniciando pruebas...');
    // Test para verificar si la extensión está activa
    test('La extensión debería estar activa', async () => {
        const extension = vscode.extensions.getExtension('mi-publicador.code-error-detector'); // Usa el identificador correcto
        assert.ok(extension, 'La extensión no está instalada o activada');
    });
    // Test para verificar si el comando scanErrors se ejecuta sin errores
    test('El comando scanErrors debería ejecutarse sin errores', async () => {
        try {
            const result = await vscode.commands.executeCommand('code-error-detector.scanErrors');
            assert.strictEqual(result, undefined, 'El comando debería ejecutarse sin errores');
        }
        catch (error) {
            assert.fail('El comando scanErrors lanzó un error: ' + error);
        }
    });
});
//# sourceMappingURL=extension.test.js.map