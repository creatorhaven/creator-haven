// ======================================
// CREATOR HAVEN - VIDEO GENERATOR
// ======================================

const videoPrompt = document.getElementById("videoPrompt");
const videoSize = document.getElementById("videoSize");
const duration = document.getElementById("duration");
const videoStyle = document.getElementById("videoStyle");

const generateVideoButton =
    document.getElementById("generateVideoButton");

const videoResultArea =
    document.getElementById("videoResultArea");


// ======================================
// GENERATE VIDEO
// ======================================

generateVideoButton.addEventListener("click", function () {

    const prompt = videoPrompt.value.trim();
    const size = videoSize.value;
    const videoDuration = duration.value;
    const style = videoStyle.value;


    // Check prompt

    if (!prompt) {

        videoResultArea.innerHTML = `
            <div class="result-placeholder">

                <div class="result-icon">
                    💭
                </div>

                <h2>
                    Tell me what you imagine
                </h2>

                <p>
                    Describe the video you want to create.
                </p>

            </div>
        `;

        videoPrompt.focus();

        return;
    }


    // Loading state

    generateVideoButton.disabled = true;

    generateVideoButton.textContent =
        "⏳ Preparing your video...";


    videoResultArea.innerHTML = `
        <div class="result-placeholder">

            <div class="result-icon">
                🎬
            </div>

            <h2>
                Your video idea is ready!
            </h2>

            <p>
                The video generation engine will be
                connected here next.
            </p>

            <p>
                <strong>Your prompt:</strong><br>
                ${escapeHTML(prompt)}
            </p>

            <p>
                <strong>Format:</strong>
                ${escapeHTML(size)}
                <br>

                <strong>Duration:</strong>
                ${escapeHTML(videoDuration)} seconds
                <br>

                <strong>Style:</strong>
                ${escapeHTML(style)}
            </p>

        </div>
    `;


    // Reset button

    setTimeout(function () {

        generateVideoButton.disabled = false;

        generateVideoButton.textContent =
            "🎬 Generate Video";

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

        videoPrompt.value = cleanText;

        videoPrompt.focus();

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
