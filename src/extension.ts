import {
    window,
    commands,
    ExtensionContext,
    Position,
    Range,
    TextDocument,
    TextLine,
    TextEditorEdit,
    TextEdit,
    Selection,
    workspace
} from 'vscode';

// this method is called when vs code is activated
export function activate(context: ExtensionContext) {
    context.subscriptions.push(registerReboundDelete());
}

function reboundDelete() {
    const editor = window.activeTextEditor;
    const doc = editor.document;
    const start = window.activeTextEditor.selections[0].start;
    let range;

    if (start.line === 0 && start.character === 0) {
        return false;
    }

    if (start.character === 0) {
        range = new Range(
            window.activeTextEditor.selections[0].start.line,
            window.activeTextEditor.selections[0].start.character,
            window.activeTextEditor.selections[0].start.line - 1,
            999999999
        );
    } else {
        range = new Range(
            window.activeTextEditor.selections[0].start.line,
            window.activeTextEditor.selections[0].start.character,
            window.activeTextEditor.selections[0].start.line,
            0
        );
    }

    return editor.edit(editorBuilder => {
        editorBuilder.delete(range);
    });
}

function registerReboundDelete() {
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = commands.registerCommand('extension.reboundDelete', reboundDelete);

    return disposable;
}
