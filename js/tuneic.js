class Note {
    static musicScale = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
    static musicScaleR = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"].reverse()

    constructor(note = -1){
        this.element = document.createElement("div");
        this.id = (uiGrid.length === 0) ? 0 : uiGrid[uiGrid.length-1].id + 1 ;
        this.note = isNaN(note) ? -1 : note;

        this.element.id = "note"+this.id;
        this.element.classList.add("scale")

        for(let i = 0; i < 37; ++i) {
            let noteElement = document.createElement("div")
            noteElement.classList.add("note")
            if(note === 36-i)
                noteElement.classList.add("active")
            noteElement.dataset.note = Note.musicScaleR[(i + Note.musicScaleR.length-1) % 12]
            noteElement.dataset.noteID = 36-i
            noteElement.addEventListener('mousedown', this.selectNote)
            noteElement.addEventListener('contextmenu', (e) => {e.preventDefault()})
            this.element.appendChild(noteElement)
        }
    }

    selectNote(event) {
        let id = event.target.parentElement.id.substring(4)
        let note = uiGrid[id];

        if(event.which === 3) {
            if (event.target.classList.contains('active')) {
                note.note = -1;
                event.target.classList.remove('active');
            }
        } else if (event.which === 1) {
            for (let child of note.element.children) {
                child.classList.toggle('active', false)
            }
            event.target.classList.add('active');
            uiGrid[note.element.id.substring(4)].note = parseInt(event.target.dataset.noteID)
        } else if (event.which === 2) {
            playNote(event.target.dataset.noteID)
        }


        event.preventDefault()
        parseSequence()
    }
}

window.onload = function () {
    let piano = document.getElementById('piano')
    for(let i = 0; i < 37; ++i) {
        let key = document.createElement("div")
        key.classList.add("key")
        key.innerText = Note.musicScaleR[(i + Note.musicScaleR.length-1) % 12]
        if (key.innerText.endsWith("#"))
            key.classList.add("sharp")
        key.dataset.noteID = 36-i
        key.addEventListener('mousedown', (ev => {
            ev.preventDefault()
            playNote(ev.target.dataset.noteID)
        }))
        key.addEventListener('contextmenu', (e) => {e.preventDefault()})
        piano.appendChild(key)
    }

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString)
    if(urlParams.has("s")) {
        let s = atob(urlParams.get("s"));
        for (let noteID of s.split(";")) {
            addNote(parseInt(noteID));
        }
        parseSequence()
    } else {
        for (let i = 0; i <= 7; i++) {
            add5Notes()
        }
    }
    document.getElementById('btn-add-note').addEventListener('click', add5Notes);

    document.getElementById('btn-make-url').addEventListener('click', makeURL);
}

function playNote(note) {
    let freq = 130.81 * Math.pow(2,note/12)
    beep(500,freq, document.getElementById('volume').value)
}


//C C# D D# E F F# G G# A A# B
let uiGrid = []
function add5Notes() {
    for (let i = 0; i <5; i++) {
        addNote()
    }
}

function addNote(noteID) {
    let note = new Note(noteID)
    uiGrid.push(note);
    document.getElementById("note-container").appendChild(note.element)
}

function makeURL() {
    let url = new URL(window.location.origin + window.location.pathname)
    url.searchParams.set('s', btoa(uiGrid.map((note => {
        return (note.note === -1) ? "" : note.note;
    })).join(";")))
    window.location.href = url;
}

let sequence = []
function parseSequence() {
    sequence = []
    let run = []
    for(let note of uiGrid) {
        if(note.note === -1) {
            if (run.length) {
                sequence.push(run)
                run = []
            }
            continue;
        }
        run.push(note.note)
    }
    if(run.length > 0)
        sequence.push(run)

    convertSequence()
}

//add one to these notes to shift sharps upwards.
const sharp = [0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0]
function convertSequence() {
    order = []
    for (let run of sequence) {
        if(run.length === 0)
            continue

        let flip = false;
        if (isDescending(run)) {
            flip = true;
            run.reverse()
        }

        if (isAscending(run)) {
            run.forEach((value, index) => {
                let i = run.length - index - 1
                run[i] -= run[0]
                run[i] += sharp[Math.abs(run[i] % 12)]
            })
            mapTrunic(run, flip)
        }
    }

    generateImage()
    outputGlyph()
}

const cons_to_trunic = {
    0b101001:  5,// w
    0b001111: 10,// dʒ
    0b110001: 17,// p
    0b011001: 18,// l
    0b100101: 19,// ɹ
    0b100111: 20,// tʃ
    0b010101: 21,// t
    0b010111: 22,// j
    0b000101: 23,// θ
    0b010001: 25,// f
    0b000011: 27,// s
    0b100001: 34,// b
    0b001101: 35,// k
    0b110011: 38,// v
    0b001001: 40,// m
    0b001011: 42,// d
    0b010011: 44,// n
    //0b11??01: 47,// ʒ - no source found yet
    0b101101: 49,// g
    0b011011: 50,// h
    0b011101: 54,// z
    0b101011: 58,// ð
    0b100011: 61,// ʃ
    0b000111: 63 // ŋ
}
const vowel_to_trunic = {
    0b00110: 1,  // aɪ
    0b10101: 2,  // eɪ
    0b01001: 3,  // ə
    0b10110: 6,  // ɒ
    0b11000: 7,  // æ
    0b10001: 8,  // ɔɪ
    0b00011: 12, // ʊ
    0b11001: 15, // u:
    0b00101: 16, // aʊ
    0b11100: 20, // eəʳ
    0b10100: 22, // ɪəʳ
    0b00111: 23, // ʊəʳ
    0b10010: 24, // ɪ
    0b01010: 27, // ɑ:
    0b01100: 28, // ɛ
    0b01110: 29, // ɜ:ʳ
    0b01011: 30, // i:
    0b01101: 31, // oʊ
}
function mapTrunic(run, flip) {
    let convert = [0,2,4,7,9,12,14,16,19,21,24]
    let tuneic = 0
    for (let number of run) {
        if(convert.indexOf(number) >= 0) {
            tuneic += Math.pow(2,convert.indexOf(number))
        }
    }
    let cons =   cons_to_trunic[tuneic & 0b111111] << 5 ?? 0
    let vowel = vowel_to_trunic[tuneic >> 6] ?? 0
    order.push(Glyph.createFromRaw(cons + vowel, flip))

}

function outputGlyph() {
    let engOut = document.getElementById('eng-out')
    let phoOut = document.getElementById('phonetic-out')
    engOut.innerText = '';
    phoOut.innerText = '';
    let text = ""
    let pho = ""
    for (let glyph of order) {
        text += glyph.getENG() + " "
        pho += glyph.getPhonemes() + " "
    }
    engOut.innerText = text;
    phoOut.innerText = pho;
}

function isAscending(array) {
    return array.every(function (value,index) {
        return index === 0 || value > array[index-1];
    })
}
function isDescending(array) {
    return array.every(function (value,index) {
        return index === 0 || value < array[index-1];
    })
}

//if you have another AudioContext class use that one, as some browsers have a limit
let audioCtx = new (window.AudioContext || window.webkitAudioContext || window.audioContext);

//All arguments are optional:

//duration of the tone in milliseconds. Default is 500
//frequency of the tone in hertz. default is 440
//volume of the tone. Default is 1, off is 0.
//type of tone. Possible values are sine, square, sawtooth, triangle, and custom. Default is sine.
//callback to use on end of tone
function beep(duration, frequency, volume, type, callback) {
    let oscillator = audioCtx.createOscillator();
    let gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    if (volume){gainNode.gain.value = volume;}
    if (frequency){oscillator.frequency.value = frequency;}
    if (type){oscillator.type = type;}
    if (callback){oscillator.onended = callback;}
    let stopTime = audioCtx.currentTime + ((duration || 500) / 1000)
    oscillator.start(audioCtx.currentTime);
    oscillator.stop(stopTime);
    gainNode.gain.setTargetAtTime(0, stopTime - 0.25, .25);

};