"use client";

import { use, useEffect, useState } from 'react';

function LocationFinder() {
    const [location, setLocation] = useState<{ latitude: number | null, longitude: number | null }>({ latitude: null, longitude: null });
    const [error, setError] = useState<string | null>(null);
    // useEffect(() => {
    //     try {
    //         handleGetLocation();
    //     } catch (error) {
    //         setError("An unexpected error occurred.");
    //         console.error("Unexpected error:", error);
    //     }
    // }, []);
    // const handleGetLocation = () => {
    //     if ("geolocation" in navigator) {
    //         navigator.geolocation.getCurrentPosition(
    //             (position) => {
    //                 const coords = {
    //                     latitude: position.coords.latitude,
    //                     longitude: position.coords.longitude,
    //                 };
    //                 setLocation(coords);
    //                 setError(null);
                    
    //                 // Print coordinates to console for easy copying
    //                 console.log(`Latitude: ${coords.latitude}, Longitude: ${coords.longitude}`);
    //             },
    //             (error) => {
    //                 setError(error.message);
    //                 console.error("Error getting location:", error.message);
    //             }
    //         );
    //     } else {
    //         setError("Geolocation is not supported by your browser.");
    //     }
    // };

    const googleMapsLink = `https://www.google.com/maps/place/30%C2%B001'33.9%22N+31%C2%B012'42.7%22E/@30.0260819,31.2118698,726m/data=!3m2!1e3!4b1!4m4!3m3!8m2!3d30.0260819!4d31.2118698?entry=ttu&g_ep=EgoyMDI0MTAyOS4wIKXMDSoASAFQAw%3D%3D`;
    

    return (
        <div className='mt-5 w-[90%] bg-gray-400 rounded-xl p-3 text-xl'>
            <a href={googleMapsLink} target="_blank" rel="noopener noreferrer">
               <div className='flex flex-col'>
                   <p className='text-center w-full mt-1' >
                       Patient location
                   </p>
               </div>
            </a>
        </div>
    );
}

export default LocationFinder;
