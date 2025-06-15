import React, { useEffect, useRef, useState } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
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

  const [error, setError] = useState(null);
  const isProcessingRef = useRef(false);
  const silenceTimeoutIdRef = useRef(null);

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      setError('Your browser does not support speech recognition. Please use Chrome or Edge.');
    }
  }, [browserSupportsSpeechRecognition]);

  useEffect(() => {
    console.log('VoiceCommandButton - Primary useEffect (finalTranscript, listening): ', {
      finalTranscript, listening, isProcessing: isProcessingRef.current, transcript
    });

    if (finalTranscript && !isProcessingRef.current) {
      console.log('VoiceCommandButton - Final transcript received. Setting isProcessingRef.current = true.');
      isProcessingRef.current = true;
      clearTimeout(silenceTimeoutIdRef.current);
      SpeechRecognition.stopListening();

      const command = finalTranscript.toLowerCase();
      let parsedData = null;

      try {
        if (type === "expense") {
          parsedData = parseExpenseCommand(command);
        } else {
          parsedData = parseIncomeCommand(command);
        }
      } catch (e) {
        console.error("VoiceCommandButton - Parsing error:", e.message);
        toast.error(`Error parsing command: ${e.message}`);
      } finally {
        resetTranscript();
        console.log('VoiceCommandButton - Releasing processing lock after command: Setting isProcessingRef.current = false');
        isProcessingRef.current = false;
      }

      if (parsedData) {
        onCommand({ ...parsedData, isVoiceCommand: true });
        toast.success(`${type === "expense" ? "Expense" : "Income"} added via voice command!`);
      } else if (finalTranscript.length > 0) {
        toast.error("Could not understand the command. Please try again.");
      }
    }
  }, [finalTranscript, onCommand, resetTranscript, type]);

  useEffect(() => {
    console.log('VoiceCommandButton - Dedicated Cleanup useEffect (listening): ', {
      listening, isProcessing: isProcessingRef.current, transcript
    });

    if (!listening && isProcessingRef.current) {
      console.log('VoiceCommandButton - Cleanup: Listening stopped and processing ref is stuck. Forcing reset.');
      isProcessingRef.current = false;
      clearTimeout(silenceTimeoutIdRef.current);
      resetTranscript();
    } else if (!listening && !isProcessingRef.current && transcript.length > 0) {
      console.log('VoiceCommandButton - Cleanup: Listening stopped, no processing, but transcript lingering. Resetting transcript.');
      resetTranscript();
    }
  }, [listening, resetTranscript, transcript]);

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
    console.log('VoiceCommandButton - toggleListening called. Current listening state:', listening);
    if (listening) {
      console.log('VoiceCommandButton - Stopping listening via toggle.');
      SpeechRecognition.stopListening();
      clearTimeout(silenceTimeoutIdRef.current);
      isProcessingRef.current = false;
      resetTranscript();
    } else {
      console.log('VoiceCommandButton - Starting listening via toggle.');
      resetTranscript();
      isProcessingRef.current = false;
      SpeechRecognition.startListening({ continuous: false, language: 'en-US' });

      silenceTimeoutIdRef.current = setTimeout(() => {
        console.log('VoiceCommandButton - Silence timeout triggered. Forcing stop listening.');
        SpeechRecognition.stopListening();
        isProcessingRef.current = false;
        resetTranscript();
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
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${listening ? 'bg-red-600' : 'bg-purple-600'} text-white hover:opacity-90`}
        title={listening ? 'Stop listening' : 'Start voice command'}
      >
        <span className="text-xl">
          {listening ? <FaMicrophoneSlash /> : <FaMicrophone />}
        </span>
        <span>{listening ? "Stop Listening" : "Voice Command"}</span>
      </button>
      <div className="text-sm text-gray-600 min-h-5 transition-all">
        {listening && <span>Listening... {transcript && <span className="font-medium">{transcript}</span>}</span>}
      </div>
    </div>
  );
};

export default VoiceCommandButton;
