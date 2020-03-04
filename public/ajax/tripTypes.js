// http://3.20.90.158 for production
// http://localhost:3000 for development

$(document).ready(function () {
    loadPanelTripTypes()
    $('#addTripType').click(() => {
        clearModalValues()
        $('.modal-footer .btn-primary').attr('onClick', 'addTripType()')
        $('.modal-footer .btn-primary').html('Add tripType')
        $('#hideme').css('display', 'flex')
        $('.filter-option.pull-left').html('Data Entry')
        $('.modal-header .title').html('Add a tripType')
        $('#tripTypeModal').modal('toggle')
    })
})

function clearModalValues() {
    clearErrors()
    $('#tripTypeName').val('')
}

function loadPanelTripTypes() {
    $('#tripTypesTable > tbody').html('')
    $('#tripTypesTable > tbody').html(`
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
    $('#tripTypesTable .loader-wrapper').css('display', 'block')
    axios.get('http://localhost:3000/site/all-tripTypes')
        .then((response) => {
            console.log(response)
            let tripTypes = response.data
            let tbody = ''
            $.each(tripTypes, (index, tripType) => {
                tbody += `
                <tr>
                    <th scope="row">${index + 1}</th>
                    <td>${tripType.name}</td>
                    <td>${tripType.deck}</td>
                    <td>${tripType.price}</td>
                    <td>${tripType.numberOfSeats}</td>
                    <td style="padding-top: 0pt;padding-bottom: 0pt; vertical-align: middle; text-align: center;">
                        <button onclick="editTripTypeModal('${tripType._id}')" class="btn btn-sm btn-warning"><i style="color: white;" class="zmdi zmdi-hc-fw"></i> EDIT</button>
                        <button onclick="deleteTripType('${tripType._id}')" class="btn btn-sm btn-danger"><i style="color: white;" class="zmdi zmdi-hc-fw"></i> DELETE</button>
                    </td>
                </tr>
                `
            })
            $('#tripTypesTable .loader-wrapper').css('display', 'none')
            $('#tripTypesTable > tbody').html(tbody)
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
            $('#tripTypeNameError').html('<p class="text-danger" style="margin-bottom: 0px;">tripType already exist</p>')
        }
    })
}

function clearErrors() {
    $('#tripTypeName').removeClass('form-control-danger')
    $('#tripTypeNameError').html('')
}

function addTripType() {
    validateTripType()
    let name, csrfToken;
    name = $('#tripTypeName').val()
    csrfToken = $('#csrfToken').val()
    $('#tripTypeModal .loader-wrapper').css('display', 'block')
    clearErrors()
    axios({
            method: 'post',
            url: 'http://localhost:3000/site/add-tripType',
            data: {
                name: name,
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
            url: 'http://localhost:3000/site/update-tripType',
            data: {
                _id: id,
                name: $('#tripTypeName').val(),
                _csrf: $('#csrfToken').val()
            }
        })
        .then(async (data) => {
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
    $('#hideme').css('display', 'none')
    $('.modal-header .title').html('Edit tripType')
    clearModalValues()
    $('#tripTypeModal').modal('toggle')
    $('#tripTypeModal .loader-wrapper').css('display', 'block')
    let data = await axios.get(`http://localhost:3000/site/tripType/${id}`)
    data = data.data
    $('#tripTypeName').val(data.name)
    $('#tripTypeModal .loader-wrapper').css('display', 'none')
}

function deleteTripType(_id) {
    swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this tripType!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
        .then((willDelete) => {
            if (willDelete) {
                let csrfToken = $('#csrfToken').val()
                return axios({
                    method: 'delete',
                    url: 'http://localhost:3000/site/delete-tripType',
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
                return swal("Oh noes!", "No tripType was found.", "error");
            }
            swal('tripType deleted Successfully!', {
                icon: "success",
            }).then(loadPanelTripTypes())
        })
        .catch((err) => {
            swal("Oh noes!", "The AJAX request failed!", "error")
            console.log(err)
        })
}