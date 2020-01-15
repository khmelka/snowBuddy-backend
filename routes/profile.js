const express = require('express')
const router = express.Router()
const config = require('config');
const auth  = require('../middleware/auth')
const Profile = require('../models/Profile')
const User = require('../models/User')
const {check, validationResult} = require('express-validator')

//get user's profile
router.get('/me', auth, async (req,res) => {
    try {
        const profile = await Profile.findOne({user: req.user.id}).populate('user', ['name', 'avatar']) 

        if (!profile) {
            return res.status(400).json({msg: 'No profile for this user'})
        }
        res.json(profile)
    } catch(error) {
        console.error(error.message)
        res.status(500).send('Server error')
    }
})

//post to create or update profie, PRIVATE
router.post('/', [auth, [
        check('location', 'Location is required')
        .not()
        .isEmpty(),
        check('sport', 'Sport field is required')
        .not()
        .isEmpty()
    ]
  ], 
async (req,res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }

    const {sport, skilevel, snblevel, bio, location, facebook, instagram} = req.body

    const profileFields = {}
    profileFields.user = req.user.id
    sport ? profileFields.sport = sport : profileFields.sport = null;
    skilevel ? profileFields.skilevel = skilevel : profileFields.skilevel = null;
    snblevel ? profileFields.snblevel = snblevel : profileFields.snblevel = null;
    location ? profileFields.location = location : profileFields.location = null;
    bio ? profileFields.bio = bio : profileFields.bio = null;
    facebook ? profileFields.facebook = facebook : profileFields.facebook = null;
    instagram ? profileFields.instagram = instagram : profileFields.instagram = null;


    // if (competitions) {profileFields.competitions = competitions.split(',').map(competition => 
    //     competition.trim())}    

    try {
        let profile = await Profile.findOne({user: req.user.id})
        if(profile){
            //update
           let  profile = await Profile.findOneAndUpdate(
                {user: req.user.id}, 
                {$set: profileFields}, 
                {new: true}
            )
            return res.json(profile)
        }
        //create
        profile = new Profile(profileFields)
        await profile.save()
        res.json(profile)

    } catch(error) {
        console.error(error.message)
        res.status(500).send('Server Error')
    }
    
})

//get all profiles
router.get('/', async (req,res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar'])
        res.json(profiles)
    } catch (error) {
        console.error(error.message)
        res.status(500).semd('Server Error')
    }
})
// router.get('/', (req,res) => res.send("profiles routes"))

// GET all profiles my user id
//user/:user_id
router.get('/user/:user_id', async (req,res) => {
   try {
       const profile = await Profile.findOne({user: req.params.user_id}).populate('user', ['name', 'avatar'])

       if(!profile) return res.status(400).json({msg: "Profile not found"})
           res.json(profile)
   } catch (error) {
       console.error(error.message)
       if(error.kind == 'ObjectId') {
           res.status(400).json({msg: "Profile not found"})
       }
       res.status(500).semd('Server Error')
   }
})

module.exports = router