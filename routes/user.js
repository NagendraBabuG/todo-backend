const express = require('express')
const admin = require('../config/firebase')
const middleware = require('../middleware/index')


const router = express.Router()

router.use(middleware)


router.get('/getData', async (req, res)=> {
    const email = req.query.email
    if(!email) return res.status(404).json({status: 'error', data : 'missing data'})
    try{

        const db = admin.firestore()
        const query = db.collection('users').where('email', '==', email)
        const snapshot = await query.get()
        if(snapshot.empty)
        {
            return res.status(404).json({status: 'error', data : 'no data available'})
        }
        console.log('snapshot ', snapshot)
        return res.status(200).json({status : 'error', data : snapshot})
    }
    catch(error)
    {
        return res.status(404).json({status: 'error', error: error})
    }
})

router.put('/editData', async(req, res) => {
    try{
        const db = admin.firestore()
        const query = db.collection('users').where('email', '==', email)
        const snapshot = await query.get()
        if(snapshot.empty)
        {
            return res.status(404).json({status: 'error', data : 'no data available'})
        }

    }
    catch(error)
    {
        return res.status(404).json({status: 'error', error: error})
    }
})

module.exports = router