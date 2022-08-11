var hideButton;
window.onload = (e) => {
  let video = document.createElement("video");
  let canvas = document.getElementById("image-canvas");
  let ctx = canvas.getContext("2d");
  let msg = document.getElementById("QR-msg");
  let last_msg = "";
  let detect_QR = false;
  let startTick;
  let startTickId;
  const waitMsg = "Detecting QR-Code...";
  const canvasWrapper = document.getElementById("QR-wrapper");
  const buttonWrapper = document.getElementById("button-wrapper-add-cancel");
  const hideKey = [{ opacity: 1 }, { opacity: 0 }];
  const showKey = [{ opacity: 0 }, { opacity: 1 }];
  const options = { fill: "forwards", duration: 500, easing: "ease" };
  function showButton() {
    canvasWrapper.animate(hideKey, options);
    buttonWrapper.animate(showKey, options);
  }
  hideButton = function () {
    canvasWrapper.animate(showKey, options);
    buttonWrapper.animate(hideKey, options);
    startTickId = setInterval(startTick, 150);
  }

  const userMedia = { video: { facingMode: "environment" } };
  navigator.mediaDevices.getUserMedia(userMedia).then((stream) => {
    video.srcObject = stream;
    video.setAttribute("playsinline", true);
    video.play();
    msg.innerText = "Loading video...";
    startTickId = setInterval(startTick, 150);
  });

  startTick = function () {
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
        canvas.height = window_width * 0.8 / video_aspect;
      }
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      let img = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let code = jsQR(img.data, img.width, img.height, {
        inversionAttempts: "dontInvert",
      });
      if (code) {
        detect_QR = true;
        if (last_msg != code.data) {
          msg.innerText = code.data;
        }
        last_msg = code.data;
        clearInterval(startTickId);
        showButton();
      } else {
        if (!detect_QR) {
          if (last_msg != waitMsg) {
            msg.innerText = waitMsg;
          }
        }
      }
    }
  }
};