import * as assert from 'assert';
import * as vscode from 'vscode';

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
        } catch (error) {
            assert.fail('El comando scanErrors lanzó un error: ' + error);
        }
    });
});

