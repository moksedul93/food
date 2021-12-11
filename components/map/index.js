import {GoogleMap, LoadScript, Marker, useJsApiLoader} from "@react-google-maps/api";
import React from "react";

const Map = props => {
    const {isLoaded} = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: "AIzaSyAVKjCxMvk5Nymx6VYSlhc4iOasFoTxuCk",
        libraries: ['places']
    })


    return (
        <>
            {isLoaded && (
                <GoogleMap
                    mapContainerStyle={{ height: props.height, width: props.width}}
                    zoom={13}
                    center={{lat: props.lat , lng: props.lng }}
                >
                    <Marker
                        position={{lat: props.lat , lng: props.lng }}
                    >
                    </Marker>
                </GoogleMap>
            )}
        </>

    )
}

export default Map