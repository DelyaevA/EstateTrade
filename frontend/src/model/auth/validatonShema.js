// Schema for yup
import * as Yup from "yup";
import {NAME_MAX_LENGTH, NAME_MIN_LENGTH, PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH} from "../../constants";

// used for validation signup
const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
export const VALIDATION_SIGNUP_SCHEMA = Yup.object().shape({
    username: Yup.string()
        .min(PASSWORD_MIN_LENGTH, "Логин должен быть не менее " + PASSWORD_MIN_LENGTH + " символов")
        .max(PASSWORD_MAX_LENGTH, "Логин должен быть не больше " + PASSWORD_MAX_LENGTH + " символов")
        .required("*Это обязательное поле"),
    email: Yup.string()
        .email("*Должен быть валидный e-mail")
        .max(100, "*e-mail должен состоять не больше, чем из 100 символов")
        .required("*Это обязательное поле"),
    password: Yup.string()
        .min(PASSWORD_MIN_LENGTH, "Пароль должен содержать не менее " + PASSWORD_MIN_LENGTH + " символов")
        .max(PASSWORD_MAX_LENGTH, "Пароль должен содержать не более " + PASSWORD_MAX_LENGTH + " символов")
        .required("*Это обязательное поле"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Пароли не совпадают')
        .required('Обязательно')
});

// used for validation login
export const VALIDATION_LOGIN_SCHEMA = Yup.object().shape({
    usernameOrEmail: Yup.string()
        .required("*Это обязательное поле"),
    password: Yup.string()
        .min(PASSWORD_MIN_LENGTH, "Пароль должен содержать не менее " + PASSWORD_MIN_LENGTH + " символов")
        .max(PASSWORD_MAX_LENGTH, "Пароль должен содержать не более " + PASSWORD_MAX_LENGTH + " символов")
        .required("*Это обязательное поле"),
});

export const VALIDATION_PASSWORD_SCHEMA = Yup.object().shape({
    password: Yup.string()
        .min(PASSWORD_MIN_LENGTH, "Пароль должен содержать не менее " + PASSWORD_MIN_LENGTH + " символов")
        .max(PASSWORD_MAX_LENGTH, "Пароль должен содержать не более " + PASSWORD_MAX_LENGTH + " символов")
        .required("*Это обязательное поле"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Пароли не совпадают')
        .required('Обязательно'),
});

// used for validation update
export const VALIDATION_UPDATE_SCHEMA = Yup.object().shape({
    password: Yup.string()
        .min(PASSWORD_MIN_LENGTH, "Пароль должен содержать не менее " + PASSWORD_MIN_LENGTH + " символов")
        .max(PASSWORD_MAX_LENGTH, "Пароль должен содержать не более " + PASSWORD_MAX_LENGTH + " символов")
        .required("*Это обязательное поле"),
});

// used for validation update
export const VALIDATION_UPLOAD_AVATAR_SCHEMA = Yup.object().shape({
    file: Yup.mixed().required()
});

export const VALIDATION_RESET_PASSWORD_SCHEMA = Yup.object().shape({
    password: Yup.string()
        .min(PASSWORD_MIN_LENGTH, "Пароль должен содержать не менее " + PASSWORD_MIN_LENGTH + " символов")
        .max(PASSWORD_MAX_LENGTH, "Пароль должен содержать не более " + PASSWORD_MAX_LENGTH + " символов")
        .required("*Это обязательное поле"),
});

export const VALIDATION_CHANGE_AUTHORITY_SCHEMA = Yup.object().shape({
    authority: Yup.string()
        .required("*Это обязательное поле"),
});

export const VALIDATION_CHANGE_CATEGORY_SCHEMA = Yup.object().shape({
    category: Yup.string()
        .required("*Это обязательное поле"),
});

export const VALIDATION_MODERATING_SCHEMA = Yup.object().shape({
    isApproved: Yup.string()
        .required("*Это обязательное поле"),
    comment: Yup.string()
});

export const VALIDATION_SEARCH = Yup.object().shape({
    category: Yup.string(),
    query: Yup.string(),
    minPrice: Yup.number()
        .min(0, "*Минимальная стоимость товара не может быть меньше 0!"),
    maxPrice: Yup.number()
        .min(0, "*Максимальная стоимость товара не может быть меньше 0!")

});

export const VALIDATION_CHANGE_PASSWORD = Yup.object().shape({
    oldPassword: Yup.string()
        .min(PASSWORD_MIN_LENGTH, "Пароль должен содержать не менее " + PASSWORD_MIN_LENGTH + " символов")
        .max(PASSWORD_MAX_LENGTH, "Пароль должен содержать не более " + PASSWORD_MAX_LENGTH + " символов")
        .required("*Это обязательное поле"),
    newPassword: Yup.string()
        .min(PASSWORD_MIN_LENGTH, "Пароль должен содержать не менее " + PASSWORD_MIN_LENGTH + " символов")
        .max(PASSWORD_MAX_LENGTH, "Пароль должен содержать не более " + PASSWORD_MAX_LENGTH + " символов")
        .required("*Это обязательное поле"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword')], 'Пароли не совпадают')
        .required("*Это обязательное поле"),
});

export const VALIDATION_NEW_ITEM = Yup.object().shape({
    name: Yup.string()
        .required("*Заголовок объявления необходим для заполнения!"),
    category: Yup.string()
        .required("*Категория товара необходима для заполнения!"),
    description: Yup.string()
        .required("*Описание товара необходима для заполнения!"),
    address: Yup.string()
        .required("*Адрес необходим для заполнения!"),
    price: Yup.number()
        .min(0, "*Стоимость товара не может быть меньше 0!")
        .required("*Стоимость товара необходима для заполнения!"),
    amount: Yup.number()
        .min(1, "*Количество товара не может быть меньше 1!")
        .required("*Количество товара необходимо для заполнения!"),

});

export const VALIDATION_UPLOAD_PICTURE_SCHEMA = Yup.object().shape({
    file: Yup.mixed().required()
});

export const VALIDATION_NEW_AUCTION = Yup.object().shape({
    name: Yup.string()
        .required("*Заголовок объявления необходим для заполнения!"),
    category: Yup.string()
        .required("*Категория товара необходима для заполнения!"),
    description: Yup.string()
        .required("*Описание товара необходима для заполнения!"),
    address: Yup.string()
        .required("*Адрес необходим для заполнения!"),
    minPrice: Yup.number()
        .min(0, "*Стоимость товара не может быть меньше 0!")
        .required("*Стоимость товара необходима для заполнения!"),
    endPrice: Yup.number()
        .min(0, "*Стоимость товара не может быть меньше 0!")
        .required("*Стоимость товара необходима для заполнения!")
        .test('тест на ставки для аукциона', '*Стоимость выкупа должна быть больше, чем начальная',
        function(value) {
            let value1 = this.resolve(Yup.ref("minPrice"));
            let value2 = this.resolve(Yup.ref("endPrice"));
            return value1 <= value2;
        })

});

export const VALIDATION_NEW_REPORT = Yup.object().shape({
    description: Yup.string()
        .required("*Описание жалобы необходимо для заполнения!"),
});

export const VALIDATION_USERNAME_OR_EMAIL_SCHEMA = Yup.object().shape({
    usernameOrEmail: Yup.string()
        .required("*Это обязательное поле"),
});

export const VALIDATION_NEW_REVIEW = Yup.object().shape({
    review: Yup.string()
        .required("*Это обязательное поле"),
    score: Yup.string()
        .required(),
});
