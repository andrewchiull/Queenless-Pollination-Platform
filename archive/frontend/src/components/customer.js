import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import dayjs from 'dayjs';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import { cities } from '../constant/data';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogContentText from '@mui/material/DialogContentText';
import DialogContent from '@mui/material/DialogContent';
import person1 from '../picture/person1.png'
import axios from '../api';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import ListSubheader from "@material-ui/core/ListSubheader";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemButton from '@mui/material/ListItemButton';
import Collapse from "@material-ui/core/Collapse";
import DoneIcon from '@mui/icons-material/Done';
import InboxIcon from "@material-ui/icons/MoveToInbox";
import DraftsIcon from "@material-ui/icons/Drafts";
import SendIcon from "@material-ui/icons/Send";
import LastPageIcon from '@material-ui/icons/LastPage';
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import StarBorder from "@material-ui/icons/StarBorder";
import DialogActions from '@mui/material/DialogActions';
import { QAList, FAQ } from '../constant/data.js';
import moment from "moment"

export default function Customer(props) {
  //const {dataDealed,setDataDealed} = props;
  const maxdate = dayjs().add(60, "day").format('YYYY-MM-DD')
  const mindate = dayjs().add(5, "day").format('YYYY-MM-DD')
  const [requestMsg, setRequestMsg] = React.useState(newState);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [QAOpen, setQAOpen] = React.useState(false);
  const [QuestionOpen, setQuestionOpen] = React.useState([false, false, false, false]);
  const [QuestionIndex, setQuestionIndex] = React.useState(-1);
  const [name, setName] = React.useState('');
  const [phone, setPhone] = React.useState('09');
  const [amount, setAmount] = React.useState(0);
  const [date, setDate] = React.useState([mindate, maxdate]);
  const [email, setEmail] = React.useState('');
  const [product, setProduct] = React.useState('');
  const [hectare, setHectare] = React.useState(0);
  const [unit, setUnit] = React.useState('分地');
  const [county, setCounty] = React.useState('台北市');
  const [address, setAddress] = React.useState('');
  const [special, setSpecial] = React.useState();

  var newState = {
    ID: NaN,
    AcceptDate: dayjs().format('YYYY-MM-DD'),
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
    Special: special,
    Dealed: false,
    Staff: NaN,
    Person: person1,
  }



  const handleAdd = async (tmpnewState) => {
    const {
      data: { message, card },
    } = await axios.post('/api/create-pollination', {
      tmpnewState
    });
    alert(message)
  };

  const handleQuestionOpen = (value) => {
    setQuestionOpen(QuestionOpen => QuestionOpen.map((item, idx) => idx === value ? !item : item));
  }
  const handleQuestionIndex = (value) => {
    if (value !== QuestionIndex) {
      setQuestionIndex(value);
    }
    else {
      setQuestionIndex(-1);
    }

  }
  const refreshPage = () => {
    window.location.reload();
  }

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };
  const handleCancel = () => {
    setDialogOpen(false);
  }
  const handleQAOpen = () => {
    setQAOpen(true);
  }
  const handleQAClose = () => {
    setQAOpen(false);
  }
  const handleDialogClose = (value) => {
    //console.log(dataDealed);
    const tmpnewState = {
      ID: NaN,
      AcceptDate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
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
      Special: special,
      Dealed: false,
      Staff: NaN,
      Person: person1,
    }
    setRequestMsg(tmpnewState);
    handleAdd(tmpnewState);
    //setDataDealed([tmpnewState,...dataDealed]);
    setDialogOpen(false);

    //refreshPage();
  };

  const handleHookChange = (func) => (event) => {
    func(event.target.value);
  };
  return (

    <Box sx={{
      display: 'flex',
      flexWrap: 'wrap',
      textAlign: 'center',
      justifyContent: 'center',
      backgroundColor: '#F8F8F8',
      m: 8,
      p: 2,
      width: '1200px',
      overflowY: 'scroll',
      '& > :not(style)': {
        m: 1,
        width: '80%',
        height: 'auto',
      },
    }}
    >
      <Typography align="center" variant="h4" component="div" sx={{ width: '100%' }}>
        新增授粉媒合需求
      </Typography>
      <Paper component="form" sx=
        {{
          //'& .MuiTextField-root': { m: 2},
          p: 2,
          m: 2,
          direction: "column",
          justifyContent: "center",
          alignItems: 'center'
        }}
        noValidate
        autoComplete="off">


        <TextField fullWidth
          margin="normal"
          required
          id="outlined-name"
          label="姓名"
          error={name.length === 0}
          value={name}
          onChange={handleHookChange(setName)}
          autoComplete="off"
        />
        <TextField fullWidth
          margin="normal"
          required
          error={!phone.match(/[0-9]{10}/)}
          id="outlined-phone"
          label="行動電話"
          autoComplete="off"
          value={phone}
          onChange={handleHookChange(setPhone)}
          helperText="只接受行動電話"

        />
        <TextField fullWidth
          margin="normal"
          id="outlined-email"
          label="email"
          value={email}
          onChange={handleHookChange(setEmail)}
        />


        <LocalizationProvider
          dateAdapter={AdapterDayjs}
          localeText={{ start: '授粉開始日期', end: '授粉結束日期' }}
        >
          <DateRangePicker
            inputFormat="YYYY-MM-DD"
            value={date}
            onChange={(newdate) => { setDate(newdate); }}
            minDate={mindate}
            renderInput={(startProps, endProps) => (
              <React.Fragment>
                <TextField margin="normal" fullWidth {...startProps} helperText="最近實施日期須於5個工作日後" />
                <TextField margin="normal" fullWidth {...endProps} />
              </React.Fragment>
            )}
          />

        </LocalizationProvider>


        <FormControl fullWidth>
          <TextField fullWidth
            margin="normal"
            id="outlined-product"
            label="農作物"
            value={product}
            onChange={handleHookChange(setProduct)}
          />

          <TextField
            margin="normal"
            id="outlined-hectart"
            label="種植面積"
            type="number"
            value={hectare}
            onChange={handleHookChange(setHectare)}
          />
          <RadioGroup
            row
            value={unit}
            onChange={handleHookChange(setUnit)}
          >
            <FormControlLabel value="分地" control={<Radio />} label="分地" />
            <FormControlLabel value="公頃" control={<Radio />} label="公頃" />
          </RadioGroup>
        </FormControl>
        <TextField fullWidth
          margin="normal"
          id="outlined-amount"
          label="需求蜂箱數"
          type="number"
          value={amount}
          onChange={handleHookChange(setAmount)}
        />
        <TextField fullWidth
          margin="normal"
          select
          id="outlined-country"
          label="農地縣市"
          SelectProps={{
            native: true,
          }}
          value={county}
          onChange={handleHookChange(setCounty)}
        >
          {cities.map((option) => (
            <option autoFocus key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </TextField>
        <TextField fullWidth
          margin="normal"
          id="outlined-Address"
          label="地址"
          value={address}
          onChange={handleHookChange(setAddress)}
          helperText="請註明完整地址"
        />

        <FormControl fullWidth >
          <TextField fullWidth margin="normal" label="其他注意事項" value={special}
            onChange={handleHookChange(setSpecial)} id="outlined-Special" />

        </FormControl>


        <Button sx={{ m: 2 }} onClick={handleDialogOpen} align="center" variant="outlined" disabled={name.length === 0 || !phone.match(/[0-9]{10}/)}>送出表單</Button>
        <Button sx={{ m: 2 }} onClick={handleQAOpen} align="center" variant="outlined" >常見問題</Button>

        <Dialog open={QAOpen}>
          <DialogTitle align="center" >常見問題集</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description" sx={{ width: '95%', p: 2 }}>
              請點選問題集分類，若有問題集無法回應的問題，請致電或寫信詢問，謝謝您
            </DialogContentText>
            <List
              component="nav"
              aria-labelledby="nested-list-subheader"
              subheader={
                <ListSubheader component="div" id="nested-list-subheader">
                  問題集
                </ListSubheader>
              }
            >
              {QAList.map(question =>
                <>
                  <ListItemButton onClick={event => handleQuestionOpen(question.index)}>
                    <ListItemIcon>
                      {QuestionOpen[question.index] ? <ExpandLess /> : <ExpandMore />}
                    </ListItemIcon>
                    <ListItemText primary={question.value} />
                  </ListItemButton>

                  <Collapse in={QuestionOpen[question.index]} timeout="auto" unmountOnExit>
                    {FAQ.filter(function (item) {
                      return item.Type === question.index;
                    }).map(QA =>
                      <>
                        <List disablePadding>
                          <ListItemButton sx={{ pl: 4 }} onClick={event => handleQuestionIndex(QA.Index)}>
                            <ListItemIcon>
                              <LastPageIcon />
                            </ListItemIcon>
                            <ListItemText primary={QA.Q} />
                          </ListItemButton>
                        </List>
                        <Collapse in={QuestionIndex === QA.Index} timeout="auto" unmountOnExit>
                          <List disablePadding>
                            <ListItemButton sx={{ pl: 8 }}>
                              <ListItemIcon>
                                <DoneIcon />
                              </ListItemIcon>
                              <ListItemText primary={QA.A} />
                            </ListItemButton>
                          </List>
                        </Collapse>
                      </>
                    )}

                  </Collapse>
                </>
              )}

            </List>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleQAClose}>返回</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={dialogOpen}>
          <DialogTitle align="center" >是否送出訊息</DialogTitle>
          <div>
            <Button sx={{ m: 2, width: '30%' }} onClick={handleDialogClose} align="center" variant="outlined">送出</Button>
            <Button color="error" sx={{ m: 2, width: '30%' }} onClick={handleCancel} align="center" variant="outlined">取消</Button>
          </div>
        </Dialog>
      </Paper>
    </Box>


  )

}