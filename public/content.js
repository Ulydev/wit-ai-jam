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

const apologies = [
    "Sorry, I didn't catch that.",
    "Sorry, I didn't understand.",
    "Please repeat your command.",
    "Unrecognized command."
]

const randomApology = () => [

][Math]

const getEntity = (command, entityName) => command.entities[entityName] ? command.entities[entityName][0] : null

const sendToBackground = chrome.runtime.sendMessage

let previousCommand = {}
const completeCommand = (command) => {
    if (!previousCommand) return // nothing to complete
    const mainIntent = command.intents ? command.intents[0] : null
    if (!mainIntent && (!command.entities || command.entities.length === 0)) return // likely invalid command
    command.intents = previousCommand.intents // put previous intent
    command.entities = [...command.entities, ...previousCommand.entities] // add previous entities (e.g. "Fill the Body field" - then "Hello everyone")
}

const elementMatchesDescription = (element, description) => {
    if (element.offsetParent === null) return false // skip if hidden
    if (element.innerText !== "") {
        if (element.innerText.toLowerCase().includes(description) || description.includes(element.innerText.toLowerCase())) return true
    }
    return false
}

const getFirstMatchingElement = (selector, description) => {
    const candidates = []
    const elements = document.querySelectorAll(selector)
    const iterator = elements.entries()
    let element = iterator.next()
    while (!element.done) {
        if (elementMatchesDescription(element.value[1], description)) candidates.push(element.value[1])
        element = iterator.next()
    }
    if (candidates.length === 0) return null
    return candidates.reduce((a, b) => Math.abs(a.length - description.length) <= Math.abs(b.length - description.length) ? a : b) // return best candidate by distance
}

const listen = (target) => {
    window.addEventListener("message", ({ data: message }) => {
        if (!message.type || message.type !== "EXECUTE_COMMAND") return
        const command = message.command
        const mainIntent = command.intents ? command.intents[0] : null
        const result = { type: "COMMAND_RESULT" }

        console.log(command)

        if (!mainIntent) {
            result.text = "Unrecognized command"
            result.voice = apologies[Math.floor(Math.random() * apologies.length)]
        } else {
            switch (mainIntent.name) {
                case "scroll": {
                    const direction = getEntity(command, "direction:direction")
                    if (!direction) {
                        result.text = "Missing scroll direction"
                        result.voice = "Would you like to scroll up or down?"
                    } else {
                        if (["up", "down", "left", "right"].includes(direction.value)) { // relative
                            let x = 0; direction.value === "left" && --x; direction.value === "right" && ++x;
                            let y = 0; direction.value === "up" && --y; direction.value === "down" && ++y;
                            window.scrollBy({ top: 300 * y, left: 300 * x, behavior: "smooth" })
                        } else { // absolute
                            // TODO:
                        }
                        result.text = "Scrolling"
                    }
                } break
                case "zoom": {
                    const dimension = getEntity(command, "dimension:dimension")
                    if (!dimension) {
                        result.text = "Missing zoom direction"
                        result.voice = "Would you like to zoom in or out?"
                    } else {
                        if (dimension.value === "in") {
                            sendToBackground({ type: "ZOOM", factor: 1.2 })
                        } else if (dimension.value === "out") {
                            sendToBackground({ type: "ZOOM", factor: 0.8 })
                        }
                        result.text = "Zooming"
                    }
                } break
                case "navigate": {
                    const direction = getEntity(command, "direction:direction")
                    if (!direction) {
                        result.text = "Missing navigation direction"
                        result.voice = "Would you like to navigate to the previous or next page?"
                    } else {
                        if (direction.value === "previous") {
                            sendToBackground({ type: "NAVIGATE", direction: "back" })
                        } else if (direction.value === "next") {
                            sendToBackground({ type: "NAVIGATE", direction: "forward" })
                        }
                        result.text = "Navigating"
                    }
                } break
                case "click": {
                    const button_name = getEntity(command, "button_name:button_name")
                    if (!button_name) {
                        result.text = "Missing target element"
                        result.voice = "Where would you like to click?"
                    } else {
                        const element = getFirstMatchingElement("a,button,input", button_name.body.toLowerCase())
                        if (!element) {
                            result.text = "No matching element"
                            result.voice = "Sorry, I couldn't find a corresponding element"
                        } else {
                            element.click()
                            result.text = "Clicking"
                        }
                    }
                } break
                case "write": {
                    const field_name = getEntity(command, "field_name:field_name")
                    const input_text = getEntity(command, "input_text:input_text")
                    if (!field_name) {
                        result.text = "Missing target element"
                        result.voice = "Where would you like to write?"
                    } else if (!input_text) {
                        result.text = "Missing content"
                        result.voice = "What would you like to write?"
                    } else {
                        const element = getFirstMatchingElement("input,textarea", field_name.body.toLowerCase())
                        if (!element) {
                            result.text = "No matching element"
                            result.voice = "Sorry, I couldn't find a corresponding element"
                        } else {
                            element.value = input_text.body
                            result.text = "Writing"
                        }
                    }
                }
            }
            previousCommand = command // store valid command
        }
        target.postMessage(result, "*")
    })
}

const iframe = render()
listen(iframe.contentWindow)