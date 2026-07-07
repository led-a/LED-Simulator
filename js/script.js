fetch("data/E131系500番代.json")
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
        createInformationButtons();
    });

setInterval(() => {

    updateScene();

    scene++;

    if (scene >= sceneList.length) {
        scene = 0;
    }

    render();

},3000);

function updateScene() {

    sceneList = [];

    // 日本語行先は必ず入れる
    sceneList.push({
        lang: "ja",
        information: "destination"
    });

    // 次駅があるなら英語も入れる
    sceneList.push({
        lang: "en",
        information: "destination"
    });
    

    // 案内があるなら入れる
    if (informationId) {
        sceneList.push({
            lang: "ja",
            information: "information"
        });
    }

    // scene番号がはみ出したら戻す
    if (scene >= sceneList.length) {
        scene = 0;
    }

    lang = sceneList[scene].lang;
    informationMode = sceneList[scene].information;
}