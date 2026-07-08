let vehicles = [];
let selectedVehicle = null;
let config = null;

async function loadVehicles() {
    const response = await fetch("vehicles/vehicles.json");
    vehicles = await response.json();

}

function createVehicleButtons() {

    const container = document.getElementById("vehicleSelect");

    container.innerHTML = "";

    vehicles.forEach(vehicle => {
        const btn = document.createElement("button");
        btn.textContent = vehicle.name;

        btn.addEventListener("click", async () => {

            selectedVehicle = vehicle;
            document.getElementById("vehicleSelector").hidden = true;
            document.getElementById("simulator").hidden = false;
            await startVehicle();
            initVehicles();
            
        });
        container.appendChild(btn);
    });
}

async function initVehicles() {
    await loadVehicles();
    createVehicleButtons();
}

initVehicles();