import { Calendar, Settings, Users, SearchIcon,User2Icon } from "lucide-react";
import { useState } from "react";
export default function Navbar() {
 const[active,setactive] = useState(" "); 
 
  return (
    <div className="flex flex-row  w-full z-10">
      <div className="max-sm:hidden sm:flex flex-col bg-black w-20 h-screen  fixed z-50">
        <div className="h-20 w-full flex justify-center items-center">
          <p className="text-white font-bold text-lg">Logo.</p>
        </div>
        <div className="bg-slate-800">
          <ul>
            <li onClick={()=>{setactive("group")}} className={active==="group"?"p-4 shadow-sm shadow-white/50 bg-sky-900/70 border-r-[3px] border-sky-500/90 text-sky-300  flex  items-center justify-center":"p-4 shadow-sm shadow-white/50  text-slate-300  flex  items-center justify-center "}>
              <Users />
            </li>
            <li onClick={()=>{setactive("schedule")}} className={active==="schedule"?"p-4 shadow-sm shadow-white/50 bg-sky-900/70 border-r-[3px] border-sky-500/90 text-sky-300  flex  items-center justify-center":"p-4 shadow-sm shadow-white/50  text-slate-300  flex  items-center justify-center"}>
              <Calendar />
            </li>
            <li onClick={()=>{setactive("setting")}} className={active==="setting"?"p-4 shadow-sm shadow-white/50 bg-sky-900/70 border-r-[3px] border-sky-500/90 text-sky-300  flex items-center justify-center":"p-4 shadow-sm shadow-white/50  text-slate-300  flex  items-center justify-center"}>
              <Settings />
            </li>
            <li onClick={()=>{setactive("profile")}} className={active==="profile"?"absolute bottom-0 p-4 shadow-sm shadow-white/50 border-r-[3px] border-sky-500/90   flex  items-center justify-center bg-sky-800 w-full":"absolute bottom-0 p-4 shadow-sm shadow-white/50   flex  items-center justify-center  w-full bg-slate-800 border-slate-500"}>
            <User2Icon className={active==="profile"?"stroke-none fill-sky-300":"stroke-none fill-slate-100"}/>
          </li>
          </ul>
        </div>
      </div>

        <ul className=" bottom-0 flex flex-row justify-evenly w-full bg-slate-7=800 sm:hidden fixed z-50">
          <li onClick={()=>{setactive("group")}} className={active==="group"?"p-4 shadow-md shadow-white/30  text-sky-300  flex  items-center justify-center bg-sky-800 w-full border-r border-slate-500":"p-4 shadow-md shadow-white/30  text-slate-300  flex  items-center justify-center bg-slate-800 w-full border-r border-slate-500"}>
            <Users />
          </li>
          <li onClick={()=>{setactive("schedule")}} className={active==="schedule"?"p-4 shadow-md shadow-white/30  text-sky-300  flex  items-center justify-center bg-sky-800 w-full border-r border-slate-500":"p-4 shadow-md shadow-white/30 border-r text-slate-300  flex  items-center justify-center bg-slate-800 w-full  border-slate-500"}>
            <Calendar />
          </li>
          <li onClick={()=>{setactive("setting")}} className={active==="setting"?"p-4 shadow-md shadow-white/30  text-sky-300  flex  items-center justify-center bg-sky-800 w-full border-r border-slate-500":"p-4 shadow-md shadow-white/30  text-slate-300  flex  items-center justify-center bg-slate-800 w-full  border-slate-500"}>
            <Settings />
          </li>
          <li onClick={()=>{setactive("profile")}} className={active==="profile"?"p-4 shadow-md shadow-white/30   flex  items-center justify-center bg-sky-800 w-full border-r border-slate-500":"p-4 shadow-md shadow-white/30   flex  items-center justify-center bg-slate-800 w-full  border-slate-500"}>
            <User2Icon className={active==="profile"?"stroke-none fill-sky-300":"stroke-none fill-slate-100"}/>
          </li>
        </ul>

      {/* <div className="max-sm:hidden h-20 w-full bg-black border-b-2 border-slate-600 flex justify-between items-center pr-4 fixed z-50">
        <h1 className="text-white p-4 font-bold text-xl ">Logo.</h1>
        <div className="flex flex-row gap-3 justify-center items-center">
           <form action="" className="flex flex-row relative">
            <SearchIcon className="stroke-slate-50 absolute inset-y-3 inset-x-3 z-10 pointer-events-none "/>
            <input type="text" className="relative border-none outline-none pl-12 w-10 h-12 rounded-full bg-slate-500/40 text-slate-100 font-normal cursor-pointer placeholder:text-slate-200 
            focus:w-full focus:rounded-md "/>
           </form>
          <div className="h-10 w-10 bg-slate-400 rounded-full "></div>
        </div>
      </div> */}
    </div>
  );
}
