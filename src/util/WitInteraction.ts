import { BrowserController, Command } from "./BrowserController"

export class WitInteraction {

    static API_KEY = process.env.REACT_APP_WIT_AI_API_KEY
    static withCors = (s: string) => `${process.env.REACT_APP_PROXY}/${s}`
    static API_SPEECH_URI = "https://api.wit.ai/speech"

    static processAudio = async (blob: Blob) => {
        const response = await fetch(WitInteraction.withCors(WitInteraction.API_SPEECH_URI), {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${WitInteraction.API_KEY}`,
                "Content-Type": "audio/wav",
                //"Transfer-Encoding": "chunked"
            },
            body: blob
        })
        const json = await response.json()
        const command: Command = { text: json["text"], intents: json["intents"], entities: json["entities"] }
        return command
    }

}