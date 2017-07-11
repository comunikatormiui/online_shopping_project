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

package "nginx"

package "python-software-properties"

execute 'install_node' do
	command 'curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -'
end

package "nodejs"

execute 'install_pg' do
	command 'npm install pg --save'
end

execute 'install_body_parser' do
	command 'npm install --save body-parser'
end

execute 'install_express' do
	command 'npm install express'
end

execute 'install_underscore' do
	command 'npm install underscore'
end

execute 'install_pm2' do
	command 'npm install pm2'
end

execute 'copy_project_cmpt470' do
	command 'cp /home/ubuntu/project/project_cmpt470 /etc/nginx/sites-available/'
end

execute 'create_website_shortcut' do
	command 'ln -sf /etc/nginx/sites-available/project_cmpt470 /etc/nginx/sites-enabled/project_cmpt470'
end

execute 'create_project_cmpt470_dir' do
	command 'mkdir -p /var/www/project_cmpt470/'
end

execute 'create_node_server' do
	command 'cp /home/ubuntu/project/app.js /var/www/project_cmpt470/'
end

execute 'remove_nginx_default' do
	command 'rm -f /etc/nginx/sites-available/default'
end

execute 'restart_nginx' do
	command 'sudo /etc/init.d/nginx restart'
end

package "postgresql" 

execute 'create_db_table' do 
	command 'echo "CREATE DATABASE mydb; CREATE USER ubuntu; GRANT ALL PRIVILEGES ON DATABASE mydb TO ubuntu; ALTER USER \"ubuntu\" with PASSWORD \'ubuntu\';" | sudo -u postgres psql'
end

execute 'create_contacts_table' do
	command 'node /home/ubuntu/project/create_table.js'
end

execute 'start_server' do
	command '/node_modules/pm2/bin/pm2 start /home/ubuntu/project/app.js'
end