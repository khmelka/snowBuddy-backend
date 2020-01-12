const mongoose = require('mongoose')
const ProlifeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    //in the user profile
      sport: {
        type: String,
        required: true
      },
      skilevel: {
        type: String,
        
      },
      snblevel: {
        type: String,
        
      },
      location: {
        type: String
      },
      bio: {
        type: String
      },
      facebook: {
        type: String
      },
      instagran: {
          type: String
      },
      date: {
        type: Date,
        default: Date.now
      }
})

module.exports = Profile = mongoose.model('profile', ProlifeSchema)