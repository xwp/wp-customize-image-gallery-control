<?php
/**
 * Plugin Name: Customize Image Gallery Control
 * Version: 0.1
 * Description: Adds a Customizer control for gallery.
 * Author: XWP
 * Plugin URI: https://github.com/xwp/wp-customize-image-gallery-control
 * Text Domain: customize-image-gallery-control
 *
 * @package CustomizeImageGalleryControl
 */

global $customize_image_gallery_control_plugin;

if ( version_compare( phpversion(), '5.3', '>=' ) ) {
	require_once __DIR__ . '/php/class-plugin.php';
	$class = 'CustomizeImageGalleryControl\\Plugin';
	$customize_image_gallery_control_plugin = new $class();
	add_action( 'plugins_loaded', array( $customize_image_gallery_control_plugin, 'init' ) );
} else {
	if ( defined( 'WP_CLI' ) ) {
		WP_CLI::warning( _customize_image_gallery_control_php_version_text() );
	} else {
		add_action( 'admin_notices', '_customize_image_gallery_control_php_version_error' );
	}
}

/**
 * Admin notice for incompatible versions of PHP.
 */
function _customize_image_gallery_control_php_version_error() {
	printf( '<div class="error"><p>%s</p></div>', esc_html( _customize_image_gallery_control_php_version_text() ) );
}

/**
 * String describing the minimum PHP version.
 *
 * @return string
 */
function _customize_image_gallery_control_php_version_text() {
	return __( 'Customize Image Gallery Control plugin error: Your version of PHP is too old to run this plugin. You must be running PHP 5.3 or higher.', 'customize-image-gallery-control' );
}
