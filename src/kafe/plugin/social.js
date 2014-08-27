/* @echo header */

    var
        getAbsoluteUrl = function(href) {
            if (href) {
                var link = document.createElement('a');
                link.href = href;
                return (link.protocol+'//'+link.host+link.pathname+link.search+link.hash);
            }
            return '';
        },

        networks = {
            facebook: {
                url:        'https://www.facebook.com/sharer/sharer.php?u=<%= url %>',
                width:      '675',
                height:     '368',
                script:     { 
                                url:   '//connect.facebook.net/<%= lang %>/sdk.js#xfbml=1&appId=<%= appid %>&version=v2.0',
                                inner: ''
                            },
                button:     '<div class="fb-share-button" data-href="<%= url %>" data-layout="<%= counter %>"></div>',
                loaded:     false,
                size:       { default: '' },
                counter:    { none: 'button', horizontal: 'button_count', vertical: 'box_count'},
                locale:     { fr: 'fr_FR', en: 'en_US'},
            },
            twitter: {
                url:        'https://twitter.com/intent/tweet?url=<%= url %>&text=<%= text %>&related=<%= related %>',
                width:      '550',
                height:     '450',
                script:     { 
                                url:   'https://platform.twitter.com/widgets.js',
                                inner: ''
                            },
                button:     '<a href="<%= url %>" class="twitter-share-button" data-related="<%= related %>" data-lang="<%= lang %>" data-size="<%= size %>" data-count="<%= counter %>"></a>',
                loaded:     false,
                size:       { default: '', small: 'medium', large: 'large'},
                counter:    { none: 'none', horizontal: 'horizontal', vertical: 'vertical'},
                locale:     { fr: 'fr', en: 'en'},
            },
            linkedin: {
                url:        'https://www.linkedin.com/shareArticle?url=<%= url %>&summary=<%= text %>&mini=true',  // &ro=false &title=lorem &source=example.com
                width:      '600',
                height:     '500',
                script:     { 
                                url:   '//platform.linkedin.com/in.js',
                                inner: 'lang: <%= lang %>'
                            },
                button:     '<script type="IN/Share" data-url="<%= url %>" data-counter="<%= counter %>"></script>',
                loaded:     false,
                size:       { default: '' },
                counter:    { none: '', horizontal: 'right', vertical: 'top'},
                locale:     { fr: 'fr_FR', en: 'en_US'},
            },
            googleplus: {
                url:        'https://plus.google.com/share?url=<%= url %>&t=<%= text %>',
                width:      '520',
                height:     '520',
                script:     { 
                                url:   'https://apis.google.com/js/platform.js',
                                inner: '{lang: \'<%= lang %>\'}'
                            },        
                button:     '<div class="g-plus" data-action="share" data-annotation="<%= counter %>" data-height="<% if(counter == "vertical-bubble") { %>60<% } else { %><%= size %><% } %>"></div>',
                loaded:     false,
                size:       { default: '', small: '15', large: '24' },
                counter:    { none: 'none', horizontal: 'bubble', vertical: 'vertical-bubble'},
                locale:     { fr: 'fr-CA', en: 'en-US'},
            },
            pinterest: {
                url:        'http://www.pinterest.com/pin/create/button/?url=<%= url %>&description=<%= text %>&media=<%= media %>',
                width:      '750',
                height:     '335',
                script:     { 
                                url:   '//assets.pinterest.com/js/pinit.js',
                                inner: ''
                            },        
                button:     '<a href="//<%= lang %>.pinterest.com/pin/create/button/?url=<%= url %>&media=<%= media %>&description=<%= text %>" data-pin-do="buttonPin" data-pin-config="<%= counter %>" data-pin-height="<%= size %>"><img src="//assets.pinterest.com/images/pidgets/pinit_fg_en_rect_gray_<%= size %>.png" /></a>',
                loaded:     false,
                size:       { default: '20', small: '20', large: '28' },
                counter:    { none: 'none', horizontal: 'beside', vertical: 'above'},
                locale:     { fr: 'fr', en: 'en'},
            }
        },


        share_options = {
            url:     document.location,
            text:    document.title,
            related: '', // twitter : https://dev.twitter.com/docs/tweet-button#related
            media:   getAbsoluteUrl( $('head link[rel="image_src"]').attr('href') ) // pinterest media
        },

        genuine_options = {
            lang:    kafe.env('lang'), 
            url:     document.location,
            text:    document.title,
            related: '', // twitter : https://dev.twitter.com/docs/tweet-button#related
            size:    'default', 
            counter: 'horizontal',
            media:   getAbsoluteUrl( $('head link[rel="image_src"]').attr('href') ) // pinterest media
        }
    ;


    /**
    * ### Version <!-- @echo VERSION -->
    * Social tools
    *
    * @module <!-- @echo MODULE -->
    * @class <!-- @echo NAME_FULL -->
    */
    var social = {};


    /**
    * Initialize share buttons functionality
    *
    * @method initShareButtons
    * @param {Object} [options] Options
    *
    * @example
    *   <span data-kafesocial-action="share" data-kafesocial-network="facebook">facebook</span>
    *   <!-- @echo NAME_FULL -->.initShareButtons()
    */
    social.initShareButtons = function(options) {
        share_options = $.extend({}, share_options, options || {});

        $('[data-<!-- @echo NAME_ATTR -->-action="share"]').on('click', function() {
            var $this = $(this);
            var network = $this.data('<!-- @echo NAME_ATTR -->-network');
            var options = $.extend({}, share_options, $this.data('<!-- @echo NAME_ATTR -->-options') || {});
            var data = networks[network];
            if (data.url) {
                window.open( _.template(data.url)(options) , '_blank', 'width='+data.width+',height='+data.height+',menubar=no,toolbar=no');
            }
        });
    };

    /**
    * Initialize genuine buttons functionality
    *
    * @method initGenuineButtons
    * @param {Object} [options] Options
    *
    * @example
    *   <span data-kafesocial-action="genuine" data-kafesocial-network="facebook">facebook</span>
    *   <!-- @echo NAME_FULL -->.initShareButtons()
    */
    // https://developers.google.com/+/web/share/
    // https://dev.twitter.com/docs/tweet-button
    // https://developers.facebook.com/docs/plugins/like-button
    // http://business.pinterest.com/en/widget-builder#do_pin_it_button
    // https://developer.linkedin.com/plugins/share-plugin-generator

    social.initGenuineButtons = function(options) {
        genuine_options = $.extend({}, genuine_options, options || {});

        $('[data-<!-- @echo NAME_ATTR -->-action="genuine"]').each(function() {

            var 
                $this = $(this),
                insertScript = function(url, inner) {
                    var script = document.createElement('script');
                    script.type = 'text/javascript';
                    script.async = true;
                    script.src = url;
                    script.innerHTML = inner;
                    var all = document.getElementsByTagName('script')[0];
                    all.parentNode.insertBefore(script, all);
                },
                network = $this.data('<!-- @echo NAME_ATTR -->-network'),
                options = $.extend({}, genuine_options, $this.data('<!-- @echo NAME_ATTR -->-options') || {}),
                data = networks[network]
            ;
            //set the good language format
            options.lang = networks[network].locale[options.lang];
            //button counter layout
            options.counter = networks[network].counter[options.counter];
            //button size
            options.size = ( networks[network].size ? networks[network].size[options.size] : options.size );

            if (!data.loaded) {
                networks[network].loaded = true;
                $this.html(_.template(data.button)(options));
                insertScript(_.template(data.script.url)(options), _.template(data.script.inner)(options));
            }
            
        });
    };

    return social;

/* @echo footer */