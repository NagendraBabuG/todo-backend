const express = require('express')
const admin = require('../config/firebase')
const middleware = require('../middleware/index')


const router = express.Router()

router.use(middleware)
// router.use((req, res, next)=>{
//     next()
// })

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
        const docId = snapshot.docs[0].id;
        //console.log('docId ', docId)
        //console.log(snapshot.docs)
        snapshot.forEach((doc)=> {
            console.log(`${doc.id} = ${JSON.stringify(doc.data())}`)
        })
        const user = {
            id : snapshot.docs[0].id,
            data : snapshot.docs[0].data()
        }

        //console.log('snapshot ', snapshot)
        return res.status(200).json({status : 'success', data : user})
    }
    catch(error)
    {
        return res.status(404).json({status: 'error', error: error})
    }
})

router.put('/editData', async(req, res) => {
    if(!req.body.email) return res.status(404).json({status : 'error', data : 'missing email'})
    const email = req.body.email
    console.log(req.body)
    console.log(email)
    let todo = undefined, done = undefined, inProgress = undefined
    if(req.body.todo) todo = req.body.todo
    if(req.body.done) done = req.body.done
    if(req.body.inProgress) inProgress = req.body.inProgress
    console.log('todo , ',todo)
    console.log('done , ', done)
    console.log('inProgress , ', inProgress)
    
    try{
        const db = admin.firestore()
        const query = db.collection('users').where('email', '==', email)
        const snapshot = await query.get()
        if(snapshot.empty)
        {
            return res.status(404).json({status: 'error', data : 'no user data available'})
        }
        const user = {
            id : snapshot.docs[0].id,
            data : snapshot.docs[0].data()
        }
        const newObject = {
            ...(todo === undefined ? {} : { todo: todo }),
            ...(done === undefined ? {} : {done : done}),
            ...(inProgress === undefined ? {} : {inProgress : inProgress})
        }
        console.log(newObject)
        db.collection('users').doc(user.id).update(newObject).then(()=> {
            console.log('document updated Successfully')
        }).catch((error)=> {
            console.log(`Error ${error}`)
        })
        const docRef = db.collection('users').doc(user.id)
        const data = await docRef.get() 
        console.log('data ', data)
        return res.status(200).json({status : 'success', data : data})

    }
    catch(error)
    {
        return res.status(404).json({status: 'error', error: error})
    }
})

module.exports = router