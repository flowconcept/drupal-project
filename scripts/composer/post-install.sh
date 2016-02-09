#!/bin/bash

if [ ! -f .composer_post_install ]
  then

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

  if [ ! -f Vagrantfile ]
    then
      # Add vagrant submodule on project initialisation
      echo "Checking out Vagrant submodule"
      git submodule add -b 8.x git@github.com:flowconcept/drupal-vagrant.git vagrant
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

  touch .composer_post_install

fi
