$(document).ready(function () {
    $('[data-cookie-string]')
        .on("click", function () {
            document.cookie = $(this).data('cookie-string');
            $("#cookieConsent").fadeOut("fast", function () {
                $("#cookieConsent").remove();
            });
        });
});