import { useState, useEffect } from "react";
import './styles/sass/App.scss'
import Header from "./componets /Header";
import Footer from "./componets /Footer";
import toast, { Toaster } from "react-hot-toast";

function App() {
  
  // All states 
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [userInput, setUserInput] = useState("");
  const [newArray, setNewArray] = useState([]);
  const [update, setUpdate] = useState(false);
  const [key, setKey] = useState("");


// functions for the form
  const handleChange = (event) => {
    setUserInput(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setPrompt(userInput);
  };

  
  // listening for sumbit changes, once form is submited this will update new array
  useEffect( ()=> {
    if (update === true) {
      // created an obj for response and prompt
      const responseObj = {
        userPrompt: prompt,
        userResponse: response,
        key: key,
      };
      // sets response obj to array, updates new array if another response is submitted 
      setNewArray([responseObj, ...newArray]);
      setUpdate(false);
    }

  },[key, newArray, prompt, response, update]);


  // fetch that gets the response from API
  useEffect(() => {
     
    const data = {
    prompt: prompt,
    temperature: 0.5,
    max_tokens: 64,
    top_p: 1.0,
    frequency_penalty: 0.0,
    presence_penalty: 0.0,
  };
    if(prompt) {
      fetch("https://api.openai.com/v1/engines/text-curie-001/completions", {
        
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.REACT_APP_OPEN_AI_KEY}`,
        },
        body: JSON.stringify(data),
      })
      .then( (res)=> {
        return res.json()
      })
      .then((jsonData)=> {
        setResponse(jsonData.choices[0].text)
        setKey(jsonData.created)
        setUpdate(true)
      })
      
      .catch(function (error) {
        toast("Please Ask Another Question");
      });
    }

  },[prompt])


  
  

  return (
    <div className="App">
      <Header />

      {/* if there is no response Toaster will pop up */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            margin: '250px 0 0 0',
            background: '#fbb034',
          },

        }}
      />


    <main className="wrapper">
      <form action="" onSubmit={handleSubmit}>

        <label className="sr-only" htmlFor="search">Search Area</label>
        <textarea placeholder="What Would You Like To Know???" name="searchArea" id="search" cols="30" rows="10" onChange={handleChange} value={userInput}></textarea>
        <button> Search </button>

      </form>

      <section className="resArea">
        <h2>Responses</h2>
        {newArray.map( (res) => {

          return (
            <div className="resBubble" key={res.key}>
              <p><span>Prompt:</span> {res.userPrompt}</p>
              <p><span>Response:</span>{res.userResponse}</p>
            </div>
          )
          })
        }
      </section>

    </main>
      <Footer />
     
    </div>

  );
}

export default App;
