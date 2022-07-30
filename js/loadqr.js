window.onload = (e) => {
    let video = document.createElement("video");
    let canvas = document.getElementById("image-canvas");
    let ctx = canvas.getContext("2d");
    let msg = document.getElementById("QR-msg");
    let last_msg = "";

    const userMedia = { video: { facingMode: "environment" } };
    navigator.mediaDevices.getUserMedia(userMedia).then((stream) => {
      video.srcObject = stream;
      video.setAttribute("playsinline", true);
      video.play();
      msg.innerText = "Loading video...";
      startTick();
    });

    function startTick() {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        const window_width = document.documentElement.clientWidth;
        const window_height = document.documentElement.clientHeight;
        const window_aspect = window_width * 0.8 / (window_height * 0.5);
        const video_aspect = video.videoWidth / video.videoHeight;
        if (window_aspect > video_aspect) {
            canvas.height = window_height * 0.5;
            canvas.width = window_height * 0.5 * video_aspect;
        } else {
            canvas.width = window_width * 0.8;
            canvas.height = window_width * 0.8 /video_aspect;
        }
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        let img = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let code = jsQR(img.data, img.width, img.height, {
          inversionAttempts: "dontInvert",
        });
        if (code) {
          //drawRect(code.location); // Rect
          if(last_msg!=code.data){
          msg.innerText = code.data; // Data
          }
          last_msg = code.data;
        } else {
          msg.innerText = "Detecting QR-Code...";
        }
      }
      setTimeout(startTick, 150);
    }

    function drawRect(location) {
      drawLine(location.topLeftCorner, location.topRightCorner);
      drawLine(location.topRightCorner, location.bottomRightCorner);
      drawLine(location.bottomRightCorner, location.bottomLeftCorner);
      drawLine(location.bottomLeftCorner, location.topLeftCorner);
    }

    function drawLine(begin, end) {
      ctx.lineWidth = 4;
      ctx.strokeStyle = "#FF3B58";
      ctx.beginPath();
      ctx.moveTo(begin.x, begin.y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
    }
  };