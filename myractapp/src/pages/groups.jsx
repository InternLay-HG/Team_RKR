import Messageslides from "@/components/messageslides";
import Navbar from "@/components/sidebar";
import { PlusCircleIcon, SearchIcon } from "lucide-react";
export default function GroupList() {
  const cardcomp = [
    {
      groupname: "group1",
      recentmessage: "recentmessage1",
    },
    {
      groupname: "group2",
      recentmessage: "recentmessage2",
    },
    {
      groupname: "group3",
      recentmessage: "recentmessage3",
    },
    {
      groupname: "group4",
      recentmessage: "recentmessage4",
    },
    {
      groupname: "group5",
      recentmessage: "recentmessage5",
    },
    {
      groupname: "group6",
      recentmessage: "recentmessage6",
    },
    {
      groupname: "group7",
      recentmessage: "recentmessage7",
    },
    {
      groupname: "group8",
      recentmessage: "recentmessage8",
    },
    {
      groupname: "group9",
      recentmessage: "recentmessage9",
    },
    {
      groupname: "group9",
      recentmessage: "recentmessage9",
    },
  ];
  return (
    <>
      <Navbar></Navbar>
      <div className="relative max-sm:w-72 sm:w-96 bg-zinc-700  p-1 h-screen sm:pl-24">
        <h1 className="p-2 font-bold text-2xl text-gray-200">Groups</h1>
        <form action="" className="flex flex-row relative inset-x-2">
          <SearchIcon className="stroke-slate-50 absolute inset-y-3 inset-x-3 z-10 pointer-events-none " />
          <input
            type="text"
            className="relative border-none outline-none pl-12 rounded-xl bg-slate-500 text-slate-100 font-normal  placeholder:text-slate-200 
            h-12 w-64"
            placeholder="Search ..."
          />
        </form>
        <div className="flex flex-col gap-2 overflow-y-auto p-2 mt-2 max-sm:h-[36rem] h-[36rem]">
          {cardcomp.map((card) => (
            <Messageslides
              groupname={card.groupname}
              recentmessage={card.recentmessage}
            />
          ))}
        </div>
        <div className="fixed bottom-24 sm:left-80 max-sm:left-52 h-12 w-12 bg-slate-600 rounded-full flex justify-center items-center">
         <PlusCircleIcon className="stroke-slate-100"/>
        </div>
      </div>
    </>
  );
}
