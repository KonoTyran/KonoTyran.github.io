window.onload = function () {
    for(let i = 0; i < 12; ++i) {
        addGlyph();
    }

    document.getElementById('btn-reset').addEventListener('click', function (event) {
        vowels = []
        consonants = []
        reverse = []
        glyph_number = -1;
        order = [];
        step = 0;
        sequence = "";
        position = getStartPosition()
        document.getElementById('container').innerText = "";
        for(let i = 0; i < 12; ++i) {
            addGlyph();
        }
        document.getElementById('human-out').innerText = "";
        document.getElementById('sequence-out').innerText = "";
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

    updateAllGlyphs()
    document.getElementById('human-out').innerText = getENG()
}

document.addEventListener('keydown', keyPress)

function keyPress(event) {
    let direction =""
    switch (event.code) {
        case "KeyW":
        case "ArrowUp":
            direction += "🡅"
            break;
        case "KeyS":
        case "ArrowDown":
            direction += "🡇"
            break;
        case "KeyA":
        case "ArrowLeft":
            direction += "🡄"
            break;
        case "KeyD":
        case "ArrowRight":
            direction += "🡆"
            break;
        default:
            return;
    }
    event.preventDefault()
    for(let i = 1; i <= 12;++i) {
        switch (direction) {
            case "🡅":
                position[i-1][0] += i
                position[i-1][1] += i + 1
                break;
            case "🡇":
                position[i-1][0] += i + 1
                position[i-1][1] += step
                break;
            case "🡄":
                position[i-1][0] += step + i - 1
                position[i-1][1] += step + i - 1
                break;
            case "🡆":
                position[i-1][0] += step
                position[i-1][1] += i
                break;

        }
        vowels[i-1] = vowel_rotation[(position[i-1][0]) % (vowel_rotation.length)]
        consonants[i-1] = cons_rotation[(position[i-1][1]) % (cons_rotation.length)]
    }
    step++;
    updateAllGlyphs()
    document.getElementById("human-out").innerHTML = getENG()

    document.getElementById("sequence-out").innerText = (sequence += direction)
}
function getStartPosition() {
    return [[0,0],[5,12],[6,24],[16,23],[14,23],[8,4],[12,4],[13,9],[0,5],[15,0],[3,19],[6,4]];
}
const cons_rotation = [25, 20, 10, 49, 35, 42, 21, 34, 24, 63, 44, 40, 0, 18, 5, 22, 19, 50, 47, 61, 54, 27, 58, 15, 38]
const vowel_rotation = [6, 7, 0, 20, 31, 16, 8, 1, 2, 22, 27, 23, 29, 15, 30, 3, 12, 28, 24]

let step = 0;
let position = getStartPosition()
let sequence = ''


