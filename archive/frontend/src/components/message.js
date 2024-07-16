import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
// import { testDataDealed, testDataUndealed } from '../constant/data';
import dayjs from 'dayjs';
import axios from '../api'
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import TextField from '@mui/material/TextField';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import FormControl from '@mui/material/FormControl';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { cities } from '../constant/data';
import person0 from '../picture/person0.png';
import person1 from '../picture/person1.png';
import person2 from '../picture/person2.png';
import person3 from '../picture/person3.png';
import person4 from '../picture/person4.png';
import ErrorIcon from '@mui/icons-material/Error';
import Icon from '@mui/material/Icon';
import ChangeHistoryIcon from '@mui/icons-material/ChangeHistory';
import { Link } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
const picture = [person0, person1, person2, person3, person4];



export default function Message(props) {
    const { data, setData, token, setToken } = props;
    const tomorrow = dayjs().add(1, 'day').format('YYYY-MM-DD');
    const today = dayjs().format('YYYY-MM-DD');
    const yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD');


    const [tomorrowIdx, setTomorrowIdx] = React.useState(-1);

    const [todayIdx, setTodayIdx] = React.useState(-1);

    const [yesterdayIdx, setYesterdayIdx] = React.useState(-1);

    const [monthIdx, setMonthIdx] = React.useState(-1);

    const [longerIdx, setLongerIdx] = React.useState(-1);

    const [showData, setShowData] = React.useState(data.filter(item => item.Dealed === 1));

    async function fetchData() {
        const {
            data: { message, card },
        } = await axios.post('/api/get-pollination');
        card.sort(function (a, b) {
            var keyA = new Date(a.ReleaseDate),
                keyB = new Date(b.ReleaseDate);
            // Compare the 2 dates
            if (keyA < keyB) return 1;
            if (keyA > keyB) return -1;
            return 0;
        });
        setData(card);
    }
    React.useEffect(() => {
        fetchData();
    }, [])
    React.useEffect(() => {
        setShowData(data.filter(item => item.Dealed === 1));
        setShowDeal(true);
        setContent(showData[0]);
    }, [data])
    React.useEffect(() => {
        if (showData.length != 0) {
            setTomorrowIdx(showData.findIndex(obj => dayjs(obj.ReleaseDate).format('YYYY-MM-DD') === tomorrow));
            setTodayIdx(showData.findIndex(obj => dayjs(obj.ReleaseDate).format('YYYY-MM-DD') === today));
            setYesterdayIdx(showData.findIndex(obj => dayjs(obj.ReleaseDate).format('YYYY-MM-DD') === yesterday));
            setMonthIdx(showData.findIndex(obj => obj.ReleaseDate.slice(5, 7) === today.slice(5, 7) && obj.ReleaseDate.slice(8, 10) < yesterday.slice(8, 10)));
            //setLongerIdx(showData.findIndex(obj => obj.ReleaseDate.slice(5,7) < today.slice(5,7)));
        }
        else {
            setTomorrowIdx(-1);
            setTodayIdx(-1);
            setYesterdayIdx(-1);
            setMonthIdx(-1);
            setLongerIdx(-1);
        }

    }, [showData])
    //const [dataDealed,setDataDealed] = React.useState();



    const [showDeal, setShowDeal] = React.useState(true);

    const [content, setContent] = React.useState(showData[0]);

    const [dialogOpen, setDialogOpen] = React.useState(false);

    const [ModifydialogOpen, setModifyDialogOpen] = React.useState(false);

    const [dialogPurpose, setDialogPurpose] = React.useState('delete');

    const [id, setID] = React.useState(content.ID);
    const [name, setName] = React.useState(content.UserName);
    const [phone, setPhone] = React.useState(content.Phone);
    const [amount, setAmount] = React.useState(content.Amount);
    const [date, setDate] = React.useState([content.ReleaseDate, content.EndDate]);
    const [email, setEmail] = React.useState(content.Email);
    const [product, setProduct] = React.useState(content.Products);
    const [hectare, setHectare] = React.useState(content.Hectare);
    const [unit, setUnit] = React.useState(content.Unit);
    const [county, setCounty] = React.useState(content.County);
    const [address, setAddress] = React.useState(content.Address);
    const [staff, setStaff] = React.useState(content.Staff);





    //console.log(tomorrowIdx,todayIdx,yesterdayIdx,monthIdx,longerIdx);

    //const tomorrowIdx = getIndex(tomorrow);
    //const todayIdx = getIndex(today);
    //const yesterdayIdx = getIndex(yesterday);
    //const monthIdx =  showData.findIndex(obj => obj.ReleaseDate.slice(5,7) === today.slice(5,7)&& obj.ReleaseDate.slice(8,10) <yesterday.slice(8,10));
    //const longerIdx =  showData.findIndex(obj => obj.ReleaseDate.slice(5,7) < today.slice(5,7));

    const handleDialogClose = () => {
        setDialogOpen(false);
    }
    const handleDeleteDialog = () => {
        setDialogOpen(true);
        setDialogPurpose('delete');
    }
    const handleDealedDialog = () => {
        setDialogOpen(true);
        setDialogPurpose('dealed');
    }
    const handleModifyDialog = () => {
        setModifyDialogOpen(true);
        setID(content.ID);
        setName(content.UserName);
        setPhone(content.Phone);
        setAmount(content.Amount);
        setEmail(content.Email);
        setProduct(content.Products);
        setHectare(content.Hectare);
        setDate([content.ReleaseDate, content.EndDate])
        setUnit(content.Unit);
        setCounty(content.County);
        setAddress(content.Address);
        setStaff(content.Staff);
    }
    const handleModifyDialogClose = () => {
        setModifyDialogOpen(false);
    }
    const handleModify = async () => {
        const tmpnewState = {
            ID: id,
            UserName: name,
            Phone: phone,
            Email: email,
            Products: product,
            Hectare: hectare,
            Unit: unit,
            Amount: amount,
            County: county,
            Address: address,
            ReleaseDate: dayjs(date[0]).format('YYYY-MM-DD'),
            EndDate: dayjs(date[1]).format('YYYY-MM-DD'),
            Staff: staff,
        }
        const {
            data: { message, card },
        } = await axios.post('/api/update-single', {
            tmpnewState
        });
        alert(message);
        fetchData();
        console.log("update");
        setModifyDialogOpen(false);
    }
    const handleDelete = async () => {
        const {
            data: { message, card },
        } = await axios.post('/api/delete-one', {
            content
        });
        alert(message);
        fetchData();
        setDialogOpen(false);
    };
    const handleDealed = async () => {
        console.log('update dealed')
        const id = content.ID;
        const {
            data: { message, card },
        } = await axios.post('/api/updateDealed', {
            content
        });
        alert(message);
        fetchData();
        setDialogOpen(false);
    }
    const handleDataUndealed = () => {

        setShowData(data.filter(item => item.Dealed === 0).reverse());
        setShowDeal(false);

    };
    const handleDataDealed = () => {
        setShowData(data.filter(item => item.Dealed === 1));
        setShowDeal(true);

    }
    const handleContent = (event, ID) => {
        //console.log(id);

        setContent(showData.find(element => element.ID === ID));
    }
    const handleHookChange = (func) => (event) => {
        func(event.target.value);
    };
    if (!token) {
        return (
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, m: 8, p: 2 }}>
                請先
                <Link to={"/login"} sx={{ m: 8, p: 2 }}>登入</Link>
                管理者帳號
            </Typography>
        )
    }
    return (
        <Box sx={{
            display: 'flex',
            flexWrap: 'wrap',
            textAlign: 'center',
            justifyContent: 'center',
            backgroundColor: '#F8F8F8',
            m: 8,
            p: 2,
            top: '150pt',
            width: '1200px',
            overflowY: 'scroll',
            '& > :not(style)': {
                maxHeight: '450pt',
                m: 1,
            },
        }}
        >
            <Paper component="form" sx=
                {{
                    //'& .MuiTextField-root': { m: 2},
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: "center",
                    alignItems: 'center',
                    p: 2,
                    flex: 1,
                    height: "400pt"

                }}
                noValidate
                autoComplete="off">
                <Stack direction="row" spacing={4} sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                    <Button size="large" variant={showDeal === true ? "contained" : "text"} onClick={handleDataDealed}>已處理</Button>
                    <Button size="large" variant={showDeal === false ? "contained" : "text"} onClick={handleDataUndealed}>未處理</Button>
                </Stack>
                <List sx={{ overflow: 'auto', width: '100%', flex: 6 }}>
                    {showData.map(({ ID, UserName, ReleaseDate, Person }, index) => (
                        <React.Fragment key={ID}>
                            {index === tomorrowIdx && (
                                <ListSubheader sx={{ bgcolor: 'background.paper' }}>
                                    Tomorrow
                                </ListSubheader>
                            )}
                            {index === todayIdx && (
                                <ListSubheader sx={{ bgcolor: 'background.paper' }}>
                                    Today
                                </ListSubheader>
                            )}

                            {index === yesterdayIdx && (
                                <ListSubheader sx={{ bgcolor: 'background.paper' }}>
                                    Yesterday
                                </ListSubheader>
                            )}
                            {index === monthIdx && (
                                <ListSubheader sx={{ bgcolor: 'background.paper' }}>
                                    This Month
                                </ListSubheader>
                            )}
                            {index === longerIdx && (
                                <ListSubheader sx={{ bgcolor: 'background.paper' }}>
                                    Longer Before
                                </ListSubheader>
                            )}

                            <ListItemButton onClick={event => handleContent(event, ID)} >
                                <ListItemAvatar>
                                    <Avatar alt="Profile Picture" src={picture[ID % 5]} />
                                </ListItemAvatar>
                                <ListItemText primary={'訂購人：' + UserName} secondary={dayjs(ReleaseDate).format('YYYY-MM-DD')} />
                                {dayjs(ReleaseDate) < dayjs().add(3, 'day') && dayjs(ReleaseDate) > dayjs() && showDeal === false &&
                                    (<Icon edge="end" aria-label="error">
                                        <ChangeHistoryIcon />
                                    </Icon>)}
                                {dayjs(ReleaseDate) < dayjs() && showDeal === false &&
                                    (<Icon edge="end" aria-label="error">
                                        <ErrorIcon />
                                    </Icon>)}


                            </ListItemButton>
                        </React.Fragment>
                    ))}
                </List>
            </Paper>
            <Paper component="form" sx=
                {{
                    //'& .MuiTextField-root': { m: 2}
                    flex: 3,
                    display: "grid",
                    width: '100%',
                    gridTemplateColumns: "10% 10% 10% 13% 13% 13% 20% 10%",
                    gridAutoRows: "10% 20% 60% 10%",
                    justifyItems: "center",
                    height: "423pt"
                }}
                noValidate
                autoComplete="off">
                <Typography variant="h6" component="div" sx={{ gridRow: "1/2", gridColumn: "4/6", width: "50%", border: 2, borderRadius: 2, borderColor: "dodgerblue", flexGrow: 1, textAlign: "center", ml: 1, mr: 1, mt: 2 }}>
                    {content.Dealed === 1 ? "已處理" : "未處理"}
                </Typography>

                <Avatar alt="Profile Picture" align="left" sx={{ gridRow: "2/3", gridColumn: "2/4", width: "100px", height: "100px", ml: 2, mr: 1, mt: 4 }} src={picture[content.ID % 5]} />

                <Typography align="left" variant="h5" component="div" sx={{ gridRow: "2/3", gridColumn: "4/7", ml: 1, mr: 1, mt: 2, alignSelf: "start", p: 2 }}>
                    {"姓名： " + content.UserName}
                    <br />
                    {"預計出貨日： " + dayjs(content.ReleaseDate).format('YYYY-MM-DD')}
                    <br />
                    {"需求蜂箱數： " + content.Amount}
                </Typography>
                <Typography align="left" variant="h6" component="div" sx={{ gridRow: "3/4", gridColumn: "2/8", ml: 1, mr: 1, alignSelf: "start", p: 3 }}>
                    {"電話： " + content.Phone}
                    <br />
                    {"Email： " + content.Email}
                    <br />
                    {"農作物： " + content.Products}
                    <br />
                    {"農作面積： " + content.Hectare + " " + content.Unit}
                    <br />
                    {"授粉結束日期： " + dayjs(content.EndDate).format('YYYY-MM-DD')}
                    <br />
                    {"地址： " + content.Address}
                    <br />
                    {"接受表單日期： " + dayjs(content.AcceptDate).format('YYYY-MM-DD')}
                    <br />
                    {"承辦人備註： " + content.Staff}
                    <br />
                    {"買方備註：" + content.Special}
                </Typography>
                {(content.Dealed === 0) ?
                    (
                        <React.Fragment>
                            <Button variant="contained" onClick={handleDealedDialog} sx={{ gridRow: "4/5", gridColumn: "4/5", mb: 2, width: "80%" }}>
                                <Typography variant="h6"> 出貨</Typography>
                            </Button>
                            <Button color="error" variant="contained" onClick={handleDeleteDialog} sx={{ gridRow: "4/5", gridColumn: "5/6", mb: 2, width: "80%" }}>
                                <Typography variant="h6"> 刪除</Typography>
                            </Button>
                            <Button color="success" variant="contained" onClick={handleModifyDialog} sx={{ gridRow: "4/5", gridColumn: "6/7", mb: 2, width: "80%" }}>
                                <Typography variant="h6"> 更改</Typography>
                            </Button>
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            <Button color="error" variant="contained" onClick={handleDeleteDialog} sx={{ gridRow: "4/5", gridColumn: "4/5", mb: 2, width: "80%" }}>
                                <Typography variant="h6"> 刪除</Typography>
                            </Button>
                            <Button color="success" variant="contained" onClick={handleModifyDialog} sx={{ gridRow: "4/5", gridColumn: "6/7", mb: 2, width: "80%" }}>
                                <Typography variant="h6"> 更改</Typography>
                            </Button>
                        </React.Fragment>
                    )}



                <Dialog open={dialogOpen}>
                    <DialogTitle align="center" >是否送出訊息</DialogTitle>
                    <div>
                        <Button sx={{ m: 2, width: '30%' }} onClick={dialogPurpose === 'dealed' ? (handleDealed) : (handleDelete)} align="center" variant="outlined">送出</Button>
                        <Button color="error" sx={{ m: 2, width: '30%' }} onClick={handleDialogClose} align="center" variant="outlined">取消</Button>
                    </div>
                </Dialog>
                <Dialog open={ModifydialogOpen}>
                    <DialogTitle align="center" >更改授粉需求內容</DialogTitle>
                    <DialogContent>


                        <TextField
                            required
                            id="outlined-name"
                            label="姓名"
                            value={name}
                            onChange={handleHookChange(setName)}
                            autoComplete="off"
                            margin="normal"
                            fullWidth
                        />
                        <TextField
                            required
                            id="outlined-phone"
                            label="電話"
                            autoComplete="off"
                            value={phone}
                            onChange={handleHookChange(setPhone)}
                            margin="normal"
                            fullWidth
                        />
                        <TextField
                            id="outlined-email"
                            label="email"
                            value={email}
                            onChange={handleHookChange(setEmail)}
                            margin="normal"
                            fullWidth
                        />


                        <LocalizationProvider
                            dateAdapter={AdapterDayjs}
                            localeText={{ start: '授粉開始日期', end: '授粉結束日期' }}

                        >
                            <DateRangePicker
                                inputFormat="YYYY-MM-DD"
                                value={date}
                                onChange={(newdate) => { setDate(newdate); }}
                                renderInput={(startProps, endProps) => (
                                    <React.Fragment>
                                        <TextField {...startProps} helperText="最近實施日期須於5個工作日後" margin="normal" fullWidth />
                                        <TextField {...endProps} margin="normal" fullWidth />
                                    </React.Fragment>
                                )}
                            />

                        </LocalizationProvider>

                        <TextField
                            id="outlined-product"
                            label="農作物"
                            value={product}
                            onChange={handleHookChange(setProduct)}
                            margin="normal"
                            fullWidth
                        />
                        <FormControl fullWidth>
                            <TextField
                                id="outlined-hectart"
                                label="種植面積"
                                type="number"
                                value={hectare}
                                onChange={handleHookChange(setHectare)}
                                margin="normal"
                                fullWidth
                            />
                            <RadioGroup
                                row
                                value={unit}
                                onChange={handleHookChange(setUnit)}
                                margin="normal"
                                fullWidth
                            >
                                <FormControlLabel value="分地" control={<Radio />} label="分地" />
                                <FormControlLabel value="公頃" control={<Radio />} label="公頃" />
                            </RadioGroup>
                        </FormControl>
                        <TextField
                            id="outlined-amount"
                            label="需求蜂箱數"
                            type="number"
                            value={amount}
                            onChange={handleHookChange(setAmount)}
                            margin="normal"
                            fullWidth
                        />
                        <TextField
                            select
                            id="outlined-country"
                            label="農地縣市"
                            SelectProps={{
                                native: true,
                            }}
                            value={county}
                            onChange={handleHookChange(setCounty)}
                            margin="normal"
                            fullWidth
                        >
                            {cities.map((option) => (
                                <option autoFocus key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </TextField>
                        <TextField
                            id="outlined-Address"
                            label="地址"
                            value={address}
                            onChange={handleHookChange(setAddress)}
                            helperText="請註明完整地址"
                            margin="normal"
                            fullWidth
                        />


                        <TextField
                            label="承辦人備註"
                            value={staff}
                            onChange={handleHookChange(setStaff)}
                            id="outlined-Special"
                            margin="normal"
                            fullWidth />


                    </DialogContent>

                    <div align="center">
                        <Button sx={{ m: 2, width: '40%' }} onClick={handleModify} align="center" variant="outlined">送出</Button>
                        <Button color="error" sx={{ m: 2, width: '40%' }} onClick={handleModifyDialogClose} align="center" variant="outlined">取消</Button>
                    </div>

                </Dialog>
            </Paper>
        </Box>
    )

}