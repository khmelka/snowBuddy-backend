const express = require('express')
const router = express.Router()
const {check, validationResult} = require('express-validator')
const User = require('../models/User')
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')         
const config = require('config')

//endpoint POST api/users, PUBLIC
router.post('/', [
    check('name', 'Name is requires')
    .not()
    .isEmpty(),
    check('email', 'Please include a valid email address')
    .isEmail(),
    check('password', 'Please enter password with min 6 characters')
    .isLength({min:6})
],
async (req,res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }
    const {name, email, password} = req.body

    try {
        let user = await User.findOne( { email } )

        if (user){
            return res.status(400).json({errors: [{msg: "User already exists" }] })
        }

        const avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        })

        user = new User ({
            name,
            email,
            avatar,
            password
        })

        const salt = await bcrypt.genSalt(10)

        user.password = await bcrypt.hash(password, salt)
        await user.save()

        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(payload, config.get('jwtSecret'),{expiresIn: 360000},
        (error, token) => {
            if(error) return error
            res.json({token})
        })

    } catch (error) {
        console.error(error.message)
        res.status(500).send('dura')
    }

})

module.exports = router