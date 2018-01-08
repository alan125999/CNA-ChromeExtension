//將設置用chrome.storage.sync儲存
function save_options() {
    var enableCopy = document.getElementById('copyBtn').checked;
    chrome.storage.local.set({'enableCopy': enableCopy}, function() {
        //提供儲存成功的提示
    });
}

// 將設定調整為預設值的功能
function restore_options() {
    //利用get設定預設值並，無值即取得預設值，有值則使用之前儲存的值
    chrome.storage.local.get({'enableCopy': true}, function(items) {
        document.getElementById('copyBtn').checked = items.enableCopy;
        console.log(items);
    });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('input[id=copyBtn]').addEventListener('change', save_options);
});
