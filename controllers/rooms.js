const addRoom = document.getElementById("addRoom");
const delRoom = document.getElementById("delRoom");

addRoom.addEventListener("click", () => {
    fetch("/rooms", {
        method: "POST",
    })
    .then(res => res.json())
    .then(data => {
        newRoomId = data.newRoomId;
        window.location.replace("/rooms/" + newRoomId)
    })
    .catch(err => console.log(err));
});

delRoom.addEventListener("click", () => {
    alert("Vyberte místnost ke smazání.");
});