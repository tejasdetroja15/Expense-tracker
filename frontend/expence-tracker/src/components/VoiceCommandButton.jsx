import React, { useEffect, useContext, useRef, useState } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { ThemeContext } from "../context/ThemeContext";
import { toast } from "react-toastify";
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';

const VoiceCommandButton = ({ onCommand, type = "expense" }) => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    finalTranscript
  } = useSpeechRecognition();

  const { darkMode } = useContext(ThemeContext);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState(null);
  const isProcessingRef = useRef(false); // Prevent multiple triggers
  const silenceTimeoutIdRef = useRef(null); // Optional timeout

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      setError('Your browser does not support speech recognition. Please use Chrome or Edge.');
    }
  }, [browserSupportsSpeechRecognition]);

  useEffect(() => {
    if (finalTranscript && isListening && !isProcessingRef.current) {
      isProcessingRef.current = true;
      SpeechRecognition.stopListening();
      setIsListening(false);

      const command = finalTranscript.toLowerCase();
      let parsedData = null;

      try {
        if (type === "expense") {
          parsedData = parseExpenseCommand(command);
        } else {
          parsedData = parseIncomeCommand(command);
        }
      } catch (e) {
        console.error("Parsing error:", e.message);
        toast.error(`Error parsing command: ${e.message}`);
        resetTranscript();
        isProcessingRef.current = false;
        return;
      }

      if (parsedData) {
        onCommand({ ...parsedData, isVoiceCommand: true });
        toast.success(`${type === "expense" ? "Expense" : "Income"} added via voice command!`);
      } else {
        toast.error("Could not understand the command. Please try again.");
      }

      resetTranscript();

      // Release lock after a short delay
      setTimeout(() => {
        isProcessingRef.current = false;
      }, 1000);
    }
  }, [finalTranscript, isListening, onCommand, resetTranscript, type]);

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

  const parseIncomeCommand = (command) => {
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

  const toggleListening = () => {
    if (isListening) {
      SpeechRecognition.stopListening();
      setIsListening(false);
      clearTimeout(silenceTimeoutIdRef.current);
    } else {
      resetTranscript();
      isProcessingRef.current = false;
      setIsListening(true);
      SpeechRecognition.startListening({ continuous: false, language: 'en-US' });

      // Optional: stop listening after 5 seconds if no speech
      silenceTimeoutIdRef.current = setTimeout(() => {
        SpeechRecognition.stopListening();
        setIsListening(false);
      }, 5000);
    }
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={toggleListening}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${isListening ? 'bg-red-600' : 'bg-purple-600'} text-white hover:opacity-90`}
        title={isListening ? 'Stop listening' : 'Start voice command'}
      >
        <span className="text-xl">
          {isListening ? <FaMicrophoneSlash /> : <FaMicrophone />}
        </span>
        <span>{isListening ? "Stop Listening" : "Voice Command"}</span>
      </button>
      <div className={`text-sm text-gray-600 min-h-5 transition-all ${isListening ? 'visible' : 'invisible'}`}>
        Listening... {transcript && <span className="font-medium">{transcript}</span>}
      </div>
    </div>
  );
};

export default VoiceCommandButton;
