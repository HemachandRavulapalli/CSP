import { useState, useEffect } from 'react';

const VoiceAssistant = () => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');

    const speak = (text) => {
        const utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance);
    };

    const startListening = () => {
        if (!('webkitSpeechRecognition' in window)) {
            alert('Voice recognition not supported in this browser.');
            return;
        }

        const recognition = new window.webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);

        recognition.onresult = (event) => {
            const text = event.results[0][0].transcript;
            setTranscript(text);
            handleCommand(text.toLowerCase());
        };

        recognition.start();
    };

    const handleCommand = (cmd) => {
        if (cmd.includes('marketplace')) {
            speak('Navigating to marketplace');
            window.location.href = '/marketplace';
        } else if (cmd.includes('home') || cmd.includes('dashboard')) {
            speak('Going home');
            window.location.href = '/';
        } else {
            speak(`I heard: ${cmd}`);
        }
    };

    return (
        <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 }}>
            <button
                onClick={startListening}
                className={`btn ${isListening ? 'btn-primary' : 'btn-secondary'}`}
                style={{ borderRadius: '50%', width: '60px', height: '60px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}
            >
                🎤
            </button>
        </div>
    );
};

export default VoiceAssistant;
