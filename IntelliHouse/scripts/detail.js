const lightsOn = document.getElementById("lightsOn");
const lightsOff = document.getElementById("lightsOff");

function setLights(type) {
    fetch(window.location.pathname, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            type: type
        })
    })
    .catch(err => console.log("Turning a light on/off failed"));
}

lightsOn.addEventListener("click", () => {
    if (!lightsOn.classList.contains("active")) {
        lightsOn.classList.add("active");
        lightsOff.classList.remove("active");

        setLights("lightsOn");
    }
});

lightsOff.addEventListener("click", () => {
    if (!lightsOff.classList.contains("active")) {
        lightsOff.classList.add("active");
        lightsOn.classList.remove("active");

        setLights("lightsOff");
    }
});

const heatingOn = document.getElementById("heatingOn");
const heatingOff = document.getElementById("heatingOff");
const heating = document.getElementById("heating");
const heatingSlider = document.getElementById("heatingSlider");
let heatingTemp = document.getElementById("heatingTemp");

function setThermostat(type) {
    fetch(window.location.pathname, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            type: type
        })
    })
    .catch(err => console.log("Turning a thermostat on/off failed"));
}

heatingOn.addEventListener("click", () => {
    if (!heatingOn.classList.contains("active")) {
        heatingOn.classList.add("active");
        heatingOff.classList.remove("active");
        heating.classList.remove("invisible");

        setThermostat("thermostatOn");
    }
});

heatingOff.addEventListener("click", () => {
    if (!heatingOff.classList.contains("active")) {
        heatingOff.classList.add("active");
        heatingOn.classList.remove("active");
        heating.classList.add("invisible");

        setThermostat("thermostatOff");
    }
});

heatingSlider.addEventListener("input", () => {
    heatingTemp.innerHTML = heatingSlider.value;
});

function setThermostatTemp(value) {
    fetch(window.location.pathname, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            type: "setThermostatTemp",
            value: value
        })
    })
    .catch(err => console.log("Setting a thermostat's heating temp failed"));
}

heatingSlider.addEventListener("mouseup", () => {
    setThermostatTemp(parseInt(heatingSlider.value));
});

const renameRoom = document.getElementById("renameRoom");
const newName = document.getElementById("newName");

renameRoom.addEventListener("click", () => {
    const name = newName.value.trim();
    
    if (name.length != 0) {
        fetch(window.location.pathname, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                type: "newName",
                value: name
            })
        })
        .then(() => window.location.replace(window.location.pathname))
        .catch(err => console.log("Renaming a room failed"));
    } else {
        alert("Pole pro název je prázdné.");
    }
});

const addRoom = document.getElementById("addRoom");
const delRoom = document.getElementById("delRoom");

addRoom.addEventListener("click", () => {
    fetch("/rooms", {
        method: "POST",
    })
    .then(res => res.json())
    .then(data => {
        window.location.replace("/rooms/" + data.id);
    })
    .catch(err => console.log("Creating a new room failed"));
});

delRoom.addEventListener("click", () => {
    const ans = confirm("Opravdu chcete danou místnost smazat?");
    
    if (ans) {
        fetch(window.location.pathname, {
            method: "DELETE",
        })
        .then(() => window.location.replace("/rooms"))
        .catch(err => console.log("Deleting a room failed"));
    }
});

const update = setInterval(updateValues, 1000);

let temp = document.getElementById("temp");
let consumption = document.getElementById("consumption");

function updateValues() {
    console.log(window.location.pathname);
    
    fetch(window.location.pathname + "/values", {
        method: "GET"
    })
    .then(res => res.json())
    .then(values => {
        temp.innerHTML = values.temp;
        consumption.innerHTML = values.consumption;
    })
    .catch(err => console.log("UpdateValues failed - IntelliHouse turned off"));
}