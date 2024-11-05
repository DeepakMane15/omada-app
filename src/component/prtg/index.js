import { useEffect, useState, useRef } from 'react';
import { Container } from 'react-bootstrap';

const Prtg = () => {
    return (
        <Container style={{marginTop:'100px'}}>
            <iframe width={'100%'} height={'900px'} frameBorder={1}
                src="http://prtg.snmitapps.org:5433/public/mapshow.htm?id=2688&mapid=B83AC487-48A3-4F52-B944-CB4EB1EF6D62" >
            </iframe >
        </Container>
    )
};

export default Prtg;