L.DNC = L.DNC || {};
L.DNC.MenuBar = L.Class.extend({

    // defaults
    options: {
        parentId : 'menu-bar'
    },

    initialize: function ( layerlist, options ) {
        // override defaults with passed options
        this.layerlist = layerlist;
        L.setOptions(this, options);

        var geotools = new L.DNC.Menu( "Geoprocessing Tools", {} )
            .addOperation(new L.DNC.TurfOperation('buffer', {
                maxFeatures: 1,
                additionalArgs: 0.1
            }));

        this.menus = [];
        this.menus.push( geotools );
    }
});
