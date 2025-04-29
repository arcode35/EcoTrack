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

# Simplified Gemini interface class
class TinyGemini:
    def __init__(self, model_name="gemini-1.5-pro"):
        try:
            self.model = genai.GenerativeModel(model_name,
                                         generation_config={
                                             "max_output_tokens": 100,
                                             "temperature": 0.1,
                                             "top_p": 0.95
                                         })
        except Exception as e:
            print(f"Error initializing Gemini: {e}")
            self.model = None

    def generate(self, prompt):
        if self.model:
            try:
                response = self.model.generate_content(prompt)
                return response.text
            except Exception as e:
                print(f"Error generating content: {e}")
                return None
        else:
            return "Gemini model not initialized."

# Load PDFs efficiently
def load_books_minimal(folder_path):
    docs = []
    for filename in os.listdir(folder_path):
        if filename.endswith(".pdf"):
            try:
                with pdfplumber.open(os.path.join(folder_path, filename)) as pdf:
                    text = "".join(page.extract_text() for page in pdf.pages)
                    docs.append(Document(page_content=text, metadata={"source": filename}))
            except Exception as e:
                print(f"Error loading {filename}: {str(e)}")
    return docs

# Create smaller chunks
def create_small_chunks(docs):
    splitter = CharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    return splitter.split_documents(docs)

# Create vectorstore
def create_minimal_vectorstore(chunks):
    # Clean up old DB if it exists
    if os.path.exists("chroma_db"):
        import shutil
        shutil.rmtree("chroma_db")
        
    embeddings = FastEmbedEmbeddings()
    return Chroma.from_documents(chunks, embeddings, persist_directory="chroma_db")

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

# Function to provide energy saving recommendations
def get_energy_recommendations(consumption_value):
    if consumption_value is None:
        return "I couldn't detect your energy consumption value. Please specify your energy usage in kWh."
    
    # Categorize consumption
    if consumption_value < 200:
        category = "low"
    elif consumption_value < 500:
        category = "moderate"
    else:
        category = "high"
    
    # Generate personalized recommendations based on consumption level
    prompt = f"""
    A user has reported {consumption_value} kWh of energy consumption, which is considered {category}.
    Provide 3-5 practical, specific recommendations to reduce their energy consumption.
    Focus on actionable advice with potential savings estimates where possible.
    """
    
    return prompt

# Main RAG pipeline function with dual functionality
def process_query(query, vectorstore, gemini):
    try:
        # Check if this is an energy-related query
        if is_energy_query(query):
            # Extract energy consumption value if present
            consumption_value = extract_energy_values(query)
            
            # Generate energy saving recommendations
            prompt = get_energy_recommendations(consumption_value)
            response = gemini.generate(prompt)
            
            # Add a prefix to make it clear this is energy advice
            return f"Energy Saving Recommendations:\n{response}"
        else:
            # Handle as a general query using RAG
            retriever = vectorstore.as_retriever(search_kwargs={"k": 2})
            docs = retriever.get_relevant_documents(query)
            context = "\n".join(d.page_content[:250] for d in docs)
            prompt = f"Context:\n{context}\n\nQuestion: {query}\n\nAnswer briefly:"
            response = gemini.generate(prompt)
            return response
            
    except Exception as e:
        response = f"Error: {str(e)}"
    
    return response

# GUI Class for the assistant
class EnergyAssistantGUI:
    def __init__(self, root, vectorstore, gemini):
        self.root = root
        self.vectorstore = vectorstore
        self.gemini = gemini
        self.chat_history = []
        self.is_listening = False
        
        # Initialize pygame for audio playback
        pygame.init()
        pygame.mixer.init()
        
        # Set up the GUI
        self.setup_gui()
    
    def setup_gui(self):
        self.root.title("Energy Advisor & RAG Assistant")
        self.root.geometry("800x600")
        self.root.configure(bg="#f0f0f0")
        
        # Create main frame
        main_frame = ttk.Frame(self.root)
        main_frame.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)
        
        # Chat display area
        chat_frame = ttk.Frame(main_frame)
        chat_frame.pack(fill=tk.BOTH, expand=True, padx=5, pady=5)
        
        # Chat history display
        self.chat_display = scrolledtext.ScrolledText(chat_frame, wrap=tk.WORD, width=60, height=20)
        self.chat_display.pack(fill=tk.BOTH, expand=True)
        self.chat_display.config(state=tk.DISABLED)
        
        # Input area
        input_frame = ttk.Frame(main_frame)
        input_frame.pack(fill=tk.X, padx=5, pady=5)
        
        # Text input field
        self.text_input = ttk.Entry(input_frame, width=50)
        self.text_input.pack(side=tk.LEFT, fill=tk.X, expand=True, padx=(0, 5))
        self.text_input.bind("<Return>", lambda event: self.send_message())
        
        # Send button
        send_button = ttk.Button(input_frame, text="Send", command=self.send_message)
        send_button.pack(side=tk.LEFT, padx=5)
        
        # Voice input button
        self.voice_button = ttk.Button(input_frame, text="🎤", width=3, command=self.toggle_voice_input)
        self.voice_button.pack(side=tk.LEFT)
        
        # Status bar
        self.status_var = tk.StringVar()
        self.status_var.set("Ready")
        status_bar = ttk.Label(self.root, textvariable=self.status_var, relief=tk.SUNKEN, anchor=tk.W)
        status_bar.pack(side=tk.BOTTOM, fill=tk.X)
        
        # Welcome message
        self.add_message("Assistant", "Welcome to the Energy Advisor & RAG Assistant! You can ask about energy consumption or any other questions. For energy advice, include your energy usage (e.g., 'My electricity usage is 300 kWh this month')")
        
        # Set focus to the input field
        self.text_input.focus_set()
    
    def add_message(self, sender, message):
        self.chat_display.config(state=tk.NORMAL)
        self.chat_display.insert(tk.END, f"{sender}: {message}\n\n")
        self.chat_display.see(tk.END)
        self.chat_display.config(state=tk.DISABLED)
    
    def send_message(self):
        # Get input text
        query = self.text_input.get().strip()
        if not query:
            return
        
        # Clear input field
        self.text_input.delete(0, tk.END)
        
        # Display user message
        self.add_message("You", query)
        
        # Process in a separate thread to keep UI responsive
        threading.Thread(target=self.process_message, args=(query,), daemon=True).start()
    
    def toggle_voice_input(self):
        if self.is_listening:
            self.status_var.set("Cancelling voice input...")
            self.is_listening = False
            self.voice_button.config(text="🎤")
        else:
            self.is_listening = True
            self.voice_button.config(text="⏹️")
            threading.Thread(target=self.listen_for_voice, daemon=True).start()
    
    def listen_for_voice(self):
        self.status_var.set("Listening... Speak now")
        text = voice_to_text()
        self.is_listening = False
        self.voice_button.config(text="🎤")
        
        if text:
            self.text_input.delete(0, tk.END)
            self.text_input.insert(0, text)
            self.send_message()
        else:
            self.status_var.set("Could not understand audio. Try again.")
    
    def process_message(self, query):
        # Update status
        self.status_var.set("Processing query...")
        
        # Handle exit command
        if query.lower() in ["exit", "quit", "bye"]:
            self.add_message("Assistant", "Goodbye! Closing the application...")
            self.root.after(1500, self.root.destroy)
            return
        
        # Process the query
        response = process_query(query, self.vectorstore, self.gemini)
        
        # Display response
        self.add_message("Assistant", response)
        
        # Convert to speech and play
        self.status_var.set("Converting to speech...")
        audio_bytes = text_to_speech(response)
        if audio_bytes:
            self.status_var.set("Playing response...")
            threading.Thread(target=play_audio, args=(audio_bytes,), daemon=True).start()
        
        # Store in chat history
        self.chat_history.append({"question": query, "answer": response})
        
        # Update status
        self.status_var.set("Ready")

# Main function
def main():
    # Set up the model
    api_key = "AIzaSyCNu4rvUS7NbUo3PAzzAYLkzXVf1KWIYyA"  # Replace with your actual API key
    genai.configure(api_key=api_key)
    gemini = TinyGemini()
    
    # Load documents
    print("Loading documents...")
    pdf_folder = "books"  # Folder containing PDF documents
    docs = load_books_minimal(pdf_folder)
    print(f"Loaded {len(docs)} documents")
    
    # Process documents
    print("Processing documents...")
    chunks = create_small_chunks(docs)
    print(f"Created {len(chunks)} chunks")
    
    # Create vector store
    print("Creating vector store...")
    vectorstore = create_minimal_vectorstore(chunks)
    print("Vector store ready")
    
    # Create and start the GUI
    root = tk.Tk()
    app = EnergyAssistantGUI(root, vectorstore, gemini)
    root.mainloop()

if __name__ == "__main__":
    main()
    


