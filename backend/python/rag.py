#predicted energy usage in kwh
import os
import pdfplumber
import google.generativeai as genai
from langchain_community.vectorstores import Chroma
from langchain_text_splitters import CharacterTextSplitter
from langchain_core.documents import Document
from langchain_community.embeddings import FastEmbedEmbeddings
import speech_recognition as sr
import gtts
from io import BytesIO
import base64
import re
import tkinter as tk
from tkinter import scrolledtext, ttk, messagebox
import threading
import pygame

# Voice to text function
def voice_to_text():
    r = sr.Recognizer()
    
    try:
        with sr.Microphone() as source:
            r.adjust_for_ambient_noise(source)
            audio = r.listen(source, timeout=5, phrase_time_limit=15)
            text = r.recognize_google(audio)
            return text
    except sr.UnknownValueError:
        return None
    except sr.RequestError as e:
        print(f"Speech service error: {e}")
        return None
    except Exception as e:
        print(f"Error in voice recognition: {e}")
        return None

# Text to speech function
def text_to_speech(text):
    try:
        tts = gtts.gTTS(text=text, lang="en", slow=False)
        fp = BytesIO()
        tts.write_to_fp(fp)
        fp.seek(0)
        audio_bytes = fp.read()
        return audio_bytes
    except Exception as e:
        print(f"Error in text-to-speech: {e}")
        return None

# Play audio function
def play_audio(audio_bytes):
    try:
        if pygame.mixer.get_init() is None:
            pygame.mixer.init()
        
        with BytesIO(audio_bytes) as audio_file:
            pygame.mixer.music.load(audio_file)
            pygame.mixer.music.play()
            
            # Wait for playback to finish
            while pygame.mixer.music.get_busy():
                pygame.time.Clock().tick(10)
    except Exception as e:
        print(f"Error playing audio: {e}")

# Function to detect energy consumption queries
def is_energy_query(query):
    energy_keywords = [
        'energy', 'consumption', 'electricity', 'power', 'usage', 'bill', 
        'watt', 'kilowatt', 'kwh', 'kw', 'save energy', 'energy saving',
        'reduce consumption', 'lower bill', 'efficient', 'efficiency'
    ]
    query_lower = query.lower()
    return any(keyword in query_lower for keyword in energy_keywords)

# Function to extract energy consumption values
def extract_energy_values(query):
    # Look for patterns like "XX kWh" or "XX kilowatt hours" or "energy usage of XX"
    kwh_pattern = r'(\d+(?:\.\d+)?)\s*(?:kwh|kilowatt[- ]?hours?|kw[- ]?h)'
    matches = re.findall(kwh_pattern, query.lower())
    
    if matches:
        return float(matches[0])
    
    # If no specific pattern found, check for numbers followed by energy context
    numbers = re.findall(r'(\d+(?:\.\d+)?)', query)
    if numbers and is_energy_query(query):
        return float(numbers[0])
    
    return None
