function listComment(memoId) {
    fetchToAPI(`/comment/${memoId}`, 'GET')
        .then(commentList => {})
}

function addComment() {
    const params = {

    };
    fetchToAPI(`/comment`, 'POST', params);
}

function editComment(commentId) {
    const params = {

    };
    fetchToAPI(`/comment/${commentId}`, 'PUT', params);
}

function delComment(commentId) {
    fetchToAPI(`/comment/${commentId}`, 'DELETE');
}