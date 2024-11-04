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
    const [type, setType] = useState("0");
    const [connectedCount, setConnectedCount] = useState(0);

    const getMutation = useMutation({
        mutationFn: () => GetDeviceApi(token, sessionId, true),
        onSuccess: (data) => {
            setDeviceList(data.data);
            let count = data.data.filter(d => d.status == 1);
            setConnectedCount(count.length);
            console.log(deviceList);
            console.log(data.data)
        },
        onError: (error) => {
            console.error("Api failed:", error.response?.data || error.message);
        }
    });

    useEffect(() => {
        getMutation.mutate();
    }, [])

    const handleFilter = () => {
        if (type == -1) {
            setFilteredDeviceList(deviceList);
            return;
        }
        let filteredList = deviceList.filter(d => d?.status == type);
        setFilteredDeviceList(filteredList);
    }

    useEffect(() => {
        handleFilter();
    }, [type]);


    return (
        <>
            <Container style={{ marginTop: '100px' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
                    <label style={{ color: 'white' }}>Filter : </label>
                    <Form.Select style={{ width: '170px' }} aria-label="Filter" value={type} onChange={e => setType(e.target.value)}>
                        <option value="-1">All ({deviceList.length})</option>
                        <option value="1">Connected ({connectedCount})</option>
                        <option value="0">Disconnected ({deviceList.length - connectedCount})</option>
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
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>
        </>
    )
}

export default DeviceList;