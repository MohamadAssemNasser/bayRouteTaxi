$('.LW').css('display', 'none')
var app = new Vue({
    el: '#form',
    data: {
        name: '',
        email: '',
        option: '',
        message: ''
    },
    methods: {
        sendFeedback: function(event) {
            sendFeedback(event)
        },
        l: function(event) {

            if (this.login == "" || this.senha == "") {

                this.log = "Preencha o campo para login.";
                event.preventDefault();
            } else {
                this.log = "Go";
            }
        }
    }

})

async function sendFeedback(event) {
    if (app.name == "" || app.email == "" || app.option == "" || app.message == "") {
        event.preventDefault()
    } else {
        event.preventDefault()
        let f = {
            _csrf: $('input[name=_csrf]').val(),
            name: app.name,
            email: app.email,
            option: app.option,
            message: app.message
        }
        $('.LW').css('display', 'block')
        axios({
                method: 'post',
                url: 'http://bayroute.taxi/feedback',
                data: f
            })
            .then((response) => {
                let data = response.data
                $('.LW').css('display', 'none')
                swal(data.message, {
                    icon: "success",
                })
                app.name = ''
                app.email = ''
                app.option = ''
                app.message = ''
            })
            .catch((error) => {
                console.log(error)
            })
    }
}