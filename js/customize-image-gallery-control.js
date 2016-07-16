/* global wp, JSON */

(function( api, $ ) {
    'use strict';

    /**
     * An image gallery control.
     *
     * @class
     * @augments wp.customize.Control
     * @augments wp.customize.Class
     */
    api.ImageGalleryControl = api.Control.extend({
        initialize: function( id, options ) {
            var control = this, args, postTypes = [];

            args = options || {};

            if ( ! args.params.type ) {
                args.params.type = 'image_gallery';
            }
            if ( ! args.params.content ) {
                args.params.content = $( '<li></li>' );
                args.params.content.attr( 'id', 'customize-control-' + id.replace( /]/g, '' ).replace( /\[/g, '-' ) );
                args.params.content.attr( 'class', 'customize-control customize-control-' + args.params.type );
            }

            api.Control.prototype.initialize.call( control, id, args );
        },

        /**
         * When the control's DOM structure is ready,
         * set up internal event bindings.
         */
        ready: function() {
            var control = this;
            // Shortcut so that we don't have to use _.bind every time we add a callback.
            _.bindAll( control, 'openFrame' );

            // Bind events.
            control.container.on( 'click keydown', '.upload-button', control.openFrame );
        },

        openFrame: function() {
            event.preventDefault();

            if ( ! this.frame ) {
                this.initFrame();
            }

            this.frame.open();
        },

        initFrame: function() {

            this.frame = wp.media({
                button: {
                    text: 'Select'
                },
                states: [
                    new wp.media.controller.Library({
                        title: 'Select gallery images',
                        library: wp.media.query({ type: 'image' }),
                        multiple: 'add'
                    })
                ]
            });
        }
    });

    api.controlConstructor['image_gallery'] = api.ImageGalleryControl;

})( wp.customize, jQuery );
