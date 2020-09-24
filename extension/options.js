window.onload = () => {
    const ipt = document.getElementById('apikey');
    ipt.addEventListener('blur', () => {
        // eslint-disable-next-line quote-props
        chrome.storage.local.set({ 'twitterAPIKey': ipt.value });
    });
};
