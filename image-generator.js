// ======================================
// CREATOR HAVEN - IMAGE GENERATOR
// ======================================

const promptBox = document.getElementById("prompt");
const sizeSelect = document.getElementById("size");
const styleSelect = document.getElementById("style");
const generateButton = document.getElementById("generateButton");
const resultArea = document.getElementById("resultArea");


// ======================================
// GENERATE BUTTON
// ======================================

generateButton.addEventListener("click", function () {

    const prompt = promptBox.value.trim();
    const size = sizeSelect.value;
    const style = styleSelect.value;

    // Check if prompt is empty
    if (!prompt) {

        resultArea.innerHTML = `
            <div class="result-placeholder">

                <div class="result-icon">
                    💭
                </div>

                <h2>
                    Tell me what you imagine
                </h2>

                <p>
                    Enter a description above and we'll create it for you.
                </p>

            </div>
        `;

        promptBox.focus();

        return;
    }


    // Show generating state

    generateButton.disabled = true;

    generateButton.textContent =
        "⏳ Preparing your creation...";


    resultArea.innerHTML = `
        <div class="result-placeholder">

            <div class="result-icon">
                ✨
            </div>

            <h2>
                Preparing your image
            </h2>

            <p>
                Your image settings have been received.
            </p>

            <p>
                <strong>Prompt:</strong><br>
                ${escapeHTML(prompt)}
            </p>

            <p>
                <strong>Size:</strong>
                ${escapeHTML(size)}
            </p>

            <p>
                <strong>Style:</strong>
                ${escapeHTML(style)}
            </p>

            <p>
                🔧 AI image generation engine will be connected next.
            </p>

        </div>
    `;


    // Reset button

    setTimeout(function () {

        generateButton.disabled = false;

        generateButton.textContent =
            "✨ Generate Image";

    }, 1500);

});


// ======================================
// INSPIRATION BUTTONS
// ======================================

const inspirationButtons =
    document.querySelectorAll(".tip-grid button");


inspirationButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        const text = button.textContent;

        const cleanText = text
            .replace(/^[^\w]+/u, "")
            .trim();

        promptBox.value = cleanText;

        promptBox.focus();

    });

});


// ======================================
// SECURITY HELPER
// ======================================

function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}
