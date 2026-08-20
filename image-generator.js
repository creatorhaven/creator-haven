// ======================================
// CREATOR HAVEN - AI IMAGE GENERATOR
// ======================================

const promptBox = document.getElementById("prompt");
const sizeSelect = document.getElementById("size");
const styleSelect = document.getElementById("style");
const generateButton = document.getElementById("generateButton");
const resultArea = document.getElementById("resultArea");

const API_URL =
    "https://creator-haven-api.smhealinghub.workers.dev/";


// ======================================
// GENERATE IMAGE
// ======================================

generateButton.addEventListener("click", async function () {

    const prompt = promptBox.value.trim();
    const size = sizeSelect.value;
    const style = styleSelect.value;


    // Check prompt

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


    // Disable button

    generateButton.disabled = true;

    generateButton.textContent =
        "⏳ Creating your image...";


    resultArea.innerHTML = `
        <div class="result-placeholder">

            <div class="result-icon">
                🎨
            </div>

            <h2>
                Creating your image...
            </h2>

            <p>
                Please give Creator Haven a moment.
            </p>

        </div>
    `;


    try {

        // Add style to prompt

        const finalPrompt =
            `${prompt}. Style: ${style}.`;


        // Send request to Cloudflare Worker

const response = await fetch(API_URL, {

    method: "POST",

    headers: {
        "Content-Type": "application/json"
    },

    body: JSON.stringify({
        prompt: prompt,
        size: size,
        style: style
    })

});

const data = await response.json();


        // Check for API error

        if (!response.ok || !data.success) {

            throw new Error(
                data.error ||
                "Image generation failed."
            );

        }


        // Display generated image

        resultArea.innerHTML = `

            <div class="generated-result">

                <img
                    src="data:image/png;base64,${data.image}"
                    alt="${escapeHTML(prompt)}"
                    class="generated-image"
                >

                <div class="result-actions">

                    <a
                        href="data:image/png;base64,${data.image}"
                        download="creator-haven-image.png"
                        class="download-button"
                    >
                        ⬇️ Download Image
                    </a>

                    <button
                        class="create-again-button"
                        onclick="window.scrollTo({
                            top: 0,
                            behavior: 'smooth'
                        })"
                    >
                        ✨ Create Another
                    </button>

                </div>

            </div>

        `;


    } catch (error) {

        console.error(error);

        resultArea.innerHTML = `

            <div class="result-placeholder">

                <div class="result-icon">
                    ⚠️
                </div>

                <h2>
                    Something went wrong
                </h2>

                <p>
                    We couldn't create your image this time.
                </p>

                <p>
                    Please try again in a moment.
                </p>

            </div>

        `;

    }


    // Enable button again

    generateButton.disabled = false;

    generateButton.textContent =
        "✨ Generate Image";

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

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}
