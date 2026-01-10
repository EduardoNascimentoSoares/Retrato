function togglePopUp(idPopUp) {
    const playersConfigMenu = document.getElementById(idPopUp)
    playersConfigMenu.classList.toggle("hidden")

    const background = document.getElementById("backgound")
    background.classList.toggle("blur")
}