window.onload = () => {
    document.getElementById("go").addEventListener('click', (e) => {
        convertTextToTrunic()
        drawTrunic()
    });

    document.getElementById('btn-save-image').addEventListener('click', saveImage)

    document.getElementById('btn-copy-image').addEventListener('click', copyImage)

    loadJSON("/resources/dictionary.json",saveJSONDict)
    document.getElementById('text-input').addEventListener('keydown', (e) => {
        if(e.code === "Enter" || e.code === "NumpadEnter") {
            convertTextToTrunic()
            drawTrunic()
        }
    })
}

function copyImage() {
    document.getElementById('image-out').toBlob(blob => navigator.clipboard.write([new ClipboardItem({'image/png':blob})]))
}

function saveImage() {
    const link = document.createElement('a')
    const canvas = document.getElementById('image-out')
    link.download = lastPhrase
    link.href = canvas.toDataURL();
    link.click()
    link.remove()
}

function saveJSONDict(json){
    dict = JSON.parse(json);
    let button = document.getElementById("go")
    button.removeAttribute("disabled")
    button.innerText = "Trunicafy"
}

function loadJSON(file, callback) {

    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', file, true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}

function convertTextToTrunic() {
    order = [];
    let vow = ["ɔ", "æ", "ɑ", "ə", "ɪ", "ɛ", "ʊ", "ʌ", "i", "u", "əɹ", "ɔɹ", "ɑɹ", "iɹ", "eɪ", "aɪ", "ɔɪ", "aʊ", "oʊ", "ɛɹ",
        "oɪ", "ɔi", "oi", "ɪɹ"]
    let con = ["m", "n", "ŋ", "p", "b", "t", "d", "k", "ɡ", "d͡ʒ", "t͡ʃ", "f", "v", "θ", "ð", "s", "z", "ʃ", "ʒ", "h", "ɹ", "j",
        "w", "l"]
    let phonemes = ["d͡ʒ", "t͡ʃ", "aɪ", "oɪ", "ɔi", "oi", "oʊ", "ɔɹ", "ɑɹ", "əɹ", "ɪɹ", "eɪ", "iɹ", "ʊ", "ɛɹ", "ɔɪ", "aʊ", "ʌ",
        "ɑ", "ɛ", "ɔ", "i", "ʃ", "ɪ", "s", "ŋ", "j", "ʒ", "u", "k", "h", "θ", "ð", "w", "v", "ɹ", "f", "ɡ", "t",
        "b", "z", "p", "m", "l", "æ", "ə", "d", "n"]

    let words = document.getElementById('text-input').value.toLowerCase().split(" ")
    lastPhrase = "glyphs_" + words.join("-")
    let errors = document.getElementById("errors")
    errors.innerHTML = "";

    for (let word of words) {
        if(dict[word]) {
            if(order.length > 0) {
                order.push(Glyph.newSpace())
            }
            word = dict[word]
            let letters = []
            while (word.length > 0) {
                for (let p of phonemes) {
                    if (word.startsWith(p)) {
                        if (p !== "ɔ")
                            letters.push(p)
                        else
                            letters.push("ɑ")
                        word = word.substring(p.length)
                        break
                    }
                }
            }

            //let's pair up our phonemes
            while (letters.length > 0) {
                //there are at least 2 phonemes left lets check to see if they can be added together.
                if(letters.length > 1) {
                    //the next two are a consonant vowel pair
                    if(con.includes(letters[0]) && vow.includes(letters[1])) {
                        order.push(Glyph.createFromRaw(phoneme_to_glyph[letters.shift()] + phoneme_to_glyph[letters.shift()]))
                        letters.slice(2,letters.length)
                    }
                    //the next two are a vowel consonant pair
                    else if(vow.includes(letters[0]) && con.includes(letters[1])){
                        order.push(Glyph.createFromRaw(phoneme_to_glyph[letters.shift()] + phoneme_to_glyph[letters.shift()], true))
                        letters.slice(2,letters.length)
                    }
                    //its a lone vowel/consonant just add it
                    else {
                        order.push(Glyph.createFromRaw(phoneme_to_glyph[letters.shift()]))
                    }
                }
                //only one left just add it to our list
                else {
                    order.push(Glyph.createFromRaw(phoneme_to_glyph[letters.shift()]))
                }
            }
        }
        else {
            let error = document.createElement("div")
            error.innerText = "Unknown Word: " + word;
            error.classList.add("error")
            errors.append(error)
            errors.classList.toggle('hidden', false)
        }
    }
}

function drawTrunic() {

    const canvas = document.getElementById("image-out")
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
    document.getElementById("image-out").classList.toggle("hidden", false)
    document.getElementById("image-controls").classList.toggle("hidden", false)
}

let lastPhrase = ""
let dict = {}