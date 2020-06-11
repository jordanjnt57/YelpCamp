var express = require('express');
var router = express.Router();
var Campground = require('../models/campground');
var middleware = require('../middleware');


//index Route
router.get('/', function(req,res){

    //Get all campgrounds from db
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log('error');
        } else {
            res.render('campgrounds/index', {campgrounds:allCampgrounds});
        }
    });
      //  res.render('campgrounds', {campgrounds: campgrounds});
});

//Create Route
router.post('/', middleware.isLoggedIn,  function(req,res){
    var name        = req.body.name,
        image       = req.body.image,
        desc        = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name: name, image: image, description: desc, author: author} 
    // Create a new campground and save to db
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            res.redirect('/campgrounds');
        }
    })

})

//New Route
router.get('/new', middleware.isLoggedIn, function(req,res){
    res.render('campgrounds/new');
})

//SHOW - Shows more info about one campground
router.get('/:id', function(req, res){

    //find the campground with provided id
    Campground.findById(req.params.id).populate('comments').exec( function(err, foundCampground){
        if(err || !foundCampground){
            req.flash('error', "Campground not found");
            res.redirect('back');
        } else {
            res.render('campgrounds/show', {campground: foundCampground});
 
        }
    })
});

//Edit Campground Route
router.get('/:id/edit', middleware.checkCampgroundOwnership, function(req,res){
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render('campgrounds/edit', {campground: foundCampground});
    })
})

//Update Campground Route
router.put('/:id', middleware.checkCampgroundOwnership, function(req,res){
    //find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect('/campgrounds');
        } else {
    //redirect somewhere(show page)
            res.redirect('/campgrounds/' + req.params.id);
        }
    })
})

//Destroy Campground Route
router.delete('/:id', middleware.checkCampgroundOwnership, function(req,res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect('/campgrounds');
        } else {
            res.redirect('/campgrounds');
        }
    })
})




module.exports = router;