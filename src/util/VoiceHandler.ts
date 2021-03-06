import "speech-polyfill/dist/speech-polyfill.js"

import store from "../state/store"
import { BrowserController } from "./BrowserController"
import { NotificationSystem } from "./NotificationSystem"
import { wait } from "./wait"
import { WitInteraction } from "./WitInteraction"

export class VoiceHandler {

    static recognition: SpeechRecognition
    
    static recorder: any
    static stream: MediaStream
    static streamChunks: Blob[]

    static initializeAudio = async () => {
        VoiceHandler.stream = await navigator.mediaDevices.getUserMedia ({ audio: { advanced: [{ channelCount: 1 }] } })

        const audioContext = new AudioContext()
        const source = audioContext.createMediaStreamSource(VoiceHandler.stream)
        const recorder = new Recorder(source, { numChannels: 1 })
        VoiceHandler.recorder = recorder
    }

    static startListening = () => {
        const recognition = new SpeechRecognition()
        VoiceHandler.recognition = recognition
        recognition.lang = "en-US"
        recognition.continuous = true
        recognition.interimResults = true
        recognition.maxAlternatives = 1

        recognition.start()

        recognition.onspeechstart = async () => {
            VoiceHandler.startAudioCapture()
        }
        
        recognition.onresult = async (event) => {
            if (event.results[0].isFinal) {
                recognition.stop()
                try { await VoiceHandler.onResult(event.results[0][0].transcript) } catch (e) {}
                recognition.start()
            } else {
                VoiceHandler.onIntermediate(event.results[0][0].transcript, (event.results[1] && event.results[1][0].transcript) || '')
            }
        }
    }

    static startAudioCapture = async () => {
        const recorder = VoiceHandler.recorder
        try { recorder.stop(); recorder.clear() } catch (e) {}
        recorder.record()
    }

    static endAudioCapture = () => new Promise<Blob>(resolve => {
        VoiceHandler.recorder.stop()
        VoiceHandler.recorder.exportWAV(resolve)
        VoiceHandler.recorder.clear()
    })

    static onResult = async (phrase: string) => {
        const setUtterance = store.getActions().setUtterance
        const setLoading = store.getActions().setLoading

        setUtterance({ confirmed: phrase })
        setLoading(true)
    
        const blob = await VoiceHandler.endAudioCapture()
        try {
            const command = await WitInteraction.processAudio(blob)
            setUtterance({ final: command.text })
            await BrowserController.executeCommand(command)
        } catch (e) {
            NotificationSystem.error(e.toString())
        }
        await wait(2000)
        
        setLoading(false)
        setUtterance({ })
    }

    static onIntermediate = (confirmed: string, intermediate: string) => {
        store.getActions().setUtterance({ confirmed, intermediate })
    }

}