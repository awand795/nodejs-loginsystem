const express = require('express');
const router = express.Router();

router.get('/',(req,res)=>{
    res.render('dashboard/index');
});

router.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success_msg',"You're successfully logout");
    res.redirect('/');
})

module.exports = router;