// $(function() {

//     enableDrag();

//     function enableDrag(){

//         $('#external-events .fc-event').each(function() {

//             $(this).data('event', {

//                 title: $.trim($(this).text()), // use the element's text as the event title

//                 stick: true // maintain when user navigates (see docs on the renderEvent method)

//             });



//             // make the event draggable using jQuery UI

//             $(this).draggable({

//                 zIndex: 999,

//                 revert: true,      // will cause the event to go back to its

//                 revertDuration: 0  //  original position after the drag

//             });

//         });

//     }



// $(".save-event").on('click', function() {

//     var categoryName = $('#addNewEvent form').find("input[name='category-name']").val();

//     var categoryColor = $('#addNewEvent form').find("select[name='category-color']").val();

//     if (categoryName !== null && categoryName.length != 0) {

//         $('#event-list').append('<div class="fc-event bg-' + categoryColor + '" data-class="bg-' + categoryColor + '">' + categoryName + '</div>');

//         $('#addNewEvent form').find("input[name='category-name']").val("");

//         $('#addNewEvent form').find("select[name='category-color']").val("");

//         enableDrag();

//     }

// });

$(function() {

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

    var newEvent = function(start) {

        $('#addDirectEvent input[name="event-name"]').val("");

        $('#addDirectEvent select[name="event-bg"]').val("");

        $('#addDirectEvent').modal('show');

        $('#addDirectEvent .save-btn').unbind();

        $('#addDirectEvent .save-btn').on('click', function() {

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

        events: [

            {

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

});

$('document').ready(() => {
    function addEvent(event) {
        let s = $('.fc-content-skeleton tr')
        let count = s[0]
        let events = s[1]
        console.log(days[1])
            // console.log(days[1].html())
    }
    addEvent()
})