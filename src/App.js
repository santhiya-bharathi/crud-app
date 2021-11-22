// import logo from './logo.svg';
import './App.css';
import { Switch, Route, useParams } from "react-router-dom";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import {useEffect, useState} from "react";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { useHistory } from "react-router-dom";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';



// this app is developed by using api and useEffect 
export default function App() {

const [scientist, setScientist] = useState([]);
  const history = useHistory();
  const [mode, setMode] = useState("dark");
const darkTheme = createTheme({
  palette: {
    mode: mode,
  },
});
console.log(scientist);

useEffect(()=>{
  fetch("https://616d58f537f997001745d9d1.mockapi.io/scientist", {method:"GET"})
  .then((data)=>data.json())
  .then((scis)=>setScientist(scis));
}, []);

  return (
     // themeprovider for dark and light mode

      // paper for blackground
      <ThemeProvider theme={darkTheme}>
      <Paper elevation={4} style={{borderRadius:"0px",minHeight:"100vh"}}>

    <div className="App">
       <AppBar position="static">
       <Toolbar>
       <Button varient="text" color="inherit" onClick={()=>history.push("/")}>Home</Button>
       <Button varient="text" color="inherit" onClick={()=>history.push("/createscientist")}>Create scientistlist</Button>
       <Button varient="text" color="inherit" onClick={()=>history.push("/scientistlist")}>Scientist list</Button>

       <Button varient="text" color="inherit" style={{marginLeft:"auto"}} onClick={()=>setMode(mode==="light"? "dark":"light")}> {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />} {mode==="light"? "Dark":"Light"}Mode</Button>
       </Toolbar>
       </AppBar>
      
       <Switch>
      
      <Route exact path="/">
          <Home />
        </Route>

        <Route path="/scientistlist/edit/:id">
          <Editscientist />
        </Route>

        <Route path="/scientistlist">
          <Scientistlist />
        </Route>

        <Route path="/createscientist">
          <Createscientist />
        </Route>

        <Route path="**">
          <NotFound/>
        </Route>

      </Switch>
    </div>
    </Paper>
    </ThemeProvider>
  );
}


//creating home page
function Home() {
  const history = useHistory();
  return (
    <div className="home">
      <h2 className="home-hello">Hello All!!!</h2>
      <img src="https://cloudproserv.com/wp-content/uploads/2019/05/Welcome-to-our-new-website-1280x720.jpg" alt="welcome"/>
      <div>
      <Button onClick={()=>history.push("/scientistlist") }variant="contained">scientistlist<ArrowForwardIcon/></Button>
      </div>
    </div>
  );
}

//creating not found page
function NotFound(){
  return(
    <div className="not-found-pic">
      <h1 className="not-found-name">404 Not Found</h1>
      <img  src="https://s12emagst.akamaized.net/assets/hu/images/error_404_600px.gif" alt="404 not found"/>
    </div>
  );
}

//crud app is developed by using POST method using API

function Createscientist(){
  const history = useHistory();
  const [name, setName] = useState("");
  const [pic, setPic] = useState("");

const addUser =()=>{
  const newUser= {pic, name};
 
  fetch(`https://616d58f537f997001745d9d1.mockapi.io/scientist`, {
    method:"POST",
    body: JSON.stringify(newUser),
    headers: {'Content-Type': 'application/json'},
}).then(()=>history.push("/scientistlist"));
};

  return(
    <div className="create-list-place">
      <TextField value={pic} 
      onChange={(event)=>setPic(event.target.value)}  label="enter profile url" variant="filled" />
     
     <TextField value={name}
      onChange={(event)=>setName(event.target.value)} label="enter name" variant="filled" />

      <Button onClick={addUser} variant="contained">Create</Button>
    </div>
  
  );
}

// edit is developed by using GET and PUT method using API

function Editscientist(){
  
  const {id} = useParams();
  const [scientistdet, setScientistdet] = useState(null);
useEffect(()=>{
  fetch(`https://616d58f537f997001745d9d1.mockapi.io/scientist/${id}`, {method:"GET"})
  .then((data)=>data.json())
  .then((mv)=>setScientistdet(mv));
}, [id]);
//only show update movie when data is available
  return scientistdet? <Updatescientist scientistdet={scientistdet}/>:"";
  
}


function Updatescientist({scientistdet}){
  const [name, setName] = useState(scientistdet.name);
  const [pic, setPic] = useState(scientistdet.profile);
  const history = useHistory();
  const editUser =()=>{
    
    const updatedUser= {pic, name};//shorthand
    console.log(updatedUser);

    fetch(`https://616d58f537f997001745d9d1.mockapi.io/scientist/${scientistdet.id}`, {
    method:"PUT",
    body: JSON.stringify(updatedUser),
    headers: {'Content-Type': 'application/json'},
}).then(()=>history.push("/scientistlist"))
  };
  return(
    <div className="create-list-place">
    <TextField value={pic} 
    onChange={(event)=>setPic(event.target.value)}  label="enter pic url" variant="filled" />
   
   <TextField value={name}
    onChange={(event)=>setName(event.target.value)} label="enter scientist name" variant="filled" />

    <Button onClick={editUser} variant="contained">Save</Button>
  </div>
  );
}

  
// userlist developed by using GET method and DELETE method is used for delete list using API

function Scientistlist(){

  const [scientist, setScientist] = useState([]);
  // console.log(scientist);
  const getScientist = () =>{
      fetch("https://616d58f537f997001745d9d1.mockapi.io/scientist")
      .then((data)=>data.json())
      .then((scis)=>setScientist(scis));
  };
  useEffect(getScientist, []);

  //after delete and refresh
  const deleteScientist = (id) =>{
    fetch(`https://616d58f537f997001745d9d1.mockapi.io/scientist/${id}`, {method:"DELETE"})
    .then(()=>getScientist());
  };

  const history = useHistory();
  return(
    <section>
      {scientist.map(({pic,name,id})=>(<Listscientist pic={pic} name={name}
      id={id}
      deleteButton= {<IconButton 
        onClick={()=> deleteScientist(id)}
        aria-label="delete" color="error"
      >
      <DeleteIcon />
    </IconButton>}
      editButton= {<IconButton 
        aria-label="edit"  color="success"
       onClick={()=>history.push("/scientistlist/edit/" + id)}>
       <EditIcon />
     </IconButton>}
      />))}
    </section>
  );
}

function Listscientist({pic,name,editButton,deleteButton}){
  return(
  <div className="content-div">
    <div>
  <img className="hero-img" src={pic} alt="profile"/>
  <div className="content-div-name">
  <h2>{name}</h2>
  <div className="edit-delete">
    {editButton}{deleteButton}
    </div>
  
  </div>
 <hr></hr>
  </div>
  </div>
  );
}

// const scientist = [
//   {id:"100", pic:"https://images.firstpost.com/wp-content/uploads/2019/02/KC_1.jpg", name:"kalpana chawla"},
// {id:"101", pic:"https://i.guim.co.uk/img/media/417a21848ea441a0acae900ba0d9ade9b322c9e5/0_579_4505_2700/master/4505.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=7bc328631920877e20dc0c98c0dc793d", name:"Einstein"},
// {id:"102", pic:"https://m.economictimes.com/thumb/msid-71234972,width-1200,height-900,resizemode-4,imgsize-637425/k-sivan-pti.jpg", name:"Shivan"},
// {id:"103", pic:"https://image.scoopwhoop.com/q30/s4.scoopwhoop.com/anj/sw/d4b16036-cd8a-432a-94ee-311617adb993.jpg", name:"APJ abdul kalam"},
// {id:"104", pic:"https://tamil.oneindia.com/img/2019/07/mayilsamy-annadurai12323-1562125497.jpg", name:"mylswamy annadurai"},
// {id:"105", pic:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwAOz-GLZZ_QK5GfTfIEmtVuQvBrs6wKDZqjLCUXLHJrA-Bwg5-9iKW9aaBK53AqYAhNY&usqp=CAU", name:"cv raman"},
// {id:"106", pic:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcHAOokyq22nIFG0mjL7ZtyonwWmPPCaTGAp1BC7VbLvRbO-10wy9vwYFui-1i36bqb-g&usqp=CAU", name:"sunita williams"},
// {id:"107", pic:"https://www.prl.res.in/prl-eng/sites/default/files/images/founder/vikram.jpg", name:"vikram sarabhai"},
// {id:"108", pic:"https://cdn.britannica.com/w:400,h:300,c:crop/08/198708-050-246F4A0D/Subrahmanyan-Chandrasekhar-1983.jpg", name:"chandrashekhar"},
// {id:"109", pic:"https://upload.wikimedia.org/wikipedia/commons/7/70/Srinivasa_Ramanujan_-_OPC_-_2_%28cleaned%29.jpg", name:"srinivasa ramanujanij"}
// ]
