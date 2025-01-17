$(document).ready(function() {
    loadPanelTripTypes()
    $('#addTripType').click(() => {
        clearModalValues()
        $('.modal-footer .btn-primary').attr('onClick', 'addTripType()')
        $('.modal-footer .btn-primary').html('Add tripType')
            // $('#hideme').css('display', 'flex')
        $('.modal-header .title').html('Add a tripType')
        $('#tripTypeModal').modal('toggle')
    })
})

function clearModalValues() {
    clearErrors()
    $('#tripTypeName').val('')
    $('.filter-option.pull-left').html('')
    $('#tripTypePrice').val('')
    $('#tripTypeNumberOfSeats').val('')
}

function loadPanelTripTypes() {
    $('#stationsTable > tbody').html('<tr><td></td></tr>')
    $('.LW').css('display', 'block')
    let html = ''
    axios.get(`${adminLink}/site/all-tripTypes`)
        .then((response) => {
            let tripTypes = response.data
            console.log(tripTypes)
            $.each(tripTypes, (index, tripType) => {
                html += `
                <tr>
                    <th style="vertical-align: middle; text-align: center;" scope="row">${index + 1}</th>
                    <td style="vertical-align: middle; text-align: center;">${tripType.name}</td>
                    <td style="vertical-align: middle; text-align: center;">${tripType.deck}</td>
                    <td style="vertical-align: middle; text-align: center;">${tripType.ticketPrice}</td>
                    <td style="vertical-align: middle; text-align: center;">${tripType.numberOfSeats}</td>
                    <td style="padding-top: 0pt;padding-bottom: 0pt; vertical-align: middle; text-align: center;">
                        <button onclick="editTripTypeModal('${tripType._id}')" class="btn btn-sm btn-warning"><i style="color: white;" class="zmdi zmdi-hc-fw"></i> EDIT</button>
                        <button onclick="deleteTripType('${tripType._id}')" class="btn btn-sm btn-danger"><i style="color: white;" class="zmdi zmdi-hc-fw"></i> DELETE</button>
                    </td>
                </tr>
                `
            })
            return html
        })
        .then((html) => {
            $('#tripTypesTable > tbody').html(html)
            $('.LW').css('display', 'none')
        })
        .catch((error) => {
            // handle error
            console.log(error)
        })
}

function validateTripType() {
    return
}

function showErrors(errors) {
    $.each(errors, (i, e) => {
        if (e.param === 'name') {
            $('#tripTypeName').addClass('form-control-danger')
            $('#tripTypeNameError').html(`${e.msg}`)
            $('#tripTypeNameError').css('display', 'block')
        } else if (e.param === 'deck') {
            $('#tripTypeDeck').addClass('form-control-danger')
            $('#tripTypeDeckError').html(`${e.msg}`)
            $('#tripTypeDeckError').css('display', 'block')
        } else if (e.param === 'ticketPrice') {
            $('#tripTypePrice').addClass('form-control-danger')
            $('#tripTypePriceError').html(`${e.msg}`)
            $('#tripTypePriceError').css('display', 'block')
        } else if (e.param === 'numberOfSeats') {
            $('#tripTypeNumberOfSeats').addClass('form-control-danger')
            $('#tripTypeNumberOfSeatsError').html(`${e.msg}`)
            $('#tripTypeNumberOfSeatsError').css('display', 'block')
        }
    })
}

function clearErrors() {
    $('#tripTypeName').removeClass('form-control-danger')
    $('#tripTypeNameError').css('display', 'none')
    $('#tripTypeDeck').removeClass('form-control-danger')
    $('#tripTypeDeckError').css('display', 'none')
    $('#tripTypePrice').removeClass('form-control-danger')
    $('#tripTypePriceError').css('display', 'none')
    $('#tripTypeNumberOfSeats').removeClass('form-control-danger')
    $('#tripTypeNumberOfSeatsError').css('display', 'none')
}

function addTripType() {
    validateTripType()
    let name, deck, ticketPrice, numberOfSeats, csrfToken
    name = $('#tripTypeName').val()
    deck = $('#tripTypeDeck').val()
    ticketPrice = $('#tripTypePrice').val()
    numberOfSeats = $('#tripTypeNumberOfSeats').val()
    csrfToken = $('#csrfToken').val()
    $('#tripTypeModal .loader-wrapper').css('display', 'block')
    clearErrors()
    axios({
            method: 'post',
            url: `${adminLink}/site/add-tripType`,
            data: {
                name: name,
                deck: deck,
                ticketPrice: ticketPrice,
                numberOfSeats: numberOfSeats,
                _csrf: csrfToken
            }
        })
        .then((data) => {
            data = data.data
            console.log(data)
            $('#tripTypeModal .loader-wrapper').css('display', 'none')
            if (data.error) {
                return showErrors(data.validationErrors)
            }
            $('#tripTypeModal').modal('toggle')
            swal("The tripType was deleted successfully!", {
                icon: "success",
            }).then(loadPanelTripTypes())
        })
        .catch((error) => {
            console.log(error)
        })
}

function updateTripType(id) {
    validateTripType()
    $('#tripTypeModal .loader-wrapper').css('display', 'block')
    clearErrors()
    axios({
            method: 'put',
            url: `${adminLink}/site/update-tripType`,
            data: {
                _id: id,
                name: $('#tripTypeName').val(),
                deck: $('#tripTypeDeck').val(),
                ticketPrice: $('#tripTypePrice').val(),
                numberOfSeats: $('#tripTypeNumberOfSeats').val(),
                _csrf: $('#csrfToken').val()
            }
        })
        .then(async(data) => {
            data = data.data
            $('#tripTypeModal .loader-wrapper').css('display', 'none')
            if (data.error) {
                return showErrors(data.validationErrors)
            }
            await $('#tripTypeModal').modal('toggle')
            console.log('toggled update')
            swal("The tripType was updated successfully!", {
                icon: "success",
            }).then(loadPanelTripTypes())
        })
        .catch((error) => {
            swal("Oh noes!", "The AJAX request failed!", "error")
            console.log(error)
        })
}

async function editTripTypeModal(id) {
    $('.modal-footer .btn-primary').html('Save Changes')
    $('.modal-footer .btn-primary').attr('onClick', `updateTripType("${id}")`)
        // $('#hideme').css('display', 'none')
    $('.modal-header .title').html('Edit Trip Type')
    clearModalValues()
    $('#tripTypeModal').modal('toggle')
    $('#tripTypeModal .loader-wrapper').css('display', 'block')
    let trip = await axios.get(`${adminLink}/site/tripType/${id}`)
    trip = trip.data
    $('#tripTypeName').val(trip.name)
    $('.filter-option.pull-left').html(trip.deck)
    $('#tripTypeDeck').val(trip.deck)
    $('#tripTypePrice').val(trip.ticketPrice)
    $('#tripTypeNumberOfSeats').val(trip.numberOfSeats)
    $('#tripTypeModal .loader-wrapper').css('display', 'none')
}

function deleteTripType(_id) {
    swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this Trip Type!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
        .then((willDelete) => {
            if (willDelete) {
                let csrfToken = $('#csrfToken').val()
                return axios({
                    method: 'delete',
                    url: `${adminLink}/site/delete-tripType`,
                    data: {
                        _id: _id,
                        _csrf: csrfToken
                    },
                })
            } else {
                return false
            }
        })
        .then((response) => {
            if (response === false)
                return
            let data = response.data
            console.log(data['ok'])
            if (data['ok'] !== 1) {
                return swal("Oh noes!", "No Trip Type was found.", "error")
            }
            swal('Trip Type deleted Successfully!', {
                icon: "success",
            }).then(loadPanelTripTypes())
        })
        .catch((err) => {
            swal("Oh noes!", "The AJAX request failed!", "error")
            console.log(err)
        })
}