function render() {
    ctx.setTransform(1,0,0,1,0,0);
    ctx.globalAlpha = 1;
    if (!typeId && !destinationId && !nextId && !carNumberId) {
        clearMatrix();
        drawMatrix(createEmptyMatrix());
        return;
    }

    const matrix = createEmptyMatrix();

    const type = getItem("type", typeId);
    const dest = getItem("destination", destinationId);
    const next = getItem("next", nextId);
    const info = getItem("information", informationId);
    const info2 = getItem("information2", information2Id);
    const carNumber = getItem("carNumber", carNumberId);
    const fullCarNumber = isCarNumberFullScreen(carNumber);
    let nextY = 0;
    // 種別
    if (config.hasCarNumberSmall) {
        drawCarNumber(carNumber, matrix);
    }
    if (type) drawType(type, matrix);

    // 行先 / 次駅
    const fullType = isTypeFullScreen(type);
    const fullDestination = isDestinationFullScreen(dest);
    if (!fullType) {
        if(showNext){
            if(informationMode === "destination"){
                if (destinationId != null) {
                    drawDestinationSmall(dest,matrix);
                }
            }
            if(informationMode === "information") {
                if(info.view?.small) {
                    if (informationId != null) {
                        drawInformationSmall(info,matrix);
                    }
                }else{
                    if (informationId != null) {
                        drawInformation(info, matrix);
                    }
                }
            }
            if(informationMode === "carNumber") {
                if (carNumberId != null) {
                    drawCarNumber(carNumber, matrix);
                }
            }
            if(next){
                if(informationMode === "destination"){
                    drawNext(next,matrix,16)      
                }
                if(informationMode === "information"){
                    if(info.view?.small) {
                        drawNext(next,matrix,16)
                    }
                }
            }
        }else{
            if(informationMode === "destination") {
                if (destinationId != null) {
                    drawDestination(dest,matrix);
                }
            }
            if(informationMode === "information") {
                if (informationId != null) {
                    drawInformation(info,matrix);
                }
            }
            if(informationMode === "information2") {
                if (information2Id != null) {
                    drawInformation2(info2,matrix);
                }
            }
            if(informationMode === "carNumber") {
                if (carNumberId != null) {
                    drawCarNumber(carNumber,matrix);
                }
            }
        }
    }
    drawMatrix(matrix);
}

function createEmptyMatrix() {
    return Array.from({ length: led.height }, () =>
        Array.from({ length: led.width }, () => ({
            r: 0,
            g: 0,
            b: 0
        }))
    );
}

function drawMatrix(matrix) {

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, led.width, led.height);

    for (let y = 0; y < led.height; y++) {
        for (let x = 0; x < led.width; x++) {

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