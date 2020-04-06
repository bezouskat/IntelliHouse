const lightsOn = document.getElementById("lightsOn");
const lightsOff = document.getElementById("lightsOff");

function lightsEnable(enable) {
    fetch(window.location.pathname, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            lightsOn: enable
        })
    })
    .catch(err => console.log(err));
}

lightsOn.addEventListener("click", () => {
    if (!lightsOn.classList.contains("active")) {
        lightsOn.classList.add("active");
        lightsOff.classList.remove("active");

        lightsEnable(true);
    }
});

lightsOff.addEventListener("click", () => {
    if (!lightsOff.classList.contains("active")) {
        lightsOff.classList.add("active");
        lightsOn.classList.remove("active");

        lightsEnable(false);
    }
});

const heatingOn = document.getElementById("heatingOn");
const heatingOff = document.getElementById("heatingOff");
const heating = document.getElementById("heating");
const heatingSlider = document.getElementById("heatingSlider");
let heatingTemp = document.getElementById("heatingTemp");

function heatingEnable(enable) {
    fetch(window.location.pathname, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            heatingOn: enable
        })
    })
    .catch(err => console.log(err));
}

heatingOn.addEventListener("click", () => {
    if (!heatingOn.classList.contains("active")) {
        heatingOn.classList.add("active");
        heatingOff.classList.remove("active");
        heating.classList.remove("invisible");

        heatingEnable(true);
    }
});

heatingOff.addEventListener("click", () => {
    if (!heatingOff.classList.contains("active")) {
        heatingOff.classList.add("active");
        heatingOn.classList.remove("active");
        heating.classList.add("invisible");

        heatingEnable(false);
    }
});

heatingSlider.addEventListener("input", () => {
    heatingTemp.innerHTML = heatingSlider.value;
});

heatingSlider.addEventListener("mouseup", () => {
    fetch(window.location.pathname, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            heatingTemp: heatingSlider.value
        })
    })
    .catch(err => console.log(err));
});

const addRoom = document.getElementById("addRoom");
const delRoom = document.getElementById("delRoom");

addRoom.addEventListener("click", () => {
    fetch("/rooms", {
        method: "POST",
    })
    .then(res => res.json())
    .then(data => {
        window.location.replace("/rooms/" + data.newRoomId);
    })
    .catch(err => console.log(err));
});

delRoom.addEventListener("click", () => {
    const ans = confirm("Opravdu chcete danou místnost smazat?");
    
    if (ans) {
        fetch(window.location.pathname, {
            method: "DELETE",
        })
        .then(window.location.replace("/rooms"))
        .catch(err => console.log(err));
    }
});