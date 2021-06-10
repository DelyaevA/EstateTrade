--Создание пользователей

--1 Пользователь: Admin1, Пароль: 000000, Роль: Пользователь, Админ
insert into users (activation_code, email, grade, info_user, is_active, logo, password, phone,
    registration_date, reset_password, username, id)
values (null, 'noxodo1083@itwbuy.com', null, null, true, 'Admin1_285463programmer.png', '$2a$10$FuwR46PxRFJYY.dMaABjU.hUX/UITg3dLgrSk9yOqUs6k0AL16r66',
    null, '2021-04-20 00:00:00', null, 'Admin1', '402881bb798bcf9e01798bd817920000');
insert into user_roles (user_id,role_id)
values ('402881bb798bcf9e01798bd817920000', 1);
insert into user_roles (user_id,role_id)
values ('402881bb798bcf9e01798bd817920000', 2);

--2 Пользователь: Admin2, Пароль: 000000, Роль: Пользователь, Админ
insert into users (activation_code, email, grade, info_user, is_active, logo, password, phone,
    registration_date, reset_password, username, id)
values (null, 'yipig36931@isecv.com', null, null, true, 'Admin2_993717worker.png', '$2a$10$GSf/lbF9VsoupAeQNdWbWeVlo8OLOL3Byytuktl0..M5tBXPXfHY.',
    null, '2021-04-20 00:00:00', null, 'Admin2', '402881bb798bcf9e01798bfe68dd0001');
insert into user_roles (user_id,role_id)
values ('402881bb798bcf9e01798bfe68dd0001', 1);
insert into user_roles (user_id,role_id)
values ('402881bb798bcf9e01798bfe68dd0001', 2);

--3 Пользователь: Admin3, Пароль: 000000, Роль: Пользователь, Админ
insert into users (activation_code, email, grade, info_user, is_active, logo, password, phone,
    registration_date, reset_password, username, id)
values (null, 'holefe1819@sc2hub.com', null, null, true, 'Admin3_94296hacker.png', '$2a$10$hvH35R5EYyRWLcJe1AIEfey4SHUsqcAnlbDMHKONjeN1vRrXGzyi6',
    null, '2021-04-21 00:00:00', null, 'Admin3', '402881bb798c11c101798c1671290000');
insert into user_roles (user_id,role_id)
values ('402881bb798c11c101798c1671290000', 1);
insert into user_roles (user_id,role_id)
values ('402881bb798c11c101798c1671290000', 2);

--4 Пользователь: Nikolay Fedorov, Пароль: 111111, Роль: Пользователь
insert into users (activation_code, email, grade, info_user, is_active, logo, password, phone,
    registration_date, reset_password, username, id)
values (null, 'yofero8011@isecv.com', null, null, true, 'Nikolay Fedorov_616995man.png', '$2a$10$zarvhWIeu.aQ2pWnpfqeWu/kv2tw7ya4xkTfhb5wcZN3V.SbRm5v2',
    null, '2021-04-24 00:00:00', null, 'NikolayFedorov', '402881bb798c11c101798c1dd1030001');
insert into user_roles (user_id,role_id)
values ('402881bb798c11c101798c1dd1030001', 1);

--5 Пользователь: Kirill Ivanov, Пароль: 111111, Роль: Пользователь
insert into users (activation_code, email, grade, info_user, is_active, logo, password, phone,
    registration_date, reset_password, username, id)
values (null, 'tosac17737@sc2hub.com', null, null, true, 'Kirill Ivanov_27145boy.png', '$2a$10$4VgZf6HOubvMgkHJ/k6b0el2OZK5Qt85xD71cE24N7/7DhyWobsfu',
    null, '2021-04-24 00:00:00', null, 'KirillIvanov', '402881bb798c11c101798c22fae60002');
insert into user_roles (user_id,role_id)
values ('402881bb798c11c101798c22fae60002', 1);

--6 Пользователь: Aleksey Petrov, Пароль: 111111, Роль: Пользователь
insert into users (activation_code, email, grade, info_user, is_active, logo, password, phone,
    registration_date, reset_password, username, id)
values (null, 'nixoli4423@sc2hub.com', null, null, true, 'Aleksey Petrov_87037business-man.png' , '$2a$10$DHewgCZENiIO27REZb3YluLyaYoWIpDcimLY9BgLi1BnqWUQz90hy',
    null, '2021-04-27 00:00:00', null, 'AlekseyPetrov', '402881bb798c11c101798c2446d90003');
insert into user_roles (user_id,role_id)
values ('402881bb798c11c101798c2446d90003', 1);

--7 Пользователь: Alexander Kiylo, Пароль: 111111, Роль: Пользователь
insert into users (activation_code, email, grade, info_user, is_active, logo, password, phone,
    registration_date, reset_password, username, id)
values (null, 'soneri5143@sc2hub.com', null, null, true, 'Alexander Kiylo_179164graphic-designer.png', '$2a$10$muLWVYe.zV2S/N3HEk3ngu/M8l81UN2tZjX.7PhsDxQwbN2zp95Iu',
    null, '2021-04-28 00:00:00', null, 'AlexanderKiylo', '402881bb798c11c101798c2565830004');
insert into user_roles (user_id,role_id)
values ('402881bb798c11c101798c2565830004', 1);

--8 Пользователь: Maria Feoktistova, Пароль: 111111, Роль: Пользователь
insert into users (activation_code, email, grade, info_user, is_active, logo, password, phone,
    registration_date, reset_password, username, id)
values (null, 'covaco4690@rphinfo.com', null, null, true, 'Maria Feoktistova_108789girl.png', '$2a$10$1yLaR06cqbS3DovYVrmWdO23RI6nVaMhCUbiQmiRynx8ECuxtFfae',
    null, '2021-04-28 00:00:00', null, 'MariaFeoktistova', '402881bb798c11c101798c265dc30005');
insert into user_roles (user_id,role_id)
values ('402881bb798c11c101798c265dc30005', 1);

--9 Пользователь: Alina Kot, Пароль: 111111, Роль: Пользователь
insert into users (activation_code, email, grade, info_user, is_active, logo, password, phone,
    registration_date, reset_password, username, id)
values (null, 'jabiway293@rphinfo.com', null, null, true, 'Alina Kot_4215woman.png', '$2a$10$IAXrrxMKvXa8R7EhzXL9Eu759x5HWiqeN8g0iohWoRsNY37fz9DfW',
    null, '2021-04-28 00:00:00', null, 'AlinaKot', '402881bb798c11c101798c278e640006');
insert into user_roles (user_id,role_id)
values ('402881bb798c11c101798c278e640006', 1);

--10 Пользователь: Sofia Forinova, Пароль: 111111, Роль: Пользователь
insert into users (activation_code, email, grade, info_user, is_active, logo, password, phone,
    registration_date, reset_password, username, id)
values (null, 'veyoxev962@itwbuy.com', null, null, true, 'Sofia Forinova_15946second woman.png', '$2a$10$LkGmVz0UsZiutP/V8Jgyv.jCBSn.zXEg9JsdKNwP.rn4FhIlYZ0B.',
    null, '2021-04-29 00:00:00', null, 'SofiaForinova', '402881bb798c11c101798c28c64c0007');
insert into user_roles (user_id,role_id)
values ('402881bb798c11c101798c28c64c0007', 1);

--11 Пользователь: Viktor Semenov, Пароль: 111111, Роль: Пользователь
insert into users (activation_code, email, grade, info_user, is_active, logo, password, phone,
    registration_date, reset_password, username, id)
values (null, 'naveke5682@sc2hub.com', null, null, true, 'Viktor Semenov_20867511.jpg', '$2a$10$lkzVhNPty/NEjYpP2XmowOAcvdakNjHHOlxO8Q6CNfxHmx9PeGqgW',
    null, '2021-04-29 00:00:00', null, 'ViktorSemenov', '402881bb79a5ead80179a5f011970000');
insert into user_roles (user_id,role_id)
values ('402881bb79a5ead80179a5f011970000', 1);

--12 Пользователь: Aleksey Shats, Пароль: 111111, Роль: Пользователь
insert into users (activation_code, email, grade, info_user, is_active, logo, password, phone,
    registration_date, reset_password, username, id)
values (null, 'soposi7319@sc2hub.com', null, null, true, 'Aleksey Shats_31288812.jpg', '$2a$10$P4.cjCcpWUYabgfQJnehJukSyabQjNQxGzfD8yrpbM.ap873jGeAi',
    null, '2021-04-29 00:00:00', null, 'AlekseyShats', '402881bb79a5ead80179a5f011970001');
insert into user_roles (user_id,role_id)
values ('402881bb79a5ead80179a5f011970001', 1);

--13 Пользователь: Nikolay Feoktistov, Пароль: 111111, Роль: Пользователь
insert into users (activation_code, email, grade, info_user, is_active, logo, password, phone,
    registration_date, reset_password, username, id)
values (null, 'hedari5540@isecv.com', null, null, true, 'Nikolay Feoktistov_3983613.jpg', '$2a$10$ilfl3gK2yy.atXL.Fkf3aOZ5JOwkMAcG5zMxRyMnwC38Zy1iHLOCu',
    null, '2021-04-29 00:00:00', null, 'NikolayFeoktistov', '402881bb79a5ead80179a5f011970002');
insert into user_roles (user_id,role_id)
values ('402881bb79a5ead80179a5f011970002', 1);

--14 Пользователь: Valeriya Shilova, Пароль: 111111, Роль: Пользователь
insert into users (activation_code, email, grade, info_user, is_active, logo, password, phone,
    registration_date, reset_password, username, id)
values (null, 'yabim84820@rphinfo.com', null, null, true, 'Valeriya Shilova_52620714.jpg', '$2a$10$eqY0Tj4PF/Q3vMHfGqKzcuKo9b4i82rYsTx.8YbF2nftuiJALNun6',
    null, '2021-04-29 00:00:00', null, 'ValeriyaShilova', '402881bb79a5ead80179a5f011970003');
insert into user_roles (user_id,role_id)
values ('402881bb79a5ead80179a5f011970003', 1);

--15 Пользователь: Elena Maleeva, Пароль: 111111, Роль: Пользователь
insert into users (activation_code, email, grade, info_user, is_active, logo, password, phone,
    registration_date, reset_password, username, id)
values (null, 'nebiwi8607@rphinfo.com', null, null, true, 'Elena Maleeva_11533015.jpg', '$2a$10$KRkJ9.7ZHwY755KsMN9GYuMSV.ov15uhG5OBNoPqwHQBUfa2D6tZK',
    null, '2021-04-30 00:00:00', null, 'ElenaMaleeva', '402881bb79a5ead80179a5f011970004');
insert into user_roles (user_id,role_id)
values ('402881bb79a5ead80179a5f011970004', 1);

--16 Пользователь: Elizaveta Astafieva, Пароль: 111111, Роль: Пользователь
insert into users (activation_code, email, grade, info_user, is_active, logo, password, phone,
    registration_date, reset_password, username, id)
values (null, 'keyayay549@itwbuy.com', null, null, true, 'Elizaveta Astafieva_56885116.jpg', '$2a$10$yZ4974mKmwc8B4LxkiekQeoKIv3FNSiljhc5.Omt/vfX0/7an4bKu',
    null, '2021-04-30 00:00:00', null, 'ElizavetaAstafieva', '402881bb79a5ead80179a5f011970005');
insert into user_roles (user_id,role_id)
values ('402881bb79a5ead80179a5f011970005', 1);

--17 Пользователь: Tatiana Ivanova, Пароль: 111111, Роль: Пользователь
insert into users (activation_code, email, grade, info_user, is_active, logo, password, phone,
    registration_date, reset_password, username, id)
values (null, 'betix51883@itwbuy.com', null, null, true, 'Tatiana Ivanova_412717.jpg', '$2a$10$4BSakT4OYYYLMTi9aHq2CuonOgyONUNvY0EYR6uTypDDNBeGJQOOG',
    null, '2021-04-30 00:00:00', null, 'TatianaIvanova', '402881bb79a5ead80179a5f011970006');
insert into user_roles (user_id,role_id)
values ('402881bb79a5ead80179a5f011970006', 1);

--18 Пользователь: Yan Gross, Пароль: 111111, Роль: Пользователь
insert into users (activation_code, email, grade, info_user, is_active, logo, password, phone,
    registration_date, reset_password, username, id)
values (null, 'tetami4899@itwbuy.com', null, null, true, 'Yan Gross_5150418.jpg', '$2a$10$QvpiaUBK2NTtd7ydP/LNfuTo7iJ7sH.DEshqXN0U/VVCozWXbsmK6',
    null, '2021-04-30 00:00:00', null, 'YanGross', '402881bb79a5ead80179a5f011970007');
insert into user_roles (user_id,role_id)
values ('402881bb79a5ead80179a5f011970007', 1);

--19 Пользователь: Vitaly Ponomarev, Пароль: 111111, Роль: Пользователь
insert into users (activation_code, email, grade, info_user, is_active, logo, password, phone,
    registration_date, reset_password, username, id)
values (null, 'limateg209@itwbuy.com', null, null, true, 'Vitaly Ponomarev_17669319.jpg', '$2a$10$yD0VuX.IwB.ywwf6kwuADudqK.9D6gvoIapEsxpOmvslDuYGxCgtG',
    null, '2021-04-30 00:00:00', null, 'VitalyPonomarev', '402881bb79a5ead80179a5f011970008');
insert into user_roles (user_id,role_id)
values ('402881bb79a5ead80179a5f011970008', 1);

--20 Пользователь: Aleksey Zhkiharev, Пароль: 111111, Роль: Пользователь
insert into users (activation_code, email, grade, info_user, is_active, logo, password, phone,
    registration_date, reset_password, username, id)
values (null, 'vejelif115@itwbuy.com', null, null, true, 'Aleksey Zhkiharev_98230520.jpg', '$2a$10$DWFjpFVL5JyAUO.y8ImrRe/iB/vSyqMeqXD03LAtYp/xmq1ITnvQa',
    null, '2021-05-01 00:00:00', null, 'AlekseyZhkiharev', '402881bb79a5ead80179a5f011970009');
insert into user_roles (user_id,role_id)
values ('402881bb79a5ead80179a5f011970009', 1);

--21 Пользователь: Darya Orekhova, Пароль: 111111, Роль: Пользователь
insert into users (activation_code, email, grade, info_user, is_active, logo, password, phone,
    registration_date, reset_password, username, id)
values (null, 'jomic21803@itwbuy.com', null, null, true, 'Darya Orekhova_1969621.jpg', '$2a$10$5gIa3TSBPG3l9VQ4fvZWxukvChml2dpxrpivatkerUikuqXX1KOWy',
    null, '2021-05-02 00:00:00', null, 'DaryaOrekhova', '402881bb79a5ead80179a5f01197000a');
insert into user_roles (user_id,role_id)
values ('402881bb79a5ead80179a5f01197000a', 1);

--22 Пользователь: Evgeny Ivanov, Пароль: 111111, Роль: Пользователь
insert into users (activation_code, email, grade, info_user, is_active, logo, password, phone,
    registration_date, reset_password, username, id)
values (null, 'nigipo3815@itwbuy.com', null, null, true, 'Evgeny Ivanov_42830222.jpg', '$2a$10$5nQvdVOlgo5xfiRd5He5Yuv/HYUesFcX1jX9DkDDqhKNDollQmraC',
    null, '2021-05-03 00:00:00', null, 'EvgenyIvanov', '402881bb79a5ead80179a5f01197000b');
insert into user_roles (user_id,role_id)
values ('402881bb79a5ead80179a5f01197000b', 1);

--23 Пользователь: Vladislav Golov, Пароль: 111111, Роль: Пользователь
insert into users (activation_code, email, grade, info_user, is_active, logo, password, phone,
    registration_date, reset_password, username, id)
values (null, 'gorawo4251@rphinfo.com', null, null, true, 'Vladislav Golov_9284223.jpg', '$2a$10$pwIJIeCs0xHgj6.NqtAHX.8Y0JXSWnIZ3TCQwDfSZrd9HhQjzlnti',
    null, '2021-05-04 00:00:00', null, 'VladislavGolov', '402881bb79a5ead80179a5f01197000c');
insert into user_roles (user_id,role_id)
values ('402881bb79a5ead80179a5f01197000c', 1);

--24 Пользователь: Olesya Ivanova, Пароль: 111111, Роль: Пользователь
insert into users (activation_code, email, grade, info_user, is_active, logo, password, phone,
    registration_date, reset_password, username, id)
values (null, 'nedena6533@sc2hub.com', null, null, true, 'Olesya Ivanova_24560624.jpg', '$2a$10$2hkcbVDUJ03DFihNfO0mQ.BIaEtCRSgftPou/tvMd1hR8AfHc3AD2',
    null, '2021-05-05 00:00:00', null, 'OlesyaIvanova', '402881bb79a5ead80179a5f01197000d');
insert into user_roles (user_id,role_id)
values ('402881bb79a5ead80179a5f01197000d', 1);

--25 Пользователь: Mariya Urazova, Пароль: 111111, Роль: Пользователь
insert into users (activation_code, email, grade, info_user, is_active, logo, password, phone,
    registration_date, reset_password, username, id)
values (null, 'hikam32969@sc2hub.com', null, null, true, 'Mariya Urazova_88624025.jpg', '$2a$10$1wiL8jl0gkKh2IxL0pVs4uo1Ty4y4SVVmOo9FldHcZtLBUrcGB3tG',
    null, '2021-05-06 00:00:00', null, 'MariyaUrazova', '402881bb79a5ead80179a5f01197000e');
insert into user_roles (user_id,role_id)
values ('402881bb79a5ead80179a5f01197000e', 1);

