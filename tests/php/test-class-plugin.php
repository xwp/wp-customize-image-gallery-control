<?php
/**
 * Tests for Plugin class
 *
 * @package CustomizeImageGalleryControl
 */

namespace CustomizeImageGalleryControl;

/**
 * Class Test_Plugin
 *
 * @package CustomizeImageGalleryControl
 */
class Test_Plugin extends \WP_UnitTestCase {

	/**
	 * Test init
	 *
	 * @see Plugin::init
	 */
	public function test_init() {
		$plugin = new Plugin();
		$plugin->init();

		$this->assertEquals( 100, has_action( 'wp_default_styles', array( $plugin, 'register_styles' ) ) );
		$this->assertEquals( 100, has_action( 'wp_default_scripts', array( $plugin, 'register_scripts' ) ) );
		$this->assertEquals( 9, has_action( 'customize_register', array( $plugin, 'customize_register' ) ) );
		$this->assertEquals( 10, has_action( 'customize_controls_enqueue_scripts', array( $plugin, 'customize_controls_enqueue_scripts' ) ) );
	}
}
