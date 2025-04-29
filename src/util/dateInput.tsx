import { useRef } from 'react';
import { DateInput } from 'react-admin'

export const CustomDateInput = ({source, label, alwaysOn}: any) => {
    const inputRef = useRef<any>(null);

    const handleClick = () => {
      if (inputRef.current === null) return;
      inputRef.current.showPicker();
    };

    return <DateInput alwaysOn={alwaysOn} fullWidth onClick={handleClick} inputProps={{ ref: inputRef }} source={`${source}`} label={label} />
}
