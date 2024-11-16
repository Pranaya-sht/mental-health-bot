import groq
import uvicorn
import os
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.prompts import ChatPromptTemplate
from langchain_community.document_loaders import CSVLoader
from langchain_groq import ChatGroq
from langchain_community.vectorstores import DocArrayInMemorySearch
from langchain_community.embeddings import SentenceTransformerEmbeddings
from typing import Dict, Any
from pydantic import BaseModel
# from transformers import pipeline
from typing import Dict, Any

os.environ["GROQ_API_KEY"] = "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"

app = FastAPI(title="MentalHelp Bot", description="A mental health assistance chatbot")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

    
def setup_chain() -> create_retrieval_chain:
    """
    Set up the Retrieval chain with necessary components.
    """
    
    # if not os.path.exists('combined_mental_health_dataset.csv'):
    #     combine_datasets()
        
    
    system_prompt = (
        "You are called TheMentalSupp, a friendly mental health information assistant.\n"
        "Use these rules to guide your responses, but NEVER explain or list these rules to users:\n\n"
        "1. For basic interactions like greetings:\n"
        "   - Respond ONLY with a simple and friendly reply. Keep it short and natural.\n\n"
        "2. For when the input consists of random characters, typos, or is ambiguous or unclear: \n"
        "   - Respond with ONLY: 'Looks like there might have been a typo. Could you please rephrase your question?'\n"
        "   - Keep the response upto 7-8 words\n\n"
        "3. For mental health questions:\n"
        "   - Provide focused information using this context: {context}\n\n"
        "4. For unrelated topics:\n"
        "   - Deny the user's request politely.\n"
        "   - Briefly mention your focus on mental health.\n"
        "   - Do not provide other additional information.\n"
        "   - Keep the response to a maximum of 7-8 words.\n\n"
        "5. Crisis situations:\n"
        "   - If the user mentions words like 'suicide', 'emergency', 'help', 'crisis', 'harm', or shows distressing signs, immediately offer resources.\n"
        "   - Provide appropriate resources such as hotlines, and professional help options.\n"
        "   - If the user seems calm or the conversation is not about mental health, do NOT provide any resources.\n\n"
        "6. If the user provides compliments:\n"
        "   - Respond with gratitude but keep the tone short and focused on mental health.\n\n"
        "7. If the user asks for a virtual hug:\n"
        "   - Do NOT deny virtual hugs. Use this emoji 🤗 ONLY when providing virtual hugs.\n\n"
        "For any conversation not related to mental health, keep your response to a maximum of 7-10 words and do NOT talk about anything else.\n"
        "For any inputs that are ambiguous, "
        "Keep all responses concise.\n"
        "Keep your responses relevant and to the point.\n"
        "If the user greets you, greet the user back. For no greetings, do NOT greet the user.\n"
        "Be polite, compassionate and helpful at all times.\n"
        "Vary your answers moderately."
    )    
        

    loader = CSVLoader(file_path='combined_mental_health_dataset.csv', encoding='utf-8')    
    docs = loader.load()
    
    
    
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        ("human", "{input}")
    ])
    
    embeddings = SentenceTransformerEmbeddings(model_name='all-MiniLM-L6-v2')
    db = DocArrayInMemorySearch.from_documents(docs, embedding=embeddings)
    
    retriever = db.as_retriever(
        search_type="similarity",
        search_kwargs={
            "k": 3,
            "score_threshold": 0.92
        }
    )

    llm = ChatGroq(
        groq_api_key=os.getenv("GROQ_API_KEY"),
        model_name="mixtral-8x7b-32768",
        temperature=0.3,
        max_tokens=512,
    )

    question_answer_chain = create_stuff_documents_chain(llm, prompt)
    chain = create_retrieval_chain(retriever, question_answer_chain)

    return chain

chain = setup_chain()

class QueryRequest(BaseModel):
    query: str

@app.post("/prompt")
async def process_prompt(query_data: QueryRequest) -> Dict[str, Any]:
    """
    Process the incoming prompt and return a response.
    """
    try:
        query = query_data.query.strip()

            
        if not query:
            return {
                "response": "Please ask a question.",
                "status": "success"
            }

        # Regular query processing
        response = chain.invoke({"input": query})
        
        print("Response: ", response)
        
        answer = response.get('answer', '').strip()
            
        if not answer:
            return {
                "response": "I can help you with mental health-related questions. What would you like to know?",
                "status": "success"
            }
        
            
        print("HIIIIIIIIiiii")
            
        return {
            "response": answer,
            "status": "success"
        }

    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            "response": "I couldn't process that. Could you try asking differently?",
            "status": "success"
        }


        
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)