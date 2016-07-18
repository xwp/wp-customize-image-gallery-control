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
            var control = this, args;

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
            _.bindAll( control, 'openFrame', 'select' );

            // Bind events.
            control.container.on( 'click keydown', '.upload-button', control.openFrame );
        },

        /**
         * Open the media modal.
         */
        openFrame: function() {
            event.preventDefault();

            if ( ! this.frame ) {
                this.initFrame();
            }

            this.frame.open();
        },

        /**
         * Initiate the media modal select frame.
         * Save it for using later in case needed.
         */
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

            // When files are selected, run a callback.
            this.frame.on( 'select', this.select );
        },

        /**
         * Callback for selecting attachments.
         */
        select: function() {
            var attachments = this.frame.state().get( 'selection' ).toJSON();
            this.params.attachments = attachments;

            var attachmentIds = this.getAttachmentIds( attachments );
            console.log( attachmentIds );
            // Set the Customizer setting; the callback takes care of rendering.
            this.setSettingValues( attachmentIds );
        },

        /**
         * Get array of attachment id-s from attachment objects.
         *
         * @param {Array} attachments Attachments.
         * @returns {Array}
         */
        getAttachmentIds: function( attachments ) {
            var ids = [];
            for ( var i in attachments ) {
                ids.push( attachments[i].id );
            }
            return ids;
        },

        /**
         * Set setting values.
         *
         * @param {Array} values Array of ids.
         */
        setSettingValues: function( values ) {
            var control = this;
            control.setting.set( values );
        },
    });

    api.controlConstructor['image_gallery'] = api.ImageGalleryControl;

})( wp.customize, jQuery );
