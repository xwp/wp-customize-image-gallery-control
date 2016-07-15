<?php
/**
 * Control.
 *
 * @package CustomizeImageGalleryControl
 */

namespace CustomizeImageGalleryControl;

/**
 * Class Control
 *
 * @package CustomizeObjectSelector
 */
class Control extends \WP_Customize_Control {

	/**
	 * Control type.
	 *
	 * @access public
	 * @var string
	 */
	public $type = 'image_gallery';

	/**
	 * Export control params to JS.
	 *
	 * @return array
	 */
	public function json() {
		return parent::json();
	}
}
