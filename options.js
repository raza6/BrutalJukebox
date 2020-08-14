window.onload = function() {
    const ipt = document.getElementById('apikey');
    ipt.addEventListener('blur', function() {
        chrome.storage.local.set({'twitterAPIKey': ipt.value});
    });
}