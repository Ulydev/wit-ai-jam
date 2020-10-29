import { toast } from "react-toastify"

export class NotificationSystem {

    static initialize = () => {
        window.addEventListener("message", ({ data: message }) => {
            if (!message.type || message.type !== "COMMAND_RESULT") return
            const callback = message.error ? NotificationSystem.error : NotificationSystem.success
            callback(message.text, message.voice)
        })
    }

    static success = (text: string, voice?: string) => {
        toast.success(text)
        NotificationSystem.say(voice || text)
    }

    static error = (text: string, voice?: string) => {
        toast.error(text)
        NotificationSystem.say(voice || text)
    }

    static say = (s: string) => window.speechSynthesis.speak(new SpeechSynthesisUtterance(s))

}