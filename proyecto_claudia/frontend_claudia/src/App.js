import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import MyNavbar from "./navbar";

import './App.css';
import {NewMicrophones} from "./microfone";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import {NewLocations} from "./location";
import {NewProcessors} from "./processor";
import {NewRecorders} from "./recorder";
import {NewSpecies} from "./specie";
import {NewDiagnostic} from "./diagnostic";
import {NewRecording} from "./recording";
import {NewEvent} from "./sing_event";
import {NewUser} from "./login";
import {FileUploader} from "./upload_singEvent";

function App(){
   return (
        <Router>
            <MyNavbar/>
            <Routes>
                <Route path="/" element={<NewUser/>} />
                <Route path="/Microphones" element={<NewMicrophones/>} />
                <Route path="/Locations"  element={<NewLocations/>}/>
                <Route path="/Processors"  element={<NewProcessors/>}/>
                <Route path="/Recorders"  element={<NewRecorders/>}/>
                <Route path="/Recordings"  element={<NewRecording/>}/>
                <Route path="/Diagnostics"  element={<NewDiagnostic/>}/>
                <Route path="/Species"  element={<NewSpecies/>}/>
                <Route path="/SingEvents"  element={<NewEvent/>}/>
                <Route path="/Upload_singEvent"  element={<FileUploader/>}/>
            </Routes>
        </Router>

  );
}

export default App;

