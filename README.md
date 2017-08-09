#### To view our website:

1. Clone the repository with the tag provided
2. Navigate to the project directory
3. `vagrant up`
4. Navigate to localhost:8000

For a description of features see this google doc
https://docs.google.com/document/d/1MG3sDiKH2JIFg9v0CPO1ZawU-zJGDXzOGPIUprLrGK8/edit?usp=sharing

Several Items and Users have been pre-loaded. Most items are being sold by user1, for testing of edit/deleting
To test buy features, you must be logged in as another user1.

Username:				Password:
* user1@sfu.ca		password
* user2@sfu.ca		password
* user3@sfu.ca		password
* user4@sfu.ca		password

A note: currently the github signup/login is not working

#### Alternative instructions below:

You can launch our app locally by:
1. git clone the application
2. cd to online_shopping_project
3. our app has two part:
	1. `cd online_shopping_project/online-shopping`,
		 `npm install`,
		 `node populatedb`, and then `npm run devstart`
		 go to "localhost:3000"
	2. `cd online_shopping_project/chat-app` and then `node index.js`
		 go to "localhost:3001"

We also support production mode deployment:
1. `git clone` the application
2. `cd` to online_shopping_project
3. `vagrant up` && `vagrant ssh`
4. `cd project/online-shopping`
5. go to “localhost:8000"

Our default/preferred web browser to run our application is Chrome.
