document.addEventListener('paste', function(e) {
	const text = e.clipboardData.getData('text');
	document.querySelector('textarea[name="userPrompt"]').value = text;
	document.querySelector('form').submit();
});