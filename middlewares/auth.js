exports.proceedIfLoggedIn = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect('/login')
    }
    next()
}

exports.preventIfLoggedIn = (req, res, next) => {
    if (req.session.isLoggedIn) {
        return res.redirect('/')
    }
    next()
}

exports.isAdmin = (req, res, next) => {
    if(req.user.role !== 'Administrator'){
        return res.redirect('/')
    }
    next()
}