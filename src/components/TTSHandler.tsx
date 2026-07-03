import { useEffect } from 'react';
import { useCMS } from '../context/CMSContext';

export default function TTSHandler() {
  const { content } = useCMS();
  const isEnabled = content.isTextToSpeechEnabled;

  useEffect(() => {
    if (!isEnabled) {
      window.speechSynthesis.cancel();
      return;
    }

    // Use a flag to prevent rapid re-triggering
    let isSpeaking = false;

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Find the closest interactive/text element
      const readableElement = target.closest('p, h1, h2, h3, h4, h5, h6, button, a, span, li');
      if (!readableElement) return;

      const text = readableElement.textContent?.trim();
      
      // Basic validation: must have text, not too long, and not just whitespace
      if (text && text.length > 0 && text.length < 500) {
        // Simple check to avoid restarting constantly if hovering within the same element
        if (window.speechSynthesis.speaking && isSpeaking) return;

        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'id-ID';
        
        utterance.onstart = () => { isSpeaking = true; };
        utterance.onend = () => { isSpeaking = false; };
        utterance.onerror = () => { isSpeaking = false; };

        window.speechSynthesis.speak(utterance);
      }
    };

    // 'mouseover' bubbles, which is what we want for document-level delegation
    document.addEventListener('mouseover', handleMouseOver);
    
    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
      window.speechSynthesis.cancel();
    };
  }, [isEnabled]);

  return null;
}
