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

execute 'update' do
	command 'cp /home/ubuntu/project/chef/cookbooks/baseconfig/files/default/nginx-default /etc/nginx/sites-available/default'
end
execute 'nginx_restart' do
	command 'nginx -s reload'
end

package "postgresql"
