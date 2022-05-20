import { useState, useEffect } from "react";

function App() {
  // console.log(process.env.REACT_APP_OPEN_AI_KEY)

  const [prompt, setPrompt] = useState("")
  const [response, setResponse] = useState("")
  const [userInput, setUserInput] = useState("")
  const [newArray, setNewArray] = useState([])
  const [update, setUpdate] = useState(false)
  const [key, setKey] = useState("")

  const handleChange = (event) => {
    setUserInput(event.target.value)
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setPrompt(userInput);
  };

  
  
  useEffect( ()=> {
    if (update === true) {
      const responseObj = {
        userPrompt: prompt,
        userResponse: response,
        key: key,
      };
      setNewArray([responseObj, ...newArray])
      setUpdate(false)
    }

  },[key, newArray, prompt, response, update])



  

  

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
        setResponse(jsonData.choices[0].text, {prompt})
        setKey(jsonData.created)
        console.log(jsonData)
        setUpdate(true)
      });
    }

  },[prompt])


  
  

  return (
    <div className="App">
      <h1>Fun With AI</h1>

    <form action="" onSubmit={handleSubmit}>

      <label htmlFor="search">Search Area</label>
      <textarea name="searchArea" id="search" cols="30" rows="10" onChange={handleChange} value={userInput}></textarea>
      <button> Search </button>

    </form>
     {newArray.map( (res) => {
       console.log(res)

       return (
         <div key={res.key}>
           <p>{res.userPrompt}</p>
           <p>{res.userResponse}</p>
         </div>
       )
     })
     }

     
    </div>

  );
}

export default App;
