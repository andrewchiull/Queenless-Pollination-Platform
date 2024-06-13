import * as React from 'react';
import Typography from '@mui/material/Typography';
export default function Welcome() {
    return(
    <div>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, m:8, p:2 }}>
                請點選表單選項進行填寫
            </Typography>
    </div>
    )
    
}