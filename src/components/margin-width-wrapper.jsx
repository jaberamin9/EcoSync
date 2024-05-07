import '@/app/globals.css'
export default function MarginWidthWrapper({
    children,
}) {
    return (
        <div className="bg-[#F4F4F5] lex flex-col md:ml-60 sm:border-r sm:border-zinc-700 min-h-screen" >
            {children}
        </div>
    );
}
