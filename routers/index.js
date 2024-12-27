const { Router } = require("express");
const userRouter = require("./userRouter");
const panelCtrl = require("../controllers/panelController");
const router = Router();
router.use('/',userRouter);
router.get('/',panelCtrl.indexPage);
module.exports= router;