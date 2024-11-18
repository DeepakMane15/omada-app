import { Container, Form, Table } from "react-bootstrap";
import Header from "../Header";
import { DevicesListMaster } from "../../common/AppConstant";
import { selectSessionId, selectToken } from "../../utils/redux/authSlice";
import store from "../../utils/redux/store";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { GetDeviceApi } from "../../api/deviceApi";

const DeviceList = () => {
    const [deviceList, setDeviceList] = useState([]);
    const token = selectToken(store.getState()); // Get accessToken from Redux
    const sessionId = selectSessionId(store.getState()); // Get accessToken from Redux
    const [filteredDeviceList, setFilteredDeviceList] = useState([]);
    const [type, setType] = useState("all");
    const [connectedCount, setConnectedCount] = useState(0);
    const [disConnectedCount, setDisConnectedCount] = useState(0);
    const [missedCount, setMissedCount] = useState(0);
    const [isolatedCount, setIsolatedCount] = useState(0);
    const [pendingCount, setPendingCount] = useState(0);
    const [deviceType, setDeviceType] = useState("all");

    const getMutation = useMutation({
        mutationFn: () => GetDeviceApi(token, sessionId, true),
        onSuccess: (data) => {
            setDeviceList(data.data.finalDeviceData);
            setFilteredDeviceList(data.data.finalDeviceData);
            let count = data.data.finalDeviceData.filter(d => d.status == 1);
            setConnectedCount(count.length);
            let disCont = data.data.finalDeviceData.filter(d => d.status == 0);
            setDisConnectedCount(disCont.length);
            let pendingCount = data.data.finalDeviceData.filter(d => d.status == 2);
            setPendingCount(pendingCount.length);
            let missedCount = data.data.finalDeviceData.filter(d => d.status == 3);
            setMissedCount(missedCount.length);
            let isolatedCount = data.data.finalDeviceData.filter(d => d.status == 4);
            setIsolatedCount(isolatedCount.length);
        },
        onError: (error) => {
            console.error("Api failed:", error.response?.data || error.message);
        }
    });

    useEffect(() => {
        getMutation.mutate();
    }, [])

    useEffect(() => {
        // Call getMutation.mutate every 2 minutes
        const interval = setInterval(() => {
            getMutation.mutate();
        }, 2 * 60 * 1000); // 2 minutes in milliseconds
    
        // Clear the interval on component unmount
        return () => clearInterval(interval);
    }, []);

    const applyFilters = (devices) => {
        let filteredList = devices.filter(d =>
            (type === "all" || d.status === Number(type)) &&
            (deviceType === "all" || d.type === deviceType)
        );
        setFilteredDeviceList(filteredList);
    };

    useEffect(() => {
        applyFilters(deviceList);
    }, [type, deviceType]);

    return (
        <>
            <Container style={{ marginTop: '100px' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
                    <label style={{ color: 'white' }}>Filter : </label>
                    <Form.Select className="custom-select"  style={{ width: '170px' }} aria-label="Filter" value={type} onChange={e => setType(e.target.value)}>
                        <option value="-1">All ({deviceList.length})</option>
                        <option value="1" style={{color:'green'}}>Connected ({connectedCount})</option>
                        <option value="0" style={{ color: 'red' }}>Disconnected ({disConnectedCount})</option>
                        <option value="2" style={{ color: 'red' }}>Pending ({pendingCount})</option>
                        <option value="3" style={{ color: 'red' }}>Heartbeat Missed ({missedCount})</option>
                        <option value="4" style={{ color: 'red' }}>Isolated ({isolatedCount})</option>
                    </Form.Select>

                    <label style={{ color: 'white' }}>Device Type : </label>
                    <Form.Select style={{ width: '170px' }} aria-label="Filter" value={deviceType} onChange={e => setDeviceType(e.target.value)}>
                        <option value="all">All ({deviceList.length})</option>
                        <option value="ap">AP ({deviceList.filter(d => d.type === 'ap')?.length || 0})</option>
                        <option value="switch">Switch ({deviceList.filter(d => d.type === 'switch')?.length || 0})</option>
                    </Form.Select>
                </div>
                <Table className="table" striped bordered hover size="sm">
                    <thead>
                        <tr>
                            <th>Sr no</th>
                            <th>Device Name</th>
                            <th>MAC AAddress</th>
                            <th>IP AAddress</th>
                            <th>Status</th>
                            <th>Clients No</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredDeviceList.map((device, i) => (
                            <tr>
                                <td style={{ color: (device["status"] === 1) ? 'green' : 'red' }}>{i + 1}</td>
                                <td style={{ color: (device["status"] === 1) ? 'green' : 'red' }}>{device["name"]}</td>
                                <td style={{ color: (device["status"] === 1) ? 'green' : 'red' }}>{device["mac"]}</td>
                                <td style={{ color: (device["status"] === 1) ? 'green' : 'red' }}>{device["ip"]}</td>
                                <td style={{ color: (device["status"] === 1) ? 'green' : 'red' }}>{device["status"] === 1 ? "Connected" : "Disconnected"}</td>
                                <td style={{ color: (device["status"] === 1) ? 'green' : 'red' }}>{device["clients"]}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>
        </>
    )
}

export default DeviceList;