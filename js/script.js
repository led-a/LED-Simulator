async function startVehicle() {

    await loadLed();

    ledsize = config.ledSize;
    ledgap = config.ledGap;
    pitch = ledsize + ledgap;
    radius = ledsize / 2;
    sizeLed.width = config.ledWidth * pitch;
    sizeLed.height = config.ledHeight * pitch;
    cacheCanvas.width = sizeLed.width;
    cacheCanvas.height = sizeLed.height;

    resizeLed();

    setupVehicleUI();

    startRenderLoop();
}
function resizeLed() {
    if (!config) return;
    const main = document.querySelector("main");

    const maxWidth = main.clientWidth - 40;
    const canvasWidth = sizeLed.width;
    const scale = Math.min(1, maxWidth / canvasWidth);

    sizeLed.style.width = sizeLed.width * scale + "px";
    sizeLed.style.height = sizeLed.height * scale + "px";
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
    resizeButtonText();

}

let renderTimer = null;

function nextScene() {

    buildSceneList();
    buildTypeSceneList();

    scene = frame % sceneList.length;
    typeScene = frame % typeSceneList.length;

    applyScene();
    applyTypeScene();

    render();

    frame++;

    renderTimer = setTimeout(nextScene, config.sceneInterval);
}

function startRenderLoop() {
    if (renderTimer !== null) {
        clearTimeout(renderTimer);
    }

    nextScene();
}

function buildSceneList() {

    sceneList = [];
    const type = getItem("type", typeId);
    
    if (informationId != null) {
        if (config.informationPosition === "next") {
            if (config.informationAhead) {
                sceneList.push({
                    lang: "ja",
                    information: "information_next",
                    next: false
                });
            }
        }
    }

    if(nextId != null) {
        sceneList.push({
            lang: "ja",
            information: "destination",
            next: true,
        });
    } else {
        if (!config.informationAhead) {
            if (destinationId != null) {
                if (config.destinationPosition === "normal") {
                    sceneList.push({
                        lang: "ja",
                        information: "destination",
                        next: false,
                    });
                }
                if (config.destinationPosition === "next") {
                    sceneList.push({
                        lang: "ja",
                        information: "destination_next",
                        next: false,
                    });
                }
            } else {
                sceneList.push({
                    lang: "ja",
                    information: "destination",
                    next: false,
                });
            }
        } else {
            if (informationId === null) {
                sceneList.push({
                    lang: "ja",
                    information: "destination",
                    next: false,
                });
            }
        }
    }

    if (informationId != null) {
        if (config.informationAhead) {
            if (hasEnglishInformation()) {
                sceneList.push({
                    lang: "en",
                    information: "information_next",
                    next: false
                });
            }
        }
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
        if (typeId === null) {
            if (nextId != null) {
                sceneList.push({
                    lang: "en",
                    information: "destination",
                    next: true
                });
            } else {
                if (destinationId != null) {
                    if (config.destinationPosition === "normal") {
                        sceneList.push({
                            lang: "en",
                            information: "destination",
                            next: false,
                        });
                    }
                    if (config.destinationPosition === "next") {
                        sceneList.push({
                            lang: "en",
                            information: "destination_next",
                            next: false,
                        });
                    }
                } else {
                    sceneList.push({
                        lang: "en",
                        information: "destination",
                        next: false,
                    });
                }
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

    if (config.destinationLanguageSwitching) {
        if (!config.languageSwitching) {
            if (hasEnglishDestination()) {
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
        }
    }

    if (hasInformationDestination()) {
        if (nextId != null) {
            sceneList.push({
                lang: "info",
                information: "destination",
                next: true
            });
        } else {
            sceneList.push({
                lang: "info",
                information: "destination",
                next: false
            });
        }
    }

    if (informationId != null) {
        if (config.informationPosition === "normal") {
            if (nextId != null) {
                sceneList.push({
                    lang: "ja",
                    information: "information",
                    next: true
                });
                if (config.informationLanguageSwitching) {
                    sceneList.push({
                        lang: "en",
                        information: "information",
                        next: true
                    });
                }
            } else {
                sceneList.push({
                    lang: "ja",
                    information: "information",
                    next: false
                });
                if (config.informationLanguageSwitching) {
                    if (hasEnglishInformation()) {
                        sceneList.push({
                            lang: "en",
                            information: "information",
                            next: false
                        });
                    }
                }
            }
        }
        if (config.informationPosition === "next") {
            if (!config.informationAhead) {
                sceneList.push({
                    lang: "ja",
                    information: "information_next",
                    next: false
                });
                if (config.informationLanguageSwitching) {
                    if (hasEnglishInformation()) {
                        sceneList.push({
                            lang: "en",
                            information: "information_next",
                            next: false
                        });
                    }
                }
            }
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

    if (carNumberId != null) {
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
        if (!isTypeFullScreen(type)) {
            if (config.hasCarNumberNormal) {
                if (nextId != null) {
                    sceneList.push({
                        lang: "ja",
                        information: "carNumber_destination",
                        next: true
                    });
                } else {
                    sceneList.push({
                        lang: "ja",
                        information: "carNumber_destination",
                        next: false
                    });
                }
                if (hasEnglishCarNumber()) {
                    if (nextId != null) {
                        sceneList.push({
                            lang: "en",
                            information: "carNumber_destination",
                            next: true
                        });
                    } else {
                        sceneList.push({
                            lang: "en",
                            information: "carNumber_destination",
                            next: false
                        });
                    }
                }
            }
        }
    }

    if (config.next_normal) {
        if (nextId != null) {
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
    }

}

function applyScene() {
    lang = sceneList[scene].lang;
    informationMode = sceneList[scene].information;
    showNext = sceneList[scene].next;
}

let typeTimer = null;

function buildTypeSceneList() {
    typeSceneList = [];
    typeSceneList.push({
        typeInfo: null
    });
    if (hasTypeInformation()) {
        typeSceneList.push({
            typeInfo: "information"
        });
    }
}

function applyTypeScene() {
    typeMode = typeSceneList[typeScene].typeInfo;
}

function initSimulator() {

    if (renderTimer !== null) {
        clearInterval(renderTimer);
        renderTimer = null;
    }

    if (typeTimer !== null) {
        clearInterval(typeTimer);
        typeTimer = null;
    }

    clearMatrix();
    drawMatrix(createEmptyMatrix());

    document.getElementById("typeButtons").innerHTML = "";
    document.getElementById("destinationButtons").innerHTML = "";
    document.getElementById("informationButtons").innerHTML = "";
    document.getElementById("information2Buttons").innerHTML = "";
    document.getElementById("nextModeButtons").innerHTML = "";
    document.getElementById("carNumberButtons").innerHTML = "";
    const typeLabel = document.getElementById("type");
    typeLabel.textContent = "種別:なし"
    const destinationLabel = document.getElementById("destination");
    destinationLabel.textContent = "行先:なし"
    const informationLabel = document.getElementById("information");
    informationLabel.textContent = "案内:なし"
    const information2Label = document.getElementById("information2");
    information2Label.textContent = "案内2:なし"
    const nextLabel = document.getElementById("nextMode");
    nextLabel.textContent = "次駅:なし"
    const carNumberLabel = document.getElementById("carNumber");
    carNumberLabel.textContent = "号車:なし"

    typeId = null;
    destinationId = null;
    informationId = null;
    information2Id = null;
    carNumberId = null;
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

window.addEventListener("resize", () => {
    requestResizeRender();
});

let resizeRequest = null;

function requestResizeRender() {
    if (resizeRequest) return;

    resizeRequest = requestAnimationFrame(() => {
        resizeLed();
        const now = performance.now();
        if (now - lastRender > 16) {
            ctx.clearRect(0,0,sizeLed.width,sizeLed.height);
            ctx.drawImage(cacheCanvas,0,0);
            lastRender = now;
        }
        resizeRequest = null;
    });
}

const sidebar = document.getElementById("sidebar");
const resizer = document.getElementById("resizer");

let dragging = false;
let startX;
let startWidth;

resizer.addEventListener("mousedown", (e) => {
    dragging = true;
    startX = e.clientX;
    startWidth = sidebar.offsetWidth;
});

let lastRender = 0;

document.addEventListener("mousemove", (e) => {
    if (!dragging) return;

    const dx = e.clientX - startX;
    let width = startWidth + dx;

    width = Math.max(260, Math.min(width, 1700));

    sidebar.style.width = width + "px";

    resizeLed();
    resizeButtonText();
    const now = performance.now();
    if (now - lastRender > 16) {
        ctx.clearRect(0,0,sizeLed.width,sizeLed.height);
        ctx.drawImage(cacheCanvas,0,0);
        lastRender = now;
    }
});

document.addEventListener("mouseup", () => {
    dragging = false;
});

document.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("touchstart", () => {
        btn.classList.add("tap");
    });

    btn.addEventListener("touchend", () => {
        btn.classList.remove("tap");
    });
});