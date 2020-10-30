export interface Command {
    text: string
    intents: string[]
    entities?: Record<any, any>
}

export class BrowserController {

    static executeCommand = async (command: Command) => {
        window.parent.postMessage({ type: "EXECUTE_COMMAND", command }, "*")
    }

}