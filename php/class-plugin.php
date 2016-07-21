<?php
/**
 * Customize Image Gallery Control Class
 *
 * @package CustomizeImageGalleryControl
 */

namespace CustomizeImageGalleryControl;

/**
 * Class Plugin
 */
class Plugin {

	/**
	 * Plugin version.
	 *
	 * @var string
	 */
	public $version;

	/**
	 * Plugin constructor.
	 *
	 * @access public
	 */
	public function __construct() {

		// Parse plugin version.
		if ( preg_match( '/Version:\s*(\S+)/', file_get_contents( dirname( __FILE__ ) . '/../customize-image-gallery-control.php' ), $matches ) ) {
			$this->version = $matches[1];
		}
	}

	/**
	 * Initialize.
	 */
	function init() {

		add_action( 'wp_default_styles', array( $this, 'register_styles' ), 100 );
		add_action( 'wp_default_scripts', array( $this, 'register_scripts' ), 100 );
		add_action( 'customize_register', array( $this, 'customize_register' ), 9 );
		add_action( 'customize_controls_enqueue_scripts', array( $this, 'customize_controls_enqueue_scripts' ) );
	}

	/**
	 * Load theme and plugin compatibility classes.
	 *
	 * @param \WP_Customize_Manager $wp_customize Manager.
	 */
	function customize_register( \WP_Customize_Manager $wp_customize ) {
		require_once __DIR__ . '/class-control.php';
		$wp_customize->register_control_type( __NAMESPACE__ . '\\Control' );
	}

	/**
	 * Register styles.
	 *
	 * @param \WP_Styles $wp_styles Styles.
	 */
	public function register_styles( \WP_Styles $wp_styles ) {

		$handle = 'customize-image-gallery-control';
		$src = plugins_url( 'css/customize-image-gallery-control.css', dirname( __FILE__ ) );
		$deps = array( 'customize-controls' );
		$wp_styles->add( $handle, $src, $deps, $this->version );
	}

	/**
	 * Register scripts.
	 *
	 * @param \WP_Scripts $wp_scripts Scripts.
	 */
	public function register_scripts( \WP_Scripts $wp_scripts ) {
		$handle = 'customize-image-gallery-control';
		$src = plugins_url( 'js/customize-image-gallery-control.js', dirname( __FILE__ ) );
		$deps = array( 'jquery', 'customize-controls' );
		$in_footer = 1;
		$wp_scripts->add( $handle, $src, $deps, $this->version, $in_footer );
	}

	/**
	 * Enqueue controls scripts.
	 */
	public function customize_controls_enqueue_scripts() {
		wp_enqueue_script( 'customize-image-gallery-control' );
		wp_enqueue_style( 'customize-image-gallery-control' );
	}
}
