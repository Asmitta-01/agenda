
function loadCalendar(events) {
    var date = new Date();

    Array.from(document.querySelectorAll('#external-events div.external-event')).forEach(function (element) {
        // create an Event Object (http://arshaw.com/fullcalendar/docs/event_data/Event_Object/)
        // it doesn't need to have a start or end
        var eventObject = {
            title: $.trim($(element).text()) // use the element's text as the event title
        };

        // store the Event Object in the DOM element so we can get to it later
        $(element).data('eventObject', eventObject);
    });

    var locale = document.getElementsByTagName('html')[0].getAttribute('lang')

    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        locale: locale,
        themeSystem: 'bootstrap5',
        initialView: 'dayGridMonth',
        initialDate: date,
        headerToolbar: {
            left: 'prevYear prev',
            // left: 'prev,next today'
            center: 'title',
            // right: 'dayGridMonth,timeGridWeek,timeGridDay'
            right: 'next nextYear'
        },
        editable: true,
        firstDay: 1, //  1(Monday) this can be changed to 0(Sunday) for the USA system
        selectable: true,
        allDaySlot: false,
        select: function (start, end, allDay) {
            var title = prompt('Event Title:');
            if (title) {
                calendar.addEvent(
                    {
                        title: title,
                        start: date,
                        end: end,
                        allDay: allDay
                    }
                );
            }
            // calendar.calendar('unselect');
        },
        eventClick: (info) => {
            info.jsEvent.preventDefault(); // don't let the browser navigate
            console.log(info.el);
            var evtContainer = document.getElementById('eventInfo');
            evtContainer.innerHTML = info.el
        },
        events: events
    });

    calendar.render();
}
