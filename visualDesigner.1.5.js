/* BEGIN LICENSE TEXT
 *你可自由拷贝、使用、修改本示例代码
 *使用时请标注原作者
 *来源：https://www.cnblogs.com/coolalam/p/9599407.html
 * Includes paper-full.js
 * http://paperjs.org
 *
 * Copyright alan.zhou coolalam@163.com
 * Released under the MIT license
 *
 * Date: 2018/9/6
 */
+function ($) {
    "use strict";
    function Component() {
    
    }
    Component.prototype.getConnectorCenter = function (pos)
    {
        var bounds = this.getBound();
        if (pos.x >= bounds.x - 5 && pos.x <= bounds.x + 5 && pos.y >= bounds.y + bounds.height / 2 - 5 && pos.y <= bounds.y + bounds.height / 2 + 5) {
            //在左连线指示器框中
            return { x: bounds.x, y: bounds.y + bounds.height / 2 };
        }
        else if (pos.x >= bounds.x + bounds.width - 5 && pos.x <= bounds.x + bounds.width + 5 && pos.y >= bounds.y + bounds.height / 2 - 5 && pos.y <= bounds.y + bounds.height / 2 + 5) {
            //在右连线指示器框中
            return { x: bounds.x + bounds.width, y: bounds.y + bounds.height / 2 }
        }
        else if (pos.x >= bounds.x + bounds.width / 2 - 5 && pos.x <= bounds.x + bounds.width / 2 + 5 && pos.y >= bounds.y - 5 && pos.y <= bounds.y + 5) {
            //在上连线指示器框中
            return { x: bounds.x + bounds.width/2, y: bounds.y  }
      }
        else if (pos.x >= bounds.x + bounds.width / 2 - 5 && pos.x <= bounds.x + bounds.width / 2 + 5 && pos.y >= bounds.y + bounds.height - 5 && pos.y <= bounds.y + bounds.height + 5) {
            //在下连线指示器框中
            return { x: bounds.x + bounds.width/2, y: bounds.y + bounds.height }

        }
        else {
            return { x: bounds.x + bounds.width/2, y: bounds.y + bounds.height / 2 }
        }
    }
    Component.prototype.getConnectorDirection = function (start,pos)
    {
        var bounds = this.getBound();
        if (pos.x >= bounds.x - 5 && pos.x <= bounds.x + 5 && pos.y >= bounds.y + bounds.height / 2 - 5 && pos.y <= bounds.y + bounds.height / 2 + 5) {
            //在左连线指示器框中
            return "left";
        }
        else if (pos.x >= bounds.x + bounds.width - 5 && pos.x <= bounds.x + bounds.width + 5 && pos.y >= bounds.y + bounds.height / 2 - 5 && pos.y <= bounds.y + bounds.height / 2 + 5) {
            //在右连线指示器框中
            return "right";
        }
        else if (pos.x >= bounds.x + bounds.width / 2 - 5 && pos.x <= bounds.x + bounds.width / 2 + 5 && pos.y >= bounds.y - 5 && pos.y <= bounds.y + 5) {
            //在上连线指示器框中
            return "up"
      }
        else if (pos.x >= bounds.x + bounds.width / 2 - 5 && pos.x <= bounds.x + bounds.width / 2 + 5 && pos.y >= bounds.y + bounds.height - 5 && pos.y <= bounds.y + bounds.height + 5) {
            //在下连线指示器框中
            return "down"

        }
        else {
            //中心点连接
            if (start.x<pos.x)
                return "left"
            else if (start.x>pos.x)
                return "right"
        }
    }

    Component.prototype.init = function (options) {
        if (options == undefined)
            options = {};
        this.properties = $.extend(options, Component.DEFAULTS);
        this.group = new paper.Group();
        this.designer = undefined; //当前设计器，createElement时赋值
        var me = this;
        var drag = false;

        this.activateConnector = null; //活动的连线指示符
        this.group.onClick = function (event) {
            if (!me.designer.lining) //非画线状态才允许选中
                me.select();
        }
        this.group.onMouseDown = function (event) {
            if (!me.designer.lining) //非画线状态才允许拖动
                drag = (event.event.button == 0);
            else if (me.activateConnector){
                me.designer.lineManager.dragStart(me.activateConnector,event.point)
            }
        }
        this.group.onMouseUp = function (event) {
            drag = false;
            document.body.style.cursor = 'default';
             if (me.designer.lining && me.activateConnector){
                me.designer.lineManager.dragEnd(me.activateConnector,event.point)
             }
        }
        this.group.onMouseDrag = function (event) {
            if (drag && !me.designer.lining) //非画线状态才允许拖动
            {
                if (me.activateConnector) //在拖动元素时如果有连线指示器则清除。
                {
                    me.activateConnector.destroy();
                    me.activateConnector = null;
                }
                 me.properties.x += event.delta.x;
                me.properties.y += event.delta.y;
                this.translate(event.delta.x, event.delta.y);
                $.each(me.designer.lines,function(idx,item){ //遍历每一条线，与此结点相关的都要重绘
                    if (item.properties.source==me.properties.id)
                    {
                        item.destroy();
                        item.properties.sxy.x+=event.delta.x;
                        item.properties.sxy.y+=event.delta.y;
                        item.render({});
                    }
                    else if (item.properties.target==me.properties.id)
                    {
                        item.destroy();
                        item.properties.txy.x+=event.delta.x;
                        item.properties.txy.y+=event.delta.y;
                        item.render({});
                    }
                })
                document.body.style.cursor = 'move';
            }
        }

        this.group.onMouseEnter = function (event) {
            if (!me.activateConnector && me.designer && me.designer.lining) //还没有创建连接指示框，且当前为连线状态
            {
                me.designer.selectAll(false);//取消选中所有元素，if any
                me.activateConnector = new Connector(me).render();
                document.body.style.cursor = 'crosshair';
            }
        }
        this.group.onMouseLeave = function (event) {
            if (me.designer && me.designer.lining && me.activateConnector) { //当前为连线状态，且移出了组件范围 ，擦除连线指示框
                me.activateConnector.destroy();
                me.activateConnector = null;
                console.log("delete in group")
                document.body.style.cursor = 'default';

            }
        }
        this.group.onMouseMove = function (event) {
            if (me.designer && me.designer.lining && me.activateConnector) { //当前为连线状态，且在组件范围 ，检测四个边线连线指示框
                me.activateConnector.hiTest(event)
            }
        }
        return this;
    }
    Component.prototype.destroy = function ()
    {
        this.group.remove();
    }
    Component.prototype.getBound = function () {
        return this.group.children[0].bounds;
    }
    Component.prototype.select = function () {
        this.group.children[0].selected = !this.group.children[0].selected ;
    }
    Component.DEFAULTS = $.extend({}, {
        width: 50,
        height: 50,
        x: 0,
        y: 0,
        id: "",
        typeName:"Component",
        backgroundColor:"white",
        backgroundImage:'',
        fontColor:'black',
        borderColor:'black',
        lineWeight:1,
        title: '',
        status: 1,
        runMode: 1,
        capacity:1
    });
    function Circle() { }
    Circle.prototype = $.extend({}, Component.prototype);
    Circle.prototype = $.extend(Circle.prototype, {
        render: function (options) {
            this.properties.typeName = "圆";
            this.properties = $.extend(this.properties, options);
            var circle = new paper.Path.Circle({
                center: [this.properties.x, this.properties.y],
                radius: 25,
                fillColor: this.properties.backgroundColor
            });
            this.group.addChild(circle);
            return this;
        }
    });

    function Retangle() { }
    Retangle.prototype = $.extend({}, Component.prototype);
    Retangle.prototype = $.extend(Retangle.prototype, {
        render: function (options) {
            this.properties.typeName = "矩形";
            this.properties.width = 200;
            this.properties.height = 100;
            this.properties.opacity = 0.5;
            this.properties = $.extend(this.properties, options);
            var rect = new paper.Path.Rectangle({
                point: [this.properties.x, this.properties.y],
                size: [this.properties.width, this.properties.height],
                radius: 5,
                strokeWidth: 1,
                strokeColor: this.properties.borderColor,
                fillColor: this.properties.backgroundColor,
                opacity: this.properties.opacity
            });
            this.group.addChild(rect);
            return this;
        }
    });
    function BezierLine() {
        
    }
    BezierLine.prototype = $.extend({}, Component.prototype);
    BezierLine.prototype = $.extend(BezierLine.prototype, {
        render: function (options) {
            this.properties.typeName = "曲线";
            this.properties.strokeWidth = 2;
            this.properties.strokeColor = 'red';
            this.properties=$.extend(this.properties,options)
            this.properties.x = Math.min(this.properties.sxy.x, this.properties.txy.x);
            this.properties.y = Math.min(this.properties.sxy.y, this.properties.txy.y);
            this.properties.width = Math.abs(this.properties.txy.x - this.properties.sxy.x);
            this.properties.height = Math.abs(this.properties.txy.y - this.properties.sxy.y);


            var wire = new paper.Path(this.calcPath(this.properties.targetType, this.properties.sxy.x, this.properties.sxy.y, this.properties.txy.x, this.properties.txy.y));
            wire.strokeWidth = this.properties.strokeWidth;
            wire.strokeColor=this.properties.strokeColor;
            wire.sendToBack();
            this.group.addChild(wire);
            //this.group.translate(this.properties.x, this.properties.y);
            return this;
        },
        calcPath:function(type, x1, y1, x2, y2)
            {
            var path= "";
            if(type =="left" || type == "right")
            path= 'M ' + x1 + ', ' + y1 + 'C ' +
            (x1 + (x2 - x1) / 2) + ', ' + y1 + ' ' +
            (x2 - (x2 - x1) / 2) + ', ' + y2 + ' ' +
            x2 + ', ' + y2;
            else if (type=="up" || type == "down")
            path='M' + x1 + ', ' + y1 + 'C ' +
            x1 + ', ' + (y1 + (y2 - y1) / 2) + ' ' +
            x2 + ', ' + (y2 - (y2 - y1) / 2) + ' ' +
            x2 + ', ' + y2;
            return path;
        }
    });


    function Ellipse() { }
    Ellipse.prototype = $.extend({}, Component.prototype);
    Ellipse.prototype = $.extend(Ellipse.prototype, {
        render: function (options) {
            this.properties.width = 120;
            this.properties.typeName = "椭圆";
            this.properties.height = 60;
            this.properties.fillColor = 'green';
            this.properties = $.extend(this.properties, options);
            var ellipse = new paper.Path.Ellipse(
                {
                    point: [this.properties.x, this.properties.y],
                    size: [this.properties.width, this.properties.height],
                    fillColor: this.properties.fillColor,
                opacity: this.properties.opacity
            });
            this.group.addChild(ellipse);
            return this;
        }
    });
    function Connector(node) {

        this.node = node;
        this.group = null;
    }
    Connector.prototype = {

        destroy: function () {
            this.group.remove();
        },
        hiTest: function (event) {
            var bounds = this.node.getBound();
            if (event.point.x >= bounds.x - 5 && event.point.x <= bounds.x + 5 && event.point.y >= bounds.y + bounds.height / 2 - 5 && event.point.y <= bounds.y + bounds.height / 2 + 5)
            {
                //在左连线指示器框中
                this.group.children[0].bounds.x = bounds.x - 5;
                this.group.children[0].bounds.y = bounds.y + bounds.height / 2 - 5;
                this.group.children[0].bounds.width = 10;
                this.group.children[0].bounds.height = 10;
            }
            else if (event.point.x >= bounds.x + bounds.width - 5 && event.point.x <= bounds.x + bounds.width  + 5 && event.point.y >= bounds.y + bounds.height / 2 - 5 && event.point.y <= bounds.y + bounds.height / 2 + 5) {
                //在右连线指示器框中
                this.group.children[0].bounds.x = bounds.x + bounds.width  - 5;
                this.group.children[0].bounds.y = bounds.y + bounds.height / 2 - 5;
                this.group.children[0].bounds.width = 10;
                this.group.children[0].bounds.height = 10;
            }
            else if (event.point.x >= bounds.x + bounds.width / 2 - 5 && event.point.x <= bounds.x + bounds.width / 2  + 5 && event.point.y >= bounds.y  - 5 && event.point.y <= bounds.y  + 5) {
                //在上连线指示器框中
                this.group.children[0].bounds.x = bounds.x + bounds.width / 2  - 5;
                this.group.children[0].bounds.y = bounds.y  - 5;
                this.group.children[0].bounds.width = 10;
                this.group.children[0].bounds.height = 10;
            }
            else if (event.point.x >= bounds.x + bounds.width / 2 - 5 && event.point.x <= bounds.x + bounds.width / 2  + 5 && event.point.y >= bounds.y + bounds.height - 5 && event.point.y <= bounds.y + bounds.height+ 5) {
                //在下连线指示器框中
                this.group.children[0].bounds.x = bounds.x + bounds.width / 2  - 5;
                this.group.children[0].bounds.y = bounds.y + bounds.height  - 5;
                this.group.children[0].bounds.width = 10;
                this.group.children[0].bounds.height = 10;
            }
            else
            {
                this.group.children[0].bounds.x = bounds.x 
                this.group.children[0].bounds.y = bounds.y;
                this.group.children[0].bounds.width = bounds.width;
                this.group.children[0].bounds.height = bounds.height;
            }
        },
        render: function () {
            var me = this;
            var color = 'white';
            this.group = new paper.Group();
            var rect = new paper.Path.Rectangle({
                point: [this.node.getBound().x, this.node.getBound().y],
                size: [this.node.getBound().width, this.node.getBound().height],
                strokeColor: 'red',
                strokeWidth: 3
            })
            rect.onMouseDown = function (event) {
                debugger;

            };
            this.group.addChild(rect);
            var bounds = this.node.getBound();
            var topCross1 = new paper.Path.Line({ from: [bounds.x + bounds.width / 2 - 2.5, bounds.y - 2.5], to: [bounds.x + bounds.width / 2 + 2.5, bounds.y + 2.5], strokeColor: 'blue' });
            this.group.addChild(topCross1);
            var topCross2 = new paper.Path.Line({ from: [bounds.x + bounds.width / 2 - 2.5, bounds.y + 2.5],to: [bounds.x + bounds.width / 2 + 2.5, bounds.y - 2.5], strokeColor: 'blue' });
            this.group.addChild(topCross2);

            var rightCross1 = new paper.Path.Line({ from: [bounds.x + bounds.width - 2.5, bounds.y + bounds.height / 2 - 2.5], to: [bounds.x + bounds.width + 2.5, bounds.y + bounds.height / 2 + 2.5], strokeColor: 'blue' });
            this.group.addChild(rightCross1);
            var rightCross2 = new paper.Path.Line({ from: [bounds.x + bounds.width - 2.5, bounds.y + bounds.height / 2 + 2.5], to: [bounds.x + bounds.width + 2.5, bounds.y + bounds.height / 2 - 2.5], strokeColor: 'blue' });
            this.group.addChild(rightCross2);

            var leftCross1 = new paper.Path.Line({ from: [bounds.x - 2.5, bounds.y + bounds.height / 2 - 2.5], to: [bounds.x + 2.5, bounds.y + bounds.height / 2 + 2.5], strokeColor: 'blue' });
            this.group.addChild(leftCross1);
            var leftCross2 = new paper.Path.Line({ from: [bounds.x - 2.5, bounds.y + bounds.height / 2 + 2.5], to: [bounds.x + 2.5, bounds.y + bounds.height / 2 - 2.5], strokeColor: 'blue' });
            this.group.addChild(leftCross2);

            var bottomCross1 = new paper.Path.Line({ from: [bounds.x + bounds.width / 2 - 2.5, bounds.y + bounds.height - 2.5], to: [bounds.x + bounds.width / 2 + 2.5, bounds.y + bounds.height + 2.5], strokeColor: 'blue' });
            this.group.addChild(bottomCross1);
            var bottomCross2 = new paper.Path.Line({ from: [bounds.x + bounds.width / 2 - 2.5, bounds.y + bounds.height + 2.5], to: [bounds.x + bounds.width / 2 + 2.5, bounds.y + bounds.height  - 2.5], strokeColor: 'blue' });
            this.group.addChild(bottomCross2);
            this.group.bringToFront();
            var drag = false;
            return this;
        }

    };
    function LineManager(designer) {
        this.designer = designer;
        this.line = null;//当前跟随线
        this.start = null;//当前正在画线的起点元素
        this.startPos=null;
        var tool=new paper.Tool();
        //设计器元素之外的移动也要显示跟随线，
        var me=this;
        tool.onMouseMove=function(event){
            me.draging(event.point);
        }
        tool.onMouseUp=function(event)
        {
            //设计器元素之外的释放不生成连线，清除已有开始结点等信息，
            if (me.line)
                me.line.remove();
            me.start=null;
            me.startPos=null;
            me.line=null;
        }
    }
    LineManager.prototype = {
        dragStart: function (co,pos) {
                this.start = co;
                var xy = co.node.getConnectorCenter(pos); //获取当前鼠标位置处连接点的中央坐标
                this.startPos=xy;
                this.line = new paper.Path.Line({
                    from: [xy.x, xy.y],
                    to: [xy.x, xy.y],
                    strokeWidth: 2,
                    strokeColor: 'red'
                });
        },
        draging: function (pos) {
            if (this.line !== null ) {
                var txy = this.calcLine(this.startPos.x, this.startPos.y, pos.x, pos.y);
                this.line.set({ pathData: 'M' + this.startPos.x + ',' + this.startPos.y + ' L' + txy.x + ',' + txy.y });
            }
        },
        dragEnd:function(co,pos)
        {
            var xy = co.node.getConnectorCenter(pos); //获取当前鼠标位置处连接点的中央坐标
            if (this.line !== null  ) {
                if (this.start.node.properties.id!=co.node.properties.id){
                    this.designer.createLine("曲线",{targetType:co.node.getConnectorDirection(this.startPos,pos),source:this.start.node.properties.id,target:co.node.properties.id,sxy:this.startPos,txy:xy});
                }
                this.line.remove();

            }
            this.start=null; //清除画线状态，等待重新画线
            this.startPos=null;
            
        },

        calcLine: function (x1, y1, x2, y2) {
            var vx = x2 - x1;
            var vy = y2 - y1;
            var d = Math.sqrt(vx * vx + vy * vy);
            vx /= d;
            vy /= d;
            d = Math.max(0, d - 5);
            return {
                'x': Math.round(x1 + vx * d),
                'y': Math.round(y1 + vy * d)
            }
        }
    }
    // VisualDesigner 公共类定义
    // ===============================
    var VisualDesigner = function (element, options) {
        this.init(element, options)
        this.nodes = {};//设计器上所有节点集合
        this.lines = {};//设计器上所有线条
        this.lining = false;//是否正在画线状态
        this.lineManager = new LineManager(this);
    }
    if (!paper) throw new Error('VisualDesigner requires paper.js')
    VisualDesigner.DEFAULTS = $.extend({}, {
        content: '',
        color: "red",
        font_color: "yellow",
        opacity: 0.5
    })
    /*编号累加*/
    VisualDesigner.prototype.createId = function() {
        var idx = 1;
         var name = "";
         var found=false;
         while (true)
         {
           name = "e" + idx;
           var element = this.nodes[name];
           if (element)
               idx++;
           else{
               break;
           }
         }
         while (true)
         {
           name = "e" + idx;
           var element = this.lines[name];
           if (element)
               idx++;
           else{
               break;
           }
         }
         return name;
    }
    VisualDesigner.prototype.createElement = function (typeName, options) {
        if (!options.id)
            options.id = this.createId(); //为元素增加id属性
        var element = null;
        switch (typeName) {
            case "圆":
                element = new Circle().init().render(options);
                break;
            case "矩形":
                element= new Retangle().init().render(options);
                break;
            case "椭圆":
                element = new Ellipse().init().render(options);
                break;
        }
        this.nodes[element.properties.id] = element;
        element.designer = this;

    }    /*增加元素*/
    VisualDesigner.prototype.createLine= function (typeName, options) {
        if (!options.id)
            options.id = this.createId(); //为元素增加id属性
        var element = null;
        switch (typeName) {
            case "曲线":
                element = new BezierLine().init().render(options);
                break;
        }
        this.lines[element.properties.id] = element;
        element.designer = this;

    }  
    VisualDesigner.prototype.setLineStatus = function (status) {
        this.lining = status;
    }

    VisualDesigner.prototype.init = function (element, options) {
        this.enabled = true
        this.$element = $(element)
        this.$element.on("dragover", function (event) {
            event.preventDefault();
        });
        var me = this;
        this.$element.on("drop", function (event) {
            event.preventDefault();
            var data = null;
            if (event.dataTransfer == undefined && event.originalEvent != undefined)
                data = event.originalEvent.dataTransfer.getData("text");
            else if (event.dataTransfer != undefined)
                data = event.dataTransfer.getData("text");
            var drag = false;
            me.createElement(data, { x: event.originalEvent.offsetX, y: event.originalEvent.offsetY });

        });
        this.htmlCanvas = element instanceof jQuery ? element[0] : element;
        this.options = this.getOptions(options)
        //初始化设计器代码
        this.canvas = paper.setup(this.htmlCanvas.id);
        //this.canvas.project.view.viewSize = new paper.Size(this.options.width, this.options.height);
        this.options = $.extend({ 'raster': 0 }, this.options || {});
        this.originalPoint = this.canvas.project.view.center;//保留中心
        this.centerPoint = { x: 0, y: 0 };
        

    }

    // NOTE: VisualDesigner 原型定义
    // ================================
    VisualDesigner.prototype.constructor = VisualDesigner
    VisualDesigner.prototype.getDefaults = function () {
        return VisualDesigner.DEFAULTS
    }
    VisualDesigner.prototype.getOptions = function (options) {
        options = $.extend({}, this.getDefaults(), this.$element.data(), options)
        return options;
    }
    VisualDesigner.prototype.clear = function () {
        var me = this;
        $.each(this.nodes, function (idx, item) {
            item.destroy();
            delete me.nodes[item.properties.id]
        })
        $.each(this.lines, function (idx, item) {
            item.destroy();
            delete me.lines[item.properties.id]
        })
    }
    VisualDesigner.prototype.selectAll = function (status) {
        var me = this;
        $.each(this.nodes, function (idx, item) {
            if (status)
                item.select();
            else
                item.unselect();
        })
    }
    VisualDesigner.prototype.open = function (content) {
        //此处打开操作：清除原来内容，并渲染新内容的代码
        this.clear();//先清除原来内容
        var contentObj = JSON.parse(content);
        for (var en in contentObj.nodes)
        {
            var el = contentObj.nodes[en];
            this.createElement(el.properties.typeName, el.properties)
        }
        for (var l1 in contentObj.lines)
        {
            debugger;
            var line = contentObj.lines[l1];
            this.createLine(line.properties.typeName, line.properties)
        }
    }
    VisualDesigner.prototype.hasContent = function () {
        return this.getTitle() || this.getContent()
    }
    VisualDesigner.prototype.getContent = function () {
        debugger;
        return JSON.stringify({ "nodes": this.nodes, "lines": this.lines },
            function (k, v) {
                if (k == "designer") {
                    return undefined;
                }
                return v;
            });
    }
    var old = $.fn.visualDesigner
    // VisualDesigner 插件定义,扩展jquery函数
    // =========================
    $.fn.visualDesigner = function (option) {
        return new VisualDesigner(this, option);
    }
    $.fn.visualDesigner.Constructor = VisualDesigner
    // visualDesigner 非冲突
    // ===================
    $.fn.visualDesigner.noConflict = function () {
        $.fn.visualDesigner = old
        return this
    }

}($);


var runMode = { designTime: 1, runTime: 2 };