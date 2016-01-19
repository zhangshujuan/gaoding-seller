(function() {
    var root = this;
    var config = {
        base: typeof process === "undefined" ? window.HEALTH.assetsPath : null,
		vars: {
		    'jqueryVersion':'1-8-3',
            'jqueryui':'jqueryui/jqueryui',
            'bootstrapVersion':'index'
		},
        alias: {
            //var
            "$": 'pluginPath/jquery/jquery-{jqueryVersion}',
            "jquery": 'pluginPath/jquery/jquery-{jqueryVersion}',
            "jqueryui":'pluginPath/{jqueryui}',
            // plugins
            "rails": 'pluginPath/jquery-ujs/rails',
            //"pagination":'pluginPath/pagination/jquery-pagination',
            "textareaAutoSize":'pluginPath/autosize/textarea-autosize',
            "jqueryValidate":'pluginPath/validate/index',
            "template":'pluginPath/template/index',
            "handlebars":'pluginPath/template/handlebars',
            "handlebars-helper":'pluginPath/template/handlebars-helper',
            "template":'pluginPath/template/index',
            "metisMenu":'pluginPath/metisMenu/index',
            "selectize":'pluginPath/selectize/selectize',
            "metadata":'pluginPath/metadata/jquery-metadata',
            "uploader":'pluginPath/uploader/uploader',
            "cxSelect":'pluginPath/selectize/cxSelect',
            "cropit":'pluginPath/cropit/cropit',
            "jqPaginator":'pluginPath/pagination/jqPaginator',
            //bootstrap
            "tab":'bootPath/tab',
            "dropdown":'bootPath/dropdown',
            "bootstrap":'bootPath/{bootstrapVersion}',
            //utils
            "common":'utilsPath/common',
            "widget":'utilsPath/widget',

            "cropitUpload":'wgPath/cropitUpload/index',
            "dataBind":'wgPath/dataBind/databind',
            //css
            "animateCss":'css/animate.css',
            "explorer":'wgPath/explorer/explorer'
        },
        paths: {
            pluginPath: 'scripts/plugins',
            utilsPath:'scripts/utils',
            bootPath:'scripts/plugins/bsjs',
            wgPath:'scripts/widget'
        },
        comboSyntax: ["??", ","],
        comboMaxLength: 500,
        preload: [
            "common"
        ],
        map: [],
        charset: 'utf-8',
        timeout: 20000,
        debug: true
    };
    if (root.seajs) {
        root.seajs.config(config);
    }
    return config;
}).call(this);