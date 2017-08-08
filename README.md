To view our website:

1) Clone the repository with the tag provided
2) Navigate to the project directory
3) vagrant up
4) Navigate to localhost:9000

For a description of features see this google doc
https://docs.google.com/document/d/1MG3sDiKH2JIFg9v0CPO1ZawU-zJGDXzOGPIUprLrGK8/edit?usp=sharing


// Alternative instructions below:


You can launch our app locally by:
1. git clone the application
2. cd to online_shopping_project
3. our app has two part:
	3.1. "cd online_shopping_project/online-shopping"
		 "npm install"
		 "node populatedb" and then "npm run devstart"
		 go to "localhost:3000"
	3.2. "cd online_shopping_project/chat-app" and then "node index.js"
		 go to "localhost:3001"

We also support production mode deployment:
1. git clone the application
2. cd to online_shopping_project
3. vagrant up && vagrant ssh
4. "cd project/online-shopping
5. go to “localhost:9000"
