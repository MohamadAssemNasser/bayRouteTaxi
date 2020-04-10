// http://3.20.90.158 for production
// https://admin.nasser-byeeklu.com for development

$(document).ready(function() {
    loadPanelUsers()
    $('#addUser').click(() => {
        clearModalValues()
        $('.modal-footer .btn-primary').attr('onClick', 'addUser()')
        $('.modal-footer .btn-primary').html('Add User')
        $('#hideme').css('display', 'flex')
        $('.filter-option.pull-left').html('Data Entry')
        $('.modal-header .title').html('Add a User')
        $('#userModal').modal('toggle')
    })
})

function clearModalValues() {
    clearErrors()
    $('#userFirstName').val('')
    $('#userLastName').val('')
    $('#userPhone').val('')
    $('#userEmail').val('')
    $('#userPassword').val('')
    $('.filter-option.pull-left').html('')
}

function loadPanelUsers() {
    $('#usersTable > tbody').html('')
    $('#usersTable > tbody').html(`
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
    $('#usersTable .loader-wrapper').css('display', 'block')
    axios.get('https://admin.nasser-byeeklu.com/site/all-panel-users')
        .then((response) => {
            let users = response.data
            let tbody = ''
            $.each(users, (index, user) => {
                tbody += `
                <tr>
                    <th scope="row">${index + 1}</th>
                    <td>${user.firstName}</td>
                    <td>${user.lastName}</td>
                    <td>${user.email}</td>
                    <td>${user.phone}</td>
                    <td>${user.role}</td>
                    <td style="padding-top: 0pt;padding-bottom: 0pt; vertical-align: middle; text-align: center;">
                        <button onclick="resetPassword('${user._id}')" class="btn btn-sm btn-info"><i style="color: white;" class="zmdi zmdi-hc-fw"></i> RESET PASSWORD</button>
                        <button onclick="editUserModal('${user._id}')" class="btn btn-sm btn-warning"><i style="color: white;" class="zmdi zmdi-hc-fw"></i> EDIT</button>
                        <button onclick="deleteUser('${user._id}')" class="btn btn-sm btn-danger"><i style="color: white;" class="zmdi zmdi-hc-fw"></i> DELETE</button>
                    </td>
                </tr>
                `
            })
            $('#usersTable .loader-wrapper').css('display', 'none')
            $('#usersTable > tbody').html(tbody)
        })
        .catch((error) => {
            // handle error
            console.log(error)
        })

}

async function resetPassword(id) {
    swal({
            title: "Are you sure?",
            text: "The password will be reset to '12345678'",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
        .then((willReset) => {
            if (willReset) {
                return axios({
                    method: 'put',
                    url: 'https://admin.nasser-byeeklu.com/site/reset-password',
                    data: {
                        _id: id,
                        _csrf: $('#csrfToken').val()
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
                return swal("Oh noes!", "No User was found.", "error");
            }
            swal('Password reset successfully!', {
                icon: "success",
            }).then(loadPanelUsers())
        })
        .catch((err) => {
            swal("Oh noes!", "The AJAX request failed!", "error")
            console.log(err)
        })
}

function validateUser() {
    return
}

function showErrors(errors) {
    $.each(errors, (i, e) => {
        if (e.param === 'firstName') {
            $('#userFirstName').addClass('form-control-danger')
            $('#firstNameError').html('<p class="text-danger" style="margin-bottom: 0px;">Enter a valid value</p>')
        } else if (e.param === 'lastName') {
            $('#userLastName').addClass('form-control-danger')
            $('#lastNameError').html('<p class="text-danger" style="margin-bottom: 0px;">Enter a valid value</p>')
        } else if (e.param === 'phone') {
            $('#userPhone').addClass('form-control-danger')
            $('#phoneError').html(`<p class="text-danger" style="margin-bottom: 0px;">${e.msg}</p>`)
        } else if (e.param === 'email') {
            $('#userEmail').addClass('form-control-danger')
            $('#emailError').html(`<p class="text-danger" style="margin-bottom: 0px;">${e.msg}</p>`)
        } else if (e.param === 'password') {
            $('#userPassword').addClass('form-control-danger')
            $('#passwordError').html(`<p class="text-danger" style="margin-bottom: 0px;">${e.msg}</p>`)
        } else if (e.param === 'role') {
            $('#userRole').addClass('form-control-danger')
            $('#roleError').html(`<p class="text-danger" style="margin-bottom: 0px;">${e.msg}</p>`)
        }
    })
}

function clearErrors() {
    $('#userFirstName').removeClass('form-control-danger')
    $('#firstNameError').html('')
    $('#userLastName').removeClass('form-control-danger')
    $('#lastNameError').html('')
    $('#userPhone').removeClass('form-control-danger')
    $('#phoneError').html('')
    $('#userEmail').removeClass('form-control-danger')
    $('#emailError').html('')
    $('#userPassword').removeClass('form-control-danger')
    $('#passwordError').html('')
    $('#userRole').removeClass('form-control-danger')
    $('#roleError').html('')
}

function addUser() {
    validateUser()
    let firstName, lastName, phone, email, password, role, csrfToken;
    firstName = $('#userFirstName').val()
    lastName = $('#userLastName').val()
    phone = $('#userPhone').val()
    phone = phone.split(/\s/).join('')
    email = $('#userEmail').val()
    password = $('#userPassword').val()
    role = $('#userRole').val()
    csrfToken = $('#csrfToken').val()
    $('#userModal .loader-wrapper').css('display', 'block')
    clearErrors()
    axios({
            method: 'post',
            url: 'https://admin.nasser-byeeklu.com/site/add-panel-user',
            data: {
                firstName: firstName,
                lastName: lastName,
                phone: phone,
                email: email,
                password: password,
                role: role,
                _csrf: csrfToken
            }
        })
        .then((response) => {
            let data = response.data
            $('#userModal .loader-wrapper').css('display', 'none')
            if (data.error) {
                return showErrors(data.validationErrors)
            }
            $('#userModal').modal('toggle')
            swal("The User was deleted successfully!", {
                icon: "success",
            }).then(loadPanelUsers())
        })
        .catch((error) => {
            console.log(error)
        })
}

async function updateUser(id) {
    validateUser()
    $('#userModal .loader-wrapper').css('display', 'block')
    clearErrors()
    try {
        let data = await axios({
            method: 'put',
            url: 'https://admin.nasser-byeeklu.com/site/update-panel-user',
            data: {
                _id: id,
                firstName: $('#userFirstName').val(),
                lastName: $('#userLastName').val(),
                phone: $('#userPhone').val(),
                email: $('#userEmail').val(),
                role: $('#userRole').val(),
                _csrf: $('#csrfToken').val()
            }
        })
        data = data.data
        $('#userModal .loader-wrapper').css('display', 'none')
        if (data.error) {
            return showErrors(data.validationErrors)
        }
        await $('#userModal').modal('toggle')
        swal("The User was updated successfully!", {
            icon: "success",
        }).then(loadPanelUsers())
    } catch (error) {
        swal("Oh noes!", "The AJAX request failed!", "error")
        console.log(error)
    }
}

async function editUserModal(id) {
    $('.modal-footer .btn-primary').html('Save Changes')
    $('.modal-footer .btn-primary').attr('onClick', `updateUser("${id}")`)
    $('#hideme').css('display', 'none')
    $('.modal-header .title').html('Edit User')
    clearModalValues()
    $('#userModal').modal('toggle')
    $('#userModal .loader-wrapper').css('display', 'block')
    let data = await axios.get(`https://admin.nasser-byeeklu.com/site/panel-user/${id}`)
    data = data.data
    $('#userFirstName').val(data.firstName)
    $('#userLastName').val(data.lastName)
    $('#userPhone').val(data.phone)
    $('#userEmail').val(data.email)
    $('#userPassword').val('')
    $('.filter-option.pull-left').html(data.role)
    $('#userRole').val(data.role)
    $('#userModal .loader-wrapper').css('display', 'none')
}

function deleteUser(_id) {
    swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this User!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
        .then((willDelete) => {
            if (willDelete) {
                let csrfToken = $('#csrfToken').val()
                return axios({
                    method: 'delete',
                    url: 'https://admin.nasser-byeeklu.com/site/delete-panel-user',
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
                return swal("Oh noes!", "No User was found.", "error");
            }
            swal('User deleted Successfully!', {
                icon: "success",
            }).then(loadPanelUsers())
        })
        .catch((err) => {
            swal("Oh noes!", "The AJAX request failed!", "error")
            console.log(err)
        })
}