import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area"
// import '@/app/globals.css'

export default function MultiSelectDropdown({ formFieldName, options, onChange }) {

    const [selectedOptions, setSelectedOptions] = useState([]);
    const handleChange = (e) => {
        const isChecked = e.target.checked;
        const option = e.target.value;

        const selectedOptionSet = new Set(selectedOptions);

        if (isChecked) {
            selectedOptionSet.add(option);
        } else {
            selectedOptionSet.delete(option);
        }

        const newSelectedOptions = Array.from(selectedOptionSet);

        setSelectedOptions(newSelectedOptions);
        onChange(newSelectedOptions);
    };
    return (



        <label className=" border-2 p-2 rounded-md">
            <input type="checkbox" className="hidden peer" />
            {"select user"}
            <div className="w-[80%] absolute bg-white border transition-opacity opacity-0 pointer-events-none peer-checked:opacity-100 peer-checked:pointer-events-auto">
                <ul>
                    <ScrollArea className="h-auto rounded-md border p-4">
                        {options?.map((option, i) => {
                            return (
                                <li key={option._id}>
                                    <label className="flex whitespace-nowrap cursor-pointer px-2 py-1 transition-colors hover:bg-blue-100 [&:has(input:checked)]:bg-blue-200">
                                        <input
                                            type="checkbox"
                                            name={formFieldName}
                                            value={option._id}
                                            className="cursor-pointer"
                                            onChange={handleChange}
                                        />
                                        <span className="ml-1">{option.email}</span>
                                    </label>
                                </li>
                            );
                        })}
                    </ScrollArea>
                </ul>
            </div>
        </label >
    )
};