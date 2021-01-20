let allStream;
let buf = [];
let mediaRecorder;

const checkboxer = document.querySelector("#idr");

setInterval(function () {
    console.warn("checkbox触发状态:" + checkboxer.checked);
}, 10000);
document.querySelector('#start').onclick = function () {
    if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
        if (checkboxer.checked) {
            navigator.mediaDevices.getDisplayMedia({
                video: true,
                audio: true
            }).then((stream) => {
                allStream = stream;
                document.querySelector("#player").srcObject = stream;
            }).catch((err) => {
                console.error("错误!", err);
            })
        } else {
            navigator.mediaDevices.getDisplayMedia({
                video: true,
                audio: false
            }).then((stream) => {
                allStream = stream;
                document.querySelector("#player").srcObject = stream;
            }).catch((err) => {
                console.error("错误!", err);
            })
        }
    } else {
        alert("不支持这个特性");
    }
}
document.querySelector('#record').onclick = function () {
    // 约束视频格式
    const options = {
        mimeType: 'video/webm;codecs=vp8'
    }
    // 判断是否是支持的mimeType格式
    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        console.error('不支持的视频格式');
        return;
    }
    try {
        mediaRecorder = new MediaRecorder(allStream, options);
        // 处理采集到的事件
        mediaRecorder.ondataavailable = function (e) {
            if (e && e.data && e.data.size > 0) {
                // 存储到数组中
                buf.push(e.data);
            }
        };
        // 开始录制
        mediaRecorder.start(10);
    } catch (e) {
        console.error(e);
    }
}
document.querySelector("#download").onclick = function () {
    mediaRecorder.stop();
    if (buf.length) {
        const blob = new Blob(buf, { type: "video/webm" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        let date = new Date();
        var downloadName = date.getFullYear().toString() + "_" + (date.getMonth + 1).toString() + "_" + date.getDate().toString() + "_Record_Video"
        a.href = url;
        a.style.display = "none";
        a.download = downloadName + ".webm"
        a.click();
    } else {
        alert("还没有录制任何内容")
    }
}
document.querySelector("#stop").onclick = function () {
    if (mediaRecorder) {
        mediaRecorder.stop();
    }
}
