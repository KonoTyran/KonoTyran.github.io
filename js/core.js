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
            [25, 40]
        ]

        this.cubicPoints = [
            [5, 15],
            [5, 35],
            [25, 5],
            [25, 25],
            [25, 45],
            [45, 15],
            [45, 35],
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

    getVowelTuneic() {
        return vowel_to_tuneic[this.vowel] ?? -1
    }

    getConsonantTuneic() {
        return consonant_to_tuneic[this.consonant] ?? -1
    }

    getENG() {
        if(this.space)
            return " ";
        if(this.flipped)
            return this.getVowelENG() + this.getConsonantENG()
        return this.getConsonantENG() + this.getVowelENG()
    }

    getPhonemes() {
        if(this.space)
            return " ";
        if(this.flipped)
            return this.getVowel() + this.getConsonant()
        return this.getConsonant() + this.getVowel()
    }

    getTuneic() {
        let scale = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24];

        let v = this.getVowelTuneic();
        let c = this.getConsonantTuneic();
        let tuneic = c + (v << 6);
        if (this.space || tuneic < 2 || v == -1 || c == -1) {
            return [-1]; // a rest
        }

        let run = scale.filter((_, i) => tuneic & (1 << i));
        if (this.flipped) {
            run.reverse();
        }

        return run;
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

    draw(cubic = false) {

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

        if(!cubic) {
            if (this.vowel & 0b00001)
                this._stroke(ctx, 3, 7, cubic)

            if (this.vowel & 0b00010)
                this._stroke(ctx, 0, 3, cubic)

            if (this.vowel & 0b00100)
                this._stroke(ctx, 0, 2, cubic)

            if (this.vowel & 0b01000)
                this._stroke(ctx, 2, 6, cubic)

            if (this.vowel & 0b10000)
                this._stroke(ctx, 6, 9, cubic)

            if (this.consonant & 0b000001)
                this._stroke(ctx, 4, 7, cubic)

            if (this.consonant & 0b000010)
                this._stroke(ctx, 3, 10, cubic)

            if (this.consonant & 0b000100)
                this._stroke(ctx, 4, 0, cubic)

            if (this.consonant & 0b001000)
                this._stroke(ctx, 2, 5, cubic)

            if (this.consonant & 0b010000)
                this._stroke(ctx, 4, 6, cubic)

            if (this.consonant & 0b100000)
                this._stroke(ctx, 5, 9, cubic)


            ctx.lineCap = "square"
            this._stroke(ctx, 1, 8)

            ctx.clearRect(0,42, 60,4)
        }
        else {
            if (this.vowel & 0b00001)
                this._stroke(ctx, 2, 5, cubic)

            if (this.vowel & 0b00010)
                this._stroke(ctx, 0, 2, cubic)

            if (this.vowel & 0b00100)
                this._stroke(ctx, 0, 1, cubic)

            if (this.vowel & 0b01000)
                this._stroke(ctx, 1, 4, cubic)

            if (this.vowel & 0b10000)
                this._stroke(ctx, 4, 6, cubic)

            if (this.consonant & 0b000001)
                this._stroke(ctx, 3, 5, cubic)

            if (this.consonant & 0b000010)
                this._stroke(ctx, 3, 2, cubic)

            if (this.consonant & 0b000100)
                this._stroke(ctx, 3, 0, cubic)

            if (this.consonant & 0b001000)
                this._stroke(ctx, 3, 1, cubic)

            if (this.consonant & 0b010000)
                this._stroke(ctx, 3, 4, cubic)

            if (this.consonant & 0b100000)
                this._stroke(ctx, 3, 6, cubic)
        }

        if (this.flipped) {
            ctx.beginPath()
            ctx.strokeStyle = "black"
            ctx.lineWidth = 4
            ctx.arc(25,(cubic) ? 49 :72, 4, 0, 2 * Math.PI, false)
            ctx.stroke();
        }

        return canvas;
    }

    _stroke(ctx, point1, point2, cubic) {
        ctx.beginPath();
        ctx.strokeStyle = "black"
        if(!cubic) {
            ctx.moveTo(this.points[point1][0], this.points[point1][1]);
            ctx.lineTo(this.points[point2][0], this.points[point2][1]);
        } else {
            ctx.moveTo(this.cubicPoints[point1][0], this.cubicPoints[point1][1]);
            ctx.lineTo(this.cubicPoints[point2][0], this.cubicPoints[point2][1]);
        }
        ctx.stroke();
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

function getTuneic() {
    let notes = [];
    for(let glyph of order) {
        let run = glyph.getTuneic();

        if (notes.length && notes[notes.length - 1] == run[0]) {
            run.shift(); // remove duplicate notes
        }

        notes = notes.concat(run);
    }
    return notes;
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
const vowel_to_tuneic = {
    0: 0b00000,
    1: 0b00110,  // aɪ
    2: 0b10101,  // eɪ
    3: 0b01001,  // ə
    6: 0b10110,  // ɒ
    7: 0b11000,  // æ
    8: 0b10001,  // ɔɪ
    12: 0b00011, // ʊ
    15: 0b11001, // u:
    16: 0b00101, // aʊ
    20: 0b11100, // eəʳ
    22: 0b10100, // ɪəʳ
    23: 0b00111, // ʊəʳ
    24: 0b10010, // ɪ
    27: 0b01010, // ɑ:
    28: 0b01100, // ɛ
    29: 0b01110, // ɜ:ʳ
    30: 0b01011, // i:
    31: 0b01101, // oʊ
}

const consonant_lookup = {
    0: "",
    5: "w",
    10: "dʒ",
    17: "p",
    18: "l",
    19: "ɹ",
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
    44: "n",
    47: "ʒ",
    49: "g",
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
const consonant_to_tuneic = {
    0: 0b000001,
    5: 0b101001,  // w
    10: 0b001111, // dʒ
    17: 0b110001, // p
    18: 0b011001, // l
    19: 0b100101, // ɹ
    20: 0b100111, // tʃ
    21: 0b010101, // t
    22: 0b010111, // j
    23: 0b000101, // θ
    25: 0b010001, // f
    27: 0b000011, // s
    34: 0b100001, // b
    35: 0b001101, // k
    38: 0b110011, // v
    40: 0b001001, // m
    42: 0b001011, // d
    44: 0b010011, // n
    47: 0b111001, // ʒ - no source found yet, guess CGAC over CEAC
    49: 0b101101, // g
    50: 0b011011, // h
    54: 0b011101, // z
    58: 0b101011, // ð
    61: 0b100011, // ʃ
    63: 0b000111,  // ŋ
}

// noinspection NonAsciiCharacters,JSNonASCIINames
const phoneme_to_glyph= {
        "aɪ":   0b00001,
        "ʌ":    0b00011,
        "ə":    0b00011,
        "æ":    0b00111,
        "u":    0b01111,
        "u:":   0b01111,
        "oʊ":   0b11111,
        "ɔɹ":   0b10111,
        "ɑɹ":   0b11011,
        "ɑ:":   0b11011,
        "əɹ":   0b11101,
        "ɜ:ʳ":  0b11101,
        "eɪ":   0b00010,
        "ɑ":    0b00110,
        "ɔ":    0b00110,
        "i":    0b11110,
        "i:":   0b11110,
        "iɹ":   0b10110,
        "ɪɹ":   0b10110,
        "ʊ":    0b01100,
        "ɛ":    0b11100,
        "ɛɹ":   0b10100,
        "ɔɪ":   0b01000,
        "oɪ":   0b01000,
        "ɔi":   0b01000,
        "oi":   0b01000,
        "ɪ":    0b11000,
        "aʊ":   0b10000,
        "ŋ":    0b111111 << 5,
        "θ":    0b010111 << 5,
        "j":    0b010110 << 5,
        "z":    0b110110 << 5,
        "v":    0b100110 << 5,
        "w":    0b000101 << 5,
        "ʃ":    0b111101 << 5,
        "ʒ":    0b101111 << 5,
        "t":    0b010101 << 5,
        "n":    0b101100 << 5,
        "t͡ʃ":  0b010100 << 5,
        "tʃ":   0b010100 << 5,
        "d":    0b101010 << 5,
        "h":    0b110010 << 5,
        "b":    0b100010 << 5,
        "s":    0b011011 << 5,
        "ɹ":    0b010011 << 5,
        "k":    0b100011 << 5,
        "d͡ʒ":  0b001010 << 5,
        "dʒ":   0b001010 << 5,
        "ð":    0b111010 << 5,
        "l":    0b010010 << 5,
        "f":    0b011001 << 5,
        "p":    0b010001 << 5,
        "ɡ":    0b110001 << 5,
        "g":    0b110001 << 5,
        "m":    0b101000 << 5
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

function generateImage() {
    document.getElementById("image-controls").classList.toggle('hidden', false)
    const canvas = document.getElementById("image-out")
    canvas.classList.toggle("hidden", false)

    let s = 0;
    for(let g of order)
        s += g.space ? 1 : 0
    let ctx = canvas.getContext("2d")
    // Stroked triangle
    canvas.width  = 20 + order.length * 40 - s * 15;
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

function speakOutput() {
    let speech = new SpeechSynthesisUtterance();

    let outString = getENG();

    speech.lang = "en-US";

    speech.text = outString
    speech.volume = 1;
    speech.rate = 1;
    speech.pitch = 1;

    window.speechSynthesis.speak(speech);
}

function generateAudio() {
    let notes = getTuneic();
    let duration = 3 / 32;
    let echoBeats = 20;

    let offlineCtx = new window.OfflineAudioContext({
        numberOfChannels: 1,
        length: 48000 * duration * (notes.length + echoBeats),
        sampleRate: 48000,
    });
    let noteOutput = offlineCtx.createGain();
    noteOutput.connect(offlineCtx.destination);

    // play notes
    let baseOffset = 0;
    for (let i = 0; i < notes.length; ++i) {
        if (notes[i] == -1) {
            // increase pitch per word, wrap around after an octave
            baseOffset = (baseOffset + 1) % 13;
            continue; // play a rest
        }

        let t = i * duration;
        let baseFreq = 523.25; // C5 note
        let freq = baseFreq * Math.pow(2, (notes[i] + baseOffset) / 12);
        let volume = (notes[i] / 24) * 0.4 + 0.4;
        fairyBeep(offlineCtx, noteOutput, t, duration, freq, volume);
    }

    // add echo
    let wetGain = offlineCtx.createGain();
    let echoDelay = offlineCtx.createDelay(duration * 2);
    let echoGain = offlineCtx.createGain();
    wetGain.gain.setValueAtTime(0.25, 0);
    echoDelay.delayTime.setValueAtTime(duration * 2, 0);
    echoGain.gain.setValueAtTime(-0.5, 0);
    noteOutput.connect(wetGain);
    wetGain.connect(echoDelay);
    echoDelay.connect(echoGain);
    echoGain.connect(echoDelay); // feedback
    echoGain.connect(offlineCtx.destination);

    const audioOut = document.getElementById('audio-out');
    offlineCtx.startRendering().then(renderedBuffer => {
        let wav = audioBufferToWav(renderedBuffer);
        let blob = new Blob([wav], {type: "audio/wav"});
        audioOut.src = URL.createObjectURL(blob);
    });

    document.getElementById("audio-out").classList.toggle("hidden", false);
    document.getElementById("audio-controls").classList.toggle("hidden", false);
}

function fairyBeep(ctx, output, startTime, duration = 0.5, frequency = 440, volume = 0.2) {
    if (!startTime) startTime = ctx.currentTime;
    let stopTime = startTime + duration;
    let attackCurve = [0, 0.25, 0.5, 0.75, 1]
        .map(x => 0.75 * x * (x - 1) + x)
        .map(x => x * volume);

    let oscillator = ctx.createOscillator();
    let envelope = ctx.createGain();
    oscillator.frequency.value = frequency;
    envelope.gain.setValueCurveAtTime(attackCurve, startTime, duration * 0.9);
    envelope.gain.setTargetAtTime(0, startTime + duration * 0.9, duration * 0.03);
    oscillator.connect(envelope);
    envelope.connect(output);

    oscillator.start(startTime);
}

// adapted from https://github.com/Jam3/audiobuffer-to-wav/blob/master/index.js
function audioBufferToWav(buffer) {
    // helper function
    function writeString(view, offset, string) {
        for (var i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i))
        }
    }

    let numChannels = 1;
    let sampleRate = buffer.sampleRate;
    let format = 3; // IEEE float format
    let bitDepth = 32;
    let bufferData = buffer.getChannelData(0);

    let bytesPerSample = bitDepth / 8;
    let blockAlign = numChannels * bytesPerSample;

    let wavBuffer = new ArrayBuffer(44 + bufferData.length * bytesPerSample);
    let wavHeader = new DataView(wavBuffer, 0, 44);
    let wavData = new DataView(wavBuffer, 44, bufferData.length * bytesPerSample);

    writeString(wavHeader, 0, 'RIFF'); // RIFF identifier
    wavHeader.setUint32(4, 36 + bufferData.length * bytesPerSample, true); // RIFF chunk length
    writeString(wavHeader, 8, 'WAVE'); // RIFF type

    writeString(wavHeader, 12, 'fmt '); // format chunk identifier
    wavHeader.setUint32(16, 16, true); // format chunk length
    wavHeader.setUint16(20, format, true); // sample format
    wavHeader.setUint16(22, numChannels, true); // channel count
    wavHeader.setUint32(24, sampleRate, true); // sample rate
    wavHeader.setUint32(28, sampleRate * blockAlign, true); // byte rate
    wavHeader.setUint16(32, blockAlign, true); // block align
    wavHeader.setUint16(34, bitDepth, true); // bits per sample

    writeString(wavHeader, 36, 'data'); // data chunk identifier
    wavHeader.setUint32(40, bufferData.length * bytesPerSample, true); // data chunk length
    for (var i = 0; i < bufferData.length; i++) {
        wavData.setFloat32(i * 4, bufferData[i], true);
    }

    return wavBuffer;
}
