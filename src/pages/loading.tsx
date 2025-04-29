export default function LoadingPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-[#212960]">
            <div className="flex flex-col items-center gap-4">
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-full border-4 border-[#1B84FF] border-t-transparent animate-spin"></div>
                    <div className="absolute inset-3 rounded-full bg-[#212960]"></div>
                </div>
                <h1 className="text-[#f9f9f9] text-xl font-semibold opacity-0 animate-fadeIn">
                    Loading, please wait...
                </h1>
            </div>
        </div>
    );
}