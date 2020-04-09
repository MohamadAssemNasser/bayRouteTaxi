// https://admin.assem-nasser.com for production
// http://admin.bayroute.taxi for development

$(document).ready(function() {
    var weekDays = []
    $.each($('#weekDays > li > a'), (index, day) => {
        $(day).click(() => {
            $(day).toggleClass('active')
            if ($(day).hasClass('active'))
                weekDays.push($(day).find('strong').html())
            else
                weekDays.splice(weekDays.indexOf($(day).find('strong').html()), 1)
        })
    })
    $('#addTrip').click(async() => {
        let from, to, departureTime, arrivalTime, type, csrfToken
        from = $(`meta[name=${$('#tripFrom').val()}]`).attr('content')
        to = $(`meta[name=${$('#tripTo').val()}]`).attr('content')
        departureTime = $('#tripDepartureTime').val()
        arrivalTime = $('#tripArrivalTime').val()
        type = $('#tripType').val()
        csrfToken = $('#csrfToken').val()

        if (validate()) {
            try {
                let response = await axios({
                    method: 'post',
                    url: 'http://admin.bayroute.taxi/site/add-trip',
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
            } catch (err) {
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

$(() => {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();

    console.log(today)

    if (dd < 10) { dd = '0' + dd }
    if (mm < 10) { mm = '0' + mm }

    var current = yyyy + '-' + mm + '-';
    var calendar = $('#calendar');
    console.log(current)

    // Add direct event to calendar
    var newEvent = (start) => {
            $('#addDirectEvent input[name="event-name"]').val("");
            $('#addDirectEvent select[name="event-bg"]').val("");
            $('#addDirectEvent').modal('show');
            $('#addDirectEvent .save-btn').unbind();
            $('#addDirectEvent .save-btn').on('click', () => {
                var title = $('#addDirectEvent input[name="event-name"]').val();
                var classes = 'bg-' + $('#addDirectEvent select[name="event-bg"]').val();
                if (title) {
                    var eventData = {
                        title: title,
                        start: start,
                        className: classes
                    };
                    calendar.fullCalendar('renderEvent', eventData, true);
                    $('#addDirectEvent').modal('hide');
                } else {
                    alert("Title can't be blank. Please try again.")
                }
            });
        }
        // initialize the calendar
    calendar.fullCalendar({
        header: {
            left: 'title',
            center: '',
            right: 'agendaWeek, agendaDay'
        },
        duration: {
            weeks: 1
        },
        defaultView: 'agendaWeek',
        eventLimit: true, // allow "more" link when too many events
        events: [{
                title: 'Birthday Party',
                start: current + '01',
                className: 'bg-info'
            },
            {
                title: 'Conference',
                start: current + '05',
                end: '2018-08-07',
                className: 'bg-warning'
            },
            {
                title: 'Meeting',
                start: current + '09T12:30:00',
                allDay: false, // will make the time show
                className: 'bg-success',
            }
        ],
    });
    $('#event-list').append('<div class="fc-event bg-info" data-class="bg-info">Nasser</div>');
})

function timeToNumber(time) {
    return time.replace(':', '')
}

function numberToTime(number) {
    return [number.slice(0, 2), ':', number.slice(2)].join('')
}

function regularTimeToMilitaryTime(time) {
    let m = time.slice(6, 8)
    time = time.slice(0, 5)
    console.log(time)
    if (m == 'pm') {
        if (time.slice(0, 2) == 12) {
            return time
        }
        time = parseInt(this.timeToNumber(time))
        return this.numberToTime(`${time+=1200}`)
    }
    time = this.timeToNumber(time)
    if (m == 'am' && time >= 1200) {
        return `00:${time%10}${Math.floor((time%100)/10)}`
    }
    return this.numberToTime(time)
}

function militaryTimeToMinutes(time) {
    let minutes = parseInt(time.slice(2))
    minutes += parseInt(time.slice(0, 2))
    console.log(minutes)
}

$('document').ready(() => {
    function addEvent(event) {
        let days = $('.fc-content-skeleton tr')
        let count = days[0]
        let events = days[1]
        console.log(days[1])
            // console.log(days[1].html())
    }
    addEvent()

    $('#test').click(async() => {
        console.log('Hello')
        try {
            // let response = await axios({
            //     method: 'get',
            //     url: 'http://admin.bayroute.taxi/site/trips',
            // })
            // console.log('response', response.data)
            console.log(militaryTimeToMinutes('1600'))
        } catch (err) {
            console.log(err)
        }
    })
})