import React, { useEffect, useContext, useState } from "react";
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
  const [lastRecognizedText, setLastRecognizedText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      setError('Your browser does not support speech recognition. Please use Chrome or Edge.');
    }
  }, [browserSupportsSpeechRecognition]);

  useEffect(() => {
    if (finalTranscript && !isProcessing) {
      console.log("Final transcript:", finalTranscript);
      setLastRecognizedText(finalTranscript);
      setIsProcessing(true);
      
      const command = finalTranscript.toLowerCase();
      let parsedData = null;

      if (type === "expense") {
        parsedData = parseExpenseCommand(command);
      } else {
        parsedData = parseIncomeCommand(command);
      }

      if (parsedData) {
        console.log("Parsed command data:", parsedData);
        onCommand({ ...parsedData, isVoiceCommand: true });
        toast.success(`${type === "expense" ? "Expense" : "Income"} added via voice command!`);
        resetTranscript();
      } else {
        console.log("Could not parse command:", command);
        toast.error("Could not understand the command. Please try again.");
      }
      
      setIsProcessing(false);
    }
  }, [finalTranscript, onCommand, resetTranscript, type, isProcessing]);

  const parseExpenseCommand = (command) => {
    // Match patterns like "add expense 100 for category" or "add expense 100 category"
    const match = command.match(/add expense (\d+)(?:\s+for\s+|\s+)(\w+)/i);
    if (match) {
      const amount = parseFloat(match[1]);
      const category = match[2].toLowerCase();
      
      // Clean up category by removing articles and extra spaces
      const cleanCategory = category
        .replace(/^(a|an|the)\s+/i, '') // Remove articles
        .replace(/\s+/g, ' ') // Replace multiple spaces with single space
        .trim();
      
      return {
        amount,
        category: cleanCategory,
        date: new Date().toISOString().split('T')[0]
      };
    }
    return null;
  };

  const parseIncomeCommand = (command) => {
    const lowerCommand = command.toLowerCase();
    const amountMatch = command.match(/\d+(\.\d+)?/);
    const amount = amountMatch ? parseFloat(amountMatch[0]) : null;

    if (!amount) {
      throw new Error('Could not find amount in command');
    }

    // Extract source using various prepositions
    let source = 'Other';
    const prepositions = ['from', 'as', 'by', 'for', 'through'];
    
    for (const prep of prepositions) {
      const parts = lowerCommand.split(prep);
      if (parts.length > 1) {
        // Get the part after the preposition and clean it up
        const potentialSource = parts[1]
          .trim()
          .replace(/^(a|an|the)\s+/i, '') // Remove articles
          .replace(/\s+/g, ' ') // Replace multiple spaces with single space
          .trim();
        
        if (potentialSource) {
          source = potentialSource;
          break;
        }
      }
    }

    return {
      type: 'income',
      amount,
      source,
      date: new Date().toISOString()
    };
  };

  const startListening = () => {
    if (!browserSupportsSpeechRecognition) {
      toast.error("Your browser doesn't support speech recognition. Please use Chrome or Edge.");
      return;
    }
    resetTranscript();
    SpeechRecognition.startListening({ 
      continuous: true,
      language: 'en-US'
    });
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
    setIsListening(!isListening);
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={toggleListening}
        className={`p-3 rounded-full ${
          isListening ? 'bg-red-500' : 'bg-blue-500'
        } text-white hover:opacity-90 transition-all`}
        title={isListening ? 'Stop listening' : 'Start voice command'}
      >
        {isListening ? <FaMicrophoneSlash /> : <FaMicrophone />}
      </button>
      {isListening && (
        <div className="text-sm text-gray-600">
          Listening... {transcript && <span className="font-medium">{transcript}</span>}
        </div>
      )}
    </div>
  );
};

export default VoiceCommandButton; 