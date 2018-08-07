# -*- mode: ruby -*-
# vi: set ft=ruby :
Vagrant.configure("2") do |config|
  config.vm.box = "ubuntu/xenial64"
  # config.vm.box_check_update = false
  config.vm.network "forwarded_port", guest: 8080, host: 8080
  config.vm.network "forwarded_port", guest: 8000, host: 8000
  # config.vm.network "forwarded_port", guest: 80, host: 8080, host_ip: "127.0.0.1"
  # config.vm.network "private_network", ip: "192.168.33.10"
  # config.vm.network "public_network"
  # config.vm.synced_folder "../data", "/vagrant_data"
  config.vm.provider "virtualbox" do |vb|
    vb.gui = false
    vb.name = "r3"
    vb.cpus = 3
    vb.memory = 3072
  end
  config.vm.provision "shell", inline: <<-SHELL
    sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 9DA31620334BD75D9DCB49F368818C72E52529D4
    echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.6 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.6.list
    sudo apt-get update
    sudo apt-get install -y --allow-unauthenticated redis-server mongodb-org=3.6.6 mongodb-org-server=3.6.6 mongodb-org-shell=3.6.6 mongodb-org-mongos=3.6.6 mongodb-org-tools=3.6.6
    sudo service mongod start
    export NVM_DIR="/usr/local/nvm"
    mkdir -p $NVM_DIR
    curl https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | PROFILE=/etc/bash.bashrc bash
    source "$NVM_DIR/nvm.sh"
    nvm install v10.8.0
    npm install -g yarn gulp-cli npm-check-updates
  SHELL
end
