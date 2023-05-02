const router = require('express').Router()
const auth = require("../middleware/auth")
const userCtrl = require("../controllers/userCtrl")


router.get('/search', auth, userCtrl.searchUser)

router.get('/user/:id', auth, userCtrl.getUser)

router.post('/user', auth, userCtrl.updateUser)

router.post('/user/:id/follow', auth, userCtrl.follow)
router.post('/user/:id/unfollow', auth, userCtrl.unfollow)

router.get('/suggestionsUser', auth, userCtrl.suggestionsUser)



module.exports = router