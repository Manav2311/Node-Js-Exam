const { Router } = require("express");
const userCtrl = require('../controllers/userController')
const userRouter = Router();

userRouter.get('/login',userCtrl.loginPage)

module.exports= userRouter;