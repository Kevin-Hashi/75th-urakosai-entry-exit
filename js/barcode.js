var DetectedCount = 0, DetectedCode = "";
var video, tmp, tmp_ctx, jan, prev, prev_ctx, width, height, mwidth, mheight, x1, y1;
window.addEventListener('load', function (event) {
    video = document.createElement('video');
    video.setAttribute("autoplay", "");
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.onloadedmetadata = function (e) { video.play(); };
    prev = document.getElementById("preview");
    prev_ctx = prev.getContext("2d");
    tmp = document.createElement('canvas');
    tmp_ctx = tmp.getContext("2d");
    jan = document.getElementById("jan");


    navigator.mediaDevices.getUserMedia(

        { "audio": false, "video": { "facingMode": "environment", "width": { "ideal": 960 }, "height": { "ideal": 720 } } }
    ).then(
        function (stream) {
            video.srcObject = stream;

            setTimeout(Scan, 500, true);
        }
    ).catch(
        function (err) { jan.value += err + '\n'; }
    );

    function Scan(first) {
        if (first) {

            width = video.videoWidth;
            height = video.videoHeight;

            prev.style.width = (width / 2) + "px";
            prev.style.height = (height / 2) + "px";

            prev.setAttribute("width", width);
            prev.setAttribute("height", height);
            mwidth = width * 0.5;
            mheight = width * 0.2;
            x1 = (width - mwidth) / 2;
            y1 = (height - mheight) / 2;
        }
        prev_ctx.drawImage(video, 0, 0, width, height);
        prev_ctx.beginPath();
        prev_ctx.strokeStyle = "rgb(255,0,0)";
        prev_ctx.lineWidth = 2;
        prev_ctx.rect(x1, y1, mwidth, mheight);
        prev_ctx.stroke();
        tmp.setAttribute("width", mwidth);
        tmp.setAttribute("height", mheight);
        tmp_ctx.drawImage(prev, x1, y1, mwidth, mheight, 0, 0, mwidth, mheight);

        tmp.toBlob(function (blob) {
            let reader = new FileReader();
            reader.onload = function () {
                let config = {
                    decoder: {
                        readers: ["ean_reader", "ean_8_reader"],
                        multiple: false,
                    },
                    locator: { patchSize: "large", halfSample: false },
                    locate: false,
                    src: reader.result,
                };
                Quagga.decodeSingle(config, function () { });
            }
            reader.readAsDataURL(blob);
        });
        setTimeout(Scan, 50, false);
    }

    Quagga.onDetected(function (result) {

        if (DetectedCode == result.codeResult.code) {
            DetectedCount++;
        } else {
            DetectedCount = 0;
            DetectedCode = result.codeResult.code;
        }
        if (DetectedCount >= 3) {
            console.log(result.codeResult.code);
            jan.value += result.codeResult.code + '\n';
            jan.scrollTop = jan.scrollHeight;
            DetectedCode = '';
            DetectedCount = 0;
        }
    });
});