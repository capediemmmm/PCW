CREATE USER 'usr'@'%' IDENTIFIED BY '123456';
GRANT ALL PRIVILEGES ON *.* TO 'usr'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;

create database if not exists pcw;

use pcw;

CREATE TABLE SPRING_SESSION (
    PRIMARY_ID CHAR(36) NOT NULL,
    SESSION_ID CHAR(36) NOT NULL,
    CREATION_TIME BIGINT NOT NULL,
    LAST_ACCESS_TIME BIGINT NOT NULL,
    MAX_INACTIVE_INTERVAL INT NOT NULL,
    EXPIRY_TIME BIGINT NOT NULL,
    PRINCIPAL_NAME VARCHAR(100),
    CONSTRAINT SPRING_SESSION_PK PRIMARY KEY (PRIMARY_ID)
) ENGINE=InnoDB ROW_FORMAT=DYNAMIC;

CREATE UNIQUE INDEX SPRING_SESSION_IX1 ON SPRING_SESSION (SESSION_ID);
CREATE INDEX SPRING_SESSION_IX2 ON SPRING_SESSION (EXPIRY_TIME);
CREATE INDEX SPRING_SESSION_IX3 ON SPRING_SESSION (PRINCIPAL_NAME);

CREATE TABLE SPRING_SESSION_ATTRIBUTES (
   SESSION_PRIMARY_ID CHAR(36) NOT NULL,
   ATTRIBUTE_NAME VARCHAR(200) NOT NULL,
   ATTRIBUTE_BYTES BLOB NOT NULL,
   CONSTRAINT SPRING_SESSION_ATTRIBUTES_PK PRIMARY KEY (SESSION_PRIMARY_ID, ATTRIBUTE_NAME),
   CONSTRAINT SPRING_SESSION_ATTRIBUTES_FK FOREIGN KEY (SESSION_PRIMARY_ID) REFERENCES SPRING_SESSION(PRIMARY_ID) ON DELETE CASCADE
) ENGINE=InnoDB ROW_FORMAT=DYNAMIC;

create table if not exists user
(
    uid int auto_increment
        primary key,
    email varchar(255) not null,
    username varchar(255) not null,
    password varchar(255) not null,
    constraint user_pk2
        unique (username),
    constraint user_pk3
        unique (email),
    CONSTRAINT chk_username_length CHECK (CHAR_LENGTH(username) >= 6),
    CONSTRAINT chk_email_length CHECK (CHAR_LENGTH(email) >= 6)
) engine=innodb comment '用户表';

# create table if not exists goods_category
# (
#     category_id int unsigned auto_increment not null primary key comment '分类id',
#     category_name varchar(255) not null comment '分类名称',
#     parent_id int unsigned default 0 not null comment '父分类id',
#     category_level int unsigned default 1 not null comment '分类级别',
#     modified_time timestamp default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP comment '修改时间'
# ) engine=innodb comment '商品分类表';

# create table if not exists goods_info
# (
#     goods_id int unsigned auto_increment not null primary key comment '商品id',
#     goods_name varchar(255) not null comment '商品名称',
#     goods_tsc varchar(255) comment '商品编码',
#     bar_code varchar(255) not null comment '商品条码',
#     goods_desc varchar(255) not null comment '商品描述',
#     one_category_id int unsigned not null comment '一级分类id',
#     two_category_id int unsigned not null comment '二级分类id',
#     three_category_id int unsigned not null comment '三级分类id',
#     goods_img varchar(255) not null comment '商品主图片',
#     goods_price decimal(10, 2) not null comment '商品价格',
#     goods_stock int unsigned not null comment '商品库存',
#     weight float comment '商品重量',
#     length float comment '商品长度',
#     height float comment '商品高度',
#     width float comment '商品宽度',
#     modified_time timestamp default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP comment '修改时间'
# ) engine=innodb comment '商品信息表';
CREATE TABLE IF NOT EXISTS goods_info
(
    goods_id INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY COMMENT '商品id',
    goods_name VARCHAR(255) NOT NULL COMMENT '商品名称',
    goods_spec VARCHAR(255) COMMENT '规格',
    goods_price VARCHAR(255) COMMENT '价格',
    goods_img_url VARCHAR(255) NOT NULL COMMENT '图片URL',
    goods_url VARCHAR(255) NOT NULL COMMENT '商品链接'
) ENGINE=InnoDB COMMENT='商品信息表';

# create table if not exists goods_history_price
# (
#     good_id int unsigned not null primary key comment '商品id',
#     price_history json not null comment '历史价格',
#     constraint fk_goods_id foreign key (good_id) references goods_info (goods_id)
# ) engine=innodb comment '商品历史价格表';
CREATE TABLE IF NOT EXISTS goods_history_price (
   good_id INT UNSIGNED NOT NULL,
   price_history JSON NOT NULL,
   PRIMARY KEY (good_id),
   CONSTRAINT fk_goods_id FOREIGN KEY (good_id) REFERENCES goods_info(goods_id) ON DELETE CASCADE
) ENGINE=InnoDB COMMENT='商品历史价格表';