function drawType(type, matrix) {

    const view = isTypeFullScreen(type)
        ? "full"
        : "normal";

    let data = null;
    
    if (config.languageSwitching) {
        data =
            type.view?.[view]?.[lang]
            ?? type.view?.[view]?.ja
            ?? type.view?.normal?.[lang]
            ?? type.view?.normal?.ja;
    } else {
        if (nextId != null) {
            data =
                type.view?.[view]?.[lang]
                ?? type.view?.[view]?.ja
                ?? type.view?.normal?.[lang]
                ?? type.view?.normal?.ja;
        } else {
            data =
                type.view?.[view]?.ja_en
                ?? type.view?.[view]?.ja;
        }
    }
    
    
    if (!data) return;

    drawImage(data, 0, 0, matrix);
}

function drawDestination(dest, matrix) {

    let usedNormal = false;
    let typewidth;

    const view = isDestinationFullScreen(dest)
        ? "full"
        : "normal";

    let data =
        dest.view?.[view]?.[lang]
        ?? dest.view?.[view]?.ja;
        if (view === "normal") {
            usedNormal = true;
        }

    if (!data) {
        data =
            dest.view?.normal?.[lang]
            ?? dest.view?.normal?.ja;
        usedNormal = true;
    }

    if (!data) return;

    const type = getItem("type", typeId)
    
    if (usedNormal) {
        typewidth = getTypeWidth(type, usedNormal);
    } else {
        typewidth = 0;
    }

    drawImage(data, typewidth, 0, matrix);
}

function drawDestinationSmall(dest, matrix) {

    let usedSmall = false;
    let typewidth;

    const view = isDestinationFullScreen(dest)
        ? "full_small"
        : "small";

    let data =
        dest.view?.[view]?.[lang]
        ?? dest.view?.[view]?.ja;
        if (view === "small") {
            usedSmall = true;
        }

    if (!data) {
        data =
            dest.view?.small?.[lang]
            ?? dest.view?.small?.ja;
        usedSmall = true;
    }

    if (!data) return;

    const type = getItem("type", typeId)
    if (usedSmall) {
        typewidth = getTypeWidth(type, usedSmall);
    } else {
        typewidth = 0;
    }

    drawImage(data, typewidth, 0, matrix);
}

function drawInformation(info, matrix) {

    let usedNormal = false;
    let typewidth;

    const view = isInformationFullScreen(info)
        ? "full"
        : "normal";

    let data =
        info.view?.[view]?.[lang]
        ?? info.view?.[view]?.ja;
        if (view === "normal") {
            usedNormal = true;
        }

    if (!data) {
        data =
            info.view?.normal?.[lang]
            ?? info.view?.normal?.ja;
        usedNormal = true;
    }

    if (!data) return;

    const type = getItem("type", typeId)
    if (usedNormal) {
        typewidth = getTypeWidth(type, usedNormal);
    } else {
        typewidth = 0;
    }

    drawImage(data, typewidth, 0, matrix);
}

function drawInformationSmall(info, matrix) {

    let usedSmall = false;
    let typewidth;

    const view = isInformationFullScreen(info)
        ? "full_small"
        : "small";

    let data =
        info.view?.[view]?.[lang]
        ?? info.view?.[view]?.ja;
        if (view === "small") {
            usedSmall = true;
        }

    if (!data) {
        data =
            info.view?.small?.[lang]
            ?? info.view?.small?.ja;
        usedSmall = true;
    }

    if (!data) return;
    const type = getItem("type", typeId)
    if (usedSmall) {
        typewidth = getTypeWidth(type, usedSmall);
    } else {
        typewidth = 0;
    }
    drawImage(data, typewidth, 0, matrix);
}

function drawNext(next, matrix, yOffset) {

    let usedNormal = false;
    let typewidth;

    const view = isNextFullScreen(next)
        ? "full"
        : "normal"

    let data =
        next?.view?.[view]?.[lang]
        ?? next?.view?.[view]?.ja;
        if (view === "normal") {
            usedNormal = true;
        }

    if (!data) {
        data =
            next?.view?.normal?.[lang]
            ?? next?.view?.normal?.ja;
        usedNormal = true;
    }

    if (!data) return;
    const type = getItem("type", typeId)
    if (usedNormal) {
        typewidth = getTypeWidth(type, usedNormal);
    } else {
        typewidth = 0;
    }

    drawImage(data, typewidth, yOffset, matrix);
}

function getTypeWidth(type, used) {

    if(!type) {
        if(used) {
            return (
                getItem("type", "null_type").view.normal.ja.width
            )
        } else {
            return 0;
        }
    }

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

function isDestinationFullScreen(dest) {

    if(!dest) return false;

    const hasNormal = !!dest.view.normal;
    const hasFull = !!dest.view.full;

    if(hasFull && !hasNormal){
        return true;
    }

    if(typeId===null){
        return true;
    }

    return false;
}

function isInformationFullScreen(info) {

    if(!info) return false;

    const hasNormal = !!info.view.normal;
    const hasFull = !!info.view.full;

    if(hasFull && !hasNormal){
        return true;
    }

    if(typeId===null){
        return true;
    }

    return false;
}

function isNextFullScreen(next) {

    if(!next) return false;

    const hasNormal = !!next.view.normal;
    const hasFull = !!next.view.full;

    if(hasFull && !hasNormal){
        return true;
    }

    if(typeId===null){
        return true;
    }

    return false;
}

function getLangForPart() {
    return lang;
}

function hasEnglishType() {
    const type = getItem("type", typeId);
    if (!type) return;
    return !!type.view?.normal?.en
        || !!type.view?.full?.en;
}