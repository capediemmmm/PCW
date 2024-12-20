#import "report-template.typ": *

#show: project.with(
  verbose: false,
  title: "使用手册",
  before-title: "第二部分"
)

#let inline-button(
  icon: "",
  bg-color: rgb(22,119,255), 
  fg-color: white,
  stroke: none,
  content
) = {
  if icon == "" {
    box(fill: bg-color,
      stroke: stroke,
      radius: 3pt, 
      inset: (x: 5pt, y: 1pt),
      outset: (y: 3pt),
      text(font: hei,
        fill: fg-color,
        size: 8.5pt,
        content
      )
    )
  } else {
    box(fill: bg-color,
      stroke: stroke,
      radius: 3pt, 
      inset: (x: 5pt, y: 0pt),
      outset: (y: 3pt),
    )[#box(image(icon, height: 6.7pt)) 
      #text(font: hei,
        fill: fg-color,
        size: 8.5pt,
        content
      )]
  }
}

#let inline-menu(
  icon: "",
  content
) = {
  inline-button(
    icon: icon,
    bg-color: rgb(245,245,245),
    fg-color: black,
    content
  )
}

#let inline-link(content) = {
  text(font: hei,
    fill: rgb(100,108,255),
    size: 10.5pt,
    content
  )
}

= 安装运行指南

== 使用 Docker 镜像 <Docker-Image>

使用本项目时，需要用到 Docker 的 #link("https://docs.docker.com/compose/install/")[Docker Compose] 工具。安装完成后，在项目根目录（即包含 `docker-compose.yml` 文件的目录）执行以下命令即可启动项目：

```bash
    docker compose up
```

启动后，可以通过浏览器访问 #link("http://localhost:8080")[`http://localhost:8080`] 来使用本项目。如需停止项目，请在项目根目录执行以下命令：

```bash
    docker compose down
```

== 使用源码 <Source-Code>

1. 需要安装以下软件：

- #link("https://nodejs.org/")[Node.js]
- #link("https://www.oracle.com/java/technologies/javase/jdk22-archive-downloads.html")[JDK 22]
- #link("https://www.mysql.com/downloads/")[MySQL]

2. 执行以下命令安装前端资源：

```sh
      cd ./frontend/frontend
      npm install
      npm run build
```

3. 运行 MySQL 数据库，并在 MySQL 中执行 `./backend/backend/src/main/resources/schema.sql` 文件中的 SQL 语句，创建数据库。如有需要，请在 `./backend/backend/src/main/resources/application-local.properties` 文件中修改数据库连接信息：

```properties
      spring.datasource.url=jdbc:mysql://<your-host>:<your-port>/pcw
```

4. 执行以下命令安装并启动后端服务：

```sh
      cd ./backend/backend
      ./mvnw spring-boot:run
```

5. 打开浏览器，访问 `http://localhost:8080` 即可使用。

= 功能介绍

== 用户信息管理

- 用户可以注册账号，登录系统以及注销退出登录。

== 商品搜索功能

- 用户可以在三个不同的购物网站（拼多多，天猫和京东）上搜索商品并获得商品的详细信息，同时可以点击商品卡片跳转到购买地址。

== 商品信息管理

- 用户通过商品搜索得到的商品信息都将存入商品数据库，用户可以在商品数据库中搜索并查看添加进入的商品的信息。
- 用户可以查看商品数据库中的商品的历史价格折线图并可以设置降价提醒，当商品价格降低到用户设置的价格时，用户将会通过注册的邮箱收到提醒。

= 操作手册

== 用户注册与登录

用户可以通过注册账号的方式注册一个新的账号，也可以通过已有账号登录系统。

=== 注册账号

进入网站根目录，默认是登陆界面。点击 #inline-button("Log in") 按钮下方的 #inline-link("register now!") 链接，进入以下注册界面：

#figure(
  image("./assets/manual/register.png", width: 80%)
)

在注册界面，输入用户名、密码、邮箱，其中用户名和密码不得少于6位，且需要输入两次。点击 #inline-button("Register") 按钮即可注册成功，网站会自动跳转回登录界面。

=== 登录账号

在登录界面，输入用户名和密码，点击 #inline-button("Log in") 按钮即可登录成功，网站会自动跳转到商品搜索界面 `/index`。

#figure(
  image("./assets/manual/login.png", width: 80%)
)

== 商品搜索界面

在登录成功后，会自动跳转到商品搜索界面 `/index`。在该界面，可以通过在左侧菜单栏中选择对应的购物网站并在输入框中输入搜索内容并点击搜索获得相应网站中的搜索结果。

#figure(
  image("./assets/manual/search.png", width: 80%)
)

在页面最上方的是导航栏，点击导航栏中的 "商品库" 菜单选项，将会跳转到商品数据库管理界面，点击右上角的注销图标会退出到登录界面。

在页面右侧的是展示搜索得到的商品卡片的展示区域。商品卡片展示的信息包括商品名称、商品价格、商品图片等。点击商品卡片，将会跳转到对应商品的购买地址。区域采取分页显示，一页最多展示8张图片。

页面左侧是购物网站选择菜单栏，通过点击不同的购物网站按钮，可以选择在不同的购物网站上进行商品搜索。在输入框中输入搜索内容，点击搜索按钮，即可在对应的购物网站上搜索商品。

#figure(
  image("./assets/manual/products_show.png", width: 80%)
)

当页面较窄或使用移动端访问时页面会重新排布，左侧的菜单栏会缩小且右侧的商品信息展示区域将支持纵向滚动：

#figure(
  image("./assets/manual/index_scroll.png", width: 35%)
)

#figure(
  image("./assets/manual/phone.jpg", width: 35%)
)

== 商品数据库界面

点击导航栏中的 "商品库" 菜单，可以跳转到商品数据库界面 `/index`。在该页面中，可以搜索当前商品库中的商品，查看商品的详细信息，查看历史价格折线图以及设置降价提醒。

#figure(
  image("./assets/manual/products_store.png", width: 80%)
)

=== 搜索商品

在该页面的搜索框中输入搜索内容，点击搜索按钮，即可搜索商品库中的商品。搜索结果以商品卡片的形式展示，点击商品卡片同样可以跳转到购买地址：

#figure(
  image("./assets/manual/products_store.png", width: 80%)
)

=== 查看历史价格折线图

在商品卡片的右下角有一个折线图标，点击之后会弹出一个对话框，展示商品的历史价格折线图：

#figure(
  image("./assets/manual/history.png", width: 50%)
)

=== 设置降价提醒

在商品卡片的右下角有一个时钟图标，点击之后会变成红叉，设置降价提醒，点击红叉之后取消设置。当商品价格降低时，用户将会通过注册的邮箱收到提醒：

#figure(
  image("./assets/manual/set_price_down.png", width: 50%)
)

#figure(
  image("./assets/manual/email.jpg", width: 50%)
)

== 会话过期

当用户登录后，若长时间未进行操作，会话会过期，此时进行任意操作或刷新页面都将会跳转回登录界面。