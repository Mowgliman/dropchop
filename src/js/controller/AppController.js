L.DNC = L.DNC || {};
/*
**
** AppController is the primary point of app initialization. It basically 'ties
** every together'
**
*/
L.DNC.AppController = L.Class.extend({

    statics: {},

    // default options
    options: {},

    // L.Class.extend automatically executes 'initialize'
    initialize : function( options ) {

        // override defaults with passed options
        L.setOptions(this, options);

        this.mapView = new L.DNC.MapView();
        this.dropzone = new L.DNC.DropZone( this.mapView._map, {} );
        this.layerlist = new L.DNC.LayerList( { layerContainerId: 'dropzone' } ).addTo( this.mapView._map );

        this.menubar = new L.DNC.MenuBar( { id: 'menu-bar' } ).addTo( document.body );

        // new menu
        this.menu = {
            geo: new L.DNC.Menu('Geoprocessing', {
                items: ['buffer', 'union']
            }).addTo( this.menubar )
        };

        this.ops = {
            geo: new L.DNC.Geo(),
            geox: new L.DNC.GeoExecute()
        };

        this.forms = new L.DNC.Forms();

        this.notification = new L.DNC.Notifications();
        this._addEventHandlers();

    },

    _addEventHandlers: function(){
        this.dropzone.fileReader.on( 'fileparsed', this._handleParsedFile.bind( this ) );
        this.forms.on( 'submit', this._handleFormSubmit.bind(this) );
        this.menu.geo.on( 'click', this._handleGeoClick.bind(this) );
    },

    /*
    **
    ** Lookup geo operation from clicked geomenu item, render appropriate form
    **
    */
    _handleGeoClick: function( e ) {
        var info = this.ops.geo[e.action];
        this.forms.render( e.action, info );
    },

    /*
    **
    ** Take input from an options form, use input to execute operation, get new
    ** layer, pass new layer off to be added to map.
    **
    */
    _handleFormSubmit: function( e ) {

        var newLayer = this.ops.geox.execute(
            e.action,
            e.parameters,
            this.ops.geo[e.action],
            this.getLayerSelection()
        );
        this._handleGeoResult(layer);
    },

    /*
    **
    ** Take newly parsed file, add to make and layerlist
    **
    */
    _handleParsedFile: function( e ) {
        var layer = L.mapbox.featureLayer( e.file );
        this.layerlist.addLayerToList( layer, e.fileInfo.name, true );
        this.mapView.numLayers++;

        this.notification.add({
            text: '<strong>' + e.fileInfo.name + '</strong> added successfully.',
            type: 'success',
            time: 2500
        });
    },

    /*
    **
    ** Take new layer, add to map and layerlist
    **
    */
    _handleGeoResult: function( layer ) {
        var mapLayer = L.mapbox.featureLayer( layer.geometry );
        this.layerlist.addLayerToList( mapLayer, layer.name, true );
    },

    _handleOperationClick: function ( e ) {
        this.forms.render( e );
    },

    getLayerSelection: function(){
        return this.layerlist.selection.list || [];
    }

});
