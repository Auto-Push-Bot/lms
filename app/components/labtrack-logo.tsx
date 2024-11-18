import SchoolIcon from '@mui/icons-material/School';

export default function LabTrackLogoWhite() {
    return (
        <div className="flex flex-row items-center">
            <SchoolIcon className="h-12 w-12 rotate-[15deg] text-orange-500"/>
            <div className="text-white text-3xl font-medium tracking-wider px-2">
                LMS
            </div>
        </div>
    )
}

export function LabTrackLogoBlack() {
    return (
        <div className="flex flex-row items-center">
            <SchoolIcon className="h-12 w-12 rotate-[15deg] text-orange-500"/>
            <div className="text-black text-3xl font-medium tracking-wider px-2">
                LMS
            </div>
        </div>
    )
}