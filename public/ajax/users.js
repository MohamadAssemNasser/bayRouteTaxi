$(document).ready(function () {
    loadPanelUsers()
})

function loadPanelUsers() {
    axios.get('http://localhost:3000/site/all-panel-users')
        .then((response) => {
            let users = response.data
            console.log(users)
            let tbody = ''
            $.each(users, (index, user) => {
                tbody += `
                <tr>
                    <th scope="row">${index + 1}</th>
                    <td>${user.firstName}</td>
                    <td>${user.lastName}</td>
                    <td>${user.email}</td>
                    <td>${user.phone}</td>
                    <td style="padding-top: 0pt;padding-bottom: 0pt; vertical-align: middle; text-align: center;">
                        <button onclick="editDialog(${index})" class="btn btn-sm btn-warning"><i style="color: white;" class="zmdi zmdi-hc-fw"></i> EDIT</button>
                        <button onclick="deleteDialog(${index})" class="btn btn-sm btn-danger"><i style="color: white;" class="zmdi zmdi-hc-fw"></i> DELETE</button>
                    </td>
                </tr>
                `
            })
            $('#usersTable > tbody').html(tbody)
        })
        .catch((error) => {
            // handle error
            console.log(error);
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
    email = $('#userEmail').val()
    password = $('#userPassword').val()
    role = $('#userRole').val()
    csrfToken = $('#csrfToken').val()
    clearErrors()
    axios.post('http://localhost:3000/site/add-panel-user', {
            firstName: firstName,
            lastName: lastName,
            phone: phone,
            email: email,
            password: password,
            role: role,
            _csrf: csrfToken
        })
        .then(function (response) {
            console.log(response)
            let data = response.data
            console.log(data)
            if (data.error) {
                return showErrors(data.validationErrors)
            }
            $('#addUserModal').modal('toggle')
            swal("The bus was deleted successfully!", {
                icon: "success",
            }).then(loadPanelUsers())
        })
        .catch(function (error) {
            console.log(error)
        });
}



// $.ajax({
//     url: 'http://18.188.194.167/removebus',
//     type: 'DELETE',
//     data: JSON.stringify({
//         "id": _id
//     }),
//     headers: {
//         "Content-Type": 'application/json',
//         Authorization: localStorage.getItem('token')
//     },
//     success: function(result) {
//         swal("The bus was deleted successfully!", {
//             icon: "success",
//           }).then(loadData())

//     },
//     error: (err) => swal(err)
// })