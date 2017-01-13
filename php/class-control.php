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
	 * Gallery file type.
	 *
	 * @var string
	 */
	public $file_type = 'image';

	/**
	 * Button labels.
	 *
	 * @var array
	 */
	public $button_labels = array();

	/**
	 * Constructor for Image Gallery control.
	 *
	 * @param \WP_Customize_Manager $manager Customizer instance.
	 * @param string                $id      Control ID.
	 * @param array                 $args    Optional. Arguments to override class property defaults.
	 */
	public function __construct( $manager, $id, $args = array() ) {
		parent::__construct( $manager, $id, $args );

		$this->button_labels = wp_parse_args( $this->button_labels, array(
			'select'       => __( 'Select Images', 'customize-image-gallery-control' ),
			'change'       => __( 'Modify Gallery', 'customize-image-gallery-control' ),
			'default'      => __( 'Default', 'customize-image-gallery-control' ),
			'remove'       => __( 'Remove', 'customize-image-gallery-control' ),
			'placeholder'  => __( 'No images selected', 'customize-image-gallery-control' ),
			'frame_title'  => __( 'Select Gallery Images', 'customize-image-gallery-control' ),
			'frame_button' => __( 'Choose Images', 'customize-image-gallery-control' ),
		) );
	}

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
		<# if ( data.attachments ) { #>
			<div class="image-gallery-attachments">
				<# _.each( data.attachments, function( attachment ) { #>
					<div class="image-gallery-thumbnail-wrapper" data-post-id="{{ attachment.id }}">
						<img class="attachment-thumb" src="{{ attachment.url }}" draggable="false" alt="" />
					</div>
				<#	} ) #>
			</div>
			<# } #>
			<div>
				<button type="button" class="button upload-button" id="image-gallery-modify-gallery">{{ data.button_labels.change }}</button>
			</div>
			<div class="customize-control-notifications"></div>

		<?php

	}

	/**
	 * Don't render any content for this control from PHP.
	 * JS template is doing the work.
	 */
	protected function render_content() {}

	/**
	 * Send the parameters to the JavaScript via JSON.
	 *
	 * @see \WP_Customize_Control::to_json()
	 */
	public function to_json() {
		parent::to_json();
		$this->json['label'] = html_entity_decode( $this->label, ENT_QUOTES, get_bloginfo( 'charset' ) );
		$this->json['file_type'] = $this->file_type;
		$this->json['button_labels'] = $this->button_labels;
	}

}
