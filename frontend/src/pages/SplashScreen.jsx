import logo from "../assets/favicon.svg";

const SplashScreen = () => {
  return (
    <div className='h-screen w-full flex items-center justify-center bg-zinc-950'>
         <img src={logo} alt="logo" className="w-28 h-28 animate-pulse" />
        </div>
  )
}
export default SplashScreen