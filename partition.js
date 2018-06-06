/*
    I need to set the width and height on init.
    style for a and b
    vertical -
        * width: data.split% || 50%;
        * height: 100%;
        * float: left;
    style for bar -
        * width: barWidth || 10px;
*/



    function Partition (/* options */) {
        var options = arguments[0];
        var data = {};
        var handler = {};
        _this = this
        /**
         * Check for options arguments
         * make sure it is an Object
         */
        if (typeof options !== 'object') {
            console.error('Please pass options as an Object');
            return 1;
        }
        // Direction
        data.direction = options.direction || 'horizontal';

        //Set elements a and b.
        data.a = document.querySelector(options.a);
        data.b = document.querySelector(options.b);

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
        // Global Style Settings
        data.a.style.float = 'left';
        data.b.style.float = 'left';
        data.bar.style.float = 'left';

        // Insert Bar Element
        data.a.parentNode.insertBefore(data.bar, data.b);

        data.mousedown = false;


        handler.get = function(obj, key) {
            return obj[key];
        }
        handler.set = function(obj, key, value) {
            if (key === 'resize') {
                // Resize A and B
                if (obj['direction'] === 'horizontal') {
                    resizeHorizontal({
                        y: value.y,
                        a: obj['a'],
                        b: obj['b'],
                        bar: obj['bar'],
                        barWidth: obj['barWidth'],
                        stopGap: obj['stopGap'],
                    })
                } else {
                    resizeVertical({
                        x: value.x,
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

        var proxy = new Proxy(data, handler);

        _this.fullStop = function () {
            proxy.mousedown = false;
            document.body.style.userSelect = '';
        }

        _this.poop = function () {
            console.log('poop')
        }

        proxy.bar.addEventListener('mousedown', function (event) {
            proxy.mousedown = true;
            document.body.style.userSelect = 'none';
        })

        proxy.a.parentElement.onmousemove = function (e) {
            if (proxy.mousedown) {
                var resize = {
                    x: e.pageX,
                    y: e.pageY
                }
                proxy.resize = resize;
            }
        }

        proxy.a.parentNode.onmouseleave = function () {
            proxy.mousedown = false;
            _this.fullStop()
        }

        proxy.a.parentNode.onmouseup = function () {
            proxy.mousedown = false;
            _this.fullStop()
        }



        this.mousedown = proxy.mousedown;

        function resizeVertical(obj) {
            var bcr = obj.a.parentElement.getBoundingClientRect();
            var offset = bcr.left;
            var rootWidth = bcr.width;
            var cursor = obj.x;
            cursor -= offset;
            var percent = (cursor/rootWidth)*100;
            if (percent > obj.stopGap || percent < (100-obj.stopGap) ) {
                obj.a.style.width = 'calc('+percent+'% - '+(obj.barWidth/2)+'px)';
                obj.b.style.width = 'calc('+(100 - percent)+'% - '+(obj.barWidth/2)+'px)';
            }
        }
        function resizeHorizontal(obj) {
            var bcr = obj.a.parentElement.getBoundingClientRect();
            var offset = bcr.top;
            var rootHeight = bcr.height;
            var cursor = obj.y;
            cursor -= offset;
            var percent = (cursor/rootHeight)*100;
            if ( percent > obj.stopGap && percent < (100-obj.stopGap) ) {
                obj.a.style.height = 'calc('+percent+'% - '+(obj.barWidth/2)+'px)';
                obj.b.style.height = 'calc('+(100 - percent)+'% - '+(obj.barWidth/2)+'px)';
            }
        }

    }
