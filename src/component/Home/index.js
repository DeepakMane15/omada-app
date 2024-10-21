import { Container } from 'react-bootstrap';
import mapImage from '../../assets/images/map.jpg';
import { DevicesListMaster } from '../../common/AppConstant';
import Header from '../Header';

const Blinker = ({ x, y }) => {
    const blinkerStyle = {
        position: 'absolute',
        top: `${y}px`,
        left: `${x}px`,
        width: '10px',
        height: '10px',
        backgroundColor: 'green',
        borderRadius: '50%',
        animation: 'blink 1s infinite',
    };

    return <div style={blinkerStyle}></div>;
};

const Home = () => {
    const deviceList = DevicesListMaster;

    return (
        <>
            <Header />
            <Container>
                <div className='mt-4'>
                    <img height={'80%'} width={'100%'} src={mapImage} alt="Map" />
                    {deviceList.map(device => (
                        <Blinker x={device.xAxis} y={device.yAxis} />
                    ))}
                </div>
            </Container>
        </>
    )
}

export default Home;