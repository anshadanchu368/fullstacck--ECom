const express =require('express')
const { subscribe } =require('../../controllers/shop/Nesletter-controller')

const router = express.Router()

router.post('/subscribe', subscribe)

module.exports=  router
