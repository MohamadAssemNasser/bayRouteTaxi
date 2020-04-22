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
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
        .then(async(willReset) => {
            if (willReset) {
                app.isLoading = true
                let response = await axios({
                    method: 'POST',
                    url: 'http://admin.bayroute.taxi/site/reply',
                    data: {
                        _csrf: $('#csrfToken').val(),
                        data: {
                            receiver: app.email,
                            subject: app.subject,
                            message: app.message,
                            id: app.id
                        }
                    }
                })
                response = response.data
                app.feedbacks = response
                app.isLoading = false
                swal('Password reset successfully!', {
                    icon: "success",
                })
            } else {
                return swal("Oh noes!", "No User was found.", "error")
            }
        })
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
            url: 'http://admin.bayroute.taxi/site/feedbacks/1',
        })
        response = response.data
        app.feedbacks = response
        console.log(app.feedbacks)
    } catch (err) {
        console.log(err)
    }
    app.isLoading = false
}