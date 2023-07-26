const express = require('express');
const router = express.Router();
const Bookdetail = require('../models/bookdetails');
const Eventdetail = require('../models/eventdetails');
const Logindetail = require('../models/logindetails');
const multer = require('multer');
const fs = require('fs');

// image upload
var storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./uploads/');
    },
    filename: function(req,file,cb){
        cb(null,file.fieldname+"_"+Date.now()+"_"+file.originalname);
    },
});

var upload = multer({
    storage: storage
}).single('image');

//Insert an book into database
router.post('/addbook',upload,(req,res)=>{
    const bookdetail = new Bookdetail({
        bookid:req.body.id,
        bookname:req.body.name,
        author:req.body.author,
        department:req.body.dept,
        image:req.file.filename,
        status:req.body.status,
    });
    bookdetail.save((err)=>{
        if(err){
            res.json({message: err.message, type: 'danger'});
        }
        else{
            req.session.message= {
                type: 'success',
                message: 'Book Added Successfully'
            };
            res.redirect('/viewbook');
        }
    })
});

//Edit Book Details
router.get('/edit/:id', (req,res)=>{
    let id  =req.params.id;
    Bookdetail.findById(id,(err,bookdetail)=>{
        if(err){
            res.redirect('/viewbook');
        }
        else{
            if(bookdetail==null){
                res.redirect('/viewbook');
            }
            else{
                res.render('edit_book',{
                    title: 'Edit Book',
                    bookdetail: bookdetail,
                })
            }
        }
    })
});

//Update Book details
router.post('/update/:id', upload, (req,res)=>{
    let id=req.params.id;
    let new_image = "";

    if(req.file){
        new_image = req.file.filename;
        try{
            fs.unlinkSync('./uploads/'+req.body.old_image);
        }
        catch(err){
            if(err){
                console.log(err);
            }
        }
    }
    else{
        new_image = req.body.old_image;
    }
    Bookdetail.findByIdAndUpdate(id,{
        bookname:req.body.name,
        author:req.body.author,
        department:req.body.dept,
        image:new_image,
        status:req.body.status,
    }, (err,result)=>{
        if(err){
            res.json({message: err.message, type: 'danger'});
        }
        else{
            req.session.message = {
                type: 'success',
                message: "Book Updated Successfully",
            };
            res.redirect('/viewbook');
        }
    })
});

//Delete Book
router.get('/delete/:id',(req,res)=>{
    let id = req.params.id;
    Bookdetail.findByIdAndRemove(id,(err,result)=>{
        if(result.image!=""){
            try{
                fs.unlinkSync('./uploads/'+result.image);
            }
            catch(err){
                console.log(err);
            }
            if(err){
                res.json({message: err.message});
            }
            else{
                req.session.message = {
                    type: 'success',
                    message: "Book Deleted Successfully",
                }
            }
            res.redirect('/viewbook');
        }
    });
});

//Get all book route

router.get('/viewbook',(req,res)=>{
    Bookdetail.find().exec((err,bookdetails)=>{
        if(err){
            res.json({mesage: err.message});
        }
        else{
            res.render('CRUDbooks',{
                title:'Book Details',
                bookdetails: bookdetails,
            })
        }
    })
});

//View Book Details

router.get('/viewbookdetails',(req,res)=>{
    Bookdetail.find().exec((err,bookdetails)=>{
        if(err){
            res.json({mesage: err.message});
        }
        else{
            res.render('viewbookdetails',{
                title:'Books',
                bookdetails: bookdetails,
            })
        }
    })
});


//Insert Event Details

router.post('/addevent',upload,(req,res)=>{
    const eventdetail = new Eventdetail({
        eventid:req.body.eventid,
        eventname:req.body.eventname,
        eventdate:req.body.eventdate,
        venue:req.body.venue,
        organised:req.body.organised,
        department:req.body.department,
        description:req.body.description,
        image:req.file.filename,
    });
    eventdetail.save((err)=>{
        if(err){
            res.json({message: err.message, type: 'danger'});
        }
        else{
            req.session.message= {
                type: 'success',
                message: 'Event Added Successfully'
            };
            res.redirect('/viewevent');
        }
    })
});

// View Event Details

router.get('/viewevent',(req,res)=>{
    Eventdetail.find().exec((err,eventdetails)=>{
        if(err){
            res.json({mesage: err.message});
        }
        else{
            res.render('viewevents',{
                title:'Event Details',
                eventdetails: eventdetails,
            })
        }
    })
});

//Edit Event Details
router.get('/editevent/:id', (req,res)=>{
    let id  =req.params.id;
    Eventdetail.findById(id,(err,eventdetail)=>{
        if(err){
            res.redirect('/viewevent');
        }
        else{
            if(eventdetail==null){
                res.redirect('/viewevent');
            }
            else{
                res.render('edit_event',{
                    title: 'Edit Event',
                    eventdetail: eventdetail,
                })
            }
        }
    })
});

//Update Event Details

router.post('/updateevent/:id', upload, (req,res)=>{
    let id=req.params.id;
    let new_image = "";

    if(req.file){
        new_image = req.file.filename;
        try{
            fs.unlinkSync('./uploads/'+req.body.old_image);
        }
        catch(err){
            if(err){
                console.log(err);
            }
        }
    }
    else{
        new_image = req.body.old_image;
    }
    Bookdetail.findByIdAndUpdate(id,{
        eventname:req.body.eventname,
        eventdate:req.body.eventdate,
        venue:req.body.venue,
        organised:req.body.organised,
        department:req.body.department,
        description:req.body.description,
        image:new_image,
    }, (err,result)=>{
        if(err){
            res.json({message: err.message, type: 'danger'});
        }
        else{
            req.session.message = {
                type: 'success',
                message: "Event Updated Successfully",
            };
            res.redirect('/viewevent');
        }
    })
});

//Delete Events

router.get('/deleteevent/:id',(req,res)=>{
    let id = req.params.id;
    Eventdetail.findByIdAndRemove(id,(err,result)=>{
        if(result.image!=""){
            try{
                fs.unlinkSync('./uploads/'+result.image);
            }
            catch(err){
                console.log(err);
            }
            if(err){
                res.json({message: err.message});
            }
            else{
                req.session.message = {
                    type: 'success',
                    message: "Event Deleted Successfully",
                }
            }
            res.redirect('/viewevent');
        }
    });
});



//Insert Student Event Details

router.post('/studentaddevent',upload,(req,res)=>{
    const eventdetail = new Eventdetail({
        eventid:req.body.eventid,
        eventname:req.body.eventname,
        eventdate:req.body.eventdate,
        venue:req.body.venue,
        organised:req.body.organised,
        department:req.body.department,
        description:req.body.description,
        image:req.file.filename,
    });
    eventdetail.save((err)=>{
        if(err){
            res.json({message: err.message, type: 'danger'});
        }
        else{
            req.session.message= {
                type: 'success',
                message: 'Event Added Successfully'
            };
            res.redirect('/viewstudentevent');
        }
    })
});

// View Event Details

router.get('/viewstudentevent',(req,res)=>{
    Eventdetail.find().exec((err,eventdetails)=>{
        if(err){
            res.json({mesage: err.message});
        }
        else{
            res.render('studentviewevents',{
                title:'Event Details',
                eventdetails: eventdetails,
            })
        }
    })
});

//Edit Event Details
router.get('/studenteditevent/:id', (req,res)=>{
    let id  =req.params.id;
    Eventdetail.findById(id,(err,eventdetail)=>{
        if(err){
            res.redirect('/viewstudentevent');
        }
        else{
            if(eventdetail==null){
                res.redirect('/viewstudentevent');
            }
            else{
                res.render('studenteditevents',{
                    title: 'Edit Event',
                    eventdetail: eventdetail,
                })
            }
        }
    })
});

//Update Event Details

router.post('/studentupdateevent/:id', upload, (req,res)=>{
    let id=req.params.id;
    let new_image = "";

    if(req.file){
        new_image = req.file.filename;
        try{
            fs.unlinkSync('./uploads/'+req.body.old_image);
        }
        catch(err){
            if(err){
                console.log(err);
            }
        }
    }
    else{
        new_image = req.body.old_image;
    }
    Bookdetail.findByIdAndUpdate(id,{
        eventname:req.body.eventname,
        eventdate:req.body.eventdate,
        venue:req.body.venue,
        organised:req.body.organised,
        department:req.body.department,
        description:req.body.description,
        image:new_image,
    }, (err,result)=>{
        if(err){
            res.json({message: err.message, type: 'danger'});
        }
        else{
            req.session.message = {
                type: 'success',
                message: "Event Updated Successfully",
            };
            res.redirect('/viewstudentevent');
        }
    })
});

//Delete Events

router.get('/studentdeleteevent/:id',(req,res)=>{
    let id = req.params.id;
    Eventdetail.findByIdAndRemove(id,(err,result)=>{
        if(result.image!=""){
            try{
                fs.unlinkSync('./uploads/'+result.image);
            }
            catch(err){
                console.log(err);
            }
            if(err){
                res.json({message: err.message});
            }
            else{
                req.session.message = {
                    type: 'success',
                    message: "Event Deleted Successfully",
                }
            }
            res.redirect('/viewstudentevent');
        }
    });
});


//Get all book route

router.get('/viewbook',(req,res)=>{
    Bookdetail.find().exec((err,bookdetails)=>{
        if(err){
            res.json({mesage: err.message});
        }
        else{
            res.render('CRUDbooks',{
                title:'Book Details',
                bookdetails: bookdetails,
            })
        }
    })
});

//Display Events in Client

router.get('/vieweventdetails',(req,res)=>{
    Eventdetail.find().exec((err,eventdetails)=>{
        if(err){
            res.json({mesage: err.message});
        }
        else{
            res.render('clientevents',{
                title:'Books',
                eventdetails: eventdetails,
            })
        }
    })
});

//Login Post

router.post('/logininfo',(req,res)=>{
    const u = new Logindetail(req.body);
    console.log(u);
    u.save();
    Logindetail.findOne({email:u.email}).then(
        (result)=>{
            if(result!=null){
                if(result.password==u.password){
                    if(result.user=="Admin"){
                        return res.send("<script>alert('Logged in Successfully'); window.location.href = '/viewevent';</script>");
                    }
                    else if(result.user="Student"){
                        return res.send("<script>alert('Logged in Successfully'); window.location.href = '/viewstudentevent';</script>");
                    }
                    else{
                        return res.send("<script>alert('Not a User'); window.location.href = '/login';</script>");
                    }
                    
                }
                else{
                    return res.send("<script>alert('Incoorect Password'); window.location.href = '/login';</script>");
                }
            }
            else{
                return res.send("<script>alert('You dont have login credentials'); window.location.href = 'http://localhost:8080/';</script>");
            }
        }
    )
});

router.get('/addevent',(req,res)=>{
    res.render('addevents',{title:'Add Events'})
});

router.get('/addbook',(req,res)=>{
    res.render('add_book',{title:'Add Books'})
});

router.get('/login',(req,res)=>{
    res.render('login',{title:'Login'})
});

module.exports = router;