<svg  width=”100%” height=”100%”></svg>
width:  svg画布的宽度   height:svg画布的高度
<g></g> 用来组织svg元素，如果一组svg元素被g元素包裹了，你可以通过对g元素进行变换

基本形状
1、矩形<rect x="10" y="10" rx="10" ry="10" width="30" height="30"/>
x、y矩形左上角的x、y坐标位置，width、height矩形的宽和高，rx、ry圆角的x、y方位的半径

2、圆形<circle cx="25" cy="75" r="20" />
cx、cy圆心的x、y坐标位置，r为圆的半径

3、线条<line x1="10" x2="50" y1="110" y2="150"/>
x1、y1线条的起点的x、y坐标位置、x2、y2线条的终点的x、y坐标位置

4、路径<path d="M10 10 H 90 V 90 H 10 L 10 10"/>
   d：一个点集数列以及其它关于如何绘制路径的信息
   M = moveto
   M x y 移动到指定坐标，xy分别为x轴和y轴的坐标点，类似画笔的起点，path中的起点，必须存在
   L = lineto
   L x y 在初始位置（M 画的起点）和xy确定的坐标画一条线，两点一线，直线，绘图中很常见的方式。
   H = horizontal lineto
   H x 沿着x轴移动一段位置
   V = vertical lineto
   V y 沿着y轴移动一段位置
   Z = closepath
   从当前位置到起点画一条直线闭合。
   A=Arcto 
弧形命令A rx ry x-axis-rotation large-arc-flag sweep-flag x y
rx和ry分别是x和y方向的半径(绘制圆弧时，rx和ry相等)
x-axis-rotation x轴旋转角度
 large-arc-flag的值确定是要画小弧或大弧，0表示画小弧(即画两点之间弧长最小的弧)，1表示画大弧(当弧度大于Math.PI时需要画大弧);
 SweepFlag用来确定画弧的方向，0逆时针方向，1顺时针方向;x和y是目的地的坐标;

文字
<text x="10" y="10">Hello World!</text>
属性x和属性y性决定了文本在视口中显示的位置。属性text-anchor，可以有这些值：start、middle、end或inherit，允许决定从这一点开始的文本流的方向

样式
stroke属性设置绘制对象的线条的颜色
fill属性设置对象内部的颜色
fill-opacity控制填充色的不透明度
stroke-opacity控制描边的不透明度
stroke-width属性定义了描边的宽度
stroke-dasharray用于创建虚线
stroke-dasharray = '10'
stroke-dasharray = '10, 10'
stroke-dasharray = '10, 10, 5, 5'

