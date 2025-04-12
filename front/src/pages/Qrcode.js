import { QRCodeCanvas } from 'qrcode.react';
import React, { } from 'react';
import NavBar from '../components/NavBar';
import env from "../env";

function Qrode({ socket }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <NavBar socket={socket}/>
            <QRCodeCanvas 
                value={env.url}
                size={180}
                bgColor="#ffffff"
                fgColor="#000000"
                level="H"
                includeMargin={true}
            />
        </div>
    );
}

export default Qrode;
