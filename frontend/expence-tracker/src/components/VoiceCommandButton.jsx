import React, { useEffect, useRef, useState } from "react";
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';

// Real Speech Recognition Implementation
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const useSpeechRecognition = () => {
  const [transcript, setTranscript] = useState('');
  const [finalTranscript, setFinalTranscript] = useState('');
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  const browserSupportsSpeechRecognition = !!SpeechRecognition;

  const resetTranscript = () => {
    setTranscript('');
    setFinalTranscript('');
  };

  const startListening = (options = {}) => {
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = options.continuous || false;
    recognition.interimResults = true;
    recognition.lang = options.language || 'en-US';

    recognition.onstart = () => {
      console.log('🎤 Speech recognition started');
      setListening(true);
    };

    recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalText = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalText += result[0].transcript;
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      console.log('📝 Interim:', interimTranscript);
      console.log('✅ Final:', finalText);

      setTranscript(interimTranscript);
      if (finalText) {
        setFinalTranscript(finalText);
      }
    };

    recognition.onerror = (event) => {
      console.error('❌ Speech recognition error:', event.error);
      setListening(false);
    };

    recognition.onend = () => {
      console.log('🛑 Speech recognition ended');
      setListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  return {
    transcript,
    finalTranscript,
    listening,
    resetTranscript,
    startListening,
    stopListening,
    browserSupportsSpeechRecognition
  };
};

const VoiceCommandButton = ({ onCommand = (data) => console.log('Command received:', data), type = "expense" }) => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    finalTranscript,
    startListening,
    stopListening
  } = useSpeechRecognition();

  const [error, setError] = useState(null);
  const isProcessingRef = useRef(false);
  const silenceTimeoutIdRef = useRef(null);

  useEffect(() => {
    return () => clearTimeout(silenceTimeoutIdRef.current);
  }, []);

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      console.warn("Speech recognition is not supported in this browser.");
    }
  }, [browserSupportsSpeechRecognition]);

  useEffect(() => {
    if (finalTranscript && !isProcessingRef.current) {
      console.log('🔄 Processing final transcript:', finalTranscript);
      isProcessingRef.current = true;
      clearTimeout(silenceTimeoutIdRef.current);
      stopListening();

      const command = finalTranscript.toLowerCase();
      let parsedData = null;

      try {
        parsedData = type === "expense"
          ? parseExpenseCommand(command)
          : parseIncomeCommand(command);
        
        console.log('✅ Parsed data:', parsedData);
      } catch (e) {
        console.error("❌ Parsing error:", e.message);
        setError(`Error parsing command: ${e.message}`);
      } finally {
        resetTranscript();
        isProcessingRef.current = false;
      }

      if (parsedData) {
        onCommand({ ...parsedData, isVoiceCommand: true });
        console.log(`✅ ${type === "expense" ? "Expense" : "Income"} added via voice command!`);
      } else if (finalTranscript.length > 0) {
        console.log("❌ Could not understand the command. Please try again.");
        setError("Could not understand the command. Please try again.");
      }
    }
  }, [finalTranscript, onCommand, resetTranscript, type, stopListening]);

  useEffect(() => {
    if (!listening && isProcessingRef.current) {
      isProcessingRef.current = false;
      clearTimeout(silenceTimeoutIdRef.current);
      resetTranscript();
    } else if (!listening && transcript.length > 0 && !isProcessingRef.current) {
      resetTranscript();
    }
  }, [listening, resetTranscript, transcript]);

  const toggleListening = () => {
    console.log('🎤 Toggle listening - Current state:', listening);
    
    if (listening) {
      console.log('🛑 Stopping listening...');
      stopListening();
      clearTimeout(silenceTimeoutIdRef.current);
      isProcessingRef.current = false;
      resetTranscript();
      setError(null);
    } else {
      console.log('▶️ Starting listening...');
      resetTranscript();
      setError(null);
      isProcessingRef.current = false;
      startListening({ continuous: false, language: 'en-US' });

      // Auto-stop after 10 seconds instead of 5
      silenceTimeoutIdRef.current = setTimeout(() => {
        console.log('⏰ Auto-stopping due to timeout');
        stopListening();
        isProcessingRef.current = false;
        resetTranscript();
      }, 10000);
    }
  };

  const parseExpenseCommand = (command) => {
    console.log('🔍 Parsing expense command:', command);
    const lowerCommand = command.replace(/rupees|dollars|euro|rs|inr/i, '').trim();
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

  const parseIncomeCommand = (command) => {
    console.log('🔍 Parsing income command:', command);
    const lowerCommand = command.replace(/rupees|dollars|euro|rs|inr/i, '').trim();
    const amountMatch = lowerCommand.match(/\b(\d+(\.\d+)?)\b/);
    if (!amountMatch) throw new Error('Could not find amount in command');
    const amount = parseFloat(amountMatch[1]);

    let source = 'Other';
    const prepositions = ['from', 'as', 'by', 'for', 'through', 'received', 'got', 'earned'];
    const commandWithoutAmount = lowerCommand.replace(amountMatch[0], '').trim();

    for (const prep of prepositions) {
      const parts = commandWithoutAmount.split(prep);
      if (parts.length > 1) {
        const potentialSource = parts[1].trim().replace(/^(a|an|the)\s+/i, '');
        if (potentialSource && !/^\d+(\.\d+)?$/.test(potentialSource)) {
          source = potentialSource;
          break;
        }
      }
    }

    if (source === 'Other') {
      const words = commandWithoutAmount.split(/\s+/);
      for (const word of words) {
        if (word && !/^\d+(\.\d+)?$/.test(word) && !prepositions.includes(word)) {
          source = word;
          break;
        }
      }
    }

    return { type: 'income', amount, source, date: new Date().toISOString() };
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
    <div className="flex flex-col items-center gap-4 p-6 bg-gray-50 rounded-lg max-w-md mx-auto">
      <div className="text-lg font-semibold text-gray-700">
        Real Voice Command Test
      </div>
      
      {/* Status Info */}
      <div className="text-sm bg-blue-100 p-3 rounded border w-full">
        <div><strong>Status:</strong> {listening ? '🎤 Listening...' : '⭕ Ready'}</div>
        <div><strong>Processing:</strong> {isProcessingRef.current ? 'Yes' : 'No'}</div>
        <div><strong>Browser Support:</strong> {browserSupportsSpeechRecognition ? '✅ Yes' : '❌ No'}</div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="text-red-600 bg-red-100 p-3 rounded border w-full text-sm">
          ❌ {error}
        </div>
      )}

      <button
        onClick={toggleListening}
        className={`
          flex items-center gap-3 px-6 py-3 rounded-lg font-medium text-white
          transition-all duration-200 transform hover:scale-105 active:scale-95
          ${listening 
            ? 'bg-red-600 hover:bg-red-700 animate-pulse' 
            : 'bg-purple-600 hover:bg-purple-700'
          }
          shadow-lg hover:shadow-xl
          focus:outline-none focus:ring-4 focus:ring-purple-300
          cursor-pointer
        `}
        style={{ 
          minWidth: '200px',
          minHeight: '60px'
        }}
        title={listening ? 'Click to stop listening' : 'Click to start voice command'}
      >
        <span className="text-xl">
          {listening ? <FaMicrophoneSlash /> : <FaMicrophone />}
        </span>
        <span>{listening ? "Stop Listening" : "Start Voice Command"}</span>
      </button>

      {/* Live Transcript */}
      <div className="w-full min-h-16 p-3 bg-white border rounded text-sm">
        <div className="font-medium text-gray-600 mb-1">Live Transcript:</div>
        {listening && (
          <div className="text-gray-800">
            <span className="text-blue-600">{transcript}</span>
            {transcript && <span className="animate-pulse">|</span>}
          </div>
        )}
        {finalTranscript && (
          <div className="text-green-600 font-medium mt-2">
            Final: "{finalTranscript}"
          </div>
        )}
        {!listening && !transcript && !finalTranscript && (
          <div className="text-gray-400 italic">
            Click the button and speak: "I spent 50 rupees on coffee" or "I earned 100 dollars from freelancing"
          </div>
        )}
      </div>

     
    </div>
  );
};

export default VoiceCommandButton;