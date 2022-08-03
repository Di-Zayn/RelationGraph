umijs版本

package:
    db 数据库操作等：链接、初始化表结构等
    manager 后台管理等：项目及项目内容的更、删、改、查

static:
    app.conf 配置文件：app的绝对路径，sqlite数据库的相对路径
    jquery jquery的依赖包
    user_project.db 由db.init_db.py脚本生成，并初始化各表

templates:
    login.html 登录页面
    projectManager.html 项目管理页面，新建删除项目
    projectHome.html 项目工作页面，编辑项目内的图谱

    其中script包含了访问后台的各种函数
    关键字说明：
        iri为一种唯一的资源描述id
        node、relation、property等均属于资源，每个资源都有唯一的iri

app.py 主函数 , 路由
utils.py 辅助功能，日志、配置读取等

项目安装:
    编辑static/app.conf的app路径
    run db/init_db.py   -> static中生成.db数据库
    run app.py -> 浏览器访问各页面

任务:
    完成templates的.html文件，形成可操作可显示的web页面

