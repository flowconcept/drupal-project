<?php

/**
 * @file
 * Production override configuration feature.
 */

/**
 * Database settings.
 */
$databases['default']['default'] = array (
  'database' => '',
  'username' => '',
  'password' => '',
  'prefix' => '',
  'host' => 'localhost',
  'port' => '',
  'namespace' => 'Drupal\\Core\\Database\\Driver\\mysql',
  'driver' => 'mysql',
);

/**
 * Override configuration values.
 * ´drush --include-overridden cget´
 */

/**
 * Show all error messages, with backtrace information.
 *
 * In case the error level could not be fetched from the database, as for
 * example the database connection failed, we rely only on this value.
 */
$config['system.logging']['error_level'] = 'hide';

/**
 * Disable CSS and JS aggregation.
 */
$config['system.performance']['css']['preprocess'] = TRUE;
$config['system.performance']['js']['preprocess'] = TRUE;

/**
 * Deny access to rebuild.php.
 *
 * This setting can be enabled to allow Drupal's php and database cached
 * storage to be cleared via the rebuild.php page. Access to this page can also
 * be gained by generating a query string from rebuild_token_calculator.sh and
 * using these parameters in a request to rebuild.php.
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
