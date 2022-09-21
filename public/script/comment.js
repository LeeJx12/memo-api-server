function listComment(memoId) {
    const wrapper = document.querySelector("#comment_list div.list-group");
    wrapper.innerHTML = '';
    fetchToAPI(`/comment/${memoId}`, 'GET')
        .then(commentList => {
            commentList.forEach(comment => {
                wrapper.append(htmlToElement(`
                    <div class="list-group-item list-group-item-action" aria-current="true">
                        <div class="d-flex w-100 justify-content-between">
                            <h5 class="mb-1">${comment.writerName}</h5>
                            <small>${timeForToday(comment.createdAt)}</small>
                        </div>
                        <div id="viewMode">
                            <p class="mb-1">${comment.comment}</p>
                            <a href="#" class="text-decoration-underline" onClick="editMode(true, this)">수정</a>
                            <a href="#" class="text-decoration-underline text-danger" onClick="delComment('${comment.commentId}')">삭제</a>
                        </div>
                        <div id="editMode" class="d-none">
                            <input type="hidden" id="commentId" name="commentId" value="${comment.commentId}"/>
                            <input type="text" class="form-control" id="comment" name="comment" placeholder="댓글을 입력하세요" value="${comment.comment}"/>
                            <a href="#" class="text-decoration-underline" onClick="editComment(this)">저장</a>
                            <a href="#" class="text-decoration-underline text-danger" onClick="editMode(false, this)">취소</a>
                        </div>
                    </div>
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

function editMode(isEditMode, obj) {
    const parent = obj.closest(".list-group-item");
    if (isEditMode) {
        parent.querySelector("#viewMode").classList.add('d-none');
        parent.querySelector("#editMode").classList.remove('d-none');
    } else {
        parent.querySelector("#viewMode").classList.remove('d-none');
        parent.querySelector("#editMode").classList.add('d-none');
    }
}

function editComment(obj) {
    const parent = obj.closest(".list-group-item");
    const params = {
        commentId: parent.querySelector("#editMode #commentId").value,
        comment: parent.querySelector("#editMode #comment").value
    };
    const memoId = document.querySelector("#viewModal #memoId").value;
    
    fetchToAPI(`/comment/${params.commentId}`, 'PUT', params)
        .then(() => editMode(false, obj))
        .then(() => listComment(memoId));
}

function delComment(commentId) {
    const memoId = document.querySelector("#viewModal #memoId").value;
    
    fetchToAPI(`/comment/${commentId}`, 'DELETE')
        .then(() => listComment(memoId));
}