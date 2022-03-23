document.addEventListener('click', function(event) {
    /** @type {HTMLElement} */
    let element = event.target
    let glyph = element.parentElement.parentElement
    let glyphID = glyph.getAttribute("id");

    if (glyphID == null || !glyphID.startsWith("glyph"))
        return;

    let id = glyphID.substring(5)

    let add = 1;
    if(element.classList.contains("active")) {
        element.classList.remove("active");
        add = -1;
    }
    else {
        element.classList.add("active");
    }

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
            vowels[id] += add * Math.pow(2,element.dataset.line)
            break;
        case "consonant":
            consonants[id] += add * Math.pow(2,element.dataset.line)
            break;
        case "reverse":
            reverse[id] = (add > 0)
            break;
        case "none":
            return;
    }

    let text = getConsonant(consonants[id]) + getVowel(vowels[id])
    if(reverse[id])
        text = getVowel(vowels[id]) + getConsonant(consonants[id])
    let s = glyphID+"-output";

    document.getElementById(s).innerHTML = text
    document.getElementById('human-out').innerText = getENG()
})

window.onload = function () {
    document.getElementById('btn-add-glyph').addEventListener('click', function(event) {
        glyph_number += 1;
        order.push(glyph_number);
        document.getElementById('container').innerHTML += new_glyph.replaceAll('#', glyph_number)
    });

    document.getElementById('btn-add-space').addEventListener('click', function(event) {
        document.getElementById('container').innerHTML += new_space;
        order.push("s");
    });

    document.getElementById('btn-reset').addEventListener('click', function (event) {
        consonants = {}
        vowels = {}
        reverse = {}
        glyph_number = 1;
        order = []

        document.getElementById('glyph-container').innerHTML = new_glyph.replaceAll('#','1')
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

let glyph_number = 1;

let order = [1];

const vowel_lookup = {
    0: "",
    1: "aɪ",
    2: "eɪ",
    3: "ʌ",
    14: "ɒ",
    15: "æ",
    16: "ɔɪ",
    28: "ʊ",
    31: "u:",
    32: "aʊ",
    44: "eəʳ",
    46: "ɪə",
    47: "ɔ:",
    48: "ɪ",
    51: "ɑ:",
    60: "ɛ",
    61: "ər",
    62: "i:",
    63: "oʊ"
}
const vowel_eng = {
    0: "",
    1: "i",
    2: "ey",
    3: "uh",
    14: "o",
    15: "a",
    16: "oy",
    28: "u",
    31: "oo",
    32: "ow",
    44: "air",
    46: "ear",
    47: "or",
    48: "i",
    51: "are",
    60: "e",
    61: "err",
    62: "e",
    63: "oh"
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
    63: "n"
}


const new_space = "<div class=\"space\"> </div>";

const new_glyph = "<div class=\"glyph\" id=\"glyph#\">\n" +
    "            <div class=\"bars\">\n" +
    "                <div class=\"vowel vowel-0\" data-type=\"vowel\" data-line=\"0\"></div>\n" +
    "                <div class=\"vowel vowel-1\" data-type=\"vowel\" data-line=\"1\"></div>\n" +
    "                <div class=\"vowel vowel-2\" data-type=\"vowel\" data-line=\"2\"></div>\n" +
    "                <div class=\"vowel vowel-3\" data-type=\"vowel\" data-line=\"3\"></div>\n" +
    "                <div class=\"vowel vowel-4\" data-type=\"vowel\" data-line=\"4\"></div>\n" +
    "                <div class=\"vowel vowel-5\" data-type=\"vowel\" data-line=\"5\"></div>\n" +
    "\n" +
    "                <div class=\"consonant consonant-0\" data-type=\"consonant\" data-line=\"0\"></div>\n" +
    "                <div class=\"consonant consonant-1\" data-type=\"consonant\" data-line=\"1\"></div>\n" +
    "                <div class=\"consonant consonant-2\" data-type=\"consonant\" data-line=\"2\"></div>\n" +
    "                <div class=\"consonant consonant-3\" data-type=\"consonant\" data-line=\"3\"></div>\n" +
    "                <div class=\"consonant consonant-4\" data-type=\"consonant\" data-line=\"4\"></div>\n" +
    "                <div class=\"consonant consonant-5\" data-type=\"consonant\" data-line=\"5\"></div>\n" +
    "                <div class=\"midline\" data-type=\"none\"></div>\n" +
    "                <div class=\"reverse\" data-type=\"reverse\"></div>\n" +
    "            </div>\n" +
    "            <div class=\"glyph-output\" id=\"glyph#-output\"></div>\n" +
    "        </div>"