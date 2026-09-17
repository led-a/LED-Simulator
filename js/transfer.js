let transferController = null;
function rgbTo3bit(value) {
    return Math.min(7, Math.max(0, Math.round(value / 36.4)));
}

function createESP32Packet() { 

    buildSceneList(); 
    buildTypeSceneList(); 

    if (sceneList.length === 0) { 
        return new Uint8Array(); 
    } 
    const typeCount = typeSceneList.length > 0 ? typeSceneList.length : 1; 
    const sceneCount = lcm(sceneList.length, typeCount); 
    const sceneData = createAllESP32Scenes(); 
    const header = createESP32Header(sceneCount); 
    const packet = new Uint8Array( header.length + sceneData.length ); 
    packet.set(header, 0); 
    packet.set(sceneData, header.length); 
    return packet; 
}

function createESP32Frame(matrix) {
    const hw = config.ledWidth;

    const frame = Array.from(
        { length: 3 },
        () => Array.from(
            { length: 16 },
            () => new Uint8Array(hw)
        )
    );

    for (let y = 0; y < config.ledHeight; y++) {
        for (let x = 0; x < hw; x++) {

            const pixel = matrix[y]?.[x];

            if (!pixel) continue;

            const r = rgbTo3bit(pixel.r);
            const g = rgbTo3bit(pixel.g);
            const b = rgbTo3bit(pixel.b);

            for (let bit = 0; bit < 3; bit++) {

                if ((r >> bit) & 1) {
                    frame[bit][y % 16][x] |=
                        (y < 16 ? 0x01 : 0x08);
                }

                if ((g >> bit) & 1) {
                    frame[bit][y % 16][x] |=
                        (y < 16 ? 0x02 : 0x10);
                }

                if ((b >> bit) & 1) {
                    frame[bit][y % 16][x] |=
                        (y < 16 ? 0x04 : 0x20);
                }
            }
        }
    }

    return frame;
}

function frameToUint8Array(frame) {
    const hw = config.ledWidth;

    const sceneBuf = new Uint8Array(3 * 16 * hw);

    let p = 0;

    for (let bit = 0; bit < 3; bit++) {
        for (let y = 0; y < 16; y++) {
            for (let x = 0; x < hw; x++) {
                sceneBuf[p++] = frame[bit][y][x];
            }
        }
    }

    return sceneBuf;
}

function uint8ArrayToHex(data) {
    let hex = "";

    for (const value of data) {
        hex += value.toString(16).padStart(2, "0");
    }

    return hex;
}

async function transferToESP32() {
    const status = document.getElementById("transferStatus");
    const button = document.getElementById("transferButton");
    const ip = document.getElementById("esp32Ip").value.trim();

    // 新しい転送用のAbortControllerを作る
    transferController = new AbortController();

    button.disabled = true;

    try {
        status.textContent = "データ作成中...";

        const packet = createESP32Packet();

        if (packet.length === 0) {
            throw new Error("表示シーンがありません");
        }

        status.textContent = "Wi-Fi転送中...";

        const hexString = uint8ArrayToHex(packet);

        const response = await fetch(
            `http://${ip}/upload`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "text/plain"
                },
                body: hexString,
                signal: transferController.signal
            }
        );

        if (!response.ok) {
            throw new Error(`転送失敗: ${response.status}`);
        }

        status.textContent = "転送完了";

    } catch (error) {

        // 車両変更などで意図的に中断した場合
        if (error.name === "AbortError") {
            console.log("ESP32転送を中断しました");
            return;
        }

        console.error(error);
        status.textContent = "転送失敗: " + error.message;

    } finally {
        button.disabled = false;
        transferController = null;
    }
}

function createAllESP32Scenes() {

    buildSceneList();
    buildTypeSceneList();

    if (sceneList.length === 0) {
        return new Uint8Array();
    }

    const typeCount =
        typeSceneList.length > 0
            ? typeSceneList.length
            : 1;

    const sceneCount =
        lcm(sceneList.length, typeCount);

    const hw = config.ledWidth;

    const sceneSize = 3 * 16 * hw;

    const allData =
        new Uint8Array(sceneCount * sceneSize);

    let offset = 0;

    const oldScene = scene;
    const oldTypeScene = typeScene;

    for (let i = 0; i < sceneCount; i++) {

        scene = i % sceneList.length;

        typeScene =
            typeSceneList.length > 0
                ? i % typeSceneList.length
                : 0;

        applyScene();
        applyTypeScene();

        const matrix = createDisplayMatrix();

        const frame =
            createESP32Frame(matrix);

        const sceneBuf =
            frameToUint8Array(frame);

        allData.set(sceneBuf, offset);

        offset += sceneSize;
    }

    scene = oldScene;
    typeScene = oldTypeScene;

    return allData;
}

function createESP32Header(sceneCount) {

    const header = new Uint8Array(20);

    // =========================
    // 表示時間
    // =========================

    let times;

    if (config.setSwitchingTime) {

        // 現在の画面設定から取得
        const jaTime =
            Number(document.querySelector("#jaTime input").value) * 1000 || 3000;

        const enTime =
            Number(document.querySelector("#enTime input").value) * 1000 || 3000;

        const infoTime =
            Number(document.querySelector("#infoTime input").value) * 1000 || 3000;

        const carNumberTime =
            Number(document.querySelector("#carNumberTime input").value) * 1000 || 3000;

        /*
         * 2020系は4画面まで。
         *
         * 画面ごとの実際の時間を
         * sceneListから取得する。
         */
        times = sceneList
            .slice(0, 4)
            .map(currentScene => {

                if (
                    currentScene.information === "carNumber" ||
                    currentScene.information === "carNumber_normal"
                ) {
                    return carNumberTime;
                }

                if (
                    currentScene.information === "information"
                ) {
                    return infoTime;
                }

                if (
                    currentScene.information === "destination"
                ) {
                    if (currentScene.lang === "ja") {
                        return jaTime;
                    }

                    if (currentScene.lang === "en") {
                        return enTime;
                    }
                }

                return 3000;
            });

    } else {

        // 通常車両など、3秒固定
        times = [3000, 3000, 3000, 3000];
    }


    // =========================
    // ヘッダー
    // =========================

    header[0] = 0xAA;
    header[1] = 0x56;

    // シーン数：1バイト
    header[2] = sceneCount & 0xFF;

    // スクロール速度：1バイト
    header[3] = 0;

    // スクロール文字幅 tw：2バイト
    header[4] = 0;
    header[5] = 0;

    // Xオフセット：1バイト
    header[6] = 0;


    // =========================
    // t0～t4
    // =========================

    for (let i = 0; i < 5; i++) {

        const time =
            times[i] ?? 3000;

        header[7 + i * 2] =
            time & 0xFF;

        header[8 + i * 2] =
            (time >> 8) & 0xFF;
    }


    // 明るさ
    header[17] = 255;

    // ハードウェア幅
    header[18] =
        config.ledWidth & 0xFF;

    header[19] =
        (config.ledWidth >> 8) & 0xFF;


    return header;
}

function gcd(a, b) {
    while (b !== 0) {
        const temp = a % b;
        a = b;
        b = temp;
    }

    return a;
}

function lcm(a, b) {
    return a / gcd(a, b) * b;
}

const transferButton = document.getElementById("transferButton");

transferButton.onclick = transferToESP32;