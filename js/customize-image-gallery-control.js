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

            if ( ! args.params.file_type ) {
                args.params.file_type = 'image';
            }

            if ( ! args.params.type ) {
                args.params.type = 'image_gallery';
            }
            if ( ! args.params.content ) {
                args.params.content = $( '<li></li>' );
                args.params.content.attr( 'id', 'customize-control-' + id.replace( /]/g, '' ).replace( /\[/g, '-' ) );
                args.params.content.attr( 'class', 'customize-control customize-control-' + args.params.type );
            }

            if ( ! args.params.attachments ) {
                args.params.attachments = [];
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

            /**
             * Set gallery data and render content.
             */
            function setGalleryDataAndRenderContent() {

                var value = control.setting.get();
                control.setAttachmentsData( value ).done( function() {
                    control.renderContent();
                    control.setupSortable();
                } );
            }

            // Ensure attachment data is initially set.
            setGalleryDataAndRenderContent();

            // Update the attachment data and re-render the control when the setting changes.
            control.setting.bind( setGalleryDataAndRenderContent );

            // Bind events.
            control.container.on( 'click keydown', '.upload-button', control.openFrame );
        },

        /**
         * Fetch attachment data for rendering in control content.
         *
         * @param {Array} value Setting value, array of attachment ids.
         * @returns {*}
         */
        setAttachmentsData: function( value ) {
            var control = this,
                promises = [];

            control.params.attachments = [];

            _.each( value, function( id, index ) {
                var hasAttachmentData = new $.Deferred();
                wp.media.attachment( id ).fetch().done( function() {
                    control.params.attachments[ index ] = this.attributes;
                    hasAttachmentData.resolve();
                } );
                promises.push( hasAttachmentData );
            } );

            return $.when.apply( undefined, promises ).promise();
        },

        /**
         * Open the media modal.
         */
        openFrame: function( event ) {
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
                    text: control.params.button_labels.frame_button
                },
                states: [
                    new wp.media.controller.Library({
                        title: control.params.button_labels.frame_title,
                        library: wp.media.query({ type: control.params.file_type }),
                        multiple: 'add'
                    })
                ]
            });

            /**
             * Pre-select images according to saved settings.
             */
            preSelectImages = function() {
                var selection, ids, attachment, library;

                library = control.frame.state().get( 'library' );
                selection = control.frame.state().get( 'selection' );

                ids = control.setting.get();

                // Sort the selected images to top when opening media modal.
                library.comparator = function( a, b ) {
                    var hasA = true === this.mirroring.get( a.cid ),
                        hasB = true === this.mirroring.get( b.cid );

                    if ( ! hasA && hasB ) {
                        return -1;
                    } else if ( hasA && ! hasB ) {
                        return 1;
                    } else {
                        return 0;
                    }
                };

                _.each( ids, function( id ) {
                    attachment = wp.media.attachment( id );
                    selection.add( attachment ? [ attachment ] : [] );
                    library.add( attachment ? [ attachment ] : [] );
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
        },

        /**
         * Setup sortable.
         *
         * @returns {void}
         */
        setupSortable: function() {
            var control = this,
                list = $( '.image-gallery-attachments' );
            list.sortable({
                items: '.image-gallery-thumbnail-wrapper',
                tolerance: 'pointer',
                stop: function() {
                    var selectedValues = [];
                    list.find( '.image-gallery-thumbnail-wrapper' ).each( function() {
                        var id;
                        id = parseInt( $( this ).data( 'postId' ), 10 );
                        selectedValues.push( id );
                    } );
                    control.setSettingValues( selectedValues );
                }
            });
        }

    });

    api.controlConstructor['image_gallery'] = api.ImageGalleryControl;

})( wp.customize, jQuery );
