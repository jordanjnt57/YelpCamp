var express         = require('express'),
    app             = express(),
    bodyParser      = require('body-parser'),
    mongoose        = require('mongoose'),
    flash           = require('connect-flash'),
    methodOverride  = require('method-override'),
    Campground      = require('./models/campground'),
    Comment         = require('./models/comment'),
    seedDB          = require('./seeds'),
    passport        = require('passport'),
    LocalStrategy   = require('passport-local'),
    User            = require('./models/user');

//Requiring Routes
var commentRoutes   = require('./routes/comments')
    campgroundRoutes = require('./routes/campgrounds'),
    indexRoutes = require('./routes/index');


//mongoose.connect('mongodb://localhost:27017/yelp_camp', {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connect('mongodb://Jordan:Password@yelpcamp-shard-00-00-bedot.mongodb.net:27017,yelpcamp-shard-00-01-bedot.mongodb.net:27017,yelpcamp-shard-00-02-bedot.mongodb.net:27017/yelpcamp?ssl=true&replicaSet=yelpcamp-shard-0&authSource=admin&retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');     //This will automatically set the views for res.render to be of file type ejs
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());
// seedDB();        //Seed the database

// Passport Configuration\
app.use(require('express-session')({
    secret: "Jordan Is the best in the world",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
})

app.use(indexRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);
app.use('/campgrounds', campgroundRoutes);

app.listen(3000, function(){
    console.log('Yelp Camp Server has started');
});
