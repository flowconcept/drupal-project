#!/bin/sh

green='\e[0;32m'
endcolor='\e[0m'

printf "${green}Running post-install.sh${endcolor}\n"

# Stage composer.lock
git add composer.lock

# Prepare the settings file for installation
if [ ! -f htdocs/sites/default/settings.php ]
  then
    cp htdocs/sites/default/default.settings.php htdocs/sites/default/settings.php
    chmod 777 htdocs/sites/default/settings.php
    git add htdocs/sites/default/settings.php
fi

# Prepare the services file for installation
if [ ! -f htdocs/sites/default/services.yml ]
  then
    cp htdocs/sites/default/default.services.yml htdocs/sites/default/services.yml
    chmod 777 htdocs/sites/default/services.yml
    git add htdocs/sites/default/services.yml
fi

# Prepare the files directory for installation
if [ ! -d htdocs/sites/default/files ]
  then
    mkdir -m777 htdocs/sites/default/files
fi

# Add vagrant submodule
if [ ! -f Vagrantfile ]
  then
    git submodule add -b d8 git@git.flowconcept.de:vagrant.git
    cp vagrant/templates/Vagrantfile .
    git add Vagrantfile
fi

printf "${green}Done.\n\nCommit and launch Vagrant VM using:${endcolor}\n"
printf "git commit -m \"Initial commit.\" && vagrant up\n\n"
