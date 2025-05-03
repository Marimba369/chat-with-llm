# Guia de Configuração e Uso da API

## Requisitos

1. **Python**: Versão 3.6 ou superior.
2. **Bibliotecas Python**: Listadas no arquivo `requirements.txt`.
3. **Servidor Ollama**: Necessário para o funcionamento da API.

## Instalação

### Passo 1: Clonar o Repositório

Clone o repositório ou copie o arquivo `app.py` para o seu diretório de trabalho.

```bash
git clone <url_do_repositorio>
cd <nome_do_diretorio>
```

### Passo 2: Instalar as dependências

Execute o comando abaixo para instalar as bibliotecas necessárias:

```bash
pip install -r requeriments.txt
```

### Passo 3: Baixar o servidor do Ollama

Para baixar o servidor Ollama, pode ver a documentação em [Ollama Download](https://ollama.com/download)

No linux use:

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

### Passo 4: Instalar FFmpeg

Para converter arquivos de áudio, instale o FFmpeg:

- No Windows, baixe e instale do site oficial: [FFmpeg](https://ffmpeg.org/download.html)

- No Linux use:

```bash
sudo apt-get install ffmpeg
```

### Passo 5: Executar o servidor Ollama localmente e baixar os modelos desejados

Execute o servidor Ollama localmente e baixe os modelos desejados. Acesse [Ollama Library](https://ollama.com/library) para escolher os modelos adequados ao seu poder computacional.

<span style="color:green">Nota: Recomenda-se utilizar modelos que correspondam às capacidades do seu hardware para garantir um tempo de resposta curto. Existem modelos que não requerem GPU e têm menos de 1 GB.</span>

### Passo 6: Executar a aplicação Flask

Navegue até o diretório onde está o arquivo `app.py` e execute:

```bash
flask run
```

A aplicação estará disponível em `http://127.0.0.1:5000`.

A documentacao esta em [Doumentação da API](http://127.0.0.1:5000/apidocs/)

## Endpoints da API

### 1. Teste da API

#### Descrição

Verifica se a API está funcionando.

#### URL

`GET /`

#### Resposta de Sucesso

- **Código**: 200
- **Conteúdo**: `<h1>OK</h1>`

### 2. Reconhecimento de Fala (Speech-to-Text)

#### Descrição

Converte áudio em texto usando a Google Web Speech API.

#### URL

`POST /api/sst/<string:lang>`

#### Parâmetros

- **lang**: Código do idioma para reconhecimento de fala (`"pt-BR"` para português do Brasil, `"pt-PT"` para português de Portugal).
- **audio**: Arquivo de áudio no formato webm.

#### Exemplo de Requisição

```bash
curl -X POST "http://127.0.0.1:5000/api/sst/pt-PT" -F "audio=@seu_audio.webm"
```

Nota: Essa rota precisa que tenha acesso a internet!

#### Resposta de Sucesso

- **Código**: 200
- **Conteúdo**: `{"data": "Texto reconhecido"}`

### 3. Conversão de Texto para Fala (Text-to-Speech)

#### Descrição

Converte texto em áudio usando a biblioteca gTTS.

#### URL

`POST /api/audio/<string:lang>`

#### Parâmetros

- **lang**: Código do idioma para conversão de texto para fala (`"pt-BR"` para português do Brasil, `"pt-PT"` para português de Portugal).
- **data**: Texto a ser convertido em fala.

#### Exemplo de Requisição

```bash
curl -X POST "http://127.0.0.1:5000/api/audio/pt-PT" -H "Content-Type: application/json" -d '{"data": "Olá, mundo!"}'
```

#### Resposta de Sucesso

- **Código**: 200
- **Conteúdo**: Arquivo de áudio MP3

### 4. Interação com Modelo de Linguagem (LLM)

#### Descrição

Interage com um modelo de linguagem (LLM).

#### URL

`POST /api/generate/`

#### Parâmetros

- **request**: Mensagem a ser enviada ao modelo de linguagem.
- **model**: Modelo a ser usado para a interação.

#### Exemplo de Requisição

```bash
curl -X POST "http://127.0.0.1:5000/api/generate/" -H "Content-Type: application/json" -d '{"request": "Olá, tudo bem?", "model": "modelo-exemplo"}'
```

#### Resposta de Sucesso

- **Código**: 200
- **Conteúdo**: `{"data": "Resposta do modelo"}`

###

## Teste

Utilize ferramentas como Postman ou cURL para enviar requisições e testar os diferentes endpoints da API. Você também pode usar a documentação interativa mencionada anteriormente.

## Teste Unitario

Para executar testes unitários, utilizamos o pytest. No diretório ./tests/, o arquivo test_app.py contém testes que validam o comportamento da API ao receber JSONs vazios.

Execute os testes com o comando:

```python
pytest
```

### Passos Futuros

- Otimização de Processamento: Atualmente, os dados são processados em memória e retornados de uma só vez, o que pode causar problemas de desempenho. Pretendemos implementar processamento sob demanda utilizando recursos como generators e async, o que melhorará a performance e evitará problemas de memória.

- Melhoria da Interface: Planejamos desenvolver uma interface de usuário mais atraente e intuitiva, proporcionando uma melhor experiência para os usuários.

- De modo a humanizar mais o frontend desejamos trabalhar com novos sst, desse jeito teremos vozes mais proximas da humana

## Conclusão

Este guia fornece instruções claras para configurar e executar a API, que oferece funcionalidades de reconhecimento de fala e conversão de texto para fala, suportando múltiplos idiomas. Sinta-se à vontade para contribuir com melhorias.

Obrigado por visitar
