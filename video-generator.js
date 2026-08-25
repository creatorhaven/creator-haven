// ======================================
// CREATOR HAVEN - FREE VIDEO GENERATOR
// ======================================

// Your existing Cloudflare Worker
const VIDEO_API =
    "https://creator-haven-api.smhealinghub.workers.dev/";


// ======================================
// PAGE ELEMENTS
// ======================================

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
// CHECK PAGE ELEMENTS
// ======================================

if (
    !videoPrompt ||
    !videoSize ||
    !duration ||
    !videoStyle ||
    !generateVideoButton ||
    !videoResultArea
) {
    console.error(
        "Creator Haven: Video generator elements are missing from the page."
    );
}


// ======================================
// GENERATE VIDEO
// ======================================

if (generateVideoButton) {

    generateVideoButton.addEventListener(
        "click",
        async function () {

            const prompt =
                videoPrompt.value.trim();

            const size =
                videoSize.value;

            const videoDuration =
                Number(duration.value);

            const style =
                videoStyle.value;


            // ==================================
            // CHECK PROMPT
            // ==================================

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


            // ==================================
            // CHECK DURATION
            // ==================================

            if (
                videoDuration !== 5 &&
                videoDuration !== 10
            ) {

                videoResultArea.innerHTML = `
                    <div class="result-placeholder">

                        <div class="result-icon">
                            ⚠️
                        </div>

                        <h2>
                            Invalid duration
                        </h2>

                        <p>
                            Please choose 5 or 10 seconds.
                        </p>

                    </div>
                `;

                return;
            }


            // ==================================
            // LOADING STATE
            // ==================================

            generateVideoButton.disabled = true;

            generateVideoButton.textContent =
                "⏳ Creating your video...";


            videoResultArea.innerHTML = `
                <div class="result-placeholder">

                    <div class="result-icon">
                        ✨
                    </div>

                    <h2>
                        Creating your video...
                    </h2>

                    <p>
                        First we're creating your AI image,
                        then turning it into a short video.
                    </p>

                    <p>
                        Please keep this page open.
                    </p>

                </div>
            `;


            try {

                // ==================================
                // GENERATE AI IMAGE
                // ==================================

                const response =
                    await fetch(
                        VIDEO_API,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                type: "image",

                                prompt: prompt,

                                style: style

                            })
                        }
                    );


                const data =
                    await response.json();


                // ==================================
                // CHECK API RESPONSE
                // ==================================

                if (
                    !response.ok ||
                    !data.success ||
                    !data.image
                ) {

                    throw new Error(
                        data.error ||
                        "Image generation failed."
                    );

                }


                // ==================================
                // CREATE IMAGE DATA URL
                // ==================================

                const imageData =
                    "data:image/png;base64," +
                    data.image;


                // ==================================
                // SHOW VIDEO CREATION MESSAGE
                // ==================================

                videoResultArea.innerHTML = `
                    <div class="result-placeholder">

                        <div class="result-icon">
                            🎬
                        </div>

                        <h2>
                            Creating your video...
                        </h2>

                        <p>
                            Adding gentle cinematic movement.
                        </p>

                        <p>
                            Duration: ${videoDuration} seconds
                        </p>

                    </div>
                `;


                // ==================================
                // CREATE MOTION VIDEO
                // ==================================

                const videoBlob =
                    await createMotionVideo(
                        imageData,
                        size,
                        videoDuration
                    );


                // ==================================
                // CREATE VIDEO URL
                // ==================================

                const videoURL =
                    URL.createObjectURL(videoBlob);


                // ==================================
                // DISPLAY VIDEO
                // ==================================

                videoResultArea.innerHTML = `

                    <div class="result-placeholder">

                        <div class="result-icon">
                            ✨
                        </div>

                        <h2>
                            Your video is ready!
                        </h2>

                        <p>
                            Your free Creator Haven video
                            has been created.
                        </p>

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
                            src="${videoURL}">
                        </video>

                        <br>
                        <br>

                        <a
                            href="${videoURL}"
                            download="creator-haven-${videoDuration}s-video.webm"
                            class="tool-button">

                            ⬇️ Download Video

                        </a>

                        <p style="margin-top: 15px;">
                            Format: WebM · ${videoDuration} seconds
                        </p>

                    </div>

                `;

            }


            // ==================================
            // ERROR
            // ==================================

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
                            ${escapeHTML(
                                error.message ||
                                "Something went wrong."
                            )}
                        </p>

                    </div>

                `;

            }


            // ==================================
            // RESET BUTTON
            // ==================================

            generateVideoButton.disabled = false;

            generateVideoButton.textContent =
                "🎬 Generate Video";

        }
    );

}


// ======================================
// CREATE MOTION VIDEO
// ======================================

async function createMotionVideo(
    imageSrc,
    size,
    seconds
) {

    return new Promise(
        function (resolve, reject) {

            const image =
                new Image();


            // ==================================
            // IMAGE LOADED
            // ==================================

            image.onload =
                function () {

                    // ------------------------------
                    // VIDEO DIMENSIONS
                    // ------------------------------

                    let width = 1280;
                    let height = 720;


                    if (size === "portrait") {

                        width = 720;
                        height = 1280;

                    }


                    if (size === "square") {

                        width = 720;
                        height = 720;

                    }


                    // ------------------------------
                    // CREATE CANVAS
                    // ------------------------------

                    const canvas =
                        document.createElement(
                            "canvas"
                        );


                    canvas.width =
                        width;

                    canvas.height =
                        height;


                    const ctx =
                        canvas.getContext("2d");


                    if (!ctx) {

                        reject(
                            new Error(
                                "Could not create video canvas."
                            )
                        );

                        return;

                    }


                    // ------------------------------
                    // CREATE VIDEO STREAM
                    // ------------------------------

                    const stream =
                        canvas.captureStream(30);


                    // ------------------------------
                    // CREATE RECORDER
                    // ------------------------------

                    let recorder;


                    try {

                        recorder =
                            new MediaRecorder(
                                stream,
                                {
                                    mimeType:
                                        "video/webm;codecs=vp9"
                                }
                            );

                    }

                    catch (error) {

                        try {

                            recorder =
                                new MediaRecorder(
                                    stream,
                                    {
                                        mimeType:
                                            "video/webm"
                                    }
                                );

                        }

                        catch (secondError) {

                            reject(
                                new Error(
                                    "Your browser does not support WebM video recording."
                                )
                            );

                            return;

                        }

                    }


                    // ------------------------------
                    // VIDEO DATA
                    // ------------------------------

                    const chunks = [];


                    recorder.ondataavailable =
                        function (event) {

                            if (
                                event.data &&
                                event.data.size > 0
                            ) {

                                chunks.push(
                                    event.data
                                );

                            }

                        };


                    // ------------------------------
                    // VIDEO FINISHED
                    // ------------------------------

                    recorder.onstop =
                        function () {

                            const blob =
                                new Blob(
                                    chunks,
                                    {
                                        type:
                                            "video/webm"
                                    }
                                );


                            stream
                                .getTracks()
                                .forEach(
                                    function (track) {
                                        track.stop();
                                    }
                                );


                            resolve(blob);

                        };


                    // ------------------------------
                    // RECORDER ERROR
                    // ------------------------------

                    recorder.onerror =
                        function (event) {

                            reject(
                                event.error ||
                                new Error(
                                    "Video recording failed."
                                )
                            );

                        };


                    // ==================================
                    // START RECORDING
                    // ==================================

                    recorder.start();


                    // ==================================
                    // REAL TIME CONTROL
                    // ==================================

                    const startTime =
                        performance.now();


                    let stopped = false;


                    // ==================================
                    // ANIMATION
                    // ==================================

                    function animate(currentTime) {

                        if (stopped) {
                            return;
                        }


                        const elapsed =
                            currentTime -
                            startTime;


                        const progress =
                            Math.min(
                                elapsed /
                                (seconds * 1000),
                                1
                            );


                        // --------------------------
                        // DRAW FRAME
                        // --------------------------

                        drawFrame(progress);


                        // --------------------------
                        // STOP AT EXACT DURATION
                        // --------------------------

                        if (progress >= 1) {

                            stopped = true;


                            // Give the recorder
                            // the final frame.

                            setTimeout(
                                function () {

                                    if (
                                        recorder.state !==
                                        "inactive"
                                    ) {

                                        recorder.stop();

                                    }

                                },
                                50
                            );


                            return;

                        }


                        // --------------------------
                        // CONTINUE ANIMATION
                        // --------------------------

                        requestAnimationFrame(
                            animate
                        );

                    }


                    // ==================================
                    // DRAW FRAME
                    // ==================================

                    function drawFrame(progress) {

                        // --------------------------
                        // GENTLE CINEMATIC ZOOM
                        // --------------------------

                        const zoom =
                            1 +
                            (progress * 0.08);


                        // --------------------------
                        // SLOW HORIZONTAL MOVEMENT
                        // --------------------------

                        const moveX =
                            Math.sin(
                                progress *
                                Math.PI
                            ) * 20;


                        // --------------------------
                        // BACKGROUND
                        // --------------------------

                        ctx.fillStyle =
                            "#000000";

                        ctx.fillRect(
                            0,
                            0,
                            width,
                            height
                        );


                        // --------------------------
                        // IMAGE RATIO
                        // --------------------------

                        const imageRatio =
                            image.width /
                            image.height;


                        const canvasRatio =
                            width /
                            height;


                        let drawWidth;
                        let drawHeight;


                        // --------------------------
                        // CALCULATE IMAGE SIZE
                        // --------------------------

                        if (
                            imageRatio >
                            canvasRatio
                        ) {

                            drawHeight =
                                height *
                                zoom;

                            drawWidth =
                                drawHeight *
                                imageRatio;

                        }

                        else {

                            drawWidth =
                                width *
                                zoom;

                            drawHeight =
                                drawWidth /
                                imageRatio;

                        }


                        // --------------------------
                        // CENTER IMAGE
                        // --------------------------

                        const x =
                            (
                                width -
                                drawWidth
                            ) / 2 +
                            moveX;


                        const y =
                            (
                                height -
                                drawHeight
                            ) / 2;


                        // --------------------------
                        // DRAW IMAGE
                        // --------------------------

                        ctx.drawImage(
                            image,
                            x,
                            y,
                            drawWidth,
                            drawHeight
                        );

                    }


                    // ==================================
                    // START ANIMATION
                    // ==================================

                    requestAnimationFrame(
                        animate
                    );

                };


            // ==================================
            // IMAGE ERROR
            // ==================================

            image.onerror =
                function () {

                    reject(
                        new Error(
                            "Could not load generated image."
                        )
                    );

                };


            // ==================================
            // LOAD IMAGE
            // ==================================

            image.src =
                imageSrc;

        }
    );

}


// ======================================
// INSPIRATION BUTTONS
// ======================================

const inspirationButtons =
    document.querySelectorAll(
        ".tip-grid button"
    );


inspirationButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                const text =
                    button.textContent;


                const cleanText =
                    text
                        .replace(
                            /^[^\w]+/u,
                            ""
                        )
                        .trim();


                videoPrompt.value =
                    cleanText;


                videoPrompt.focus();

            }
        );

    }
);


// ======================================
// SECURITY HELPER
// ======================================

function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        text;


    return div.innerHTML;

}
