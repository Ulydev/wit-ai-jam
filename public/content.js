const render = () => {
    const iframe = document.createElement("iframe")
    iframe.id = "voice-extension"
    iframe.setAttribute("style", "z-index: 10000; position: fixed; left: 0; top: 0; display: block; width: 100%; height: 100%; pointer-events: none;")
    iframe.src = "http://localhost:3000"
    iframe.frameBorder = 0
    iframe.allowtransparency = true
    iframe.allow = "microphone"
    document.body.prepend(iframe)
    return iframe
}

const toggle = () => {
    const iframe = document.getElementById("voice-extension")
    iframe.style.display = iframe.style.display === "block" ? "none" : "block"
}

const listen = (target) => {
    window.addEventListener("message", ({ data: message }) => {
        if (!message.type || message.type !== "EXECUTE_COMMAND") return
        const command = message.command
        const mainIntent = command.intents[0]
        const result = { type: "COMMAND_RESULT" }
        switch (mainIntent) {
            case "scroll": {
                window.scrollBy({ top: 100, left: 0, behavior: "smooth" })
                result.text = "Scrolling"
            } break
        }
        target.postMessage(result, "*")
    })
}

const iframe = render()
listen(iframe.contentWindow)