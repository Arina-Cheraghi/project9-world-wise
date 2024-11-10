import React, { useState } from 'react'

export function useGeoLocation(defaultPosition = null) {
    const [isLoading, setIsLoading] = useState(false);
    const [position, setPosition] = useState(defaultPosition);
    const [error, setError] = useState(false);


    function getPosition() {
        if (!navigator.geolocation)
            return setError("your browser does not support geolocation");

        setIsLoading(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setPosition({
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude
                });
                setIsLoading(false);
            },
            (error) => {
                setError(error.message);
                setIsLoading(false);
            }
        )
    }


    return { isLoading, position, error, getPosition }

}
