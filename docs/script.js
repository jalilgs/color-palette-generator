const generateBtn = document.getElementById("generate-btn")
const paletteContainer = document.querySelector(".palette-container")
const body = document.body
const saveBtn = document.getElementById("save-btn");
const savedPalettesContainer = document.getElementById("saved-palettes");
const animationToggle = document.getElementById("animation-toggle");
//__________________________________________________________________________________________________

function boxAnimation(){
    const allBoxes = document.querySelectorAll(".color-box");

const box1 = allBoxes[0];
const box2 = allBoxes[1];
const box3 = allBoxes[2];
const box4 = allBoxes[3];
const box5 = allBoxes[4];

const rect1 = allBoxes[0].getBoundingClientRect();
const rect2 = allBoxes[1].getBoundingClientRect();
const rect3 = allBoxes[2].getBoundingClientRect();
const rect4 = allBoxes[3].getBoundingClientRect();
const rect5 = allBoxes[4].getBoundingClientRect();

// For each box: how far LEFT/RIGHT (x) AND UP/DOWN (y) to reach Box 3
const box1X = rect3.left - rect1.left;
const box1Y = rect3.top - rect1.top;

const box2X = rect3.left - rect2.left;
const box2Y = rect3.top - rect2.top;

const box4X = rect3.left - rect4.left;
const box4Y = rect3.top - rect4.top;

const box5X = rect3.left - rect5.left;
const box5Y = rect3.top - rect5.top;

const timing = { duration: 1000, easing: "ease-in-out" };

box1.animate([
    { transform: "translate(0px, 0px)", offset: 0 },
    { transform: `translate(${box1X}px, ${box1Y}px)`, offset: 0.6 },
    { transform: "translate(0px, 0px)", offset: 1 }
], timing);

box2.animate([
    { transform: "translate(0px, 0px)", offset: 0 },
    { transform: "translate(0px, 0px)", offset: 0.3 },
    { transform: `translate(${box2X}px, ${box2Y}px)`, offset: 0.6 },
    { transform: "translate(0px, 0px)", offset: 1 }
], timing);

box4.animate([
    { transform: "translate(0px, 0px)", offset: 0 },
    { transform: "translate(0px, 0px)", offset: 0.3 },
    { transform: `translate(${box4X}px, ${box4Y}px)`, offset: 0.6 },
    { transform: "translate(0px, 0px)", offset: 1 }
], timing);

box5.animate([
    { transform: "translate(0px, 0px)", offset: 0 },
    { transform: `translate(${box5X}px, ${box5Y}px)`, offset: 0.6 },
    { transform: "translate(0px, 0px)", offset: 1 }
], timing);

box3.animate([
    { transform: "scale(1)", offset: 0 },
    { transform: "scale(1)", offset: 0.5 },
    { transform: "scale(1.15)", offset: 0.65 },
    { transform: "scale(1)", offset: 1 }
], timing);

}

animationToggle.title = animationToggle.checked
    ? "Disable animations"
    : "Enable animations";

animationToggle.addEventListener("change", function () {
    animationEnabled = animationToggle.checked;

    if (animationEnabled) {
        animationToggle.title = "Disable animations";
    } else {
        animationToggle.title = "Enable animations";
    }
});
//________________________________________________________________________
let savedPalettes = [];
let colors = [];

// Create the first palette
for (let i = 0; i < 5; i++) {
    colors.push(generateRandomColor());
}

// Show it
updatePaletteDisplay(colors);
// updateBgColor(colors);
// updateButton(colors);
// updateAccentColor(colors);

const colorValues = colors.map(color => color.value);

updateBgColor(colorValues);
updateButton(colorValues);
updateAccentColor(colorValues);

generateBtn.addEventListener("click", generatePalette)

paletteContainer.addEventListener("click",  function (e) {
    if(e.target.classList.contains("copy-btn")){
        const hexValue = e.target.previousElementSibling.textContent

        navigator.clipboard.writeText(hexValue).then(() => showCopySuccess(e.target)).catch((err) => console.log(err))
    }else if(e.target.classList.contains("color")){
        const hexValue = e.target.nextElementSibling.querySelector(".hex-value").textContent

        navigator.clipboard.writeText(hexValue).then(() => showCopySuccess(e.target.nextElementSibling.querySelector(".copy-btn")))
        .catch((err) => console.log(err))

    }
    if (e.target.classList.contains("lock-btn")) {
        const colorBox = e.target.closest(".color-box");
        const colorBoxes = document.querySelectorAll(".color-box");
        const index = [...colorBoxes].indexOf(colorBox);

        colors[index].locked = !colors[index].locked;

        e.target.classList.toggle("fa-lock");
        e.target.classList.toggle("fa-lock-open");
    }

});

document.addEventListener("keydown", function(e){
    if(e.code === "Space"){
        e.preventDefault()
        generatePalette()
    }
})

saveBtn.addEventListener("click", function(){
    const colorValues = colors.map(color => color.value);

    const isDuplicate = savedPalettes.some(palette =>
        palette.length === colorValues.length &&
        palette.every((hex, i) => hex === colorValues[i])
    );

    if(isDuplicate){
        saveBtn.style.opacity = "0.5";
        setTimeout(() => { saveBtn.style.opacity = ""; }, 300);
        return;
    }

    savedPalettes.push(colorValues)
    renderSavedPalettes()
})

savedPalettesContainer.addEventListener("click", function(e){
    if(e.target.classList.contains("saved-color")){
        const hexValue = e.target.textContent;

        navigator.clipboard.writeText(hexValue)
            .then(() => showSavedColorCopySuccess(e.target))
            .catch((err) => console.log(err));
    }
});

function showSavedColorCopySuccess(element){
    const originalText = element.textContent;
    element.textContent = "Copied!";

    setTimeout(() => {
        element.textContent = originalText;
    }, 1000);
}

function renderSavedPalettes(){
    savedPalettesContainer.innerHTML = "";
    savedPalettes.forEach(palette =>{
        const paletteDiv = document.createElement("div")
        paletteDiv.classList.add("saved-palette")
        
        savedPalettesContainer.appendChild(paletteDiv);
        palette.forEach(color=>{
            const colorDiv = document.createElement("div");
    colorDiv.classList.add("saved-color");
    colorDiv.style.backgroundColor = color;
    colorDiv.style.color = getContrastColor(color)
    colorDiv.textContent = color;
    colorDiv.title = "Click to copy";

    paletteDiv.appendChild(colorDiv);
            
        })
    })
}
//
renderSavedPalettes();

function getContrastColor(hex){
    const r = parseInt(hex.slice(1,3), 16);
    const g = parseInt(hex.slice(3,5), 16);
    const b = parseInt(hex.slice(5,7), 16);
    const luminance = (0.299*r + 0.587*g + 0.114*b) / 255;
    return luminance > 0.6 ? "rgba(0, 0, 0, 0.75)" : "rgba(255, 255, 255, 0.92)";
}

function showCopySuccess(element){
    element.classList.remove("far", "fa-copy")
    element.classList.add("fas", "fa-check")

    element.style.color = "#48bb78"

    setTimeout(() => {
        element.classList.add("far", "fa-copy")
        element.classList.remove("fas", "fa-check")
        element.style.color = "";
    }, 1500)
}

let animationEnabled = true;

function generatePalette(){
    
    // if (animationEnabled){
    //     boxAnimation()
    
    // for(let i=0; i<colors.length; i++){
    //     if(!colors[i].locked){
    //         colors[i]= generateRandomColor()
            
    //     }
    // }

    // setTimeout(() => {
    //     updatePaletteDisplay(colors);
    //     const colorValues = colors.map(color => color.value);

    //     updateBgColor(colorValues);
    //     updateButton(colorValues);
    //     updateAccentColor(colorValues);
    // }, 500);
    // }else{
     

    //     for(let i=0; i<colors.length; i++){
    //     if(!colors[i].locked){
    //         colors[i]= generateRandomColor()
            
    //         }
    //     }
    //     updatePaletteDisplay(colors);
    //     const colorValues = colors.map(color => color.value);

    //     updateBgColor(colorValues);
    //     updateButton(colorValues);
    //     updateAccentColor(colorValues);
    // }


    if (animationEnabled) {
        boxAnimation();
    }

    const delay = animationEnabled ? 500 : 0;

    setTimeout(() => {

        for (let i = 0; i < colors.length; i++) {
            if (!colors[i].locked) {
                colors[i] = generateRandomColor();
            }
        }

        updatePaletteDisplay(colors);

        const colorValues = colors.map(color => color.value);

        updateBgColor(colorValues);
        updateButton(colorValues);
        updateAccentColor(colorValues);

    }, delay);

    // updatePaletteDisplay(colors)
    
    // const colorValues = colors.map(color => color.value);

    // updateBgColor(colorValues);
    // updateButton(colorValues);
    // updateAccentColor(colorValues);
}


function generateRandomColor(){
    const letters = "0123456789ABCDEF"
    let color = {
        value: "#",
        locked: false,
    }

    for(let i=0; i<6; i++){
        color.value  += letters[Math.floor(Math.random() * 16)]
        color.locked = false
    }
    return color
}

function updatePaletteDisplay(colors){
    const colorBox = document.querySelectorAll(".color-box")

    colorBox.forEach((box, index) => {
        const color = colors[index].value
        const colorDiv = box.querySelector(".color")
        const hexValue = box.querySelector(".hex-value")

        colorDiv.style.backgroundColor = color;
        hexValue.textContent = color;
    });
}

function updateBgColor(colorValues){
    body.style.background =
        `linear-gradient(135deg, ${colorValues.join(", ")})`;
}

function updateButton(colorValues){
    generateBtn.style.background =
        `linear-gradient(45deg, ${colorValues[0]}, ${colorValues[2]})`;
    saveBtn.style.background =
        `linear-gradient(45deg, ${colorValues[1]}, ${colorValues[3]})`;
}

function updateAccentColor(colorValues){
    document.documentElement.style.setProperty(
        "--accent-color",
        colorValues[4]
    );
    document.documentElement.style.setProperty(
        "--toggle-color",
        colorValues[4]
    );
    document.documentElement.style.setProperty(
        "--toggle-border",
        colorValues[4]
    );

}
// generatePalette()
