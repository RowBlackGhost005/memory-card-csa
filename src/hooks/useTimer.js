import {useEffect , useState} from 'react';

function useTimer(reset){
    const [seconds , setSeconds] = useState(0);
    const [minutes , setMinutes] = useState(0);

    useEffect(() => {
        setSeconds(0);
        setMinutes(0);

    }, [reset]);

    useEffect(() => {
        const interval = setInterval(() => {
            setSeconds(prev => prev + 1);
        }, 1000)

        return () => clearInterval(interval);
    } , [])

    useEffect(()=> {
        if(seconds === 60){
            setMinutes(prev => prev + 1);
            setSeconds(0);
        }
    } , [seconds])

    return [seconds , minutes];
}

export default useTimer;