function timeForToday(value) {
    const today = new Date();
    const timeValue = new Date(value);

    const betweenTime = Math.floor((today.getTime() - timeValue.getTime()) / 1000 / 60);
    if (betweenTime < 1) return '방금전';
    if (betweenTime < 60) {
        return `${betweenTime}분전`;
    }

    const betweenTimeHour = Math.floor(betweenTime / 60);
    if (betweenTimeHour < 24) {
        return `${betweenTimeHour}시간전`;
    }

    const betweenTimeDay = Math.floor(betweenTime / 60 / 24);
    if (betweenTimeDay < 365) {
        return `${betweenTimeDay}일전`;
    }

    return `${Math.floor(betweenTimeDay / 365)}년전`;
}

function fetchToAPI(uri, method, params) {
    return new Promise((resolve, reject) => {
        fetch(uri, {
            method: method,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(params)
        })
        .then(response => resolve(response.json()))
        .catch(reject);
    });
}

function getSessionUser() {
    return new Promise((resolve, reject) => {
        fetchToAPI('/user/session', 'GET')
            .then(user => {
                if (user.status && user.status === 400) {
                    location.href = '/login.html';
                    return;
                }
                document.querySelector("#sessionUser").innerHTML = user.userName;
            })
            .then(resolve)
            .catch(e => {
                location.href = '/login.html';
                reject(e);
            });
    })
}

function init() {
    getSessionUser()
        .then(() => {
            search(_pageId, _listCnt);
        })
}

function htmlToElement(html) {
    if (undefined === html || '' === html) {
        return;
    }
    let template = document.createElement("template");
    if (('content' in template)) {
        template.innerHTML = html.trim();
        return template.content.firstChild;
    } else {
        template = document.createElement("div");
        template.innerHTML = html.trim();
        return template.firstChild;
    }
}