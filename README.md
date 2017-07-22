To view our website:

1) Clone the repository
2) From the online_shopping_project directory use "vagrant up"
3) On your web browser navigate to "localhost:9000"

Key features include (in their initial, unfinished state):

- Register and Login system 
- Profile page to view/edit your personal information
- Directory of items for sale
- List of categories which filter items
- IRC chat to discuss items
- Search feature to look up items


// Alternative instructions below:


You can launch our app locally by:
1. git clone the application
2. cd to online_shopping_project
3. our app has two part:
	3.1. "cd online_shopping_project/online-shopping" 
		 "npm install" and then "npm run devstart"
		 go to "localhost:3000"
	3.2. "cd online_shopping_project/chat-app" and then "node index.js"
		 go to "localhost:3001"

We also support production mode deployment:
1. git clone the application
2. cd to online_shopping_project
3. vagrant up && vagrant ssh
4. "cd project/online-shopping
5. go to “localhost:9000"
