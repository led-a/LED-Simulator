async function startVehicle() {

    await loadLed();

    ledsize = config.ledSize;
    ledgap = config.ledGap;
    pitch = ledsize + ledgap;
    radius = ledsize / 2;

    const led = document.getElementById("led");

    led.width = config.ledWidth * pitch;
    led.height = config.ledHeight * pitch;

    const scale = window.innerWidth <= 768 ? 0.6 : 1;

    led.style.width = led.width * scale + "px";
    led.style.height = led.height * scale + "px";

    setupVehicleUI();

    startRenderLoop();
}
async function loadConfig() {
    const response = await fetch(selectedVehicle.config);
    config = await response.json();
}

async function loadLed() {

    // config.json
    let response = await fetch(selectedVehicle.config);
    config = await response.json();

    // led.json
    response = await fetch(selectedVehicle.led);
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
    if (config.hasCarNumber) {
        document.getElementById("carNumberGroup").hidden = false;
        createCarNumberButtons();
    } else {
        document.getElementById("carNumberGroup").hidden = true;
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

    if(nextId != null) {
        sceneList.push({
            lang: "ja",
            information: "destination",
            next: true,
        });
    } else {
        sceneList.push({
            lang: "ja",
            information: "destination",
            next: false,
        });
    }

    if (config.languageSwitching) {
        if (hasEnglishType()) {
            if (nextId != null) {
                sceneList.push({
                    lang: "en",
                    information: "destination",
                    next: true
                });
            } else {
                sceneList.push({
                    lang: "en",
                    information: "destination",
                    next: false
                });
            }
        }
    } else {
        if (nextId != null) {
            sceneList.push({
                lang: "en",
                information: "destination",
                next: true
            });
        }
    }

    if (informationId != null) {
        if (nextId != null) {
            sceneList.push({
                lang: "ja",
                information: "information",
                next: true
            });
        } else {
            sceneList.push({
                lang: "ja",
                information: "information",
                next: false
            });
        }
    }

    if (information2Id != null) {
        if (nextId != null) {
            sceneList.push({
                lang: "ja",
                information: "information2",
                next: true
            });
        } else {
            sceneList.push({
                lang: "ja",
                information: "information2",
                next: false
            });
        }
    }

    if (config.hasCarNumberFull) {
        if (nextId != null) {
            sceneList.push({
                lang: "ja",
                information: "carNumber",
                next: true
            });
        } else {
            sceneList.push({
                lang: "ja",
                information: "carNumber",
                next: false
            });
        }
        if (hasEnglishCarNumber()) {
            if (nextId != null) {
                sceneList.push({
                    lang: "en",
                    information: "carNumber",
                    next: true
                });
            } else {
                sceneList.push({
                    lang: "en",
                    information: "carNumber",
                    next: false
                });
            }
        }
    }

    if (config.next_normal) {
        sceneList.push({
            lang: "ja",
            information: "destination",
            next: false
        });
        sceneList.push({
            lang: "en",
            information: "destination",
            next: false
        });
    }
    // scene番号がはみ出したら戻す
    if (scene >= sceneList.length) {
        scene = 0;
    }

    lang = sceneList[scene].lang;
    informationMode = sceneList[scene].information;
    showNext = sceneList[scene].next;
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