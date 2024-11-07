import svg from "@/assets/react.svg"
export default function Messageslides( props) {
  return (
    <div className="w-full h-[3.4rem] bg-zinc-200 shadow-md rounded-md flex flex-row gap-4 items-center p-6 hover:bg-gray-200/60">
      <img src={svg} alt="" className="h-8 w-8 "/>
      <div className="flex flex-col">
        <p className="text-base font-semibold ">{props.groupname}</p>
        <p className="text-sm">{props.recentmessage}</p>
      </div>
    </div>
  );
}
