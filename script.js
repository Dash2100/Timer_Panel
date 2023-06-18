let url = 'ws://localhost'
var ws = new WebSocket(url)

// 監聽連線狀態
ws.onopen = () => {
    //src2.innerHTML = "<h2>已與伺服器連線</h2>"
}
ws.onclose = () => {
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: '伺服器連線失敗，請重新整理頁面',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showCancelButton: false,
        showCloseButton: false,
        confirmButtonText: 'Reload',
    }).then((result) => {
        if (result.isConfirmed) {
            location.reload();
        }
    })
}

const Toast = Swal.mixin({
    toast: true,
    position: 'bottom-right',
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true
})

function validateInput(input) {
    if (parseInt(input.value) > 59) {
        input.value = '59';
    }
    if (input.value.length === 1) {
        input.value = '0' + input.value;
    }
    input.value = input.value.replace(/[^0-9]/g, '');

    updateTime()
}

function animateButtonClick(id) {
    var btn = document.getElementById(id);

    btn.style.transform = 'scale(0.95)';
    btn.style.opacity = '0.5';
    btn.style.transition = 'all 0.2s ease';

    setTimeout(function () {
        btn.style.opacity = '';
        btn.style.transform = '';
    }, 200);
}

function updateTime() {
    let min = document.getElementById("min").value;
    let sec = document.getElementById("sec").value;

    let time = parseInt(min) * 60 + parseInt(sec);
    ws.send(JSON.stringify({ get: "time", data: time }));
}

//setip function Swal.fire with input box to set ip adress
function setip() {
    Swal.fire({
        title: 'Enter IP address',
        input: 'text',
        inputAttributes: {
            autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Set',
        showLoaderOnConfirm: true,
        preConfirm: (ip) => {
            //check if ip is valid
            if (ip.match(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/)) {
                ws.send(JSON.stringify({ get: "setip", data: ip }));
                return ip;
            } else {
                Swal.showValidationMessage(
                    `Invalid IP address`
                )
            }
        },
    })
}

//接收 Server 發送的訊息
ws.onmessage = event => {
    let res = JSON.parse(event.data);
    if (res.get == "updatetime") {
        let number = formatSecond(res.data);
        console.log(number);
        let min = number.split(":")[0];
        let sec = number.split(":")[1];
        document.getElementById("min").value = min;
        document.getElementById("sec").value = sec;

    }
    if (res.get == "error") {
        Toast.fire({
            icon: 'error',
            title: res.data
        })
    }
}

function start() {
    document.getElementById("min").disabled = true;
    document.getElementById("sec").disabled = true;
    var btns = document.getElementsByClassName("btn");

    ws.send(JSON.stringify({ get: "start" }));
}

function stop() {
    document.getElementById("min").disabled = false;
    document.getElementById("sec").disabled = false;
    ws.send(JSON.stringify({ get: "stop" }));
}

function addtime(sec) {
    ws.send(JSON.stringify({ get: "add", data: sec }));
}

function subtime(sec) {
    ws.send(JSON.stringify({ get: "sub", data: sec }));
}

function formatSecond(seconds) {
    var minutes = Math.floor(seconds / 60); // 计算分钟数
    var remainingSeconds = seconds % 60; // 计算剩余的秒数

    var formattedMinutes = ('0' + minutes).slice(-2); // 格式化分钟数，确保始终有两位数字
    var formattedSeconds = ('0' + remainingSeconds).slice(-2); // 格式化秒数，确保始终有两位数字

    return formattedMinutes + ':' + formattedSeconds; // 返回格式化的分钟和秒数
}