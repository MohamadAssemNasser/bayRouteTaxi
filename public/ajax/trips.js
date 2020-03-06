// http://3.20.90.158 for production
// http://localhost:3000 for development

$(document).ready(function () {
    var weekDays = []
    $.each($('#weekDays > li > a'), (index, day) => {
        $(day).click(() => {
            $(day).toggleClass('active')
            if($(day).hasClass('active'))
                weekDays.push($(day).find('strong').html())
            else
                weekDays.splice(weekDays.indexOf($(day).find('strong').html()), 1)
        })
    })
})