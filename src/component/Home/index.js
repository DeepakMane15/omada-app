import { Container } from 'react-bootstrap';
import mapImage from '../../assets/images/map.jpg';
import { useMutation } from '@tanstack/react-query';
import { GetDeviceApi } from '../../api/deviceApi';
import { useEffect, useState } from 'react';
import { selectSessionId, selectToken } from '../../utils/redux/authSlice';
import store from '../../utils/redux/store';

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
    const [deviceList, setDeviceList] = useState([]);
    const token = selectToken(store.getState()); // Get accessToken from Redux
    const sessionId = selectSessionId(store.getState()); // Get accessToken from Redux

    const getMutation = useMutation({
        mutationFn: () => GetDeviceApi(token, sessionId),
        onSuccess: (data) => {
            setDeviceList(data.data);
            console.log(deviceList);
            console.log(data.data)
        },
        onError: (error) => {
            console.error("Api failed:", error.response?.data || error.message);
        }
    });

    useEffect(() => {
        getMutation.mutate()
    }, [])

    return (
        <>
            <Container>
                <div className='mt-4'>
                    <img height={'80%'} width={'100%'} src={mapImage} alt="Map" />
                    {deviceList && deviceList.length > 0 && deviceList?.map(device => (
                        <Blinker x={device.xAxis} y={device.yAxis} />
                    ))}
                </div>
            </Container>
        </>
    )
}

export default Home;