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

    document.getElementById(s).innerText = text
})

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

let vowels = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
    10: 0
}

let consonants = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
    10: 0
}

let reverse = {
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
    7: false,
    8: false,
    9: false,
    10: false
}

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
    61: "ə",
    62: "i:",
    63: "oʊ"


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
    54: "z",
    58: "ð",
    61: "ʃ",
    63: "ŋ"
}
