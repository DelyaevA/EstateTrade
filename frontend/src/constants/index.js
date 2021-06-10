export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';
export const API_CHAT_URL = API_BASE_URL.replace("/api", "");
export const ACCESS_TOKEN = 'accessToken';
export const BASE_LOGO_PATH = API_BASE_URL + "/files/avatars/"
export const BASE_PICTURE_PATH = API_BASE_URL + "/files/pictures/"
export const BASE_AUCTION_PICTURE_PATH = API_BASE_URL + "/files/pictures/auction/"

export const NAME_MIN_LENGTH = 4;
export const NAME_MAX_LENGTH = 40;

export const GOOGLE_AUTH_URL = API_CHAT_URL +'/oauth2/authorization/google'

export const LIST_SIZE = 9;

export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 15;

export const EMAIL_MAX_LENGTH = 40;

export const PHONE_MIN_LENGTH = 11;

export const PASSWORD_MIN_LENGTH = 6;
export const PASSWORD_MAX_LENGTH = 20;

export const USER_LIST_SIZE = 15;

export const ITEM_TYPE = {
    1: 'Уникальное',
    2: 'Неуникальное'
}


export const CONDITION = {
    1: 'Новая вещь',
    2: 'Б/У'
}

export const CATEGORY = {
    0 : 'Любая категория',
    1: 'Транспорт',
    11: 'Автомобили',
    12: 'Мотоциклы и мототехника',
    13: 'Грузовики и спецтехника',
    14: 'Водный транспорт',
    15: 'Запчасти и аксессуары',
    2: 'Недвижимость',
    21: 'Квартиры',
    22: 'Комнаты',
    23: 'Дома, дачи, коттеджи',
    24: 'Земельные участки',
    25: 'Гаражи и машиноместа',
    26: 'Коммерческая недвижимость',
    27: 'Недвижимость за рубежом',
    3: 'Работа',
    31: 'Вакансии',
    32: 'Резюме',
    4: 'Услуги',
    5: 'Личные вещи',
    51: 'Одежда, обувь, аксессуары',
    52: 'Детская одежда и обувь',
    53: 'Товары для детей и игрушки',
    54: 'Часы и украшения',
    55: 'Красота и здоровье',
    6: 'Для дома и дачи',
    61: 'Бытовая техника',
    62: 'Мебель и интерьер',
    63: 'Посуда и товары для кухни',
    64: 'Продукты питания',
    65: 'Ремонт и строительство',
    66: 'Растения',
    7: 'Бытовая электроника',
    71: 'Аудио и видео',
    72: 'Игры, приставки и программы',
    73: 'Настольные компьютеры',
    74: 'Ноутбуки',
    75: 'Оргтехника и расходники',
    76: 'Планшеты и электронные книги',
    77: 'Телефоны',
    78: 'Товары для компьютера',
    79: 'Фототехника',
    8: 'Хобби и отдых',
    81: 'Билеты и путешествия',
    82: 'Велосипеды',
    83: 'Книги и журналы',
    84: 'Коллекционирование',
    85: 'Музыкальные инструменты',
    86: 'Охота и рыбалка',
    87: 'Спорт и отдых',
    9: 'Животные',
    91: 'Собаки',
    92: 'Кошки',
    93: 'Птицы',
    94: 'Аквариум',
    95: 'Другие животные',
    96: 'Товары для животных',
    a: 'Готовый бизнес и оборудование',
    a1: 'Готовый бизнес',
    a2: 'Оборудование для бизнеса'
}

export const CATEGORY_REPORTS_ITEM = {
    1: 'Свой вариант',
    2: 'Неверное описание, фото',
    3: 'Мошенник',
    4: 'Объявление нарушает правила',
    5: 'Уже продано'
}

export const CATEGORY_REPORTS_USER = {
    1: 'Свой вариант',
    2: 'Непорядочный продавец',
    3: 'Мошенник',
    4: 'Оскробления'
}
