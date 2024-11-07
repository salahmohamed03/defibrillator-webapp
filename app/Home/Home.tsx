"use client";

import RealTimePlot from "./ploting";
import Location from "./Location";
import { useEffect, useState } from "react";
import PoolingService from "../PoolingService";
interface Message {
    sender_id: string;
    recipient_id: string;
    content: string;
}



export default function Home() {

    const [status , setStatus] = useState<number>(0);
    const [paused , setPaused] = useState<boolean>(true);
    const [temp , setTemp] = useState<string>('0.0');
    const [isNormal ,setIsnormal] = useState<boolean>(true);
    const [showPause , setShowPause] = useState<boolean>(false);
    // const apiUrl = "http://192.168.0.28:8000";
    const apiUrl = "http://192.168.15.108:8000";

    const userId = "app"
    const currentStatus = [
        "Heart rhythm is normal",
        "Abnormal heart rhythm detected",
        "Device is charging",
        "First shock delivered",
        "Re-evaluating heart rhythm",
        "Second shock delivered",
        "Third shock delivered",
        "No shock needed, continue monitoring",
        "Device is in standby mode",
        "Battery is low, recharge soon",
        "Device cooling down before recharging"
      ];
      const currentStatusStyle = [
        "text-green-800",         
        "text-red-500",           
        "text-yellow-500",        
        "text-blue-500",          
        "text-indigo-500",        
        "text-blue-600",          
        "text-blue-700",          
        "text-gray-500",          
        "text-gray-500",          
        "text-yellow-600",        
        "text-gray-300"           
      ];
      const changeStatus = ()=> {
        if(status+1>= currentStatus.length){
            setStatus(0)
        }else{
            setStatus(status+1)
        }
      }
      const [messages, setMessages] = useState<Message>();
      const [error, setError] = useState<string | null>(null);
      
      const service = new PoolingService(apiUrl);
    //   const service = new PoolingService("");
      const handelPost = async () => {
            try {
                const message: Message = {
                    sender_id: userId,
                    recipient_id: "arduino",
                    content: "1"
                }
                const response = await service.sendMessage(message);
                console.log(response);
            } catch (err) {
                setError(`Error sending message: ${err}`);
            }
      }
      useEffect(() => {
          const interval = setInterval(async () => {
              try {
                  const newMessage = await service.getMessages(userId);
                  if (newMessage) {
                      setMessages(newMessage);
                      let splitted = newMessage.content.split(',');
                      setTemp(splitted[0]);
                      setIsnormal(splitted[1] === '1');
                      if(splitted[1] !== '1'){
                        setStatus(1);
                        setPaused(false);
                      }

                  }
              } catch (err) {
                  setError(`Error fetching messages: ${err}`);
                  clearInterval(interval); 
              }
          }, 1000);
          return () => clearInterval(interval);
      }, [userId, apiUrl]);
      
    useEffect(() => {
        if(paused){
            return;
        }
        const interval = setInterval(() => {
            changeStatus();
        }, 4000); // Change status every 5 seconds
        handelStatus(currentStatus[status]);
        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, [status]);

    const handelPause = ()=> {
        setPaused(!paused);
        changeStatus();
    }
    const handelStatus = (status:string) => {
        if (status === "Abnormal heart rhythm detected"){
            setPaused(false);
            setShowPause(true);
        }else if(status === "First shock delivered"){
            handelPost();
        }else if(status === "Second shock delivered"){
            handelPost();
        }else if(status === "Third shock delivered"){
            handelPost();
            setShowPause(false);
        }else if(status === "Device cooling down before recharging"){
            setPaused(true);
        }
    }
    return (
        <div className="flex flex-col items-center bg-[#1A43BF] h-screen"> 
            {/* Temperature */}
            <div className="w-[90%] h-[50px] bg-[#b3e5fc] rounded-xl flex flex-row"> 
                <div className="w-[50%] h-full bg-[#b3e5fc] rounded-l-xl"> 
                    <p className="text-2xl m-2 text-[#00072D]">Temperature</p>
                </div>
                <div className="w-[50%] h-full bg-[#b3e5fc] rounded-r-xl"> 
                    <p className="text-2xl m-2 text-[#00072D]">{temp}°C</p>
                </div>
            </div>

            {/* Real-time plotting */}
            <div className="w-[90%] h-[200px] bg-[#b3e5fc] m-5 rounded-xl"> 
                <RealTimePlot isArrhythmia={isNormal} setIsArrhythmia={setIsnormal} />
            </div>

            {/* Status */}
            <div className="p-2 w-[90%] h-[200px] bg-[#b3e5fc] mx-5 mt-5 rounded-xl"> 
                <p className="text-xl text-[#00072D]">Status:</p>
                <div className={`flex flex-row justify-center h-[100px] items-center text-3xl text-center ${currentStatusStyle[status]}`}>
                    {currentStatus[status]}
                </div>
                
                {showPause && (
                    <button 
                        className="mt-4 bg-[#1F4E9F] hover:bg-[#10397C] text-white font-bold py-2 px-4 rounded" 
                        onClick={handelPause}
                    >
                        {paused ? "Continue" : "Pause"}
                    </button>
                )}
            </div>

            <Location />
        </div>
    );
}