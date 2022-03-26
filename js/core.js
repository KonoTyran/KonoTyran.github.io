document.addEventListener('click', function(event) {
    /** @type {HTMLElement} */
    let element = event.target
    if(element.parentElement == null || element.parentElement.parentElement == null)
        return
    let glyph = element.parentElement.parentElement
    let glyphID = glyph.getAttribute("id");

    if (glyphID == null || !glyphID.startsWith("glyph"))
        return;

    let id = glyphID.substring(5)

    if(consonants[id] == null) {
        consonants[id] = 0;
    }
    if(vowels[id] == null) {
        vowels[id] = 0;
    }
    if(reverse[id] == null) {
        reverse[id] = false;
    }

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

    let text = getConsonant(consonants[id]) + getVowel(vowels[id])
    if(reverse[id])
        text = getVowel(vowels[id]) + getConsonant(consonants[id])
    let s = glyphID+"-output";

    document.getElementById(s).innerHTML = text
    document.getElementById('human-out').innerText = getENG()
})

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

function updateGlyph(id) {
    let glyph = document.getElementById("glyph"+id)
    if(glyph == null)
        return;

    for(const bar of glyph.firstElementChild.children) {
        if(bar.dataset.type === "vowel") {
            bar.classList.toggle("active", vowels[id] & bar.dataset.line)
        }

        if(bar.dataset.type === "consonant") {
            bar.classList.toggle("active", consonants[id] & bar.dataset.line)
        }

        if(bar.dataset.type === "reverse") {
            bar.classList.toggle("active", reverse[id])
        }

        if(bar.dataset.type === "midline") {
            bar.classList.toggle("active", (0b010 & consonants[id]) > 0 || (0b010000 & consonants[id]) > 0)
        }
    }
}

function getENG() {
    let text = ''
    for( const id of order) {
        if(id === "s")
            text += " "
        else if(reverse[id])
            text += getVowelENG(vowels[id]) + getConsonantENG(consonants[id])
        else
            text += getConsonantENG(consonants[id]) + getVowelENG(vowels[id])

    }
    return text;
}


function getVowel(vowelID) {
    if(vowel_lookup[vowelID] == null)
        return "?"
    return vowel_lookup[vowelID]
}

function getConsonant(vowelID) {
    if(consonant_lookup[vowelID] == null)
        return "?"
    return consonant_lookup[vowelID]
}

function getVowelENG(vowelID) {
    if(vowel_eng[vowelID] == null)
        return ""
    return vowel_eng[vowelID]
}

function getConsonantENG(consonantID) {
    if(consonant_eng[consonantID] == null)
        return ""
    return consonant_eng[consonantID]
}

let vowels = {}
let consonants = {}
let reverse = {}
let glyph_number = 0;
let order = [];

const vowel_lookup = {
    0: "",
    1: "aɪ",
    2: "eɪ",
    3: "ʌ",
    6: "ɒ",
    7: "æ",
    8: "ɔɪ",
    12: "ʊ",
    15: "u:",
    16: "aʊ",
    20: "eəʳ",
    22: "ɜ:ʳ",
    23: "ɔ:",
    24: "ɪ",
    27: "ɑ:",
    28: "e",
    29: "ɜ:ʳ",
    30: "i:",
    31: "oʊ"

}
const vowel_eng = {
    0: "",
    1: "i",
    2: "ey",
    3: "uh",
    6: "o",
    7: "a",
    8: "oy",
    12: "e",
    15: "oo",
    16: "ow",
    20: "air",
    22: "ear",
    23: "or",
    24: "i",
    27: "are",
    28: "e",
    29: "err",
    30: "e",
    31: "oh"
}

const consonant_lookup = {
    0: "",
    5: "w",
    10: "dʒ",
    17: "p",
    18: "l",
    19: "r",
    20: "tʃ",
    21: "t",
    22: "j",
    23: "θ",
    25: "f",
    27: "s",
    34: "b",
    35: "k",
    38: "v",
    40: "m",
    42: "d",
    49: "g",
    44: "n",
    47: "g",
    50: "h",
    54: "z",
    58: "ð",
    61: "ʃ",
    63: "ŋ"
}
const consonant_eng = {
    0: "",
    5: "w",
    10: "j",
    17: "p",
    18: "l",
    19: "r",
    20: "ch",
    21: "t",
    22: "y",
    23: "th",
    25: "f",
    27: "s",
    34: "b",
    35: "k",
    38: "v",
    40: "m",
    42: "d",
    49: "g",
    44: "n",
    47: "g",
    50: "h",
    54: "z",
    58: "th",
    61: "sh",
    63: "ng"
}


const new_space = "<div class=\"space\"> </div>";
function addSpace(event) {
    let space = document.createElement("div");
    space.classList.add("space")
    glyph_number++
    order.push("s")
    document.getElementById("container").appendChild(space)

}
function addGlyph(event) {
    glyph_number++;
    order.push(glyph_number);
    let glyph = document.createElement("div");
    glyph.classList.add("glyph")
    glyph.id = "glyph"+glyph_number;
    let bar_container = document.createElement("div");
    bar_container.classList.add("bars");
    glyph.appendChild(bar_container)
    for(let i = 0; i < 6; ++i) {
        let n = i;
        if(i >= 3)
            --n;
        let bar = document.createElement("div")
        bar.classList.add("vowel", "vowel-"+i)
        bar.dataset.type = "vowel";
        bar.dataset.line = Math.pow(2,n);
        bar_container.appendChild(bar)
    }

    for(let i = 0; i < 6; ++i) {
        let bar = document.createElement("div")
        bar = document.createElement("div")
        bar.classList.add("consonant", "consonant-"+i)
        bar.dataset.type = "consonant";
        bar.dataset.line = Math.pow(2,i);
        bar_container.appendChild(bar)
    }
    let bar = document.createElement("div")
    bar.classList.add("midline")
    bar.dataset.type = "midline"
    bar_container.appendChild(bar)
    bar = document.createElement("div")
    bar.classList.add("reverse")
    bar.dataset.type = "reverse"
    bar_container.appendChild(bar)
    let out = document.createElement("div")
    out.classList.add("glyph-output")
    out.id = "glyph"+glyph_number+"-output"
    glyph.appendChild(out)
    document.getElementById("container").appendChild(glyph)
}