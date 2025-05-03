from flask import Flask, request, send_file, jsonify
import subprocess
import logging
from gtts import gTTS
import os
from flask_cors import CORS
import speech_recognition as sr
from pydub import AudioSegment
from flasgger import Swagger
import ollama

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})
swagger = Swagger(app)

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def convert_webm_to_wav(input_file, output_file):
    try:
        audio = AudioSegment.from_file(input_file, format="webm")
        audio.export(output_file, format="wav")
        logger.info(f"Successfully converted {input_file} to {output_file} using pydub")
        return True
    except Exception as e:
        logger.error(f"Pydub conversion failed: {e}")
        try:
            command = ["ffmpeg", "-i", input_file, output_file]
            subprocess.run(command, check=True)
            logger.info(f"Successfully converted {input_file} to {output_file} using ffmpeg")
            return True
        except Exception as e:
            logger.error(f"FFmpeg conversion failed: {e}")
            return False

@app.post("/api/sst/<string:lang>")
def server_sst(lang='en'):
    """
    Convert Speech to Text
    ---
    parameters:
      - name: lang
        in: path
        type: string
        required: true
        description: The language code for speech recognition.
      - name: audio
        in: formData
        type: file
        required: true
        description: The audio file in webm format.
    responses:
      200:
        description: Successfully converted speech to text.
        schema:
          type: object
          properties:
            data:
              type: string
      400:
        description: Bad request or audio not understood.
      500:
        description: Internal server error.
    """
    if 'audio' not in request.files:
        logger.warning("Audio file not found in the request")
        return jsonify({"data": "Erro ao receber o arquivo!"}), 400

    audio_file = request.files['audio']
    audio_file.save('audio.webm')
    logger.info("Received and saved audio file as 'audio.webm'")

    if not convert_webm_to_wav('audio.webm', 'audio.wav'):
        logger.error("Error converting WebM to WAV")
        return jsonify({"data": "Erro ao converter o arquivo"}), 500

    recognizer = sr.Recognizer()
    try:
        with sr.AudioFile('audio.wav') as source:
            audio_data = recognizer.record(source)
            text = recognizer.recognize_google(audio_data, language=lang)
            logger.info("Audio successfully recognized")
            return jsonify({"data": text}), 200
    except sr.UnknownValueError:
        logger.warning("Could not understand the audio")
        return jsonify({"data": "Não foi possível reconhecer o áudio"}), 400
    except sr.RequestError as e:
        logger.error(f"Speech recognition request error: {e}")
        return jsonify({"data": f"Erro ao solicitar reconhecimento de fala: {e}"}), 500
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        return jsonify({"data": f"Erro inesperado ao processar o áudio: {e}"}), 500

@app.post("/api/audio/<string:lang>")
def server_tts(lang="en"):
    """
    Convert Text to Speech
    ---
    parameters:
      - name: lang
        in: path
        type: string
        required: true
        description: The language code for text-to-speech.
      - name: data
        in: body
        schema:
          type: object
          required: true
          properties:
            data:
              type: string
              description: The text to be converted to speech.
    responses:
      200:
        description: Successfully converted text to speech.
        schema:
          type: string
          format: binary
      400:
        description: Bad request, missing data parameter.
      500:
        description: Internal server error.
    """
    request_data = request.get_json()
    if 'data' not in request_data:
        logger.warning("Missing 'data' parameter in the request")
        return jsonify({"data": "Parametro data ausente na solicitacao"}), 400

    data = request_data["data"]
    tts = gTTS(text=data, lang=lang)
    tts.save("llm.mp3")
    logger.info("Text-to-speech conversion successful")
    return send_file(os.path.abspath("llm.mp3"), mimetype="audio/mpeg")

@app.post("/api/generate/")
def server_llm():
    """
    Interact with a Language Model
    ---
    parameters:
      - name: request
        in: body
        schema:
          type: object
          required: true
          properties:
            request:
              type: string
              description: The message to send to the language model.
            model:
              type: string
              description: The model to use for the interaction.
    responses:
      200:
        description: Successfully interacted with the language model.
        schema:
          type: object
          properties:
            data:
              type: string
      400:
        description: Bad request, missing parameters.
      500:
        description: Internal server error.
    """
    request_data = request.get_json()
    message = request_data.get("request")
    model = request_data.get("model")

    if not message or not model:
        logger.warning("Invalid parameters: 'request' or 'model' missing")
        return jsonify({"Warning": "Parametros invalidos!"}), 400

    try:
        # Assuming ollama is a library or API for language model interactions
        ollama.show(model)  # Validates if the model is installed on the server
        logger.info(f"Model {model} is installed and valid")

        data = ollama.chat(
            model=model,
            messages=[{'role': 'user', 'content': message}],
            stream=False,
        )
        logger.info("LLM chat successful")
        return jsonify({"data": data["message"]["content"]}), 200
    except Exception as e:
        logger.error(f"Model interaction failed: {e}")
        return jsonify({"data": "Model não instalado no servidor ou modelo inválido. Se não instalado, execute 'ollama [model]' no terminal"}), 500

@app.get("/")
def testAPI():
    """
    Test API Endpoint
    ---
    responses:
      200:
        description: API is working.
        content:
          text/html:
            schema:
              type: string
              example: "<h1>OK</h1>"
    """
    logger.info("Test API called")
    return "<h1>OK</h1>", 200