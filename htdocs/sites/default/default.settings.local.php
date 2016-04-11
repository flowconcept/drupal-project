<?php

/**
 * @file
 * Drupal production site configuration file.
 */

/**
 * Database settings.
 */
$databases['default']['default'] = array (
  'database' => '',
  'username' => '',
  'password' => '',
  'host' => 'localhost',
  'port' => '',
  'driver' => 'mysql',
  'prefix' => '',
);

/**
 * Override configuration values.
 * ´drush --include-overridden cget´
 */

/**
 * Hide all error messages.
 */
$config['system.logging']['error_level'] = 'hide';

/**
 * Enable CSS and JS aggregation.
 */
$config['system.performance']['css']['preprocess'] = TRUE;
$config['system.performance']['js']['preprocess'] = TRUE;

/**
 * Deny access to rebuild.php.
 */
$settings['rebuild_access'] = FALSE;

/**
 * Deny access to update.php script.
 */
$settings['update_free_access'] = FALSE;

// Adjust local file system paths.
$settings['file_private_path'] = '../private';
$config['system.file']['path']['temporary'] = '/tmp';

// Trusted host configuration.
# $settings['trusted_host_patterns'] = array('^www\.example\.de$');

/**
 * Configure Stage File Proxy origin.
 */
/*
$conf['stage_file_proxy_origin'] = call_user_func(function() {
  $aliases = array();
  // Include drush configs
  $drush_config = '/vagrant/vagrant/config/root/home/vagrant/.drush/vagrant.aliases.drushrc.php';
  if (!file_exists($drush_config)) {
  	return FALSE;
  }
  include($drush_config);
  if (empty($aliases['staging']['uri'])) {
    return FALSE;
  }
  $url = array_merge(array('user' => 'flow', 'pass' => 'flowies'), parse_url($aliases['staging']['uri']));
  return $url['scheme'] . '://' . $url['user'] . ':' . $url['pass'] . '@' . $url['host'];
});
// */
