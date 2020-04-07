// http://3.20.90.158 for production
// http://admin.bayroute.taxi:3000 for development

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
    $('#addTrip').click(async () => {
        let from, to, departureTime, arrivalTime, type, csrfToken
        from = $(`meta[name=${$('#tripFrom').val()}]`).attr('content')
        to = $(`meta[name=${$('#tripTo').val()}]`).attr('content')
        departureTime = $('#tripDepartureTime').val()
        arrivalTime = $('#tripArrivalTime').val()
        type = $('#tripType').val()
        csrfToken = $('#csrfToken').val()
    
        if(validate()) {
            try{
                let response = await axios({
                    method: 'post',
                    url: 'http://admin.bayroute.taxi:3000/site/add-trip',
                    data: {
                        days: weekDays,
                        from: from,
                        to: to,
                        departureTime: departureTime,
                        arrivalTime: arrivalTime,
                        type: type,
                        _csrf: csrfToken
                    }
                })
                console.log(response)
            }
            catch(err){
                console.log(err)
            }
        }
    
    })
})

function showErrors(errors) {
    $.each(errors, (i, e) => {
        if (e.param === 'name') {
            $('#stationName').addClass('form-control-danger')
            $('#stationNameError').html('<p class="text-danger" style="margin-bottom: 0px;">Station already exist</p>')
        }
    })
}

function clearErrors() {
    $('#stationName').removeClass('form-control-danger')
    $('#stationNameError').html('')
}


function validate(from, to, departureTime, arrivalTime, type) {
    return true
}