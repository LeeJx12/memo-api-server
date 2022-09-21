function search(pageId, listCnt) {
    fetchToAPI(`/memo/list/${pageId}/${listCnt}`, 'GET')
        .then(memoList => {
            const ul = document.querySelector(".list-group");
            ul.innerHTML = '';
            memoList.forEach(memo => {
                const html = `
                    <a href="#" class="list-group-item list-group-item-action" aria-current="true" onClick="return false;">
                        <div class="d-flex w-100 justify-content-between">
                            <h5 class="mb-1">${memo.title}</h5>
                            <small>${timeForToday(memo.createdAt)}</small>
                        </div>
                        <p class="mb-1">${memo.memo}</p>
                        <small>${memo.userId}</small>
                    </a>
                `;

                const li = htmlToElement(html);
                li.addEventListener('click', e => viewMemo(memo.memoId));
                ul.append(li);
            });

            if (memoList.length === 0) {
                ul.append(htmlToElement(`<h4>등록된 메모가 없습니다.</h4>`))
            }
        })
}

function saveMemo() {
    const params = {
        title: document.querySelector("#writeModal #title").value,
        memo: document.querySelector("#writeModal #memo").value
    };
    fetchToAPI('/memo', 'POST', params)
        .then(() => search(_pageId, _listCnt))
        .then(() => {
            document.querySelector("#writeModal #title").value = '';
            document.querySelector("#writeModal #memo").value = '';
            document.querySelector("#closeWriteModal").click();
        });
}

function editMemo() {
    const params = {
        memoId: document.querySelector(".edit #memoId").value,
        title: document.querySelector(".edit #title").value,
        memo: document.querySelector(".edit #memo").value,
        userId: document.querySelector(".edit #userId").value
    };
    fetchToAPI(`/memo/${params.memoId}`, 'PUT', params)
        .then(() => search(_pageId, _listCnt));
}

function deleteMemo(memoId) {
    fetchToAPI(`/memo/${memoId}`, 'DELETE')
        .then(() => search(_pageId, _listCnt));
}

function viewMemo(memoId) {
    fetchToAPI(`/memo/${memoId}`, 'GET')
        .then(memo => {
            document.querySelector(".view").innerHTML = JSON.stringify(memo);
            document.querySelector(".edit #memoId").value = memo.memoId;
            document.querySelector(".edit #userId").value = memo.userId;
            document.querySelector(".edit #title").value = memo.title;
            document.querySelector(".edit #memo").value = memo.memo;
        })
}