# Make sure the Apt package lists are up to date, so we're downloading versions that exist.
cookbook_file "apt-sources.list" do
  path "/etc/apt/sources.list"
end
execute 'apt_update' do
  command 'apt-get update'
end

# Base configuration recipe in Chef.
package "wget"
package "ntp"
cookbook_file "ntp.conf" do
  path "/etc/ntp.conf"
end
execute 'ntp_restart' do
  command 'service ntp restart'
end

# NodeJS & NPM
# To get more recent version of Node and NPM
execute 'install_ppa' do
  command 'curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -'
end
package "nodejs"

# MongoDB
execute 'get_key_mongodb' do
  command 'sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 0C49F3730359A14518585931BC711F9BA15703C6'
end
execute 'create_file_mongodb' do
  command 'echo "deb [ arch=amd64,arm64 ] http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.4.list'
end
execute 'apt_update' do
  command 'apt-get update'
end
package "mongodb-org" # sudo apt-get install -y mongodb-org
execute 'start_mongodb' do
  command 'sudo service mongod start'
end

# Install and update packages
execute 'npm_install' do
	command 'npm install'
  cwd 'home/ubuntu/project/online-shopping'
end

# Add default data
execute 'populatedb' do
  command 'node populatedb'
  cwd 'home/ubuntu/project/online-shopping'
end

# Development mode (Not working yet) --------------

# execute 'run_node' do
#   cwd '/home/ubuntu/project/online-shopping'
#   command 'nohup npm run devstart > /dev/null 2>&1 &'
# end

# Production mode ---------------------------------

execute 'install_pm2' do
	command 'npm install pm2 -g'
    cwd 'home/ubuntu/project/online-shopping'
end
execute 'start_server' do
  # Start node app in background using PM2
	command 'pm2 start bin/www -f'
  cwd 'home/ubuntu/project/online-shopping'
end


package "nginx"
cookbook_file "default" do
  path "/etc/nginx/sites-available/default"
end
execute 'restart_nginx' do
	command 'sudo /etc/init.d/nginx restart'
end


# testing chat app in vagrant
execute 'launch_chat' do
    cwd 'home/ubuntu/project/online-shopping/chat-app'
    command 'node ./index.js &'
end
