const admin = require('../config/firebase');

const decodeToken = async (req, res, next) => {
	console.log(req.headers)
	if(!req.headers) return res.json({message : 'missing header'})
	if(!req.headers.authorization) return res.json({message : 'missing header'}) 
	const token = req.headers.authorization.split(' ')[1]
	if(!token) return res.json({message : 'missing header'})
	//console.log(token)
	try{
		const decodeValue = await admin.auth().verifyIdToken(token);
			//console.log(decodeValue, "decoded value")
			if (decodeValue) {
                console.log(decodeValue, "decoded value");
				return next();
			}
			return res.json({ message: 'Unauthorized' });
	}
	catch{
		
		return res.json({ message: 'Internal Error' });
	}
}
//module.exports = new Middleware();
module.exports = decodeToken