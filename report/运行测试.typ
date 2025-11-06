#import "report-template.typ": *

#show: project.with(
  verbose: false,
  title: "运行测试",
  before-title: "第三部分"
)

= 测试介绍

== 测试目的

此次项目的测试对象为在2024-2025学年秋冬学期《B/S体系软件设计》课程中设计的商品比价网站，旨在确保商品比价网站的质量和性能符合设计和用户需求。测试过程将覆盖所有关键功能、性能指标，以及系统稳定性和安全性。

测试的主要目的是验证系统是否满足功能性和非功能性需求，包括但不限于用户界面的友好性、系统的稳定性、性能指标、安全性、以及错误处理能力。

== 测试范围

测试的范围包括但不限于以下内容：

- 系统的功能性测试：确保所有功能按照需求运行。
- 系统的安全性测试：验证系统的安全性，包括但不限于数据加密、防止SQL注入等。
- 系统的兼容性测试：确保系统能够在不同的浏览器和操作系统上正常运行。

在本次测试中，我们会对系统的所有模块进行测试，包括商品搜索、商品数据库模块等等。

== 测试环境

/ 操作系统: Windows 11
/ CPU: Intel(R) Iris(R) Xe Graphics CPU
/ 内存: 16.0 GB
/ 浏览器: Google Chrome 131.0.6778.140

== 测试方法

在测试过程中，我们将主要使用黑盒测试的方法，即不考虑系统的内部结构和实现细节，只测试系统的输入和输出，旨在评估系统的基本功能和性能。我们将测试验证系统的所有功能，包括但不限于用户登录、设备查询、模拟设备发送消息等等。我们也会模拟用户的各种行为，包括可能出现的各种用户的异常操作，以及对系统的各种异常输入，以验证系统的稳定性和安全性。

= 测试结果

== 功能性测试

=== 用户登录界面测试

用户登陆界面需要包含用户名和密码两个输入框，以及一个登录按钮。在输入用户名和密码后，点击登录按钮，验证是否能够成功登录。若登录成功，应该跳转到用户主界面；若登录失败，应该弹出错误提示。

==== 账号密码正确

/ 输入用户名: aaaaaa
/ 输入密码: 123456

系统正常登录，跳转到用户主界面。

==== 用户名或密码错误

测试用例1：用户名错误

/ 输入用户名: aaaaab
/ 输入密码: 123456

测试用例2：密码错误

/ 输入用户名: aaaaaa
/ 输入密码: 1234567

#figure(
  image("./assets/test/1.png", width: 70%),
)

两种情况下，系统都弹出错误提示，提示登陆失败。

==== 用户名或密码为空

测试用例1：用户名为空时

#figure(
  image("./assets/test/3.png", width: 30%)
)

测试用例2：密码为空时

#figure(
  image("./assets/test/2.png", width: 30%)
)

两种情况下，系统都弹出错误提示，提示用户输入用户名和密码。

=== 用户注册界面测试

用户注册界面需要包含用户名、密码、确认密码、邮箱等输入框，以及一个注册按钮。在输入所有信息后，点击注册按钮，验证是否能够成功注册。若注册成功，应该跳转到用户登录界面；若注册失败，应该弹出错误提示。

==== 注册成功

/ 输入邮箱: cyx\@111.com
/ 输入用户名: cyx123
/ 输入密码: 123456
/ 确认密码: 123456

系统正常注册，跳转到用户登录界面。

==== 重复的用户名或邮箱

为了方便测试，我们先行注册几个用户，在数据库中已经存在以下数据：

#figure(
  image("./assets/test/4.png", width: 70%)
)

测试用例1：重复的邮箱。输入邮箱 cyx\@111.com，可以看到系统弹出错误提示，提示用户名已经存在。

#figure(
  image("./assets/test/5.png", width: 25%)
)

测试用例2：重复的用户名。输入用户名 cyx123，可以看到系统弹出错误提示，提示用户名已经存在。

#figure(
  image("./assets/test/6.png", width: 25%)
)

==== 密码和确认密码不一致

测试用例：密码和确认密码不一致。输入密码 123456，确认密码 1234567，可以看到系统弹出错误提示，提示两次输入的密码不一致。

#figure(
  image("./assets/test/diff-password.png", width: 25%)
)

==== 邮箱格式不正确

测试用例：邮箱格式不正确。输入邮箱 peipei，可以看到系统弹出错误提示，提示邮箱格式不正确。

#figure(
  image("./assets/test/invalid-email.png", width: 25%)
)

==== 密码长度不够

测试用例：密码长度不够。输入密码 12345，可以看到系统弹出错误提示，提示密码长度不够。

#figure(
  image("./assets/test/short-pwd.png", width: 25%)
)

==== 非法用户名

测试用例：非法用户名。输入用户名 用户，可以看到系统弹出错误提示，提示用户名不合法。

#figure(
  image("./assets/test/invalid-username.png", width: 25%)
)

==== 用户名长度不够

测试用例：用户名长度不够。输入用户名 cyx，可以看到系统弹出错误提示，提示用户名长度不够。

#figure(
  image("./assets/test/short-username.png", width: 25%)
)

==== 空表单

测试用例：空表单。点击注册按钮，可以看到系统弹出错误提示，提示用户名、密码、确认密码、邮箱不能为空。

#figure(
  image("./assets/test/empty-register.png", width: 25%)
)

=== 用户信息设置界面测试

==== 修改用户名或邮箱

测试用例1：修改用户名。输入用户名 bbbbbb，可以看到系统弹出成功提示，提示用户名修改成功，且上方的用户名已经更新。

#figure(
  image("./assets/test/change_username.png", width: 70%)
)

#figure(
  image("./assets/test/change_username_2.png", width: 70%)
)

测试用例2：修改邮箱。输入邮箱 aaa\@aaa.com，可以看到系统弹出成功提示，提示邮箱修改成功，且上方的邮箱已经更新。

#figure(
  image("./assets/test/change_email.png", width: 70%)
)

#figure(
  image("./assets/test/change_email_2.png", width: 70%)
)

测试用例3：重复的用户名或邮箱。输入用户名 cyx123，可以看到系统弹出错误提示，提示用户名已经存在。输入邮箱 cyx\@111.com，可以看到系统弹出错误提示，提示邮箱已经存在。

#figure(
  image("./assets/test/change_exists.png", width: 70%)
)

测试用例4：用户名长度不够。输入用户名 cyx，可以看到系统弹出错误提示，提示用户名长度不够。

#figure(
  image("./assets/test/change_username_short.png", width: 70%)
)

==== 修改密码

测试用例1：修改密码。输入原密码 123456，新密码 1234567，确认密码 1234567，可以看到系统弹出成功提示，提示密码修改成功。

#figure(
  image("assets/test/change_pwd_succ.png", width: 70%)
)

测试用例2：原密码错误。输入原密码 123456，新密码 123456，确认密码 123456，可以看到系统弹出错误提示，提示密码错误。

#figure(
  image("assets/test/wrong_pwd.png", width: 70%)
)

测试用例3：新密码和确认密码不一致。输入原密码 1234567，新密码 123456，确认密码 1234567，可以看到系统弹出错误提示，提示两次输入的密码不一致。

#figure(
  image("assets/test/change-pwd-diff.png", width: 50%)
)

测试用例4：新密码长度不够。输入原密码 1234567，新密码 12345，确认密码 12345，可以看到系统弹出错误提示，提示密码长度不够。

#figure(
  image("assets/test/change_pwd_short.png", width: 50%)
)

测试用例5：空表单。点击修改密码按钮，可以看到系统弹出错误提示，提示原密码、新密码、确认密码不能为空。

#figure(
  image("assets/test/change_pwd_empty.png", width: 50%)
)


=== 商品搜索测试

==== 搜索

测试用例1：搜索商品。在搜索框中输入商品名称 `ipad`，点击搜索按钮，可以看到系统返回了搜索结果。

#figure(
  image("./assets/test/search-products.png", width: 60%)
)

测试用例2：空表单。点击搜索按钮，可以看到按钮并不进入loading状态，提醒用户此时搜索内容为空。

#figure(
  image("./assets/test/search-products-empty.png", width: 60%)
)

测试用例3：切换菜单栏。点击不同的购物网站按钮再点击搜索，可以看到系统返回了对应的搜索结果：

#figure(
  image("./assets/test/search-products-jd.png", width: 60%)
)

=== 商品库界面测试

==== 搜索

测试用例1：搜索商品。在搜索框中输入商品名称 `ipad`，点击搜索按钮，可以看到系统返回了搜索结果。

#figure(
  image("./assets/test/store-search-products.png", width: 60%)
)

测试用例2：空表单。点击搜索按钮，可以看到按钮并不会进入loading状态，提醒用户此时搜索内容为空。

#figure(
  image("./assets/test/store-search-products-empty.png", width: 60%)
)

==== 查看历史价格折线图

测试用例：查看历史价格折线图。点击商品卡片中的 折线图 按钮，可以看到系统返回了该商品的历史价格折线图。

#figure(
  image("./assets/test/store-product-chart.png", width: 60%)
)

==== 降价提醒

测试用例：设置降价提醒。点击商品卡片中的 时钟 按钮，并手动设置其价格低于前次搜索，可以看到邮件成功发送：

#figure(
  image("./assets/manual/email.jpg", width: 60%)
)

== 安全性测试

=== SQL注入

测试用例：SQL注入。在用户登录界面，输入用户名 `admin`，密码 `123456' or '1'='1`，可以看到系统弹出错误提示，提示用户名或密码错误。

#figure(
  image("./assets/test/sql-injection.png", width: 80%)
)

=== 未登录用户访问

测试用例：未登录用户访问。在用户未登录时，强行访问 `/#/index`，可以看到系统弹出错误提示，提示用户未登录，并跳转到登录界面。

#figure(
  image("./assets/test/redirect.png", width: 80%)
)

=== 密码加密

测试用例：密码加密。在数据库中，可以看到用户的密码已经被加密。

#figure(
  image("./assets/test/4.png", width: 80%)
)

== 移动端兼容性测试

在手机上访问

=== 登录注册界面

#align(center, grid(
  columns: (auto, auto),
  image("./assets/test/mobile-login.png", width: 80%),
  image("./assets/test/mobile-register.png", width: 80%)
))

可以看到，登录注册界面在移动端上正常显示。

=== 商品搜索界面

搜索界面显示如下：

#figure(
  image("./assets/test/mobile-search.jpg", width: 40%)
)

可以看到，商品搜索界面在移动端上正常显示。

=== 商品数据库界面

#figure(
  image("./assets/test/mobile_db_search.jpg", width: 40%)
)

#figure(
  image("./assets/test/mobile-db-history.jpg", width: 40%)
)

可以看到，商品数据库界面在移动端浏览器上正常显示。

=== 用户信息设置界面

#figure(
  image("./assets/test/mobile_setting.jpg", width: 40%)
)

可以看到，用户信息设置界面在移动端上正常显示。

= 测试结论

本次测试覆盖了系统的所有功能，包括用户登录、用户注册、用户信息设置、商品搜索、商品数据库查询、显示历史价格表、降价邮件提醒等等。测试结果显示，系统的所有功能均正常运行，符合设计和用户需求。系统的安全性也得到了验证，包括但不限于防止SQL注入、密码加密等。系统的兼容性也得到了验证，可以在不同的浏览器和操作系统上正常运行。

= 后续建议

- 定期维护：为了确保系统的稳定性和安全性，建议定期维护系统，包括但不限于更新系统、修复漏洞等。
- 用户反馈：建议增加用户反馈功能，以便用户可以及时反馈系统的问题，以便及时修复。
- 扩展测试：随着用户量的增加，定期进行更广泛的性能和安全测试。
- 数据备份：建立定期数据备份机制，确保数据安全。