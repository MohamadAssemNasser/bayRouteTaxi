// http://admin.bayroute.taxi for production
// http://admin.bayroute.taxi for development

$(document).ready(function() {
    loadPanelStations()
    $('#addStation').click(() => {
        clearModalValues()
        $('.modal-footer .btn-primary').attr('onClick', 'addStation()')
        $('.modal-footer .btn-primary').html('Add Station')
        $('#hideme').css('display', 'flex')
        $('.filter-option.pull-left').html('Data Entry')
        $('.modal-header .title').html('Add a Station')
        $('#stationModal').modal('toggle')
    })
})

function clearModalValues() {
    clearErrors()
    $('#stationName').val('')
}

function loadPanelStations() {
    $('#stationsTable > tbody').html('')
    $('#stationsTable > tbody').html(`
    <tr>
        <td colspan="7">
            <div class="loader-wrapper" style="display: none;">
                <div class="loader">
                    <div class="m-t-30">
                        <img class="zmdi-hc-spin" src="assets/images/loader.svg" width="48" height="48" alt="Aero">
                    </div>
                    <p>Please wait...</p>
                </div>
            </div>
        </td>
    </tr>
    `)
    $('#stationsTable .loader-wrapper').css('display', 'block')
    axios.get('http://admin.bayroute.taxi/site/all-stations')
        .then((response) => {
            console.log(response)
            let stations = response.data
            let tbody = ''
            $.each(stations, (index, station) => {
                tbody += `
                <tr>
                    <th scope="row">${index + 1}</th>
                    <td>${station.name}</td>
                    <td style="padding-top: 0pt;padding-bottom: 0pt; vertical-align: middle; text-align: center;">
                        <button onclick="editStationModal('${station._id}')" class="btn btn-sm btn-warning"><i style="color: white;" class="zmdi zmdi-hc-fw"></i> EDIT</button>
                        <button onclick="deleteStation('${station._id}')" class="btn btn-sm btn-danger"><i style="color: white;" class="zmdi zmdi-hc-fw"></i> DELETE</button>
                    </td>
                </tr>
                `
            })
            $('#stationsTable .loader-wrapper').css('display', 'none')
            $('#stationsTable > tbody').html(tbody)
        })
        .catch((error) => {
            // handle error
            console.log(error)
        })

}

function validateStation() {
    return
}

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

async function addStation() {
    validateStation()
    let name, csrfToken;
    name = $('#stationName').val()
    csrfToken = $('#csrfToken').val()
    $('#stationModal .loader-wrapper').css('display', 'block')
    clearErrors()
    try {
        let data = await axios({
            method: 'post',
            url: 'http://admin.bayroute.taxi/site/add-station',
            data: {
                name: name,
                _csrf: csrfToken
            }
        })
        data = data.data
        console.log(data)
        $('#stationModal .loader-wrapper').css('display', 'none')
        if (data.error) {
            return showErrors(data.validationErrors)
        }
        $('#stationModal').modal('toggle')
        swal("The Station was deleted successfully!", {
            icon: "success",
        }).then(loadPanelStations())
    } catch (error) {
        console.log(error)
    }
}

async function updateStation(id) {
    validateStation()
    $('#stationModal .loader-wrapper').css('display', 'block')
    clearErrors()
    try {
        let data = await axios({
            method: 'put',
            url: 'http://admin.bayroute.taxi/site/update-station',
            data: {
                _id: id,
                name: $('#stationName').val(),
                _csrf: $('#csrfToken').val()
            }
        })
        data = data.data
        $('#stationModal .loader-wrapper').css('display', 'none')
        if (data.error) {
            return showErrors(data.validationErrors)
        }
        await $('#stationModal').modal('toggle')
        swal("The Station was updated successfully!", {
            icon: "success",
        }).then(loadPanelStations())
    } catch (error) {
        swal("Oh noes!", "The AJAX request failed!", "error")
        console.log(error)
    }
}

async function editStationModal(id) {
    $('.modal-footer .btn-primary').html('Save Changes')
    $('.modal-footer .btn-primary').click(() => {
        updateStation(id)
    })
    $('#hideme').css('display', 'none')
    $('.modal-header .title').html('Edit Station')
    clearModalValues()
    $('#stationModal').modal('toggle')
    $('#stationModal .loader-wrapper').css('display', 'block')
    let data = await axios.get(`http://admin.bayroute.taxi/site/station/${id}`)
    data = data.data
    $('#stationName').val(data.name)
    $('#stationModal .loader-wrapper').css('display', 'none')
}

function deleteStation(_id) {
    swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this Station!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
        .then((willDelete) => {
            if (willDelete) {
                let csrfToken = $('#csrfToken').val()
                return axios({
                    method: 'delete',
                    url: 'http://admin.bayroute.taxi/site/delete-station',
                    data: {
                        _id: _id,
                        _csrf: csrfToken
                    },
                })
            } else {
                return false;
            }
        })
        .then((response) => {
            if (response === false)
                return;
            let data = response.data
            console.log(data['ok'])
            if (data['ok'] !== 1) {
                return swal("Oh noes!", "No Station was found.", "error");
            }
            swal('Station deleted Successfully!', {
                icon: "success",
            }).then(loadPanelStations())
        })
        .catch((err) => {
            swal("Oh noes!", "The AJAX request failed!", "error")
            console.log(err)
        })
}