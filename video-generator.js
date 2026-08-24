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
// CLOUDFLARE VIDEO API
// ======================================

const VIDEO_API =
    "https://creator-haven-api.smhealinghub.workers.dev/";


// ======================================
// GENERATE VIDEO
// ======================================

generateVideoButton.addEventListener("click", async function () {

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
        "⏳ Generating your video...";

    videoResultArea.innerHTML = `
        <div class="result-placeholder">

            <div class="result-icon">
                🎬
            </div>

            <h2>
                Creating your video...
            </h2>

            <p>
                This may take a little while.
                Please keep this page open.
            </p>

        </div>
    `;


    try {

        // Send request to Cloudflare Worker
        const response = await fetch(VIDEO_API, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                // IMPORTANT:
                // Tell Cloudflare this is a VIDEO request
                type: "video",

                prompt: prompt,

                size: size,

                duration: Number(videoDuration),

                style: style

            })

        });


        const data = await response.json();


        // Check API response
        if (!response.ok || !data.success) {

            throw new Error(
                data.error || "Video generation failed."
            );

        }


        // ======================================
        // DISPLAY VIDEO
        // ======================================

        videoResultArea.innerHTML = `

            <div class="result-placeholder">

                <div class="result-icon">
                    ✨
                </div>

                <h2>
                    Your video is ready!
                </h2>

                <video
                    controls
                    autoplay
                    loop
                    playsinline
                    style="
                        width: 100%;
                        max-width: 800px;
                        border-radius: 16px;
                        margin-top: 20px;
                    "
                    src="${data.video}">
                </video>

                <br><br>

                <a
                    href="${data.video}"
                    download
                    target="_blank"
                    class="tool-button">
                    ⬇️ Download Video
                </a>

            </div>

        `;

    }


    catch (error) {

        console.error(
            "Video generation error:",
            error
        );


        videoResultArea.innerHTML = `

            <div class="result-placeholder">

                <div class="result-icon">
                    ⚠️
                </div>

                <h2>
                    Video generation failed
                </h2>

                <p>
                    ${escapeHTML(error.message)}
                </p>

            </div>

        `;

    }


    // Reset button
    generateVideoButton.disabled = false;

    generateVideoButton.textContent =
        "🎬 Generate Video";

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
