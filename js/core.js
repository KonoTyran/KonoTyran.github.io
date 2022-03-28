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
        this.id = (order[order.length-1] == null) ? 0 : order[order.length-1].id + 1 ;

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
            this._stroke(ctx, 3,5)
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