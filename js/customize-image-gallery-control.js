/* global wp, JSON */
/* eslint consistent-this: [ "error", "control" ] */
/* eslint complexity: ["error", 8] */

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

            if ( ! args.params.labels ) {
                args.params.labels = {};
                args.params.labels.title = 'Select Gallery Images';
                args.params.labels.select = 'Select Images';
            }

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

            var control = this, preSelectImages;

            this.frame = wp.media({
                button: {
                    text: control.params.labels.select
                },
                states: [
                    new wp.media.controller.Library({
                        title: control.params.labels.title,
                        library: wp.media.query({ type: 'image' }),
                        multiple: 'add'
                    })
                ]
            });

            /**
             * Pre-select images according to saved settings.
             */
            preSelectImages = function() {
                var selection, ids, attachment;
                selection = control.frame.state().get( 'selection' );
                ids = control.setting.get();
                ids.forEach( function( id ) {
                    attachment = wp.media.attachment( id );
                    selection.add( attachment ? [ attachment ] : [] );
                });
            };
            control.frame.on( 'open', preSelectImages );
            control.frame.on( 'select', control.select );
        },

        /**
         * Callback for selecting attachments.
         */
        select: function() {

            var control = this, attachments, attachmentIds;

            attachments = control.frame.state().get( 'selection' ).toJSON();
            control.params.attachments = attachments;

            attachmentIds = control.getAttachmentIds( attachments );
            control.setSettingValues( attachmentIds );
        },

        /**
         * Get array of attachment id-s from attachment objects.
         *
         * @param {Array} attachments Attachments.
         * @returns {Array}
         */
        getAttachmentIds: function( attachments ) {
            var ids = [], i;
            for ( i in attachments ) {
                ids.push( attachments[ i ].id );
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
        }
    });

    api.controlConstructor['image_gallery'] = api.ImageGalleryControl;

})( wp.customize, jQuery );
