import {API_BASE_URL, LIST_SIZE, ACCESS_TOKEN, USER_LIST_SIZE} from '../constants';

let request = (options, contentType={'Content-Type': 'application/json'}) => {

    const headers = new Headers(contentType)

    if(localStorage.getItem(ACCESS_TOKEN)) {
        headers.append('Authorization', 'Bearer ' + localStorage.getItem(ACCESS_TOKEN))
    }

    const defaults = {headers: headers};
    options = Object.assign({}, defaults, options);

    return fetch(options.url, options)
        .then(response =>
            response.json().then(json => {
                if(!response.ok) {
                    return Promise.reject(json);
                }
                return json;
            })
        );
};

function uploadSingleFile(options, file) {

    let body = new FormData();
    body.append('file', file.file);

    const headers = new Headers({"Content-Type": "multipart/form-data"})

    if(localStorage.getItem(ACCESS_TOKEN)) {
        headers.append('Authorization', 'Bearer ' + localStorage.getItem(ACCESS_TOKEN))
    }

    const defaults = {headers: headers};
    options = Object.assign({}, defaults, options);

    return fetch(options.url,{ method: 'POST',headers:{
            'Authorization': 'Bearer ' + localStorage.getItem(ACCESS_TOKEN),
        } , body :body} )
        .then(response =>
            response.json().then(json => {
                if(!response.ok) {
                    return Promise.reject(json);
                }
                return json;
            })
        );
}

export function activate(code) {
    return request({
        url: API_BASE_URL + "/activate/" + code,
    })
}

export function inputPassword(recReset) {
    return request({
        url: API_BASE_URL + "/resetPassword",
        method: 'PUT',
        body: JSON.stringify(recReset)
    })
}

export function oauth2Login(code) {
    return request({
        url: API_BASE_URL + "/auth/oauth_login/" + code,
        method: 'POST',
        body: JSON.stringify(code)
    })
}

export function formatLabels(dateArray) {
    return dateArray.map(date => formatDate(date));
}

export function formatDate(stringDate) {
    if (stringDate) {
        let d = new Date(`${stringDate}`);
        let ye = new Intl.DateTimeFormat('ru', {year: 'numeric'}).format(d);
        let mo = new Intl.DateTimeFormat('ru', {month: 'short'}).format(d);
        let da = new Intl.DateTimeFormat('ru', {day: '2-digit'}).format(d);
        if (da[0] === "0") {
            da = da[1];
        }
        return (`${da} ${mo} ${ye}`);
    } else {
        return null;
    }
}

export function getReviews(username) {
    return request({
        url: API_BASE_URL + "/reviews/" + username,
        method: 'GET',
    })
}

export function getAllItems(page, size) {
    page = page || 0;
    size = size || LIST_SIZE;

    return request({
        url: API_BASE_URL + "/items?page=" + page + "&size=" + size,
        method: 'GET'
    });
}

export function getAllAuctionsForAdmin(page, size) {
    page = page || 0;
    size = size || LIST_SIZE;

    return request({
        url: API_BASE_URL + "/admin/auctions?page=" + page + "&size=" + size,
        method: 'GET'
    });
}

export function getAllItemsWithReports(page, size) {
    page = page || 0;
    size = size || LIST_SIZE;

    return request({
        url: API_BASE_URL + "/reports/items?page=" + page + "&size=" + size,
        method: 'GET'
    });
}

export function getAllUsersWithReports(page, size) {
    page = page || 0;
    size = size || LIST_SIZE;

    return request({
        url: API_BASE_URL + "/reports/users?page=" + page + "&size=" + size,
        method: 'GET'
    });
}

export function getAllItemsForAdmin(page, size) {
    page = page || 0;
    size = size || LIST_SIZE;

    return request({
        url: API_BASE_URL + "/items/admin?page=" + page + "&size=" + size,
        method: 'GET'
    });
}

export function getAllUsers(page, size) {
    page = page || 0;
    size = size || USER_LIST_SIZE;

    return request({
        url: API_BASE_URL + "/users?page=" + page + "&size=" + size,
        method: 'GET'
    });
}

export function login(loginRequest) {
    return request({
        url: API_BASE_URL + "/auth/signin",
        method: 'POST',
        body: JSON.stringify(loginRequest)
    });
}

export function getUserProfile(username) {
    return request({
        url: API_BASE_URL + "/users/" + username,
        method: 'GET'
    });
}

export function addContact(userId) {
    return request({
        url: API_BASE_URL + "/messages/" + userId + "/addContact",
        method: 'GET'
    });
}




export function banUser(username) {
    return request({
        url: API_BASE_URL + "/admin/users/" + username + "/ban",
        method: 'PUT'
    });
}

export function unbanUser(username) {
    return request({
        url: API_BASE_URL + "/admin/users/" + username + "/unban",
        method: 'PUT'
    });
}

export function updateUserByAdmin() {
    return request({
        url: API_BASE_URL + "/admin/users/",
        method: 'GET'
    });
}

export function resetPasswordByAdmin(username, password) {
    return request({
        url: API_BASE_URL + "/users/" + username + "/changePassword",
        method: 'PUT',
        body: JSON.stringify(password)
    });
}


export function moderate(id, values, path="items") {
    return request({
        url: API_BASE_URL + "/admin/" + path + "/" + id + "/moderate",
        method: 'PUT',
        body: JSON.stringify(values)
    });
}


export function changeAuthority(username, values) {
    return request({
        url: API_BASE_URL + "/admin/users/" + username + "/changeAuthority",
        method: 'PUT',
        body: JSON.stringify(values)
    });
}

export function changeCategory(id, values, type) {
    return request({
        url: API_BASE_URL + "/admin/" + type + "/" + id + "/changeCategory",
        method: 'PUT',
        body: JSON.stringify(values)
    });
}

export function makeAdmin(username) {
    return request({
        url: API_BASE_URL + "/users/" + username + "/makeAdmin",
        method: 'GET'
    });
}

export function signup(signupRequest) {
    return request({
        url: API_BASE_URL + "/auth/signup",
        method: 'POST',
        body: JSON.stringify(signupRequest)
    });
}

export function changePassword(passwords) {
    return request({
        url: API_BASE_URL + "/users/me/changePassword",
        method: 'PUT',
        body: JSON.stringify(passwords)
    });
}

export function checkUsernameAvailability(username) {
    return request({
        url: API_BASE_URL + "/user/checkUsernameAvailability?username=" + username,
        method: 'GET'
    });
}

export function checkEmailAvailability(email) {
    return request({
        url: API_BASE_URL + "/user/checkEmailAvailability?email=" + email,
        method: 'GET'
    });
}


export function getCurrentUser() {
    if(!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_BASE_URL + "/users/me",
        method: 'GET'
    });
}

export function getUser(username) {
    return request({
        url: API_BASE_URL + "/users/" + username,
        method: 'GET'
    });
}

export function getUserFullI(username) {
    return request({
        url: API_BASE_URL + "/admin/users/" + username,
        method: 'GET'
    });
}

export function getRegistrationData() {
    return request({
        url: API_BASE_URL + "/data/userDataRegistration",
        method: 'GET'
    })
}

export function getItem(itemId) {
    return request({
        url: API_BASE_URL + "/items/" + itemId,
        method: 'GET'
    });
}

export function getAuction(auctionId) {
    return request({
        url: API_BASE_URL + "/auctions/" + auctionId,
        method: 'GET'
    });
}

export function getAllBetForAuction(auctionId){
    return request({
        url: API_BASE_URL + "/bets/" + auctionId,
        method: 'GET'
    });
}

export function getReview(username) {
    return request({
        url: API_BASE_URL + "/review/" + username,
        method: 'GET'
    });
}

export function getAllReportsByItemId(itemId) {
    return request({
        url: API_BASE_URL + "/reports/item/" + itemId,
        method: 'GET'
    });
}

export function getAllReportsByUserId(userId) {
    return request({
        url: API_BASE_URL + "/reports/user/" + userId,
        method: 'GET'
    });
}

export function getAllAuctions(page, size) {
    page = page || 0;
    size = size || LIST_SIZE;

    return request({
        url: API_BASE_URL + "/auctions?page=" + page + "&size=" + size,
        method: 'GET'
    });
}

export function getAuctionFullInfo(auctionId) {
    return request({
        url: API_BASE_URL + "/admin/auctions/" + auctionId,
        method: 'GET'
    });
}
export function deleteBet(betId) {
    return request({
        url: API_BASE_URL + "/admin/bets/" + betId,
        method: 'DELETE'
    });
}

export function castBet(auctionId, betData) {
    return request({
        url: API_BASE_URL + "/bets/" + auctionId,
        method: 'POST',
        body: JSON.stringify(betData)
    });
}

export function addReportItem(itemId, reportData){
    return request({
        url: API_BASE_URL + "/reports/items/" + itemId,
        method: 'POST',
        body: JSON.stringify(reportData)
    });
}

export function addReportUser(userId, reportData){
    return request({
        url: API_BASE_URL + "/reports/users/" + userId,
        method: 'POST',
        body: JSON.stringify(reportData)
    });
}

export function unfreeze(auctionId) {
    return request({
        url: API_BASE_URL + "/admin/auctions/" + auctionId + "/unfreeze",
        method: 'PUT'
    });
}

export function updateItem(itemData, itemId) {
    return request({
        url: API_BASE_URL + "/items/" + itemId,
        method: 'PUT',
        body: JSON.stringify(itemData)
    });
}

export function updateUser(userData) {
    return request({
        url: API_BASE_URL + "/users",
        method: 'PUT',
        body: JSON.stringify(userData)
    });
}
export function deleteUser(username) {
    return request({
        url: API_BASE_URL + "/admin/users/" + username,
        method: 'DELETE'
    });
}

export function deleteItem(itemId) {
    return request({
        url: API_BASE_URL + "/items/" + itemId,
        method: 'DELETE'
    });
}

export function deleteItemByUser(itemId) {
    return request({
        url: API_BASE_URL + "/item/" + itemId,
        method: 'DELETE'
    });
}

export function createItem(itemData) {
    return request({
        url: API_BASE_URL + "/items",
        method: 'POST',
        body: JSON.stringify(itemData)
    });
}

export function createAuction(auctionData) {
    return request({
        url: API_BASE_URL + "/auctions",
        method: 'POST',
        body: JSON.stringify(auctionData)
    });
}

export function resetPassword(usernameOrEmail) {
    return request({
        url: API_BASE_URL + "/resetPassword/" + usernameOrEmail,
        method: 'PUT',
    });
}

export function endAuctionNow(auctionId) {
    return request({
        url: API_BASE_URL + "/auctions/end/now/" + auctionId,
        method: 'POST',
    });
}

export function endAuction(auctionId) {
    return request({
        url: API_BASE_URL + "/auctions/end/" + auctionId,
        method: 'POST',
    });
}

export function createReview(username, reviewData) {
    return request({
        url: API_BASE_URL + "/reviews/" + username,
        method: 'POST',
        body: JSON.stringify(reviewData)
    });
}

export function updateReview(username, reviewData) {
    return request({
        url: API_BASE_URL + "/reviews/" + username,
        method: 'PUT',
        body: JSON.stringify(reviewData)
    });
}

export function setAvatar(avatar) {
    return uploadSingleFile({
        url: API_BASE_URL + "/files/upload/logo",
        method: 'POST',
    }, avatar);
}

export function getUserCreatedItems(username, page, size) {
    page = page || 0;
    size = size || LIST_SIZE;

    return request({
        url: API_BASE_URL + "/users/" + username + "/items?page=" + page + "&size=" + size,
        method: 'GET'
    });
}

export function getUserFCreatedItems(username, page, size) {
    page = page || 0;
    size = size || LIST_SIZE;

    return request({
        url: API_BASE_URL + "/users/" + username + "/useritems?page=" + page + "&size=" + size,
        method: 'GET'
    });
}

export function getUserCreatedAuctions(username, page, size) {
    page = page || 0;
    size = size || LIST_SIZE;

    return request({
        url: API_BASE_URL + "/users/" + username + "/auctions?page=" + page + "&size=" + size,
        method: 'GET'
    });
}

export function getUserFCreatedAuctions(username, page, size) {
    page = page || 0;
    size = size || LIST_SIZE;

    return request({
        url: API_BASE_URL + "/users/" + username + "/userauctions?page=" + page + "&size=" + size,
        method: 'GET'
    });
}

export function getItemsByQuery(searchOptions, page, size) {
    page = page || 0;
    size = size || LIST_SIZE;

    return request({
        url: API_BASE_URL + "/items/search?page=" + page + "&size=" + size,
        method: 'POST',
        body: JSON.stringify(searchOptions)
    });
}

export function getAuctionsByQuery(searchOptions, page, size) {
    page = page || 0;
    size = size || LIST_SIZE;

    return request({
        url: API_BASE_URL + "/auctions/search?page=" + page + "&size=" + size,
        method: 'POST',
        body: JSON.stringify(searchOptions)
    });
}

export function getUsers() {
    if (!localStorage.getItem("accessToken")) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_BASE_URL + "/users/summaries",
        method: "GET",
    });
}

export function countNewMessages(senderId, recipientId) {
    if (!localStorage.getItem("accessToken")) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_BASE_URL + "/messages/" + senderId + "/" + recipientId + "/count",
        method: "GET",
    });
}

export function findChatMessages(senderId, recipientId) {
    if (!localStorage.getItem("accessToken")) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_BASE_URL + "/messages/" + senderId + "/" + recipientId,
        method: "GET",
    });
}

export function findChatMessage(id) {
    if (!localStorage.getItem("accessToken")) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_BASE_URL + "/messages/" + id,
        method: "GET",
    });
}

export function setPicture(itemId, picture) {
    return uploadSingleFile({
        url: API_BASE_URL + "/files/pictures/" + itemId,
        method: 'POST',
    }, picture);
}

    export function setAuctionPicture(auctionId, picture) {
        return uploadSingleFile({
            url: API_BASE_URL + "/files/pictures/auction/" + auctionId,
            method: 'POST',
        }, picture);
}
