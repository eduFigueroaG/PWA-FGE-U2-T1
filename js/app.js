let url = window.location.href;
let swDirect = '/PWA-FGE-U2-T1/serviceWorker.js'

if (navigator.serviceWorker) {
    if (url.includes('localhost')) {
        swDirect = '/serviceWorker.js'
    }
    navigator.serviceWorker.register(swDirect)
} else {
    console.log("Cambia de navegador...")
}

let principal = $('#principal')
let notice = $('#notice')

$('.btn-follow').on('click', function (e) {
    e.preventDefault();
    principal.fadeOut(function () {
        notice.slideDown(1000)
    })

})
$('.btn-back').on('click', function (e) {
    e.preventDefault();

    notice.fadeOut(function () {
        principal.slideDown(1000);
    })
})