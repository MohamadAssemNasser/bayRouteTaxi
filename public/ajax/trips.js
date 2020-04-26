var from = {}
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

    $.each($('#tripFrom option'), (index, e) => {
        from[`${$(e).val()}`] = []
    })

    $('#addTrip').click(async() => {
        clearErrors()
        $(this).prop('disabled', true)
        let from, to, departureTime, arrivalTime, type, csrfToken
        from = $(`meta[name=${$('#tripFrom').val()}]`).attr('content')
        to = $(`meta[name=${$('#tripTo').val()}]`).attr('content')
        departureTime = $('#tripDepartureTime').val()
        arrivalTime = $('#tripArrivalTime').val()
        type = $('#tripType').val()
        csrfToken = $('#csrfToken').val()
        $('.LW').css('display', 'block')

        if (validate()) {
            try {
                let response = await axios({
                    method: 'post',
                    url: `${adminLink}/site/add-trip`,
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
                response = response.data
                $('.LW').css('display', 'none')
                $(this).prop('disabled', false)
                if (response.error) {
                    return showErrors(response.validationErrors)
                }
                swal("The Trip was added successfully!", {
                    icon: "success",
                }).then(renderCalendar($('#scheduleFrom > div > div > ul > .selected > a > .text').html()))
            } catch (err) {
                console.log(err)
            }
        }
    })
})

function showErrors(errors) {
    $.each(errors, (i, e) => {
        if (e.param === 'from') {
            $('#tripFrom').parent().parent().append(`<p class="text-danger" style="margin-bottom: 0px;">${e.msg}</p>`)
            $('#tripTo').parent().parent().append(`<p class="text-danger" style="margin-bottom: 0px;">${e.msg}</p>`)
        } else if (e.param === 'days') {
            $('#weekDays').parent().prepend(`<p class="text-danger" style="margin-bottom: 0px;">${e.msg}</p>`)
        } else if (e.param === 'departureTime') {
            $('#tripArrivalTime').parent().parent().append(`<p class="text-danger mb-1" style="margin-bottom: 0px;">${e.msg}</p>`)
            $('#tripDepartureTime').parent().parent().append(`<p class="text-danger mb-1" style="margin-bottom: 0px;">${e.msg}</p>`)
        }
    })
}

function clearErrors() {
    $(".text-danger").remove()
}


function validate(from, to, departureTime, arrivalTime, type) {
    return true
}

function createCalendar() {
    const date = new Date();
    let dd = date.getDate();
    let mm = date.getMonth() + 1; //January is 0
    const yyyy = date.getFullYear();

    if (dd < 10) { dd = '0' + dd }
    if (mm < 10) { mm = '0' + mm }

    let current = yyyy + '-' + mm + '-'
    const calendar = $('#calendar')
    console.log('current', current)

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
        eventLimit: true,
        events: []
    })
}

$(() => {
    createCalendar()
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

function regularTimeToMinutes(from, to) {
    from = regularTimeToMilitaryTime(from)
    from = timeToNumber(from)
    to = regularTimeToMilitaryTime(to)
    to = timeToNumber(to)
    let minutes = parseInt(to.slice(2)) + parseInt(to.slice(0, 2)) * 60
    minutes -= parseInt(from.slice(2)) + parseInt(from.slice(0, 2)) * 60
    console.log('minutes', minutes)
}

function handleData(data) {
    var m, t, w, r, f, s, u // days

    m = new Date()
    t = new Date()
    w = new Date()
    r = new Date()
    f = new Date()
    s = new Date()
    u = new Date()

    const today = m.getDay()

    m.setDate(m.getDate() - today + 1)
    t.setDate(t.getDate() - today + 2)
    w.setDate(w.getDate() - today + 3)
    r.setDate(r.getDate() - today + 4)
    f.setDate(f.getDate() - today + 5)
    s.setDate(s.getDate() - today + 6)
    u.setDate(u.getDate() - today)

    m = `${m.getFullYear()}-${(m.getMonth()+1 < 10) ? `0${m.getMonth()+1}` : `${m.getMonth()+1}`}-${(m.getDate() < 10) ? `0${m.getDate()}` : `${m.getDate()}`}`
    t = `${t.getFullYear()}-${(t.getMonth()+1 < 10) ? `0${t.getMonth()+1}` : `${t.getMonth()+1}`}-${(t.getDate() < 10) ? `0${t.getDate()}` : `${t.getDate()}`}`
    w = `${w.getFullYear()}-${(w.getMonth()+1 < 10) ? `0${w.getMonth()+1}` : `${w.getMonth()+1}`}-${(w.getDate() < 10) ? `0${w.getDate()}` : `${w.getDate()}`}`
    r = `${r.getFullYear()}-${(r.getMonth()+1 < 10) ? `0${r.getMonth()+1}` : `${r.getMonth()+1}`}-${(r.getDate() < 10) ? `0${r.getDate()}` : `${r.getDate()}`}`
    f = `${f.getFullYear()}-${(f.getMonth()+1 < 10) ? `0${f.getMonth()+1}` : `${f.getMonth()+1}`}-${(f.getDate() < 10) ? `0${f.getDate()}` : `${f.getDate()}`}`
    s = `${s.getFullYear()}-${(s.getMonth()+1 < 10) ? `0${s.getMonth()+1}` : `${s.getMonth()+1}`}-${(s.getDate() < 10) ? `0${s.getDate()}` : `${s.getDate()}`}`
    u = `${u.getFullYear()}-${(u.getMonth()+1 < 10) ? `0${u.getMonth()+1}` : `${u.getMonth()+1}`}-${(u.getDate() < 10) ? `0${u.getDate()}` : `${u.getDate()}`}`

    data.forEach(element => {
        element.days.forEach((day) => {
            let d, date
            switch (day) {
                case 'MONDAY':
                    d = 1
                    date = m
                    break
                case 'TUESDAY':
                    d = 2
                    date = t
                    break
                case 'WEDNESDAY':
                    d = 3
                    date = w
                    break
                case 'THURSDAY':
                    d = 4
                    date = r
                    break
                case 'FRIDAY':
                    d = 5
                    date = f
                    break
                case 'SATURDAY':
                    d = 6
                    date = s
                    break
                case 'SUNDAY':
                    d = 0
                    date = u
            }
            from[`${element.from}`].push({
                title: `${element.from} -> ${element.to}`,
                start: `${date}T${element.departureTime}:00`,
                end: `${date}T${element.arrivalTime}:00`,
                from: `${element.from}`,
                allDay: false,
                className: 'bg-success',
            })
        })
    })
}

function renderCalendar(departure){
    $('.LW').css('display', 'block')
    const calendar = $('#calendar')
    // calendar.fullCalendar('removeEventSources')
    calendar.fullCalendar( 'removeEvents', function(e){ return e.from != departure});
    from[`${departure}`].forEach( element => {
        calendar.fullCalendar('renderEvent', element, true)
    })
    $('.LW').css('display', 'none')
}

$('document').ready(() => {
    axios({
        method: 'get',
        url: `${adminLink}/site/trips`,
    }).then((response) => {
        handleData(response.data)
        renderCalendar($('#scheduleFrom > div > div > ul > .selected > a > .text').html())
        $('.LW').css('display', 'none')
    }).catch((err) => {
        console.log(err)
    })

    var before = $('#scheduleFrom > div > div > ul > .selected > a > .text').html()
    $('#scheduleFrom > div > div > ul > li').click(()=>{
        setTimeout(function(){ 
            let after = $('#scheduleFrom > div > div > ul > .selected > a > .text').html()
            if(before === after)
            return
            renderCalendar(after)
            before = after 
        }, 20);
    })
})