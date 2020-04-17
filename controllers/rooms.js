const addRoom = document.getElementById("addRoom");
const delRoom = document.getElementById("delRoom");

addRoom.addEventListener("click", () => {
    fetch("/rooms", {
        method: "POST"
    })
    .then(res => res.json())
    .then(data => {
        window.location.replace("/rooms/" + data.id)
    });
});

delRoom.addEventListener("click", () => {
    alert("Vyberte místnost ke smazání.");
});