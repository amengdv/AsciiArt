const fileSelector = document.getElementById("selector");
const generateButton = document.getElementById("generate");
const imgOrigin = document.getElementById("imgorigin");
const reader = new FileReader();

const canvas = document.querySelector("#asciiCanvas");
const ctx = canvas.getContext('2d');

let chosenImg;

const rangeSlider = document.getElementById("intensityAdjust");
const rangeVal = document.getElementById("val");

rangeVal.innerHTML = rangeSlider.value;

// normalize the grayscale value and multiply with the length
function grayscaleToAscii(val) {
    const asciiCharacters = "@%#*+=-:. ";
    let scaleIndex = Math.floor(val / 255 * (asciiCharacters.length - 1));
    return asciiCharacters[scaleIndex];
}

function grayscale(data) {
    for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = avg;
        data[i + 1] = avg;
        data[i + 2] = avg;
    }

    return data;
}

rangeSlider.addEventListener("input", () => {
    rangeVal.innerHTML =  rangeSlider.value;
});

// This event listener listened for when user upload a picture
fileSelector.addEventListener("change", (event) => {
    chosenImg = event.target.files[0];
    if (chosenImg) {

        reader.onload = () => {
            imgOrigin.src = reader.result;
        }

        reader.readAsDataURL(chosenImg);
    }
});

// This event listener listened for when user clicked generate button
generateButton.addEventListener("click", () => {
    canvas.width = imgOrigin.width;
    canvas.height = imgOrigin.height;

    let fontSize = rangeVal.innerHTML;
    
    ctx.drawImage(imgOrigin, 0, 0, canvas.width / fontSize, canvas.height  / fontSize);

    const imageData = ctx.getImageData(
        0, 0, canvas.width, canvas.height
    );

    const data = imageData.data;

    let gscaleData = grayscale(data);

    console.log(gscaleData);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = `${fontSize}px monospace`;

    let xInd = 0;
    for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
            xInd++;
            const r = gscaleData[xInd * 4];

            let ascii = grayscaleToAscii(r);

            ctx.fillText(ascii, x * fontSize, y * fontSize);
        }
    }
});
