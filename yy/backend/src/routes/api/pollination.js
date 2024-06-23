import mysql from 'mysql'
import e, { Router } from 'express';
import { createRequire } from 'module';


const require = createRequire(import.meta.url);
require('dotenv').config();

const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
})
const router = Router();

router.post('/login-request', async function (req, res) {
    try {
        pool.getConnection((err, connection) => {
            if (err) throw err;
            console.log('in the progress')
            const params = req.body.params;
            const sql = "SELECT * FROM `UserData` WHERE `UserName` = (?)";
            const UserName = [params.UserName];
            const Password = params.Password;

            connection.query(sql, [UserName], (err, rows) => {
                connection.release() // return the connection to pool
                if (!err) {
                    if (rows[0] && Password === rows[0].Password) {
                        console.log('login success')
                        res.send({ message: `登入成功`, Login: true })
                    }
                    else {
                        console.log('wrong password')
                        res.send({ message: `帳號或密碼錯誤`, Login: false })
                    }

                } else {
                    console.log(err)

                    res.send({ message: 'Wrong username', Login: false })
                }

            })
        })
    }
    catch (e) {
        res.json({ message: 'Something went wrong.....' });
    }

});

router.post('/register', async function (req, res) {
    try {
        pool.getConnection((err, connection) => {
            if (err) throw err;
            const params = req.body.params;
            const sql = "INSERT INTO `UserData` (`UserName`, `Password`) VALUES (?, ?)";
            const values = [params.UserName, params.Password];

            connection.query(sql, values, (err, result) => {
                connection.release(); // return the connection to pool
                if (!err) {
                    res.send({ message: '註冊成功', Register: true });
                } else {
                    console.log(err);
                    res.send({ message: '註冊失敗', Register: false });
                }
            });
        });
    } catch (e) {
        res.json({ message: 'Something went wrong.....' });
    }
});

router.post('/create-pollination', async function (req, res) {
    pool.getConnection((err, connection) => {
        if (err) throw err
        const params = req.body.tmpnewState
        const sql = "INSERT INTO `testjs` (`ID`, `AcceptDate`, `UserName`, `Phone`, `Email`, `Products`, `Hectare`,`Unit`, `Amount`, `County`, `Address`, `ReleaseDate`, `EndDate`, `Special`, `Dealed`, `Staff` ) VALUES (?)"
        var v = [null, params.AcceptDate, params.UserName, params.Phone, params.Email, params.Products, params.Hectare, params.Unit, params.Amount, params.County, params.Address, params.ReleaseDate, params.EndDate, params.Special, params.Dealed, null]
        connection.query(sql, [v], (err, rows) => {
            connection.release() // return the connection to pool
            if (!err) {
                res.send({ message: `新要求更新完成` })
            } else {
                console.log(err)
            }

            console.log('The data from pollination table are:11 \n', params)

        })
    })
});
router.post('/delete-one', async function (req, res) {

    try {
        pool.getConnection((err, connection) => {
            if (err) throw err
            //console.log(req.body)
            const params = req.body.content
            const sql = "DELETE FROM `testjs` WHERE `ID`= (?)"
            const id = [params.ID]
            connection.query(sql, [id], (err, rows) => {
                connection.release() // return the connection to pool
                if (!err) {
                    res.send({ message: `已刪除該授粉需求` })
                } else {
                    console.log(err)
                }

                console.log('The data deleted from pollination table are:11 \n', params)

            })
        }
        )
    }
    catch (e) {
        res.json({ message: 'Something went wrong.....' });
    }

})
router.post('/get-pollination', async function (req, res) {

    try {
        pool.getConnection((err, connection) => {
            if (err) throw err

            connection.query('SELECT * FROM `testjs` WHERE 1', (err, rows) => {
                //console.log(rows)
                connection.release() // return the connection to pool
                if (!err) {

                    res.send({ message: 'get data', card: rows })
                } else {
                    //console.log(err)
                }
                //console.log("everything ok")
                //console.log('The data from beer table are: \n', rows)
            })
        })


    } catch (e) {
        res.json({ message: 'Something went wrong.....' });
    }
})
router.post('/update-single', async function (req, res) {

    try {
        console.log('start to update single')
        pool.getConnection((err, connection) => {
            if (err) throw err
            const params = req.body.tmpnewState
            connection.query('UPDATE `testjs` SET `UserName`=(?),`Phone`=(?),`Email`=(?),`Products`=(?),`Hectare`=(?),`Unit`=(?),`Amount`=(?),`County`=(?),`Address`=(?),`ReleaseDate`=(?),`EndDate`=(?),`Staff`=(?) WHERE `ID` = (?)',
                [params.UserName, params.Phone, params.Email, params.Products, params.Hectare, params.Unit, params.Amount, params.County, params.Address, params.ReleaseDate, params.EndDate, params.Staff, params.ID], (err, rows) => {
                    //console.log(rows)
                    connection.release() // return the connection to pool
                    if (!err) {

                        res.send({ message: '更新資料成功' })
                    } else {
                        console.log(err)
                    }

                    //console.log('The data from beer table are: \n', rows)
                })
        })


    } catch (e) {
        res.json({ message: 'Something went wrong.....' });
    }
})


router.post('/updateDealed', async function (req, res) {

    try {
        pool.getConnection((err, connection) => {
            if (err) throw err
            const params = req.body.content
            connection.query('UPDATE `testjs` SET `Dealed`= (?) WHERE `ID` = (?)', [1, params.ID], (err, rows) => {
                //console.log(rows)
                connection.release() // return the connection to pool
                if (!err) {

                    res.send({ message: '更新資料成功' })
                } else {
                    //console.log(err)
                }
                console.log("dealed update success")
                //console.log('The data from beer table are: \n', rows)
            })
        })


    } catch (e) {
        res.json({ message: 'Something went wrong.....' });
    }
})
export default router;