module.exports = {
	facebook: {
		clientID: '798231580356363' || '1404935769542854',
		clientSecret: '09b4c5ec595b1746b1f44f21fc717aff' || '127989e8dbaab25fe9188d66b86399c8',
		callbackURL: 'http://localhost:3000/auth/facebook/callback' || 'http://localhost:9000/auth/facebook/callback'
	},
	github: {
		clientID: '4d6b77439cce6eea959f',
		clientSecret: '746a27e92a0a74a39a99d25c25b7942abbe9a5d1',
		callbackURL: 'http://localhost:3000/auth/github/callback'
	},
	//for testing version
	/*facebook: {
		clientID: '1404935769542854' || '798231580356363',
		clientSecret: '127989e8dbaab25fe9188d66b86399c8' || '09b4c5ec595b1746b1f44f21fc717aff',
		callbackURL: 'http://localhost:9000/auth/facebook/callback' || 'http://localhost:3000/auth/facebook/callback'
	},*/
}
