async function startVehicle() {
    await loadConfig();
    await loadLed();
    setupVehicleUI();
    startRenderLoop();
}
async function loadConfig() {
    const response = await fetch(selectedVehicle.config);
    config = await response.json();
}

async function loadLed() {
    const response = await fetch(selectedVehicle.led);
    jsonData = await response.json();
    if (!jsonData?.categories) {
        console.error("JSONが壊れてる");
        return;
    }
}

function setupVehicleUI() {

    if (config.hasType) {
        document.getElementById("typeGroup").hidden = false;
        createTypeButtons();
    } else {
        document.getElementById("typeGroup").hidden = true;
    }
    if (config.hasDestination) {
        document.getElementById("destinationGroup").hidden = false;
        createDestinationButtons();
    } else {
        document.getElementById("destinationGroup").hidden = true;
    }
    if (config.hasInformation) {
        document.getElementById("informationGroup").hidden = false;
        createInformationButtons();
    } else {
        document.getElementById("informationGroup").hidden = true;
    }
    if (config.hasInformation2) {
        document.getElementById("information2Group").hidden = false;
        createInformation2Buttons();
    } else {
        document.getElementById("information2Group").hidden = true;
    }
    if (config.hasNext) {
        document.getElementById("nextModeGroup").hidden = false;
        createNextModeButtons();
    } else {
        document.getElementById("nextModeGroup").hidden = true;
    }

    setVehicleSelectButton();

}

let renderTimer = null;

function startRenderLoop() {

    if (renderTimer !== null) {
        clearInterval(renderTimer);
    }
    
    renderTimer = setInterval(() => {

        updateScene();

        scene++;

        if (scene >= sceneList.length) {
            scene = 0;
        }

        render();

    },config.sceneInterval);
}

function updateScene() {

    sceneList = [];

    // 日本語行先は必ず入れる
    sceneList.push({
        lang: "ja",
        information: "destination"
    });

    // 次駅があるなら英語も入れる
    if (config.languageSwitching) {
        if (hasEnglishType()) {
                sceneList.push({
                lang: "en",
                information: "destination"
            });
        }
    } else {
        if (nextId != null) {
            sceneList.push({
                lang: "en",
                information: "destination"
            });
        }
    }

    // 案内があるなら入れる
    if (informationId != null) {
        sceneList.push({
            lang: "ja",
            information: "information"
        });
    }

    if (information2Id != null) {
        sceneList.push({
            lang: "ja",
            information: "information2"
        });
    }

    // scene番号がはみ出したら戻す
    if (scene >= sceneList.length) {
        scene = 0;
    }

    lang = sceneList[scene].lang;
    informationMode = sceneList[scene].information;
}

function initSimulator() {

    if (renderTimer !== null) {
        clearInterval(renderTimer);
        renderTimer = null;
    }

    clearMatrix();
    drawMatrix(createEmptyMatrix());

    document.getElementById("typeButtons").innerHTML = "";
    document.getElementById("destinationButtons").innerHTML = "";
    document.getElementById("informationButtons").innerHTML = "";
    document.getElementById("information2Buttons").innerHTML = "";
    document.getElementById("nextModeButtons").innerHTML = "";

    typeId = null;
    destinationId = null;
    informationId = null;
    nextId = null;
    sceneList = [];
    lang = "ja";
    scene = 0;
    selectedVehicle = null;
    displayMode = "normal";
    informationMode = "destination";
    langIndex = 0;
    languageSwitching = null;
}