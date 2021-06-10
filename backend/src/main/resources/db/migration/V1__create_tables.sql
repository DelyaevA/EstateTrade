-- Предварительное удаление связей талиц
alter table if exists auctions drop constraint if exists FK8unim8kevgxstq1of0l3l5c56;
alter table if exists bets drop constraint if exists FKoar4jt6km2jl8q6xtc4bxm5rs;
alter table if exists bets drop constraint if exists FK7wiqvktpwwlfp256eelwiibci;
alter table if exists items drop constraint if exists FK72fe854se0ydxkxchp0qq58d8;
alter table if exists reports drop constraint if exists FK2o32rer9hfweeylg7x8ut8rj2;
alter table if exists reports drop constraint if exists FK2kmyy6fyd3ho2xdc7nn75milx;
alter table if exists reviews drop constraint if exists FK23i3pg4gwwn3lu1lt5lykj2lj;
alter table if exists reviews drop constraint if exists FK2fbmducna9wit1mcfn18y71md;
alter table if exists user_roles drop constraint if exists FKh8ciramu9cc9q3qcqiv4ue8a6;
alter table if exists user_roles drop constraint if exists FKhfh9dx7w3ubf1co1vdev94g3f;
-- Предварительное удаление таблиц
drop table if exists addresses cascade;
drop table if exists auctions cascade;
drop table if exists bets cascade;
drop table if exists chat_messages cascade;
drop table if exists chat_rooms cascade;
drop table if exists contacts cascade;
drop table if exists items cascade;
drop table if exists orders cascade;
drop table if exists reports cascade;
drop table if exists reviews cascade;
drop table if exists roles cascade;
drop table if exists user_roles cascade;
drop table if exists users cascade;
-- Создание таблиц
-- Таблица адреса
create table addresses (
    id varchar(255) not null,
    address varchar(255),
    geo_lat float8,
    geo_lon float8,
    primary key (id));
-- Таблица аукционы
create table auctions (
    id varchar(255) not null,
    created_at timestamp not null,
    updated_at timestamp not null,
    created_by varchar(255),
    updated_by varchar(255),
    auction_time varchar(255),
    category varchar(255),
    comment varchar(255),
    condition varchar(255),
    days_action varchar(255),
    description varchar(255),
    end_price int8,
    expiration_date_time timestamp,
    freeze_data_time timestamp,
    is_approved boolean not null,
    is_freeze boolean not null,
    is_moderated boolean not null,
    max_price int8,
    min_price int8,
    name varchar(255),
    pictures varchar(255),
    address_id varchar(255),
    primary key (id));
-- Таблица ставки
create table bets (
    id varchar(255) not null,
    created_at timestamp not null,
    updated_at timestamp not null,
    created_by varchar(255),
    updated_by varchar(255),
    price int8,
    auction_id varchar(255) not null,
    user_id varchar(255) not null,
    primary key (id));
-- Таблица сообщения в чате
create table chat_messages (
    id varchar(255) not null,
    chat_id varchar(255),
    content varchar(255),
    recipient_id varchar(255),
    recipient_name varchar(255),
    sender_id varchar(255),
    sender_name varchar(255),
    status int4,
    timestamp timestamp,
    primary key (id));
-- Таблица чат комнаты
create table chat_rooms (
    id varchar(255) not null,
    chat_id varchar(255),
    recipient_id varchar(255),
    sender_id varchar(255),
    primary key (id));
-- Таблица контакты
create table contacts (
id varchar(255) not null,
first_user varchar(255),
second_user varchar(255),
primary key (id));
-- Таблица объявления
create table items (
    id varchar(255) not null,
    created_at timestamp not null,
    updated_at timestamp not null,
    created_by varchar(255),
    updated_by varchar(255),
    amount int8,
    category varchar(255),
    comment varchar(255),
    condition varchar(255),
    description varchar(255),
    expiration_date_time timestamp,
    is_approved boolean not null,
    is_moderated boolean not null,
    item_type varchar(255),
    name varchar(255),
    price int8,
    address_id varchar(255),
    primary key (id));
-- Таблица заказы
create table orders (
    id varchar(255) not null,
    title varchar(255),
    primary key (id));
-- Таблица жалобы
create table reports (
    id varchar(255) not null,
    category int4,
    description varchar(255),
    item_id varchar(255),
    user_id varchar(255),
    primary key (id));
-- Таблица оценки пользователей
create table reviews (
    id varchar(255) not null,
    created_at date,
    review varchar(255),
    score int4 not null,
    creator_id varchar(255),
    reviewed_id varchar(255),
    primary key (id));
-- Таблица роли
create table roles (
    id int8 generated by default as identity,
    name varchar(60),
    primary key (id));
-- Таблица пользователи
create table user_roles (
    user_id varchar(255) not null,
     role_id int8 not null,
     primary key (user_id, role_id));
-- Таблица Пользователи
create table users (
    id varchar(255) not null,
    activation_code varchar(255),
    email varchar(255),
    grade float8,
    info_user varchar(255),
    is_active boolean,
    logo varchar(255),
    password varchar(255),
    phone varchar(255),
    registration_date timestamp,
    reset_password varchar(255),
    username varchar(255),
    primary key (id));
-- Создание связей табллиц
alter table if exists roles add constraint UK_nb4h0p6txrmfc0xbrd1kglp9t unique (name);
alter table if exists users add constraint UKr43af9ap4edm43mmtq01oddj6 unique (username);
alter table if exists users add constraint UK6dotkott2kjsp8vw4d0m25fb7 unique (email);
alter table if exists auctions add constraint FK8unim8kevgxstq1of0l3l5c56 foreign key (address_id) references addresses;
alter table if exists bets add constraint FKoar4jt6km2jl8q6xtc4bxm5rs foreign key (auction_id) references auctions;
alter table if exists bets add constraint FK7wiqvktpwwlfp256eelwiibci foreign key (user_id) references users;
alter table if exists items add constraint FK72fe854se0ydxkxchp0qq58d8 foreign key (address_id) references addresses;
alter table if exists reports add constraint FK2o32rer9hfweeylg7x8ut8rj2 foreign key (user_id) references users;
alter table if exists reports add constraint FK2kmyy6fyd3ho2xdc7nn75milx foreign key (item_id) references items;
alter table if exists reviews add constraint FK23i3pg4gwwn3lu1lt5lykj2lj foreign key (creator_id) references users;
alter table if exists reviews add constraint FK2fbmducna9wit1mcfn18y71md foreign key (reviewed_id) references users;
alter table if exists user_roles add constraint FKh8ciramu9cc9q3qcqiv4ue8a6 foreign key (role_id) references roles;
alter table if exists user_roles add constraint FKhfh9dx7w3ubf1co1vdev94g3f foreign key (user_id) references users;







