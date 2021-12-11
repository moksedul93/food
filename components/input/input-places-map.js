import {GoogleMap, Marker, useJsApiLoader, Autocomplete} from "@react-google-maps/api";
import React, {useState} from "react";
import {Form, Input} from 'antd'
import axios from "axios";

const InputPlacesMap = ({label, form, style = {height: 300, width: '100%'}}) => {
    const {isLoaded} = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: "AIzaSyAVKjCxMvk5Nymx6VYSlhc4iOasFoTxuCk",
        libraries: ['places']
    })
    const [autocomplete, setAutocomplete] = useState()
    const [marker, setMarker] = useState();
    const [refresh, setRefresh] = useState(false)
    const reload = () => setRefresh(!refresh)

    const onPlacesChange = () => {
        let {formatted_address, geometry} = autocomplete.getPlace()
        setAddressLocation(formatted_address, geometry.location.lat(), geometry.location.lng())
    }
    const handleMapClick = async ({latLng}) => {
        let {formatted_address, geometry} = await getGeocode(latLng.lat(), latLng.lng())
        setAddressLocation(formatted_address, geometry.location.lat, geometry.location.lng)
    }
    const onDragEnd = async () => {
        if (marker) {
            let {formatted_address, geometry} = await getGeocode(marker.position.lat(), marker.position.lng())
            setAddressLocation(formatted_address, geometry.location.lat, geometry.location.lng)
        }
    }

    const getGeocode = async (lat, lng) => {
        let response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + '%2C' + lng + '&language=en&key=AIzaSyAVKjCxMvk5Nymx6VYSlhc4iOasFoTxuCk');
        return response.data.results[0]
    }

    const getAddress = () => {
        let fields = form.getFieldsValue()
        if (fields.address && fields.address.address) {
            return fields.address.address
        }
        return ""
    }
    const setAddress = value => {
        form.setFieldsValue({address: {address: value}})
        reload()
    }
    const getLocation = () => {
        let fields = form.getFieldsValue()
        if (fields.address && fields.address.location) {
            return fields.address.location
        }
        return {lat: 22.8136822, lng: 89.5635596}
    }
    const setAddressLocation = (address, lat, lng) => {
        form.setFieldsValue({address: {address: address, location: {lat, lng}}})
        reload()
    }

    return (
        <>
            <div className="form-group">
                <label>{label}</label>
                {isLoaded && (
                    <Form.Item name={['address', 'address']} rules={[{required: true, message: ''}]}>
                        <Autocomplete onLoad={value => setAutocomplete(value)} onPlaceChanged={onPlacesChange}>
                            <Input size="large" value={getAddress()} onChange={e => setAddress(e.target.value)}/>
                        </Autocomplete>
                    </Form.Item>
                )}
                <Form.Item
                    name={['address', 'location']}
                    style={{position: "absolute", marginTop: -55}}
                    rules={[
                        {required: true, message: 'Please select a address'}
                    ]}
                />
            </div>
            <div className="form-group">
                {isLoaded && (
                    <GoogleMap
                        mapContainerStyle={style}
                        zoom={13}
                        center={getLocation()}
                        onClick={handleMapClick}
                    >
                        <Marker
                            onLoad={value => setMarker(value)}
                            draggable={true}
                            position={getLocation()}
                            onDragEnd={onDragEnd}
                        >
                        </Marker>
                    </GoogleMap>
                )}
            </div>

        </>

    )
}

export default InputPlacesMap