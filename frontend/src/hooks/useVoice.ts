import { useState, useRef, useCallback, useEffect } from 'react';

interface UseVoiceOptions {
    onTranscript?: (text: string) => void;
    continuous?: boolean;
    lang?: string;
}

export function useVoice(options: UseVoiceOptions = {}) {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [isSupported, setIsSupported] = useState(false);
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        setIsSupported(!!SpeechRecognition);

        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = options.continuous ?? false;
            recognition.interimResults = true;
            recognition.lang = options.lang || 'en-US';

            recognition.onresult = (event: any) => {
                let finalText = '';
                let interimText = '';

                for (let i = 0; i < event.results.length; i++) {
                    const result = event.results[i];
                    if (result.isFinal) {
                        finalText += result[0].transcript;
                    } else {
                        interimText += result[0].transcript;
                    }
                }

                const text = finalText || interimText;
                setTranscript(text);

                if (finalText && options.onTranscript) {
                    options.onTranscript(finalText);
                }
            };

            recognition.onend = () => {
                setIsListening(false);
            };

            recognition.onerror = (event: any) => {
                console.warn('Speech recognition error:', event.error);
                setIsListening(false);
            };

            recognitionRef.current = recognition;
        }

        return () => {
            recognitionRef.current?.stop();
        };
    }, []);

    const startListening = useCallback(() => {
        if (recognitionRef.current) {
            setTranscript('');
            recognitionRef.current.start();
            setIsListening(true);
        }
    }, []);

    const stopListening = useCallback(() => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            setIsListening(false);
        }
    }, []);

    const toggleListening = useCallback(() => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    }, [isListening, startListening, stopListening]);

    return { isListening, transcript, isSupported, startListening, stopListening, toggleListening };
}
