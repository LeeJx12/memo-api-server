function search(pageId, listCnt) {
    fetchToAPI(`/memo/list/${pageId}/${listCnt}`, 'GET')
        .then(memoList => {
            const ul = document.querySelector(".list-group");
            ul.innerHTML = '';
            memoList.forEach(memo => {
                const html = `
                    <a href="#" class="list-group-item list-group-item-action" aria-current="true" onClick="return false;">
                        <div class="d-flex w-100 justify-content-between">
                            <h5 class="mb-1 text-truncate">${memo.title}</h5>
                            <small>${timeForToday(memo.createdAt)}</small>
                        </div>
                        <p class="mb-1 text-truncate">${memo.memo}</p>
                        <small>${memo.writerName}</small>
                    </a>
                `;

                const li = htmlToElement(html);
                li.addEventListener('click', e => viewMemo(memo.memoId));
                ul.append(li);
            });

            if (memoList.length === 0) {
                ul.append(htmlToElement(`<div class="m-auto my-5"><h4>등록된 메모가 없습니다.</h4></div>`))
            }

            return memoList.length > 0;
        })
        .then(showPagination)
}

function showPagination(isShow) {
    const nav = document.querySelector("#pagination");
    const ul = nav.querySelector("ul.pagination");
    ul.innerHTML = '';
    if (isShow) {
        fetchToAPI(`/memo/list/cnt`)
            .then(totalCnt => {
                const totalPage = Math.ceil(totalCnt / _listCnt);

                if (1 === totalPage) {
                    !nav.classList.contains('d-none') && nav.classList.add('d-none');
                    return;
                }

                if (_pageId - 2 >= 1) {
                    ul.append(htmlToElement(`<li class="page-item"><a class="page-link" href="#" onClick="return false;" data-id="${_pageId-2}">Prev</a></li>`));
                }
                if (_pageId - 1 >= 1) {
                    ul.append(htmlToElement(`<li class="page-item"><a class="page-link" href="#" onClick="return false;" data-id="${_pageId-1}">${_pageId-1}</a></li>`));
                }
                ul.append(htmlToElement(`<li class="page-item active"><a class="page-link" href="#" onClick="return false;" data-id="${_pageId}">${_pageId}</a></li>`));
                if (_pageId + 1 <= totalPage) {
                    ul.append(htmlToElement(`<li class="page-item"><a class="page-link" href="#" onClick="return false;" data-id="${_pageId+1}">${_pageId+1}</a></li>`));
                }
                if (_pageId + 2 <= totalPage) {
                    ul.append(htmlToElement(`<li class="page-item"><a class="page-link" href="#" onClick="return false;" data-id="${_pageId+2}">Next/a></li>`));
                }

                nav.classList.contains('d-none') && nav.classList.remove('d-none');
            });
    } else {
        !nav.classList.contains('d-none') && nav.classList.add('d-none');
    }
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
        memoId: document.querySelector("#editModal #memoId").value,
        title: document.querySelector("#editModal #title").value,
        memo: document.querySelector("#editModal #memo").value
    };
    fetchToAPI(`/memo/${params.memoId}`, 'PUT', params)
        .then(() => search(_pageId, _listCnt))
        .then(() => document.querySelector("#closeEditModal").click());
}

function deleteMemo() {
    const memoId = document.querySelector("#viewModal #memoId").value;

    fetchToAPI(`/memo/${memoId}`, 'DELETE')
        .then(() => search(_pageId, _listCnt))
        .then(() => document.querySelector("#closeViewModal").click());
}

function viewMemo(memoId) {
    fetchToAPI(`/memo/${memoId}`, 'GET')
        .then(memo => {
            document.querySelector("#viewModalButton").click();
            document.querySelector("#viewModalLabel").innerHTML = memo.title;
            document.querySelector("#viewModal #memoId").value = memo.memoId;
            document.querySelector("#viewModal #memo").innerHTML = memo.memo;
            document.querySelector("#viewModal #writerName").innerHTML = memo.writerName;
            document.querySelector("#viewModal #createdAt").innerHTML = memo.createdAt;
            document.querySelector("#viewModal #updatedAt").innerHTML = memo.updatedAt;

            document.querySelector("#editModal #memoId").value = memo.memoId;
            document.querySelector("#editModal #title").value = memo.title;
            document.querySelector("#editModal #memo").value = memo.memo;

            return memoId;
        })
        .then(listComment);
}