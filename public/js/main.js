
const _url = document.forms.namedItem('event').getAttribute('action');
var url = _url;

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
                document.querySelectorAll('.evtinfo-p').forEach((elt) => {
                    if (elt.classList.contains('d-none'))
                        elt.classList.remove('d-none')
                })

                if (request.status == 200) {
                    var data = JSON.parse(request.response);
                    Object.entries(data).forEach(([key, value]) => {
                        document.getElementById(`eventInfo_${key}`).innerHTML = value;
                    })
                    document.getElementById('eventInfo_category').className = `p-2 rounded bg-opacity-100 ${data.className}`;
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
                const data = JSON.parse(request.response);
                if (url.includes('save')) {
                    calendar.addEvent(data);
                    newToast('The new event has been added', 'success');
                }
                else if (url.includes('update')) {
                    var id = document.getElementById('eventInfo_id').textContent;
                    var evt = calendar.getEventById(id);
                    Object.entries(data).forEach(([key, value]) => {
                        if (key == 'start')
                            evt.setStart(value);
                        else if (key = 'end')
                            evt.setEnd(value);
                        else
                            evt.setProp(key, value);
                    })
                    newToast('Successfully updated the event', 'success');
                }
            }
        } else {
            console.log(`Error: ${request.status} : ${request.response}`);
            newToast('An error occurs, failure', 'danger');
        }
    }
    request.open("POST", url);
    request.send(formData);
});

document.getElementById('deleteEvent').addEventListener('click', function (e) {
    if (confirm('Are you sure you want to delete this event ? ')) {
        var id = document.getElementById('eventInfo_id').textContent;
        const deleteText = e.currentTarget.innerHTML;
        e.currentTarget.innerHTML = '<span class="spinner-grow spinner-grow-sm mx-2"></span>';

        const request = new XMLHttpRequest();
        request.onload = function () {
            document.getElementById('eventInfo').innerHTML = evtInfo;
            document.getElementById('deleteEvent').innerHTML = deleteText;
            document.querySelectorAll('.evtinfo-p').forEach((elt) => {
                if (!elt.classList.contains('d-none'))
                    elt.classList.add('d-none')
            })

            if (request.status == 200) {
                if (calendar instanceof FullCalendar.Calendar) {
                    var evt = calendar.getEventById(id);
                    evt.remove();
                    newToast('The event has been deleted', 'info');
                }
            } else {
                console.log(`Error: ${request.status} : ${request.responseText}`);
                newToast('An error occurs while trying to delete the event', 'danger');
            }
        }
        request.open("POST", `/event/delete/${id}`);
        request.send();
    }
});

document.getElementById('editEvent').addEventListener('click', function (e) {
    var id = document.getElementById('eventInfo_id').textContent;
    if (calendar instanceof FullCalendar.Calendar) {
        var evt = calendar.getEventById(id);
    }

    if (typeof evt != 'undefined') {
        document.getElementById('event_title').value = evt.title;
        document.getElementById('event_description').value = document.getElementById('eventInfo_description').textContent;
        document.getElementById('event_launchedOn_month').value = evt.start.getMonth() + 1;
        document.getElementById('event_launchedOn_day').value = evt.start.getDate();
        document.getElementById('event_launchedOn_year').value = evt.start.getFullYear();
        document.getElementById('event_startHour_hour').value = evt.start.getHours();
        document.getElementById('event_startHour_minute').value = evt.start.getMinutes();
        document.getElementById('event_duration_days').value = ((evt.end - evt.start) / (1000 * 3600 * 24)).toFixed();
        document.getElementById('event_duration_hours').value = (((evt.end - evt.start) / (1000 * 3600) % 24)).toFixed();
        for (let index = 0; index < document.getElementById('event_category').length; index++) {
            var opt = document.getElementById('event_category').options[index];
            if (opt.textContent == document.getElementById('eventInfo_category').textContent)
                document.getElementById('event_category').value = index + 1;
        }

        url = `/event/update/${id}`;
        var el = bootstrap.Offcanvas.getOrCreateInstance('#eventForm');
        el.show();

        document.getElementById('eventForm').addEventListener('hidden.bs.offcanvas', function () {
            url = _url;
            document.forms.namedItem('event').reset();
        });
    }
});

var lang = document.querySelector('html').getAttribute('lang');
if (lang == 'fr') {
    var translatedToFr = {
        'Couldn\' load this event': "Impossible de charger cet événement",
        'The new event has been added': 'Le nouvel événement a été ajouté',
        'Successfully updated the event': "Mise à jour de l'événement avec succès",
        'An error occurs, failure': 'Une erreur s\'est produite, échec',
        'The event has been deleted': 'L\'événement a été supprimé',
        'An error occurs while trying to delete the event': "Une erreur s'est produite en essayant de supprimer l'événement"
    }
}
function newToast(message, _class = 'primary') {
    if (lang == 'fr' && typeof translatedToFr != 'undefined') {
        message = translatedToFr[message];
    }
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