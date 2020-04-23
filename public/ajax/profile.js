var app = new Vue({
    el: '#app',
    data: {
        editing: false,
        validForUpdate: true,
        action: 'View',
        firstName: $('meta[name=firstName]').attr('content'),
        lastName: $('meta[name=lastName]').attr('content'),
        email: $('meta[name=email]').attr('content'),
        phone: $('meta[name=phone]').attr('content'),
        password: '',
        confirmPassword: '',
        errors: {
            firstName: false,
            lastName: false,
            email: false,
            phone: false,
            changePassword: false,
            password: false
        },
    },
    methods: {
        startEditing: function() {
            this.editing = true
        },
        updateUser: updateUser,
        changePassword: changePassword,
        stopEditing: function() {
            this.editing = false
        }
    },
    watch: {
        editing: function(newValue) {
            this.action = this.editing ? 'Edit' : 'View'
        },
        firstName: function(newValue) {
            if (this.errors.firstName = validName(newValue))
                $('#firstName').addClass('form-control-danger')
            else
                $('#firstName').removeClass('form-control-danger')
        },
        lastName: function(newValue) {
            if (this.errors.lastName = validName(newValue))
                $('#lastName').addClass('form-control-danger')
            else
                $('#lastName').removeClass('form-control-danger')
        },
        email: function(newValue) {
            if (this.errors.email = validEmail(newValue))
                $('#email').addClass('form-control-danger')
            else
                $('#email').removeClass('form-control-danger')
        },
        phone: function(newValue) {
            if (this.errors.phone = validEmail(newValue))
                $('#phone').addClass('form-control-danger')
            else
                $('#phone').removeClass('form-control-danger')
        },
        password: function(newValue) {
            if (newValue === '') {
                $('#password').removeClass('form-control-danger')
                this.errors.password = false
            } else if (this.errors.password = (newValue.length < 8))
                $('#password').addClass('form-control-danger')
            else
                $('#password').removeClass('form-control-danger')
        },
        confirmPassword: function(newValue) {
            if (newValue === '') {
                $('#confirmPassword').removeClass('form-control-danger')
                this.errors.confirmPassword = false
            } else if (this.errors.confirmPassword = !(newValue == this.password))
                $('#confirmPassword').addClass('form-control-danger')
            else
                $('#confirmPassword').removeClass('form-control-danger')
        }
    }
})

// $(document).ready(() => {
//     $('.LW').css('display', 'none')
// })

async function changePassword() {
    axios({
            method: 'put',
            url: `https://admin.assem-nasser.com/site/reset-password/${$('meta[name=userId]').attr('content')}`,
            data: {
                password: app.password,
                confirmPassword: app.confirmPassword,
                _csrf: $('#csrfToken').val()
            },
        })
        .then((response) => {
            if (response.data.error)
                return swal("Oh noes!", "Invalid Data", "error")
            swal('Password Changed successfully!', {
                icon: "success",
            })
            app.password = ''
            app.confirmPassword = ''
        })
        .catch((err) => {
            swal("Oh noes!", "The AJAX request failed!", "error")
            console.log(err)
        })
}

async function updateUser() {
    $('#phone').removeClass('form-control-danger')
    app.errors.phone = false
    let user = {
        _id: $('meta[name=userId]').attr('content'),
        firstName: app.firstName,
        lastName: app.lastName,
        phone: $('#phone').val(),
        email: app.email,
        role: $('#role').val(),
        _csrf: $('#csrfToken').val()
    }
    if (!validateForm())
        return
    try {
        let data = await axios({
            method: 'put',
            url: `https://admin.assem-nasser.com/site/update-panel-user/${user._id}`,
            data: user
        })
        data = data.data
        if (data.error) {
            return showErrors(data.validationErrors)
        }
        data = await axios.get(`https://admin.assem-nasser.com/site/panel-user/${user._id}`)
        data = data.data
        app.firstName = data.firstName
        app.lastName = data.lastName
        app.email = data.email
        app.phone = data.phone
        swal("The User was updated successfully!", {
            icon: "success",
        })
        app.editing = false
    } catch (error) {
        swal("Oh noes!", "The AJAX request failed!", "error")
    }
}

function showErrors(errors) {
    $.each(errors, (i, e) => {
        switch (e.param) {
            case 'firstName':
                $('#firstName').addClass('form-control-danger')
                app.errors.firstName = true
                break
            case 'lastName':
                $('#lastName').addClass('form-control-danger')
                app.errors.laststName = true
                break
            case 'phone':
                $('#phone').addClass('form-control-danger')
                app.errors.phone = true
                break
            case 'email':
                $('#email').addClass('form-control-danger')
                app.errors.email = true
                break
        }
    })
}

function validateForm() {
    let isValid = true
    if (validName(app.firstName)) {
        app.errors.firstName = true
        isValid = false
    } else if (validName(app.lastName)) {
        app.errors.lastName = true
        isValid = false
    } else if (validEmail(app.email)) {
        app.errors.email = true
        isValid = false
    }
    return isValid
}

function validEmail(email) {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return !re.test(String(email).toLowerCase())
}

function validPhone(phone) {
    return !(/\d{2}[\s]?\d{3}[\s]?\d{3}$/.test(phone))
}

function validName(name) {
    return !(typeof name === "string" && name.length > 2 &&
        (name >= "a" && name <= "z" || name >= "A" && name <= "Z") && !/[0-9]/.test(name))
}