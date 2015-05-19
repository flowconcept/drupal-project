#!/bin/sh

green='\e[0;32m'
endcolor='\e[0m'

printf "${green}Running post-install.sh${endcolor}\n"

# Prepare the settings file for installation
if [ ! -f htdocs/sites/default/settings.php ]
  then
    cp htdocs/sites/default/default.settings.php htdocs/sites/default/settings.php
    chmod 777 htdocs/sites/default/settings.php
fi

# Prepare the services file for installation
if [ ! -f htdocs/sites/default/services.yml ]
  then
    cp htdocs/sites/default/default.services.yml htdocs/sites/default/services.yml
    chmod 777 htdocs/sites/default/services.yml
fi

# Prepare the files directory for installation
if [ ! -d htdocs/sites/default/files ]
  then
    mkdir -m777 htdocs/sites/default/files
fi

# Add vagrant submodule
git submodule add git@git.flowconcept.de:vagrant.git
cp vagrant/templates/Vagrantfile .

# Add new files to repository
git add Vagrantfile composer.lock htdocs/sites/default/services.yml htdocs/sites/default/settings.php

printf "${green}Done.\n\nCommit and launch Vagrant VM using:${endcolor}\n"
printf "git commit -m \"Initial commit.\" && vagrant up\n\n"
