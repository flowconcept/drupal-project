# Composer template for Drupal projects

[![Build Status](https://travis-ci.org/smk/drupal-project.svg?branch=8.x)](https://travis-ci.org/smk/drupal-project)

This project template should provide a kickstart for managing your site 
dependencies with [Composer](https://getcomposer.org/).

If you want to know, how to use it as replacement for
[Drush Make](https://github.com/drush-ops/drush/blob/master/docs/make.md) visit
the [Documentation on drupal.org](https://www.drupal.org/node/2471553).

## Usage

First you need to [install composer](https://getcomposer.org/doc/00-intro.md#installation-linux-unix-osx).

> Note: The instructions below refer to the [global composer installation](https://getcomposer.org/doc/00-intro.md#globally).
You might need to replace `composer` with `php composer.phar` (or similar) for your setup.

After that you can start a new project by forking this repository first, since
you're going to commit project specific files.

Then checkout the repository and let composer install the dependencies: 

```
cd my-project
composer install
```

With `composer require ...` you can download new dependencies to your installation:

```
composer require drupal/devel:8.*
```

## What does the template do?

When installing the given `composer.json` some tasks are taken care of:

* Drupal will be downloaded to the `htdocs/core`-directory.
* Autoloader is implemented to use the generated composer autoloader in `vendor/autoload.php`,
  instead of the one provided by Drupal (`htdocs/vendor/autoload.php`).
* Modules (packages of type `drupal-module`) will be placed in `htdocs/modules/contrib/`
* Themes (packages of type `drupal-module`) will be placed in `htdocs/themes/contrib/`
* Profiles (packages of type `drupal-profile`) will be placed in `htdocs/profiles/contrib/`
* Creates default writable versions of `settings.php` and `services.yml`.
* Creates `sites/default/files`-directory.
* ~~Latest version~~ Currently locked at RC2 version of drush, installed locally for use at `vendor/bin/drush`.
* Vagrant will be added as git submodule and provides a `Vagrantfile`.

When done, optionally commit changes made by composer, and launch the VM with `vagrant up`. 

## Generate composer.json from existing project

With using [the "Composer Generate" drush extension](https://www.drupal.org/project/composer_generate)
you can now generate a basic `composer.json` file from an existing project. Note
that the generated `composer.json` might differ from this project's file.


## FAQ

### Should I commit the contrib modules I download

Composer recommends **no**. They provide [argumentation against but also workrounds if a project decides to do it anyway](https://getcomposer.org/doc/faqs/should-i-commit-the-dependencies-in-my-vendor-directory.md).
