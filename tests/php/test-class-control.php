<?php
/**
 * Test Class for Control
 *
 * @package CustomizeImageGalleryControl
 */

namespace CustomizeImageGalleryControl;

/**
 * Class Test_Control
 *
 * @package CustomizeImageGalleryControl
 */
class Test_Control extends \WP_UnitTestCase {

	/**
	 * Plugin instance.
	 *
	 * @var object
	 */
	var $plugin;

	/**
	 * \WP_Customize_Manager instance.
	 *
	 * @var object
	 */
	var $wp_customizer;

	/**
	 * Set up test class.
	 */
	function setUp() {
		parent::setUp();
		require_once( ABSPATH . WPINC . '/class-wp-customize-manager.php' );
		$this->wp_customizer = new \WP_Customize_Manager();
		$this->plugin = new Plugin();
		$this->plugin->customize_register( $this->wp_customizer );
	}
	/**
	 * Test constructor
	 */
	public function test_construct() {
		$control = new Control( $this->wp_customizer, 'no-setting', array() );
		$this->assertTrue( 'image_gallery' === $control->type );
		$this->assertTrue( 'image' === $control->file_type );
	}
}
