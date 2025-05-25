document.addEventListener('keydown', (e) => {
    if (e.code == 'Space' && e.target == document.body) {
        e.preventDefault();
    }
});