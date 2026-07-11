function createTypeButtons() {

    const container = document.getElementById("typeButtons");
    container.innerHTML = "";

    const typeCategory = getCategory("type");
    if (!typeCategory) return;

    const normalBtn = document.createElement("button");
    container.classList.remove("groupedButtons", "normalButtons");

    if (config.typeDistinction) {
        container.classList.add("groupedButtons");
    } else {
        container.classList.add("normalButtons");
    }

    normalBtn.textContent = "種別なし";

    normalBtn.addEventListener ("click", () => {
        setSelected(container, normalBtn);
        typeId = null;
        render();
    });

    container.appendChild(normalBtn);

    if (config.typeDistinction) {

        typeCategory.groups.forEach(group => {

            // ===== 無表示グループ =====
            if (group.name === "無表示") {

                group.items.forEach(item => {

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

                return;
            }

            // ===== 路線グループ =====

            const header = document.createElement("div");
            header.className = "groupHeader";
            header.textContent = "▶ " + group.name;

            const groupContainer = document.createElement("div");
            groupContainer.className = "groupButtons";
            groupContainer.hidden = true;

            header.addEventListener("click", () => {

                groupContainer.hidden = !groupContainer.hidden;

                header.textContent =
                    (groupContainer.hidden ? "▶ " : "▼ ") + group.name;

            });

            container.appendChild(header);
            container.appendChild(groupContainer);

            group.items.forEach(item => {

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

            groupContainer.appendChild(btn);

            });

        });
    } else {
        const container = document.getElementById("typeButtons");

        const category = getCategory("type");

        category?.items.forEach(item => {

            const btn = document.createElement("button");
            const label =
                item.view?.normal?.ja?.name ??
                item.view?.normal?.en?.name ??
                item.view?.full?.ja?.name ??
                item.view?.full?.en?.name ??
                item.name ??
                "no-name";
            btn.textContent = label;

            btn.addEventListener ("click", () => {
                setSelected(container, btn);
                typeId = item.id;
                render();
            });

            container.appendChild(btn);
        });
    }
}

function createDestinationButtons() {

    const container = document.getElementById("destinationButtons");
    container.innerHTML = "";

    const destinationCategory = getCategory("destination");
    if (!destinationCategory) return;

    const normalBtn = document.createElement("button");
    container.classList.remove("groupedButtons", "normalButtons");

    if (config.destinationDistinction) {
        container.classList.add("groupedButtons");
    } else {
        container.classList.add("normalButtons");
    }

    normalBtn.textContent = "行先なし";

    normalBtn.addEventListener ("click", () => {
        setSelected(container, normalBtn);
        destinationId = null;
        render();
    });

    container.appendChild(normalBtn);

    if (config.destinationDistinction) {

        destinationCategory.groups.forEach(group => {

            // ===== 無表示グループ =====
            if (group.name === "無表示") {

                group.items.forEach(dest => {

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

                return;
            }

            // ===== 路線グループ =====

            const header = document.createElement("div");
            header.className = "groupHeader";
            header.textContent = "▶ " + group.name;

            const groupContainer = document.createElement("div");
            groupContainer.className = "groupButtons";
            groupContainer.hidden = true;

            header.addEventListener("click", () => {

                groupContainer.hidden = !groupContainer.hidden;

                header.textContent =
                    (groupContainer.hidden ? "▶ " : "▼ ") + group.name;

            });

            container.appendChild(header);
            container.appendChild(groupContainer);

            group.items.forEach(dest => {

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

            groupContainer.appendChild(btn);

            });

        });
    } else {
        const container = document.getElementById("destinationButtons");

        const category = getCategory("destination");

        category?.items.forEach(dest => {

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

            btn.addEventListener ("click", () => {
                setSelected(container, btn);
                destinationId = dest.id;
                render();
            });

            container.appendChild(btn);
        });
    }
}

function createNextModeButtons() {

    const container = document.getElementById("nextModeButtons");
    container.innerHTML = "";

    const nextModeCategory = getCategory("next");
    if (!nextModeCategory) return;

    const normalBtn = document.createElement("button");
    container.classList.remove("groupedButtons", "normalButtons");

    if (config.nextModeDistinction) {
        container.classList.add("groupedButtons");
    } else {
        container.classList.add("normalButtons");
    }

    normalBtn.textContent = "次駅なし";

    normalBtn.addEventListener ("click", () => {
        setSelected(container, normalBtn);
        displayMode = "normal";
        scene = 0;
        langIndex = 0;
        nextId = null;
        render();
    });

    container.appendChild(normalBtn);

    if (config.nextModeDistinction) {

        nextModeCategory.groups.forEach(group => {

            // ===== 無表示グループ =====
            if (group.name === "無表示") {

                group.items.forEach(item => {

                    const btn = document.createElement("button");

                    const label =
                        item.view?.normal?.ja?.name ??
                        item.view?.normal?.en?.name ??
                        item.name ??
                        "no-name";

                    btn.textContent = label;

                    btn.addEventListener("click", () => {
                        setSelected(container, btn);
                        nextId = item.id;
                        render();
                    });

                    container.appendChild(btn);
                });

                return;
            }

            // ===== 路線グループ =====

            const header = document.createElement("div");
            header.className = "groupHeader";
            header.textContent = "▶ " + group.name;

            const groupContainer = document.createElement("div");
            groupContainer.className = "groupButtons";
            groupContainer.hidden = true;

            header.addEventListener("click", () => {

                groupContainer.hidden = !groupContainer.hidden;

                header.textContent =
                    (groupContainer.hidden ? "▶ " : "▼ ") + group.name;

            });

            container.appendChild(header);
            container.appendChild(groupContainer);

            group.items.forEach(item => {

                const btn = document.createElement("button");

                const label =
                    item.view?.normal?.ja?.name ??
                    item.view?.normal?.en?.name ??
                    item.name ??
                    "no-name";

                btn.textContent = label;

                btn.addEventListener("click", () => {
                    setSelected(container, btn);
                    displayMode = "next";
                    scene = 0;
                    langIndex = 0;
                    nextId = item.id;
                    render();
                });

            groupContainer.appendChild(btn);

            });

        });
    } else {
        const container = document.getElementById("nextModeButtons");

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
}

function createInformationButtons() {

    const container = document.getElementById("informationButtons");
    container.innerHTML = "";

    const informationCategory = getCategory("information");
    if (!informationCategory) return;

    const normalBtn = document.createElement("button");
    container.classList.remove("groupedButtons", "normalButtons");

    if (config.informationDistinction) {
        container.classList.add("groupedButtons");
    } else {
        container.classList.add("normalButtons");
    }

    normalBtn.textContent = "案内なし";

    normalBtn.addEventListener ("click", () => {
        setSelected(container, normalBtn);
        informationId = null;
        render();
    });

    container.appendChild(normalBtn);

    if (config.informationDistinction) {

        informationCategory.groups.forEach(group => {

            // ===== 無表示グループ =====
            if (group.name === "無表示") {

                group.items.forEach(info => {

                    const btn = document.createElement("button");

                    const label =
                        info.view?.full?.ja?.name ??
                        info.view?.full?.en?.name ??
                        info.view?.normal?.ja?.name ??
                        info.view?.normal?.en?.name ??
                        info.view?.small?.ja?.name ??
                        info.view?.small?.en?.name ??
                        info.name ??
                        "no-name";

                    btn.textContent = label;

                    btn.addEventListener("click", () => {
                        setSelected(container, btn);
                        informationId = info.id;
                        render();
                    });

                    container.appendChild(btn);
                });

                return;
            }

            // ===== 路線グループ =====

            const header = document.createElement("div");
            header.className = "groupHeader";
            header.textContent = "▶ " + group.name;

            const groupContainer = document.createElement("div");
            groupContainer.className = "groupButtons";
            groupContainer.hidden = true;

            header.addEventListener("click", () => {

                groupContainer.hidden = !groupContainer.hidden;

                header.textContent =
                    (groupContainer.hidden ? "▶ " : "▼ ") + group.name;

            });

            container.appendChild(header);
            container.appendChild(groupContainer);

            group.items.forEach(info => {

                const btn = document.createElement("button");

                const label =
                    info.view?.full?.ja?.name ??
                    info.view?.full?.en?.name ??
                    info.view?.normal?.ja?.name ??
                    info.view?.normal?.en?.name ??
                    info.view?.small?.ja?.name ??
                    info.view?.small?.en?.name ??
                    info.name ??
                    "no-name";

                btn.textContent = label;

                btn.addEventListener("click", () => {
                    setSelected(container, btn);
                    informationId = info.id;
                    render();
                });

            groupContainer.appendChild(btn);

            });

        });
    } else {
        const container = document.getElementById("informationButtons");

        const category = getCategory("information");

        category?.items.forEach(info => {

            const btn = document.createElement("button");
            const label =
                info.view?.full?.ja?.name ??
                info.view?.full?.en?.name ??
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
                render();
            });

            container.appendChild(btn);
        });
    }
}

function createInformation2Buttons() {

    const container = document.getElementById("information2Buttons");
    container.innerHTML = "";

    const informationCategory = getCategory("information2");
    if (!informationCategory) return;

    const normalBtn = document.createElement("button");
    container.classList.remove("groupedButtons", "normalButtons");

    if (config.information2Distinction) {
        container.classList.add("groupedButtons");
    } else {
        container.classList.add("normalButtons");
    }

    normalBtn.textContent = "案内2なし";

    normalBtn.addEventListener ("click", () => {
        setSelected(container, normalBtn);
        information2Id = null;
        render();
    });

    container.appendChild(normalBtn);

    if (config.information2Distinction) {

        informationCategory.groups.forEach(group => {

            // ===== 無表示グループ =====
            if (group.name === "無表示") {

                group.items.forEach(info => {

                    const btn = document.createElement("button");

                    const label =
                        info.view?.full?.ja?.name ??
                        info.view?.full?.en?.name ??
                        info.view?.normal?.ja?.name ??
                        info.view?.normal?.en?.name ??
                        info.view?.small?.ja?.name ??
                        info.view?.small?.en?.name ??
                        info.name ??
                        "no-name";

                    btn.textContent = label;

                    btn.addEventListener("click", () => {
                        setSelected(container, btn);
                        information2Id = info.id;
                        render();
                    });

                    container.appendChild(btn);
                });

                return;
            }

            // ===== 路線グループ =====

            const header = document.createElement("div");
            header.className = "groupHeader";
            header.textContent = "▶ " + group.name;

            const groupContainer = document.createElement("div");
            groupContainer.className = "groupButtons";
            groupContainer.hidden = true;

            header.addEventListener("click", () => {

                groupContainer.hidden = !groupContainer.hidden;

                header.textContent =
                    (groupContainer.hidden ? "▶ " : "▼ ") + group.name;

            });

            container.appendChild(header);
            container.appendChild(groupContainer);

            group.items.forEach(info => {

                const btn = document.createElement("button");

                const label =
                    info.view?.full?.ja?.name ??
                    info.view?.full?.en?.name ??
                    info.view?.normal?.ja?.name ??
                    info.view?.normal?.en?.name ??
                    info.view?.small?.ja?.name ??
                    info.view?.small?.en?.name ??
                    info.name ??
                    "no-name";

                btn.textContent = label;

                btn.addEventListener("click", () => {
                    setSelected(container, btn);
                    information2Id = info.id;
                    render();
                });

            groupContainer.appendChild(btn);

            });

        });
    } else {
        const container = document.getElementById("information2Buttons");

        const category = getCategory("information2");

        category?.items.forEach(info => {

            const btn = document.createElement("button");
            const label =
                info.view?.full?.ja?.name ??
                info.view?.full?.en?.name ??
                info.view?.normal?.ja?.name ??
                info.view?.normal?.en?.name ??
                info.view?.small?.ja?.name ??
                info.view?.small?.en?.name ??
                info.name ??
                "no-name";
                btn.textContent = label;

            btn.addEventListener ("click", () => {
                setSelected(container, btn);
                information2Id = info.id;
                render();
            });

            container.appendChild(btn);
        });
    }
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