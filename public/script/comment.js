function listComment(memoId) {
    const wrapper = document.querySelector("#comment_list div.list-group");
    wrapper.innerHTML = '';
    fetchToAPI(`/comment/${memoId}`, 'GET')
        .then(commentList => {
            commentList.forEach(comment => {
                wrapper.append(htmlToElement(`
                    <a href="#" class="list-group-item list-group-item-action" aria-current="true" onClick="return false;">
                        <div class="d-flex w-100 justify-content-between">
                            <h5 class="mb-1">${comment.writerName}</h5>
                            <small>${timeForToday(comment.createdAt)}</small>
                        </div>
                        <p class="mb-1">${comment.comment}</p>
                        <small class="text-decoration-underline" onClick="editMode(true)">edit</small>
                        <small class="text-decoration-underline text-danger" onClick="delComment('${comment.commentId}')">delete</small>
                    </a>
                `))
            });
        })
}

function addComment() {
    const params = {
        comment: document.querySelector("#viewModal #comment").value,
        memoId: document.querySelector("#viewModal #memoId").value
    };
    fetchToAPI(`/comment`, 'POST', params)
        .then(() => {
            listComment(params.memoId);
            document.querySelector("#viewModal #comment").value = '';
        });
}

function editMode(isEditMode) {

}

function editComment(commentId) {
    const params = {

    };
    fetchToAPI(`/comment/${commentId}`, 'PUT', params);
}

function delComment(commentId) {
    fetchToAPI(`/comment/${commentId}`, 'DELETE');
}