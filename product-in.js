(function() {
    // Check if config and emailjs are available before initializing
    if (window.config && window.config.emailjs && window.config.emailjs.publicKey && window.config.emailjs.publicKey !== 'your-emailjs-public-key-here') {
        emailjs.init(window.config.emailjs.publicKey);
    } else {
        console.warn('EmailJS not configured. Please add your EmailJS public key to config.js');
    }
})(); 