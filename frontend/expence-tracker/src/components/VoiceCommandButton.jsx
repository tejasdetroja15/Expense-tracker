import React, { useEffect, useRef, useState } from "react";
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';

// Mock SpeechRecognition for demonstration
const mockSpeechRecognition = {
  startListening: (options) => {
    console.log('Starting speech recognition with options:', options);
  },
  stopListening: () => {
    console.log('Stopping speech recognition');
  }
};

const useMockSpeechRecognition = () => ({
  transcript: '',
  listening: false,
  resetTranscript: () => console.log('Resetting transcript'),
  browserSupportsSpeechRecognition: true,
  finalTranscript: ''
});

const VoiceCommandButton = ({ onCommand = (data) => console.log('Command received:', data), type = "expense" }) => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    finalTranscript
  } = useMockSpeechRecognition();

  const [error, setError] = useState(null);
  const [isListening, setIsListening] = useState(false); // Added local state for demo
  const isProcessingRef = useRef(false);
  const silenceTimeoutIdRef = useRef(null);

  // Debug function to test button click
  const handleButtonClick = () => {
    console.log('🎤 Button clicked!');
    setIsListening(!isListening);
    
    if (isListening) {
      console.log('Stopping listening...');
      mockSpeechRecognition.stopListening();
      clearTimeout(silenceTimeoutIdRef.current);
      isProcessingRef.current = false;
    } else {
      console.log('Starting listening...');
      isProcessingRef.current = false;
      mockSpeechRecognition.startListening({ continuous: false, language: 'en-US' });

      silenceTimeoutIdRef.current = setTimeout(() => {
        console.log('Auto-stopping due to timeout');
        mockSpeechRecognition.stopListening();
        setIsListening(false);
        isProcessingRef.current = false;
      }, 5000);
    }
  };

  useEffect(() => {
    return () => clearTimeout(silenceTimeoutIdRef.current);
  }, []);

  const parseExpenseCommand = (command) => {
    const lowerCommand = command.replace(/rupees|dollars|euro/i, '').trim();
    const amountMatch = lowerCommand.match(/\b(\d+(\.\d+)?)\b/);
    if (!amountMatch) throw new Error('Could not find amount in command');
    const amount = parseFloat(amountMatch[1]);

    let category = 'Other';
    const prepositions = ['for', 'on', 'at', 'in', 'to', 'as'];
    const commandWithoutAmount = lowerCommand.replace(amountMatch[0], '').trim();

    for (const prep of prepositions) {
      const parts = commandWithoutAmount.split(prep);
      if (parts.length > 1) {
        const potentialCategory = parts[1].trim().replace(/^(a|an|the)\s+/i, '');
        if (potentialCategory && !/^\d+(\.\d+)?$/.test(potentialCategory)) {
          category = potentialCategory;
          break;
        }
      }
    }

    return { type: 'expense', amount, category, date: new Date().toISOString() };
  };

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="text-red-500 p-4 border border-red-300 rounded-lg">
        Your browser does not support speech recognition.<br />
        Please use <b>Chrome</b> or <b>Edge</b> over <b>HTTPS</b>.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-gray-50 rounded-lg">
      <div className="text-lg font-semibold text-gray-700">
        Voice Command Debug Test
      </div>
      
      {/* Debug Info */}
      <div className="text-sm bg-blue-100 p-3 rounded border">
        <div><strong>Button State:</strong> {isListening ? 'Listening' : 'Ready'}</div>
        <div><strong>Processing:</strong> {isProcessingRef.current ? 'Yes' : 'No'}</div>
        <div><strong>Browser Support:</strong> {browserSupportsSpeechRecognition ? 'Yes' : 'No'}</div>
      </div>

      <button
        onClick={handleButtonClick}
        onMouseEnter={() => console.log('Mouse entered button')}
        onMouseLeave={() => console.log('Mouse left button')}
        className={`
          flex items-center gap-3 px-6 py-3 rounded-lg font-medium text-white
          transition-all duration-200 transform hover:scale-105 active:scale-95
          ${isListening 
            ? 'bg-red-600 hover:bg-red-700 shadow-red-200' 
            : 'bg-purple-600 hover:bg-purple-700 shadow-purple-200'
          }
          shadow-lg hover:shadow-xl
          focus:outline-none focus:ring-4 focus:ring-purple-300
          cursor-pointer
        `}
        style={{ 
          minWidth: '180px',
          minHeight: '50px',
          zIndex: 10,
          position: 'relative'
        }}
        title={isListening ? 'Click to stop listening' : 'Click to start voice command'}
      >
        <span className="text-xl">
          {isListening ? <FaMicrophoneSlash /> : <FaMicrophone />}
        </span>
        <span>{isListening ? "Stop Listening" : "Voice Command"}</span>
      </button>

      <div className="text-sm text-gray-600 min-h-6 text-center">
        {isListening ? (
          <span className="text-green-600 font-medium">
            🎤 Listening... Click button to stop
          </span>
        ) : (
          <span>Click the button above to test voice commands</span>
        )}
      </div>

      {/* Test buttons for debugging */}
      <div className="flex gap-2 mt-4">
        <button
          onClick={() => console.log('Test button 1 clicked')}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Test Click 1
        </button>
        <button
          onClick={() => console.log('Test button 2 clicked')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Test Click 2
        </button>
      </div>

      <div className="text-xs text-gray-500 mt-4 text-center max-w-md">
        <strong>Debug Instructions:</strong><br />
        1. Open browser console (F12)<br />
        2. Click the voice command button<br />
        3. Check console for click events<br />
        4. Try the test buttons below if main button doesn't work
      </div>
    </div>
  );
};

export default VoiceCommandButton;