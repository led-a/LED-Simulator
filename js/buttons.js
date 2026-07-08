function createTypeButtons() {

    const container = document.getElementById("typeButtons");
    const normalBtn = document.createElement("button");
    normalBtn.textContent = "種別なし";

    normalBtn.addEventListener ("click", () => {
        setSelected(container, normalBtn);
        typeId = null;
        render();
    });

    container.appendChild(normalBtn);
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
            render();
        });

        container.appendChild(btn);
    });
}

function createDestinationButtons() {

    const container = document.getElementById("destinationButtons");
    const normalBtn = document.createElement("button");
    normalBtn.textContent = "行先なし";

    normalBtn.addEventListener ("click", () => {
        setSelected(container, normalBtn);
        destinationId = null;
        render();
    });

    container.appendChild(normalBtn);
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
            render();
        });

        container.appendChild(btn);
    });
}

function createNextModeButtons() {

    const container = document.getElementById("nextModeButtons");

    // 無表示
    const normalBtn = document.createElement("button");
    normalBtn.textContent = "次駅なし";

    normalBtn.addEventListener ("click", () => {
        displayMode = "normal";
        scene = 0;
        langIndex = 0;
        setSelected(container, normalBtn);
        nextId = null;
        render();
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
            scene = 0;
            langIndex = 0;
            nextId = item.id;
            render();
        });

        container.appendChild(btn);
    });
}

function createInformationButtons() {

    const container = document.getElementById("informationButtons");

    // 無表示
    const normalBtn = document.createElement("button");
    normalBtn.textContent = "案内なし";

    normalBtn.addEventListener ("click", () => {
        setSelected(container, normalBtn);
        informationId = null;
        scene = 0;
        langIndex = 0;
        render();
    });

    container.appendChild(normalBtn);

    const category = getCategory("information");

    category?.items.forEach(info => {

        const btn = document.createElement("button");
        const label =
            info.view?.normal?.ja?.name ??
            info.view?.normal?.en?.name ??
            info.view?.small?.ja?.name ??
            info.view?.small?.en?.name ??
            info.name ??
            "no-name";
        btn.textContent = label;

        btn.addEventListener ("click", () => {
            setSelected(container, btn);
            informationId = info.id;
            scene = 0;
            langIndex = 0;
            render();
        });

        container.appendChild(btn);
    });
}

function setSelected(container, button) {

    container.querySelectorAll("button")
        .forEach(b => b.classList.remove("selected"));

    button.classList.add("selected");
}

function setVehicleSelectButton() {
    const container = document.getElementById("vehicleSelectButton");
    container.addEventListener("click", () => {
        initSimulator();
        document.getElementById("simulator").hidden = true;
        document.getElementById("vehicleSelector").hidden = false;
    })
}