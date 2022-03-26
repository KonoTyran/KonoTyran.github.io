window.onload = function () {
    addGlyph();
    document.getElementById('btn-add-glyph').addEventListener('click', addGlyph);

    document.getElementById('btn-add-space').addEventListener('click', addSpace);

    document.getElementById('btn-reset').addEventListener('click', function (event) {
        consonants = {}
        vowels = {}
        reverse = {}
        glyph_number = 0;
        order = []

        document.getElementById('container').innerHTML = "";
        addGlyph()
        document.getElementById('human-out').innerHTML = "";
    })

    document.getElementById('btn-speak').addEventListener('click', function (event) {
        let speech = new SpeechSynthesisUtterance();

        let outString = getENG();

        speech.lang = "en-US";

        speech.text = outString
        speech.volume = 1;
        speech.rate = 1;
        speech.pitch = 1;

        window.speechSynthesis.speak(speech);
    })
}

document.addEventListener('click', glyphClick);

function glyphClick(event) {
    /** @type {HTMLElement} */
    let element = event.target
    if(element.parentElement == null || element.parentElement.parentElement == null)
        return
    let glyph = element.parentElement.parentElement
    let glyphID = glyph.getAttribute("id");

    if (glyphID == null || !glyphID.startsWith("glyph"))
        return;

    let id = glyphID.substring(5)

    switch (element.dataset.type) {
        case "vowel":
            vowels[id] ^= element.dataset.line
            break;
        case "consonant":
            consonants[id] ^= element.dataset.line
            break;
        case "reverse":
            reverse[id] = !reverse[id]
            break;
        case "midline":
        case "none":
            return;
    }

    updateGlyph(id);

    document.getElementById('human-out').innerText = getENG()
}