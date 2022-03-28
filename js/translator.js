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
        document.getElementById('image-out').classList.toggle("hidden", true)
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

    document.getElementById('btn-generate-image').addEventListener('click', generateImage)

    document.getElementById('btn-save-image').addEventListener('click', saveImage)

    document.getElementById('btn-copy-image').addEventListener('click', copyImage)
}

document.addEventListener('click', glyphClick);

function glyphClick(event) {
    /** @type {HTMLElement} */
    let element = event.target
    let glyph = element.closest("div[id^=\"glyph\"]");
    if (glyph == null )
        return;

    let id = glyph.getAttribute("id").substring(5);

    if(event.altKey) {
        glyph.remove()
        order = order.filter(glyph => glyph.id != id)
        return;
    }

    glyph = order.filter(g => g.id == id).shift();

    if(glyph.space)
        return;

    switch (element.dataset.type) {
        case "vowel":
            glyph.vowel ^= element.dataset.line
            break;
        case "consonant":
            glyph.consonant ^= element.dataset.line
            break;
        case "reverse":
            glyph.flipped = !glyph.flipped
            break;
        case "midline":
        case "none":
            return;
    }

    glyph.update()

    document.getElementById('human-out').innerText = getENG()
}

function saveImage() {
    const link = document.createElement('a')
    const canvas = document.getElementById('image-out')
    link.download = 'glyphs.png'
    link.href = canvas.toDataURL();
    link.click()
    link.remove()
}

function copyImage() {
    document.getElementById('image-out').toBlob(blob => navigator.clipboard.write([new ClipboardItem({'image/png':blob})]))
}

function generateImage() {
    document.getElementById("image-controls").classList.toggle('hidden', false)
    const canvas = document.getElementById("image-out")
    canvas.classList.toggle("hidden", false)

    let s = 0;
    for(let g of order)
        s += g.space ? 1 : 0
    let ctx = canvas.getContext("2d")
    // Stroked triangle
    canvas.width  = 20 + order.length * 40 - s * 10;
    canvas.height = 80;
    ctx.clearRect( 0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    let pos = 5;
    for(let glyph of order) {
        ctx.drawImage(glyph.draw(), pos, 0)
        pos += glyph.space ? 25 : 40;
    }
}
