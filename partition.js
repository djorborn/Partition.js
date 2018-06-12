/*
    Partition.js
    created by Daniel Osborn
    github.com/djorborn

*/



    function Partition (/* options */) {
        var options = arguments[0];
        var data = {};
        var handler = {};
        var _this = this;
        var exampleObject = "\nnew Partition({\n\tdirection: 'vertical',\n\ta: '#element_one',\n\tb: '#element_two'\n});"
        /**
         * Check for options arguments
         * make sure it is an Object
         */
        if (typeof options !== 'object') {
            console.error('Please pass options as an Object', exampleObject);
            return 1;
        }
        // Direction
        data.direction = options.direction || 'horizontal';

        //Set elements a and b.
        data.a = document.querySelector(options.a);
        data.b = document.querySelector(options.b);

        if (!data.a || !data.b) {
            console.error('Please pass Elements to a and b.', exampleObject)
        }

        data.splitSize = options.splitSize || '50 50';
        data.splitSize = data.splitSize.split(' ');

        data.stopGap = options.stopGap || 10;

        // Set Bar
        data.barWidth = options.barWidth || 10;
        data.bar = options.bar || document.createElement('div');
        // Initial Style For A, B and Bar
            // Vertical Settings
        if (data.direction === 'vertical') {
            // A
            data.a.style.width = 'calc('+data.splitSize[0]+'% - '+data.barWidth/2+'px)';
            data.a.style.height = '100%';
            //B
            data.b.style.width = 'calc('+data.splitSize[1]+'% - '+data.barWidth/2+'px)';
            data.b.style.height = '100%';
            // Bar
            data.bar.style.width = data.barWidth + 'px';
            data.bar.style.height = '100%';
            data.bar.style.cursor = 'ew-resize';
        } else {
            // Horizontal Settings
            // A
            data.a.style.height = 'calc('+data.splitSize[0]+'% - '+data.barWidth/2+'px)';
            data.a.style.width = '100%';
            //B
            data.b.style.height = 'calc('+data.splitSize[1]+'% - '+data.barWidth/2+'px)';
            data.b.style.width = '100%';
            // Bar
            data.bar.style.height = data.barWidth + 'px';
            data.bar.style.width = '100%';
            data.bar.style.cursor = 'ns-resize';
        }

        data.onresize = options.onresize

        // Global Style Settings
        data.a.style.float = 'left';
        data.b.style.float = 'left';
        data.a.style.position = 'relative';
        data.b.style.position = 'relative';
        data.bar.style.float = 'left';

        // Set CSS class for bar
        data.bar.classList.add('bar-' + data.direction);

        // Insert Bar Element
        data.a.parentNode.insertBefore(data.bar, data.b);
// -----------------------------------------------------------------------------
        // Iframe Fix
        if (options.iframe) {
            for (var i = 0; i < 2; i++) {
                var fix = document.createElement('div');

                fix.style = 'position: absolute;width: 100%;height: 100%;'+
                'background: transparent;top: 0;left: 0;z-index: 9; display: none;';

                data[('fix' + i)] = fix;
            }
            data.a.appendChild(data.fix0);
            data.b.appendChild(data.fix1);
        }
        data.iframe = options.iframe;
// -----------------------------------------------------------------------------


        data.mousedown = false;

        handler.get = function(obj, key) {
            return obj[key];
        }
        handler.set = function(obj, key, value) {
            if (obj['iframe']) {
                if (key === 'fixOn') {
                    if (value) {
                        obj['fix0'].style.display = 'block';
                        obj['fix1'].style.display = 'block';
                    } else {
                        obj['fix1'].style.display = 'none';
                        obj['fix0'].style.display = 'none';
                    }
                }
            }
            if (key === 'resize') {
                // Resize A and B
                if (obj['onresize']) {
                    obj['onresize'](value)
                }
                if (obj['direction'] === 'horizontal') {
                    resizeHorizontal({
                        click: value.y,
                        a: obj['a'],
                        b: obj['b'],
                        bar: obj['bar'],
                        barWidth: obj['barWidth'],
                        stopGap: obj['stopGap'],
                    })
                } else {
                    resizeVertical({
                        click: value.x,
                        a: obj['a'],
                        b: obj['b'],
                        bar: obj['bar'],
                        barWidth: obj['barWidth'],
                        stopGap: obj['stopGap'],
                    })
                }
            }
            obj[key] = value;
        }
        // Main Proxy
        var proxy = new Proxy(data, handler);

        /**
         * fullStop function
         * Stops resize
         */
        _this.fullStop = function () {
            proxy.mousedown = false;
            proxy.fixOn = false
            document.body.style.userSelect = '';
        }

        // bar mousedown event
        proxy.bar.addEventListener('mousedown', function (event) {
            proxy.mousedown = true;
            document.body.style.userSelect = 'none';
            // if (proxy.iframe) {
            //     proxy.fixOn = true;
            // }
        });
        // Main mousemove Resize event
        proxy.a.parentElement.onmousemove = function (e) {
            if (proxy.mousedown) {
                var resize = {
                    x: e.clientX,
                    y: e.clientY
                }
                proxy.resize = resize;
            }
        }
        // mouseleave event to kill resize
        proxy.a.parentNode.onmouseleave = function () {
            proxy.mousedown = false;
            _this.fullStop();
        }
        // mouseup event to kill resize
        proxy.a.parentNode.onmouseup = function () {
            proxy.mousedown = false;
            _this.fullStop();
        }


        // Boolean for bar mousedown
        // if true then the bar is ready
        this.mousedown = proxy.mousedown;

//---------------------------------------------------------------
        /** resize function argument obj
          * click: pageX or pageY,
          * a: Element Object,
          * b: Element Object,
          * bar: Element Object,
          * barWidth: Number
          * stopGap: Number
         */

        /**
         * resizeVertical
         * Resize for vertical direction
         * @param {object} obj
         */
        function resizeVertical(obj) {
            var bcr = obj.a.parentElement.getBoundingClientRect();
            var offset = bcr.left;
            var rootWidth = bcr.width;
            var cursor = obj.click;
            cursor -= offset;
            var percent = (cursor/rootWidth)*100;
            if (percent > obj.stopGap || percent < (100-obj.stopGap) ) {
                obj.a.style.width = 'calc('+percent+'% - '+(obj.barWidth/2)+'px)';
                obj.b.style.width = 'calc('+(100 - percent)+'% - '+(obj.barWidth/2)+'px)';
            }
        }
        /**
         * resizeHorizontal
         * Resize for horizontal direction
         * @param {object} obj
         */
        function resizeHorizontal(obj) {

            var bcr = obj.a.parentElement.getBoundingClientRect();
            var offset = bcr.top;
            var rootHeight = bcr.height;
            var cursor = obj.click;
            cursor -= offset;
            var percent = (cursor/rootHeight)*100;
            if ( percent > obj.stopGap || percent < (100-obj.stopGap) ) {
                obj.a.style.height = 'calc('+percent+'% - '+(obj.barWidth/2)+'px)';
                obj.b.style.height = 'calc('+(100 - percent)+'% - '+(obj.barWidth/2)+'px)';
            }
        }

    }
