var app = new Vue({
    el: '#app',
    data: {
        feedbacks: [],
        isLoading: true,
        name: '',
        email: '',
        subject: '',
        clientMessage: '',
        message: '',
        id: ''
    },
    methods: {
        reply(index) {
            app.name = app.feedbacks[index]['name']
            app.email = app.feedbacks[index]['email']
            app.clientMessage = app.feedbacks[index]['message']
            app.id = app.feedbacks[index]['_id']
            elmnt = document.getElementById("reply")
            elmnt.scrollIntoView({ behavior: "smooth", inline: "nearest" })
            console.log(index)
        },
        clear() {
            // this.name = ''
            // this.email = ''
            this.subject = ''
                // this.clientMessage = ''
            this.message = ''
        },
        sendReply: function() {
            sendReply()
        }
    },
    computed: {
        canSend: function() {
            if (this.name != '' && this.email != '' && this.subject != '' && this.message != '')
                return true
            return false
        }
    }
})

function sendReply() {
    swal({
            title: "Are you sure?",
            text: "You cannot unsend what has been sent...",
            icon: "info",
            buttons: true,
            dangerMode: true,
        })
        .then(async(willReset) => {
            if (willReset) {
                app.isLoading = true
                let response = await axios({
                    method: 'POST',
                    url: 'https://admin.assem-nasser.com/site/reply',
                    data: {
                        _csrf: $('#csrfToken').val(),
                        data: {
                            email: app.email,
                            name: app.name,
                            subject: app.subject,
                            message: app.message,
                            oldMessage: app.clientMessage,
                            id: app.id
                        }
                    }
                })
                response = response.data
                app.isLoading = false
                swal('Password reset successfully!', {
                    icon: "success",
                }).then(() => {
                    getFeedbacks()
                })
            }
        })
}

function resetInputs() {
    app.name = ''
    app.email = ''
    app.subject = ''
    app.clientMessage = ''
    app.message = ''
    app.id = ''
}

function reply(index) {
    app.name = feedbacks[index]['name']
    app.email = feedbacks[index]['email']
    app.message = feedbacks[index]['message']
}

$(document).ready(() => {
    getFeedbacks()
})
async function getFeedbacks() {
    app.isLoading = true
    try {
        let response = await axios({
            method: 'get',
            url: 'https://admin.assem-nasser.com/site/feedbacks/2',
        })
        response = response.data
        app.feedbacks = response
        console.log(app.feedbacks)
    } catch (err) {
        console.log(err)
    }
    app.isLoading = false
}