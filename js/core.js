// noinspection JSBitwiseOperatorUsage

/**
 * @param {number=} consonant
 * @param {number=} vowel
 * @param {boolean=} flipped
 * @param {boolean=} space
 */
class Glyph {
    constructor(consonant = 0, vowel = 0, flipped = false, space = false){
        this.element = document.createElement("div");
        this.consonant = consonant
        this.vowel = vowel
        this.flipped = flipped
        this.space = space
        this.id = (order.length === 0) ? 0 : order[order.length-1].id + 1 ;

        this.points = [
            [5, 15],
            [5, 40],
            [5, 57],
            [25, 5],
            [25, 25],
            [25, 47],
            [25, 67],
            [45, 15],
            [45, 40],
            [45, 57],
            [25, 40],
        ]

        this.element.id = "glyph"+this.id;
        if(space) {
            this.element.classList.add("space")
            return;
        }
        this.element.classList.add("glyph")

        let bar_container = document.createElement("div");
        bar_container.classList.add("bars");
        this.element.appendChild(bar_container)
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
        this.output = document.createElement("div")
        this.output.classList.add("glyph-output")
        this.output.id = "glyph"+order.length+"-output"

        this.element.appendChild(this.output)
    }

    static newSpace() {
        return new Glyph(0,0,false, true)
    }

    getConsonant() {
        return consonant_lookup[this.consonant] ?? "?"
    }

    getVowel() {
        return vowel_lookup[this.vowel] ?? "?"
    }

    getVowelENG() {
        return vowel_eng[this.vowel] ?? ""
    }

    getConsonantENG() {
        return consonant_eng[this.consonant] ?? ""
    }

    getENG() {
        if(this.space)
            return " ";
        if(this.flipped)
            return this.getVowelENG() + this.getConsonantENG()
        return this.getConsonantENG() + this.getVowelENG()
    }

    static createFromRaw(rawNumber, flipped = false) {
        return new Glyph(rawNumber >> 5, rawNumber & ~(0b111111 << 5), flipped)
    }

    update() {
        for(const bar of this.element.firstElementChild.children) {
            if(bar.dataset.type === "vowel") {
                bar.classList.toggle("active", this.vowel & bar.dataset.line)
            }

            if(bar.dataset.type === "consonant") {
                bar.classList.toggle("active", this.consonant & bar.dataset.line)
            }

            if(bar.dataset.type === "reverse") {
                bar.classList.toggle("active", this.flipped)
            }

            if(bar.dataset.type === "midline") {
                bar.classList.toggle("active", (0b010 & this.consonant) > 0 || (0b010000 & this.consonant) > 0)
            }
        }

        let text = this.getConsonant() + this.getVowel()
        if(this.flipped)
            text = this.getVowel() + this.getConsonant()
        this.output.innerHTML = text
    }

    draw() {

        let canvas = document.createElement("canvas")
        let ctx = canvas.getContext("2d")
        if(this.space) {
            canvas.width = 25
            canvas.height = 80
            return canvas;
        }

        canvas.width = 50;
        canvas.height = 90;

        // ctx.rect(0, 0, canvas.width, canvas.height)
        // ctx.stroke()

        ctx.imageSmoothingEnabled = false;
        ctx.lineWidth = 4
        ctx.lineCap = "round"

        if(this.vowel & 0b00001) {
            this._stroke(ctx, 3,7)
        }
        if(this.vowel & 0b00010) {
            this._stroke(ctx, 0,3)
        }
        if(this.vowel & 0b00100) {
            this._stroke(ctx, 0,2)
        }
        if(this.vowel & 0b01000) {
            this._stroke(ctx, 2,6)
        }
        if(this.vowel & 0b10000) {
            this._stroke(ctx, 6,9)
        }

        if(this.consonant & 0b000001) {
            this._stroke(ctx, 4,7)
        }
        if(this.consonant & 0b000010) {
            this._stroke(ctx, 3,10)
        }
        if(this.consonant & 0b000100) {
            this._stroke(ctx, 4,0)
        }
        if(this.consonant & 0b001000) {
            this._stroke(ctx, 2,5)
        }
        if(this.consonant & 0b010000) {
            this._stroke(ctx, 4,6)
        }
        if(this.consonant & 0b100000) {
            this._stroke(ctx, 5,9)
        }

        ctx.lineCap = "square"
        this._stroke(ctx,1,8)

        ctx.clearRect(0,42, 60,4)


        if (this.flipped) {
            ctx.beginPath()
            ctx.strokeStyle = "black"
            ctx.lineWidth = 4
            ctx.arc(25,72, 4, 0, 2 * Math.PI, false)
            ctx.stroke();
        }

        return canvas;
    }

    _stroke(ctx, point1, point2) {
        ctx.beginPath();
        ctx.strokeStyle = "black"
        ctx.moveTo(this.points[point1][0], this.points[point1][1]);
        ctx.lineTo(this.points[point2][0], this.points[point2][1]);
        ctx.stroke();
        ctx.closePath()
    }

}

function updateAllGlyphs() {
    for(let glyph of order) {
        glyph.update()
    }
}

function getENG(){
    let text = "";
    for(let glyph of order) {
        text += glyph.getENG()
    }
    return text;
}

let order = [];

const vowel_lookup = {
    0: "",
    1: "aɪ",
    2: "eɪ",
    3: "ə",
    6: "ɒ",
    7: "æ",
    8: "ɔɪ",
    12: "ʊ",
    15: "u:",
    16: "aʊ",
    20: "eəʳ",
    22: "ɪəʳ",
    23: "ʊəʳ",
    24: "ɪ",
    27: "ɑ:",
    28: "ɛ",
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
    47: "ʒ",
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

// noinspection NonAsciiCharacters,JSNonASCIINames
const phoneme_to_glyph= {
        "aɪ": 0b00001,
        "ʌ":  0b00011,
        "ə":  0b00011,
        "æ":  0b00111,
        "u":  0b01111,
        "oʊ": 0b11111,
        "ɔɹ": 0b10111,
        "ɑɹ": 0b11011,
        "əɹ": 0b11101,
        "eɪ": 0b00010,
        "ɑ":  0b00110,
        "ɔ":  0b00110,
        "i":  0b11110,
        "iɹ": 0b10110,
        "ɪɹ": 0b10110,
        "ʊ":  0b01100,
        "ɛ":  0b11100,
        "ɛɹ": 0b10100,
        "ɔɪ": 0b01000,
        "oɪ": 0b01000,
        "ɔi": 0b01000,
        "oi": 0b01000,
        "ɪ":  0b11000,
        "aʊ": 0b10000,
        "ŋ":  0b111111 << 5,
        "θ":  0b010111 << 5,
        "j":  0b010110 << 5,
        "z":  0b110110 << 5,
        "v":  0b100110 << 5,
        "w":  0b000101 << 5,
        "ʃ":  0b111101 << 5,
        "ʒ":  0b101111 << 5,
        "t":  0b010101 << 5,
        "n":  0b101100 << 5,
        "t͡ʃ":0b010100 << 5,
        "d":  0b101010 << 5,
        "h":  0b110010 << 5,
        "b":  0b100010 << 5,
        "s":  0b011011 << 5,
        "ɹ":  0b010011 << 5,
        "k":  0b100011 << 5,
        "d͡ʒ":0b001010 << 5,
        "ð":  0b111010 << 5,
        "l":  0b010010 << 5,
        "f":  0b011001 << 5,
        "p":  0b010001 << 5,
        "ɡ":  0b110001 << 5,
        "m":  0b101000 << 5
}

function addSpace() {
    let glyph = Glyph.newSpace()
    order.push(glyph)
    document.getElementById("container").appendChild(glyph.element)

}
function addGlyph() {
    let glyph = new Glyph()
    order.push(glyph);
    document.getElementById("container").appendChild(glyph.element)
}