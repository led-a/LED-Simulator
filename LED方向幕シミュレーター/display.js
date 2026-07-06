function drawType(type, matrix) {

    const view = isTypeFullScreen(type)
        ? "full"
        : "normal";

    const data =
        type.view?.[view]?.[lang]
        ?? type.view?.[view]?.ja;

    if (!data) return;
    const typewidth = getTypeWidth(type);

    drawImage(data, 0, 0, matrix);
}

function drawDestination(dest, matrix) {

    const data =
        dest.view?.normal?.[lang]
        ?? dest.view?.normal?.ja;

    if (!data) return;
    const type = getItem("type", typeId)
    const typewidth = getTypeWidth(type);

    drawImage(data, typewidth, 0, matrix);
}

function drawDestinationSmall(dest, matrix) {

    const data =
        dest.view?.small?.[lang]
        ?? dest.view?.small?.ja;

    if (!data) return;
    const type = getItem("type", typeId)
    const typewidth = getTypeWidth(type);

    drawImage(data, typewidth, 0, matrix);
}

function drawInformation(info, matrix) {

    const data =
        info.view?.normal?.[lang]
        ?? info.view?.normal?.ja;

    if (!data) return;
    const type = getItem("type", typeId)
    const typewidth = getTypeWidth(type);

    drawImage(data, typewidth, 0, matrix);
}

function drawInformationSmall(info, matrix) {

    const data =
        info.view?.small?.[lang]
        ?? info.view?.small?.ja;

    if (!data) return;
    const type = getItem("type", typeId)
    const typewidth = getTypeWidth(type);

    drawImage(data, typewidth, 0, matrix);
}

function drawNext(next, matrix, yOffset) {

    const data =
        next?.view?.normal?.[lang]
        ?? next?.view?.normal?.ja;

    if (!data) return;
    const type = getItem("type", typeId)
    const typewidth = getTypeWidth(type);

    drawImage(data, typewidth, yOffset, matrix);
}

function getTypeWidth(type) {

    const view = isTypeFullScreen(type)
        ? "full"
        : "normal";

    const lang = getLangForPart();

    return (
        type.view?.[view]?.[lang]?.width
        ?? type.view?.[view]?.ja?.width
        ?? 0
    );
}

function isTypeFullScreen(type) {

    if(!type) return false;

    const hasNormal = !!type.view.normal;
    const hasFull = !!type.view.full;

    if(hasFull && !hasNormal){
        return true;
    }

    if(destinationId===null && nextId===null){
        return true;
    }

    return false;
}

function getLangForPart() {
    return lang;
}