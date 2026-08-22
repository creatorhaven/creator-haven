// ======================================
// CREATOR HAVEN - VIDEO GENERATOR
// ======================================

const API_URL =
    "https://creator-haven-api.smhealinghub.workers.dev/";

const videoPrompt =
    document.getElementById("videoPrompt");

const videoSize =
    document.getElementById("videoSize");

const duration =
    document.getElementById("duration");

const videoStyle =
    document.getElementById("videoStyle");

const generateVideoButton =
    document.getElementById("generateVideoButton");

const videoResultArea =
    document.getElementById("videoResultArea");


// ======================================
// GENERATE VIDEO
// ======================================

generateVideoButton.addEventListener("click", async function () {

    const prompt = videoPrompt.value.trim();
    const size = videoSize.value;
    const videoDuration = Number(duration.value);
    const style = videoStyle.value;


    // ======================================
    // CHECK PROMPT
    // ======================================

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


    // ======================================
    // LOADING STATE
    // ======================================

    generateVideoButton.disabled = true;

    generateVideoButton.textContent =
        "⏳ Creating your video...";

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

            <p>
                ✨ Your video is being generated with AI.
            </p>

        </div>
    `;


    try {

        // ======================================
        // SEND REQUEST TO CLOUDFLARE
        // ======================================

        const response = await fetch(API_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                type: "video",

                prompt: prompt,

                size: size,

                duration: videoDuration,

                style: style

            })

        });


        // ======================================
        // READ RESPONSE
        // ======================================

        const data = await response.json();


        // ======================================
        // CHECK ERROR
        // ======================================

        if (!response.ok || !data.success) {

            throw new Error(
                data.error ||
                "Video generation failed."
            );

        }


        // ======================================
        // CHECK VIDEO URL
        // ======================================

        if (!data.video) {

            throw new Error(
                "The video was generated but no video URL was returned."
            );

        }


        // ======================================
        // SHOW VIDEO
        // ======================================

        videoResultArea.innerHTML = `

            <div class="result-placeholder">

                <div class="result-icon">
                    ✨
                </div>

                <h2>
                    Your video is ready!
                </h2>

                <p>
                    ${escapeHTML(prompt)}
                </p>

                <video
                    controls
                    playsinline
                    style="
                        width: 100%;
                        max-width: 800px;
                        margin-top: 25px;
                        border-radius: 16px;
                        display: block;
                        margin-left: auto;
                        margin-right: auto;
                    "
                >

                    <source
                        src="${escapeHTML(data.video)}"
                        type="video/mp4"
                    >

                    Your browser does not support video playback.

                </video>


                <div style="margin-top: 25px;">

                    <a
                        href="${escapeHTML(data.video)}"
                        target="_blank"
                        rel="noopener"
                        class="tool-button"
                        style="
                            display: inline-block;
                            text-decoration: none;
                        "
                    >
                        ⬇️ Open / Download Video
                    </a>

                </div>


                <p style="margin-top: 20px;">

                    <strong>Format:</strong>
                    ${escapeHTML(size)}

                    <br>

                    <strong>Duration:</strong>
                    ${videoDuration} seconds

                    <br>

                    <strong>Style:</strong>
                    ${escapeHTML(style)}

                </p>

            </div>

        `;


    } catch (error) {

        console.error(
            "Video generation error:",
            error
        );


        // ======================================
        // ERROR MESSAGE
        // ======================================

        videoResultArea.innerHTML = `

            <div class="result-placeholder">

                <div class="result-icon">
                    ⚠️
                </div>

                <h2>
                    Video generation failed
                </h2>

                <p>
                    ${escapeHTML(
                        error.message ||
                        "Something went wrong."
                    )}
                </p>

                <p>
                    Please try again in a moment.
                </p>

            </div>

        `;

    }


    // ======================================
    // RESET BUTTON
    // ======================================

    generateVideoButton.disabled = false;

    generateVideoButton.textContent =
        "🎬 Generate Video";

});


// ======================================
// INSPIRATION BUTTONS
// ======================================

const inspirationButtons =
    document.querySelectorAll(
        ".tip-grid button"
    );


inspirationButtons.forEach(function (button) {

    button.addEventListener(
        "click",
        function () {

            const text =
                button.textContent;

            const cleanText =
                text
                    .replace(/^[^\w]+/u, "")
                    .trim();

            videoPrompt.value =
                cleanText;

            videoPrompt.focus();

        }
    );

});


// ======================================
// SECURITY HELPER
// ======================================

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent =
        String(text);

    return div.innerHTML;

}
