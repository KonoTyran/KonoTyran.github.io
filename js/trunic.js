window.onload = () => {
    document.getElementById("go").addEventListener('click', drawTrunic);
    drawTrunic()
}


function drawTrunic() {
    const canvas = document.getElementById("image-out")

    let s = 0;
    for(let g of order)
        s += g.space ? 1 : 0
    let ctx = canvas.getContext("2d")
    // Stroked triangle
    canvas.width  = 20 + order.length * 40 - s * 10;
    canvas.height = 90;
    ctx.clearRect( 0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    let pos = 5;
    for(let glyph of order) {
        ctx.drawImage(glyph.draw(), pos, 0)
        pos += glyph.space ? 25 : 40;
    }
}
