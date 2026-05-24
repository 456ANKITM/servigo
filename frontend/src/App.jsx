import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import FreelancerProfile from './pages/FreelancerProfile';
import ClientProfile from './pages/ClientProfile';
import JobDetails from './pages/JobDetails';
import SearchUsers from './pages/SearchUsers';
import SearchJobs from './pages/SearchJobs';
import PostJob from './pages/PostJob';
import AppliedWorkers from './pages/AppliedWorkers';
import WorkerPublicView from './pages/WorkerPublicView';
import Jobs from './pages/Jobs';
import { useDispatch, useSelector } from 'react-redux';
import { socket } from './socket';
import Chat from './pages/Chat';
import Services from './pages/Services';
import About from './pages/About';
import Contact from './pages/Contact';
import { useGetUserQuery, useUpdateLocationMutation } from './redux/api/api';
import { logoutUser, setUser } from './redux/slices/authSlice';
import SplashScreen from './pages/SplashScreen';
import JobsPosted from './pages/JobsPosted';
import BrowseJobs from './pages/BrowseJobs';
import JobsAgreements from './pages/JobsAgreements';
import toast from 'react-hot-toast';

const App = () => {
   const {user} = useSelector((state)=>state.auth)
    const [updateLocation] = useUpdateLocationMutation()
  const dispatch = useDispatch();
  const [booting, setBooting] = useState(false);
 const { data:userData, error, isLoading } = useGetUserQuery();
 console.log(userData)
 

  useEffect(()=>{

    if (!user) return;
    if(!navigator.geolocation){
      toast.error("geolocation is not supported by your browser")
      return;
    }
    // Ask For a location
    navigator.geolocation.getCurrentPosition(
      async  (position) => {
        try {
          const {latitude, longitude} = position.coords;
         let res =  await updateLocation({
            latitude, 
            longitude
          }).unwrap();
        } catch (error) {
          toast.error(error?.data?.message || "Failed to update the location")
        }
      },
       
       (error) => {
      if (error.code === error.PERMISSION_DENIED) {
        toast.error("Location permission denied ❌");
      } else if (error.code === error.POSITION_UNAVAILABLE) {
        toast.error("Location unavailable");
      } else if (error.code === error.TIMEOUT) {
        toast.error("Location request timed out");
      } else {
        toast.error("Failed to get location");
      }
    },

    {
      enableHighAccuracy: true, 
      timeout: 10000,           
      maximumAge: 0,            
    }
    )
    
  },[user, updateLocation])

  useEffect(()=>{
      if(userData?.success){
        dispatch(setUser(userData.data));
      } else {
         dispatch(logoutUser());
      }
  },[userData])

 useEffect(() => {
  if (user?._id) {
    socket.connect();
    socket.emit("addUser", user._id);
  }

  return () => {
    socket.disconnect();
  };
}, [user]);


if(booting) {
  return <SplashScreen />
}
  return (
   <BrowserRouter> 
         <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile/worker" element={<FreelancerProfile />} />
          <Route path="/profile/client" element={<ClientProfile />} />
          <Route path="/jobdetails/:jobId" element={<JobDetails />} />
          <Route path="/search-users" element={<SearchUsers />} />
          <Route path="/search-jobs" element={<SearchJobs />} />
          <Route path="/post-job" element={<PostJob />} />
          <Route path="/job/:jobId/workers" element={<AppliedWorkers />} />
          <Route path="/public/worker-profile/:userId" element={<WorkerPublicView />} />
          <Route path="/your-jobs" element={<Jobs />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/jobs-posted" element={<JobsPosted />} />
          <Route path="/browse-jobs" element={<BrowseJobs />} />
          <Route path="/jobs-agreements" element={<JobsAgreements />} />
          
         </Routes>
   </BrowserRouter>
  )
}

export default App;