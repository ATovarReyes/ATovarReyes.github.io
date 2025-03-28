document.addEventListener("DOMContentLoaded", function () {
    const audio = document.getElementById("audio");
    const playButton = document.getElementById("playButton");
    const body = document.body;
    const header = document.querySelector("header");
    const footer = document.querySelector("footer");

    // Definimos colores según las frecuencias (Bajos, Medios, Agudos)
    let lowColors = ["#330000", "#661111", "#992222", "#BB3333"]; // Bajos
    let midColors = ["#003300", "#116611", "#229922", "#33BB33"]; // Medios
    let highColors = ["#000033", "#111166", "#222299", "#3333BB"]; // Agudos

    // Configuración del Análisis de Audio
    let context = new (window.AudioContext || window.webkitAudioContext)();
    let analyser = context.createAnalyser();
    let source = context.createMediaElementSource(audio);

    source.connect(analyser);
    analyser.connect(context.destination);
    analyser.fftSize = 512;

    let bufferLength = analyser.frequencyBinCount;
    let dataArray = new Uint8Array(bufferLength);

    function getAverageVolume(start, end) {
        let sum = 0;
        let count = end - start;
        for (let i = start; i < end; i++) {
            sum += dataArray[i];
        }
        return sum / count;
    }

    function changeBackground() {
        analyser.getByteFrequencyData(dataArray);

        let low = getAverageVolume(0, bufferLength * 0.2); // Bajos (0-20%)
        let mid = getAverageVolume(bufferLength * 0.2, bufferLength * 0.6); // Medios (20-60%)
        let high = getAverageVolume(bufferLength * 0.6, bufferLength); // Agudos (60-100%)

        let newColor;
        if (low > mid && low > high) {
            newColor = lowColors[Math.floor(Math.random() * lowColors.length)];
        } else if (mid > low && mid > high) {
            newColor = midColors[Math.floor(Math.random() * midColors.length)];
        } else {
            newColor = highColors[Math.floor(Math.random() * highColors.length)];
        }

        // Aplicar cambios de color
        body.style.backgroundColor = newColor;
        header.style.backgroundColor = newColor;
        footer.style.backgroundColor = newColor;

        // Transición suave
        body.style.transition = "background-color 1s";
        header.style.transition = "background-color 1s";
        footer.style.transition = "background-color 1s";

        requestAnimationFrame(changeBackground);
    }

    playButton.addEventListener("click", function () {
        if (audio.paused) {
            audio.play();
            context.resume();
            changeBackground(); // Inicia el cambio de colores
            playButton.textContent = "⏸ Pausar";
        } else {
            audio.pause();
            playButton.textContent = "▶ Reproducir";
        }
    });
});


