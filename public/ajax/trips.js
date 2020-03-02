// http://3.20.90.158 for production
// http://localhost:3000 for development

$(document).ready(function () {
    $.each($('#weekDays > li > a'), (index, day) => {
        $(day).click(() => {
            $(day).toggleClass('active')
        })
    })
})