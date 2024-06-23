import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MenuAppBar from "./menuAppBar";
import Welcome from "./welcome";
import Customer from "./customer";
import Message from "./message";
import Login from "./login";
import Register from './register';
import { testDataDealed } from "../constant/data";
import axios from '../api'
import Typography from '@mui/material/Typography';
export default function Main() {
    const [dataDealed, setDataDealed] = React.useState(testDataDealed);
    const [token, setToken] = React.useState();
    const [data, setData] = React.useState();
    async function fetchData() {
        const {
            data: { message, card },
        } = await axios.post('/api/get-pollination');
        setData(card);
    }
    React.useEffect(() => {
        fetchData();
    }, []);

    return (
        <Router>
            <MenuAppBar />
            <Routes>
                <Route exact path="/" element={
                    <Typography variant="h6" component="div" sx={{
                        flexGrow: 1, m: 8,
                        p: 2
                    }}>
                        請點選表單選項進行填寫
                    </Typography>
                } />
                <Route exact path="/Welcome" element={<Welcome />} />
                <Route exact path="/customer" element={<Customer dataDealed={dataDealed} setDataDealed={setDataDealed} data={data} setData={setData} />} />
                <Route exact path="/message" element={<Message data={data} setData={setData} token={token} setToken={setToken} />} />
                <Route exact path="/login" element={<Login token={token} setToken={setToken} />} />
                <Route exact path="/register" element={<Register />} />
            </Routes>
        </Router>
    )


}