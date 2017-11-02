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
    let lines = [];

    if (start.line === 0 && start.character === 0) {
        return false;
    }

    for (let i = 0; i < window.activeTextEditor.selections.length; i++) {
        if (window.activeTextEditor.selections[i].start.character === 0) {
            lines.push(
                {
                    startLine: window.activeTextEditor.selections[i].start.line,
                    startCharacter: window.activeTextEditor.selections[i].start.character,
                    endLine: window.activeTextEditor.selections[i].start.line - 1,
                    endCharacter: 999999999
                }
            );
        } else {
            lines.push(
                {
                    startLine: window.activeTextEditor.selections[i].start.line,
                    startCharacter: window.activeTextEditor.selections[i].start.character,
                    endLine: window.activeTextEditor.selections[i].start.line ,
                    endCharacter: 0
                }
            );
        }
    }

    return editor.edit(editorBuilder => {
        let range;

        for (let i = 0; i < lines.length; i++) {
            range = new Range(
                lines[i].startLine,
                lines[i].startCharacter,
                lines[i].endLine,
                lines[i].endCharacter
            );

            editorBuilder.delete(range);
        }
    });
}

function registerReboundDelete() {
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = commands.registerCommand('extension.reboundDelete', reboundDelete);

    return disposable;
}
