const router = require('express').Router()

const apiUsersRouter = require('./api/apiUsers')
const apiOrdersRouter = require('./api/apiOrders')

router.use('/users',apiUsersRouter)
router.use('/orders',apiOrdersRouter)

module.exports=router