function render() {
    ctx.setTransform(1,0,0,1,0,0);
    ctx.globalAlpha = 1;
    if (!typeId && !destinationId && !nextId) {
        clearMatrix();
        drawMatrix(createEmptyMatrix());
        return;
    }

    const matrix = createEmptyMatrix();

    const type = getItem("type", typeId);
    const dest = getItem("destination", destinationId);
    const next = getItem("next", nextId);
    const info = getItem("information", informationId)
    let nextY = 0;
    // 種別
    if (type) drawType(type, matrix);

    // 行先 / 次駅
    const fullType = isTypeFullScreen(type);

    if (!fullType) {

        if(displayMode==="next"){

            if(informationMode==="destination"){

                drawDestinationSmall(dest,matrix);

            }else{
                if(info.view?.small) {

                drawInformationSmall(info,matrix);

                }else{
                    drawInformation(info, matrix);
                }

            }

            if(next){
                if(informationMode === "destination"){
                    drawNext(next,matrix,16)      
                }else{
                    if(info.view?.small) {
                        drawNext(next,matrix,16)
                    }
                }
            }

        }else{

            if(informationMode==="destination"){

                drawDestination(dest,matrix);

            }else{

                drawInformation(info,matrix);

            }
        }
    }
    drawMatrix(matrix);
}

function createEmptyMatrix() {
    return Array.from({ length: 32 }, () =>
        Array.from({ length: 128 }, () => ({
            r: 0,
            g: 0,
            b: 0
        }))
    );
}

function drawMatrix(matrix) {

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, led.width, led.height);

    for (let y = 0; y < 32; y++) {
        for (let x = 0; x < 128; x++) {

            const p = matrix[y][x];

            drawLED(x, y, {
                r: p?.r ?? 0,
                g: p?.g ?? 0,
                b: p?.b ?? 0
            });
        }
    }
}

function drawLED(x, y, color) {

    ctx.fillStyle = `rgb(${color.r},${color.g},${color.b})`;

    ctx.beginPath();
    ctx.arc(
        x * pitch + radius,
        y * pitch + radius,
        radius,
        0,
        Math.PI * 2
    );
    ctx.fill();
}

function drawImage(displayData, startX, startY, matrix) {
    const data = displayData.data;
    let index = 0;

    for (let y = 0; y < displayData.height; y++) {
        for (let x = 0; x < displayData.width; x++) {

            matrix[startY + y][startX + x] = {
                r: data[index],
                g: data[index + 1],
                b: data[index + 2]
            };

            index += 3;
        }
    }
}

function clearMatrix() {
    ctx.fillStyle = "rgb(0,0,0)";
    ctx.fillRect(0, 0, led.width, led.height);
}