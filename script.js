const train = document.getElementById("train");
fetch("E131系500番代.json")
    .then(res => res.json())
    .then(data => {
        jsonData = data;
        createTypeButtons();
        createDestinationButtons();
    });


const type = document.getElementById("type");
const destination = document.getElementById("destination");
const displayButton = document.getElementById("displayButton");
const led = document.getElementById("led");
const ctx = led.getContext("2d");
const ledsize = 6;
const ledradius = ledsize / 2;
const ledgap = 1;
const pitch = ledsize + ledgap;
const matrix = [];
const typewidth = 47;
const destinationwidth = 128 - typewidth;

for (let y = 0; y < 32; y++) {
    matrix[y] = [];
    for (let x = 0; x < 128; x++) {
        matrix[y][x] = {
            r:0,
            g:0,
            b:0
        };
    }
}

displayButton.addEventListener("click", function () {
    clearMatrix();  
    
    const selectedType = getItem("type", typeId);
    const selectedDestination = getItem("destination", destinationId);
    if(selectedType) {
        drawType(selectedType);
    }
    if(selectedDestination) {
        drawDestination(selectedDestination);
    }
    drawMatrix();

});

function drawLED(x, y, color) {

    ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
    ctx.beginPath();
    ctx.arc(
        x * pitch + ledradius,
        y * pitch + ledradius,
        ledradius,
        0,
        Math.PI * 2
    );
    ctx.fill();
}

function drawMatrix() {
    
    ctx.clearRect(0, 0, led.width, led.height);

    for (let y=0; y < 32; y++) {
        
        for (let x=0; x <128; x++) {

            drawLED(x, y, matrix[y][x]);

        }

    }

}

function drawHorizontalLine(y, startX, endX) {

    for (let x = startX; x <= endX; x++) {

        matrix[y][x] = true;

    }

}

function drawVerticalLine(x, startY, endY) {

    for (let y = startY; y <= endY; y++) {

        matrix[y][x] = true;

    }

}

function drawRectangle(startX, startY, endX, endY) {

    drawHorizontalLine(startY, startX, endX)
    drawHorizontalLine(endY, startX, endX)
    drawVerticalLine(startX, startY, endY)
    drawVerticalLine(endX, startY, endY)

}

function clearMatrix() {
    
    for (let y = 0; y < 32; y++) {

        for (let x = 0; x <128; x++) {

            matrix[y][x] = {
                r:0,
                g:0,
                b:0
            };
        
        }

    }

}

function drawChar(char, offsetX, offsetY) {
    const pattern = font[char];
    if (!pattern) return;

    for (let y = 0; y < pattern.length; y++) {
        
        for (let x = 0; x < pattern[y].length; x++) {

            if (pattern[y][x] === "1") {
                matrix[offsetY + y][offsetX + x] = true;

            }

        }

    }

}

function drawText(text, startX, startY) {
    
    let x = startX;
    
    for (let i = 0; i < text.length; i++) {

        drawChar(text[i], x, startY);

        x += 6;

    }

}

let lang = "ja";
let typeId = null;
let destinationId = null;
let jsonData = null;

function createTypeButtons() {
    const container = document.getElementById("typeButtons")
    const typeCategory = jsonData.categories.find(category => category.id === "type")
    if(!typeCategory) {
        return;
    }
    typeCategory.items.forEach(type => {
        const btn = document.createElement("button")
        btn.textContent = type.ja.name;
        btn.addEventListener("click", () => {
            container.querySelectorAll("button").forEach(button => {
                button.classList.remove("selected");
            });
            btn.classList.add("selected");
            typeId = type.id;
        });
        container.appendChild(btn)
    })
}

function createDestinationButtons() {
    const container = document.getElementById("destinationButtons")
    const destinationCategory = jsonData.categories.find(category => category.id === "destination")
    if(!destinationCategory) {
        return;
    }
    destinationCategory.items.forEach(destination => {
        const btn = document.createElement("button")
        btn.textContent = destination.ja.name;
        btn.addEventListener("click",() => {
            container.querySelectorAll("button").forEach(button => {
                button.classList.remove("selected");
            });
            btn.classList.add("selected");
            destinationId = destination.id;
        });
        container.appendChild(btn)
    })
}

function getCategory(categoryId) {
    return jsonData.categories.find(
        category => category.id === categoryId
    );
}

function getItem(categoryId, itemId) {
    const category = getCategory(categoryId);
    if (!category) {
        return null;
    }
    return category.items.find(
        item => item.id === itemId
    );
}
function drawImage(displayData, startX, startY) {
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

function drawType(type) {
    const displayData = type[lang] ?? type.ja;
    drawImage(displayData, 0, 0);
}

function drawDestination(destination) {
    const displayData = destination[lang] ?? destination.ja;
    drawImage(displayData, typewidth, 0)
}