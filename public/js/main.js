
var calendar;
const evtInfo = document.getElementById('eventInfo').innerHTML;
function loadCalendar(events) {
    var date = new Date();
    var locale = document.getElementsByTagName('html')[0].getAttribute('lang')

    var calendarEl = document.getElementById('calendar');
    calendar = new FullCalendar.Calendar(calendarEl, {
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
        select: function (info) {
            var label = document.getElementById('eventLabel');
            const labelText = label.innerHTML;
            var prn = locale == 'en' ? 'on' : 'le';
            label.innerHTML += ` ${prn} ${info.start.toDateString()}`;

            document.getElementById('event_launchedOn_month').value = info.start.getMonth() + 1;
            document.getElementById('event_launchedOn_day').value = info.start.getDate();
            document.getElementById('event_launchedOn_year').value = info.start.getFullYear();
            var evtLaunchedOn = document.getElementById('event_launchedOn');
            var dateElt = document.createElement('div');
            dateElt.append(info.start.toDateString());
            dateElt.classList.add('fw-bold');
            evtLaunchedOn.appendChild(dateElt);
            evtLaunchedOn.children[1].classList.add('d-none');

            var el = new bootstrap.Offcanvas('#eventForm');
            el.show();

            document.getElementById('eventForm').addEventListener('hidden.bs.offcanvas', function () {
                label.innerHTML = labelText;
                evtLaunchedOn.removeChild(dateElt);
                evtLaunchedOn.children[1].classList.remove('d-none');
            });
            calendar.unselect();
        },
        eventClick: (info) => {
            // info.jsEvent.preventDefault(); // don't let the browser navigate
            document.getElementById('eventInfo').innerHTML = '<div class="spinner-grow spinner-grow-lg"></div>';

            const request = new XMLHttpRequest();
            request.onload = function () {
                document.getElementById('eventInfo').innerHTML = evtInfo;

                if (request.status == 200) {
                    var data = JSON.parse(request.response);
                    Object.entries(data).forEach(([key, value]) => {
                        document.getElementById(`eventInfo_${key}`).innerHTML = value;
                    })
                    document.getElementById('eventInfo_category').classList.add('text-bg-success');
                } else {
                    console.log(`Error: ${request.status}`, request.responseText);
                    newToast('Couldn\' load this event', 'danger');
                }
            }
            request.open("GET", `/event/${info.event.id}`);
            request.send();
        },
        events: events
    });

    calendar.render();
}

document.forms.namedItem('event').addEventListener('submit', function (e) {
    e.preventDefault();

    const submitText = document.getElementById('event_save').innerHTML;
    document.getElementById('event_save').innerHTML = '<span class="spinner-grow spinner-grow-sm mx-2"></span>';

    var formData = new FormData(this);
    const request = new XMLHttpRequest();
    request.onload = function () {
        document.getElementById('event_save').innerHTML = submitText;

        var el = bootstrap.Offcanvas.getOrCreateInstance('#eventForm');
        el.hide();

        if (request.status == 200) {
            if (calendar instanceof FullCalendar.Calendar) {
                calendar.addEvent(JSON.parse(request.response));
                newToast('The new event has been added', 'success');
            }
        } else {
            console.log(`Error: ${request.status} : ${request.responseText}`);
            newToast('An error occurs, failure', 'danger');
        }
    }
    request.open("POST", "/event/save");
    request.send(formData);
});


function newToast(message, _class = 'primary') {
    document.querySelector('.toast-body').innerHTML = message;
    const toastEl = document.querySelector('.toast');
    toastEl.classList.forEach((cls) => {
        if (cls.includes('text-bg')) {
            const classes = toastEl.className.split(" ").filter(c => !c.startsWith('text-bg'));
            toastEl.className = classes.join(" ").trim();
        }
    });
    toastEl.classList.add(`text-bg-${_class}`);
    var toast = bootstrap.Toast.getOrCreateInstance(toastEl);
    toast.show();
}