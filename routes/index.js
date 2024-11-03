var express = require('express');
var router = express.Router();
var usermodel = require("./users");
const passport = require('passport');
const localStrategy = require('passport-local');
const upload = require("./multer")

passport.use(new localStrategy(usermodel.authenticate()))


// ye index page me jo form h usko show krne ke liye h 
router.get('/', function (req, res, next) {
  res.render('index');
});

router.get('/profile',isLoggedIn, async function (req, res, next) {
  let userdata = await usermodel.findOne({username:req.session.passport.user})
  res.render('profile',{userdata});
});

// router.get('/likes/:userid',isLoggedIn,async function(req, res, next) {
//   let liuser = await usermodel.findOne({username:req.session.passport.user})
//   // if(user.likes.indexOf(req.session.passport.user === -1)){
//     liuser.likes.push(req.session.passport.user)
//     await liuser.save()
//   // }
//   res.redirect("/profile")
// });

router.post('/register', function (req, res, next) {
  const userdets = new usermodel({
    email: req.body.email,
    username: req.body.username,
    // password: req.body.password,
    picture: req.body.picture,
  })
  usermodel.register(userdets, req.body.password)
    .then(function (user) {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/profile")
      })
    })
});

router.post('/login',passport.authenticate("local",{
  successRedirect:"/profile",
  failureRedirect:"/"
}) ,function (req, res, next) {  
});

router.get("/logout",function(req,res,next){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
})

function isLoggedIn (req,res,next){
  if(req.isAuthenticated()){
    return next()
  }
  else{
    res.redirect("/")
  }
}

router.post('/upload', isLoggedIn ,upload.single('image'), async function (req, res, next) {
  let imageupload = await usermodel.findOne({username:req.session.passport.user})
  imageupload.picture = req.file.filename,
  await imageupload.save()
  res.redirect('/profile');
});












// // ye rout h user ko create krne ke liye
// router.post('/re', async function(req, res, next) {
//   let crt = await usermodel.create({
//     username:req.body.username,
//     email:req.body.email,
//     password:req.body.password,
//     picture:req.body.picture,
//   })
//   res.redirect("/sh");
// });

// // ye rout h sare users ko show krne ke liye
// router.get('/sh', async function(req, res, next) {
//   let showuser = await usermodel.find()
//   res.render('show',{showuser});
// });

// // ye routs h users ke like badhane ke liye 
// router.get('/likes/:userid',async function(req, res, next) {
//   let liuser = await usermodel.findOne({_id:req.params.userid})
//   liuser.likes++
//   await liuser.save()
//   res.redirect('/sh')
// });


module.exports = router;
