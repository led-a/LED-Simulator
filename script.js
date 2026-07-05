
// =====================
// 状態
// =====================
let jsonData = null;

let typeId = null;
let destinationId = null;
let nextId = null;

let displayMode = "normal";
let baseLang = "ja";
let nextLang = "ja";
let langIndex = 0;
const langs = ["ja", "en"];

setTimeout(() => {

    setInterval(() => {

        if (displayMode !== "next") return;

        langIndex = (langIndex + 1) % langs.length;
        nextLang = langs[langIndex];

        render();

    }, 3000);

}, 3000);

// =====================
// DOM
// =====================
const displayButton = document.getElementById("displayButton");
const led = document.getElementById("led");
const ctx = led.getContext("2d");

const typewidth = 47;


// =====================
// JSON読み込み
// =====================
fetch("E131系500番代.json")
    .then(res => res.json())
    .then(data => {
        jsonData = data;
        if (!jsonData?.categories) {
            console.error("JSONが壊れてる");
            return;
        }

        createTypeButtons();
        createDestinationButtons();
        createNextModeButtons();
    });


// =====================
// 共通取得関数
// =====================
function getCategory(categoryId) {
    return jsonData?.categories?.find(c => c.id === categoryId);
}

function getItem(categoryId, itemId) {
    const category = getCategory(categoryId);
    if (!category) return null;

    return category.items.find(i => i.id === itemId);
}


// =====================
// 描画エンジン
// =====================
function clearMatrix() {
    ctx.fillStyle = "rgb(0,0,0)";
    ctx.fillRect(0, 0, led.width, led.height);
}

const ledsize = 6;
const ledgap = 1;
const pitch = ledsize + ledgap;
const radius = ledsize / 2;
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


// =====================
// 画像描画
// =====================
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


// =====================
// メイン描画
// =====================
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
    let nextY = 0;
    console.log("type:", typeId, type);
    console.log("dest:", destinationId, dest);
    console.log("next:", nextId, next);
    console.log("displayMode:", displayMode);
    // 種別
    if (type) drawType(type, matrix);

    // 行先 / 次駅
    if (displayMode === "next") {

        if (dest) {
            drawDestinationSmall(dest, matrix);
            const destData =
                dest.view?.normal?.ja
                ?? dest.view?.normal?.en;
            nextY = (destData?.height ?? 16);
        } 
        if (next) drawNext(next, matrix, 16);

    } else {

        if (dest) drawDestination(dest, matrix);
    }

    drawMatrix(matrix);
}


// =====================
// マトリクス生成
// =====================
function createEmptyMatrix() {
    return Array.from({ length: 32 }, () =>
        Array.from({ length: 128 }, () => ({
            r: 0,
            g: 0,
            b: 0
        }))
    );
}


// =====================
// 種別
// =====================
function drawType(type, matrix) {

    const langUse =
        displayMode === "next"
            ? nextLang
            : baseLang;

    const view =
        displayMode === "fullscreen"
            ? "full"
            : "normal";

    const data =
        type.view?.[view]?.[langUse]
        ?? type.view?.[view]?.ja;

    if (!data) return;

    drawImage(data, 0, 0, matrix);
}


// =====================
// 行先（通常）
// =====================
function drawDestination(dest, matrix) {

    const view =
        displayMode === "fullscreen"
            ? "full"
            : "normal";

    const data =
        dest.view?.[view]?.[baseLang]
        ?? dest.view?.[view]?.ja;

    if (!data) return;

    drawImage(data, typewidth, 0, matrix);
}


// =====================
// 行先（小）
// =====================
function drawDestinationSmall(dest, matrix) {

    const langUse = getLangForPart("destination_small");

    const data =
        dest.view?.small?.[nextLang]
        ?? dest.view?.small?.ja;

    if (!data) return;

    drawImage(data, typewidth, 0, matrix);
}


// =====================
// 次駅
// =====================
function drawNext(next, matrix, yOffset) {

    const data =
        next?.view?.normal?.[nextLang]
        ?? next?.view?.normal?.ja;

    if (!data) return;

    drawImage(data, typewidth, yOffset, matrix);
}


// =====================
// ボタン：種別
// =====================
function createTypeButtons() {

    const container = document.getElementById("typeButtons");
    const typeCategory = getCategory("type");

    if (!typeCategory) return;

    typeCategory.items.forEach(item => {

        const btn = document.createElement("button");

        const label =
            item.view?.normal?.ja?.name ??
            item.view?.normal?.en?.name ??
            item.view?.full?.ja?.name ??
            item.view?.full?.en?.name ??
            item.name ??
            "no-name";

        btn.textContent = label;

        btn.addEventListener("click", () => {
            setSelected(container, btn);
            typeId = item.id;
        });

        container.appendChild(btn);
    });
}


// =====================
// ボタン：行先
// =====================
function createDestinationButtons() {

    const container = document.getElementById("destinationButtons");
    const destinationcategory = getCategory("destination");
    if (!destinationcategory) return;

    destinationcategory.items.forEach(dest => {

        const btn = document.createElement("button");
        const label =
            dest.view?.normal?.ja?.name ??
            dest.view?.normal?.en?.name ??
            dest.view?.small?.ja?.name ??
            dest.view?.small?.en?.name ??
            dest.view?.full?.ja?.name ??
            dest.view?.full?.en?.name ??
            dest.name ??
            "no-name";
        btn.textContent = label;

        btn.addEventListener("click", () => {
            setSelected(container, btn);
            destinationId = dest.id;
        });

        container.appendChild(btn);
    });
}


// =====================
// ボタン：次駅
// =====================
function createNextModeButtons() {

    const container = document.getElementById("nextModeButtons");

    // 無表示
    const normalBtn = document.createElement("button");
    normalBtn.textContent = "無表示";

    normalBtn.addEventListener ("click", () => {
        setSelected(container, normalBtn);
        displayMode = "normal";
        nextId = null;
    });

    container.appendChild(normalBtn);

    const category = getCategory("next");

    category?.items.forEach(item => {

        const btn = document.createElement("button");
        const label =
            item.view?.normal?.ja?.name ??
            item.view?.normal?.en?.name ??
            item.name ??
            "no-name";
        btn.textContent = label;

        btn.addEventListener ("click", () => {
            setSelected(container, btn);
            displayMode = "next";
            nextId = item.id;
        });

        container.appendChild(btn);
    });
}

function setSelected(container, button) {

    container.querySelectorAll("button")
        .forEach(b => b.classList.remove("selected"));

    button.classList.add("selected");
}

displayButton.addEventListener ("click", () => {
    render();
})

function getLangForPart(part) {

    if (displayMode === "next") {

        if (part === "type") return "en";
        if (part === "destination_small") return "en";
    }

    return "ja";
}