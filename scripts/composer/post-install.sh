#!/bin/sh

# Stage composer.lock
git add composer.lock

# Prepare the settings file for installation
if [ ! -f htdocs/sites/default/settings.php ]
  then
    echo "Adding Drupal settings.php"
    cp htdocs/sites/default/default.settings.php htdocs/sites/default/settings.php
    chmod 777 htdocs/sites/default/settings.php
    git add htdocs/sites/default/settings.php
fi

# Prepare the services file for installation
if [ ! -f htdocs/sites/default/services.yml ]
  then
    echo "Adding Drupal services.yml"
    cp htdocs/sites/default/default.services.yml htdocs/sites/default/services.yml
    chmod 777 htdocs/sites/default/services.yml
    git add htdocs/sites/default/services.yml
fi

# Prepare the files directory for installation
if [ ! -d htdocs/sites/default/files ]
  then
    echo "Creating Drupal public files directory"
    mkdir -m777 htdocs/sites/default/files
fi

if [ ! -f Vagrantfile ]
  then
    # Add vagrant submodule on project initialisation
    echo "Checking out Vagrant submodule"
    git submodule add -b master git@github.com:flowconcept/drupal-vagrant.git
    cp vagrant/templates/Vagrantfile .
    git add Vagrantfile
  else
    # Update (checkout) submodules when provisioning an existing project
    git submodule update --init
fi

if [ -n "$(git status --untracked-files=no --porcelain)" ]
  then
  echo "Git status:"
  git status --untracked-files=no --porcelain
fi
