const express = require('express')
const admin = require('./config/firebase')
const cors = require('cors')
const PORT = process.env.PORT || 3001
const app = express()
app.use(cors())
app.use(express.json())
app.use('/api', require('./routes/user'))
app.post('/createUser', async(req, res) => {
    console.log(req.body, "body")
    const useremail = req.body.email, username = req.body.name, password = req.body.password

    if(!useremail || !username || !password) return res.status(404).json({status : 'error', data: "missing data"});

    let userAdded = undefined
    
    try{
        // make it like transaction
        // still u didn't add employee details for authentication
        userAdded = await admin.auth().createUser(
            {
                email: useremail,
                displayName: username,
                password: password, 
            })
            console.log(userAdded)
            const db = admin.firestore()
            const userRef = db.collection('users').doc(userAdded.uid);

            // Create the user document with some initial data
            await userRef.set({
              email: useremail,
              displayName:username,
              role: 'admin',
              todo: [],
              inProgress: [],
              done: [],
              createdAt: admin.firestore.FieldValue.serverTimestamp(),
              // Add any 
            })
        console.log(userAdded)
        res.status(200).json({status : 'success', data : userAdded})
        
    }
    catch(error)
    {
        console.log(error)
        if(error.code == 'auth/email-already-exists') return res.status(400).json({status : 'email already exits'})
        // If an error occurs during the transaction, delete the user in Firebase Authentication
        res.status(404).json({status : "error", data: error})   
    }

})

app.listen(PORT, ()=> {
    console.log(`server is running on ${PORT}`)
})