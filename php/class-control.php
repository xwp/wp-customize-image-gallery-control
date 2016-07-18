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
	 * An Underscore (JS) template for this control's content (but not its container).
	 *
	 * Class variables for this control class are available in the `data` JS object;
	 * export custom variables by overriding {@see WP_Customize_Control::to_json()}.
	 *
	 * @see WP_Customize_Control::print_template()
	 */
	protected function content_template() {
		$data = $this->json();
		?>
		<#
		_.defaults( data, <?php echo wp_json_encode( $data ) ?> );
		data.input_id = 'input-' + String( Math.random() );
		#>
			<span class="customize-control-title"><label for="{{ data.input_id }}">{{ data.label }}</label></span>
			<button type="button" class="button upload-button" id="image-gallery-modify-gallery">Modify Gallery</button>
			<div class="customize-control-notifications"></div>
		<?php
	}

	/**
	 * Don't render any content for this control from PHP.
	 * JS template is doing the work.
	 */
	protected function render_content() {}

}
