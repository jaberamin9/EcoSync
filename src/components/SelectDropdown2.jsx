import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area"

export default function SelectDropdown2({ formFieldName, options, onChange }) {

    const [selectedOptions, setSelectedOptions] = useState();
    const handleChange = (e) => {
        const option = e.target.value;
        setSelectedOptions(option);
        onChange(option);
    };
    return (
        <label className=" border-2 p-2 rounded-md">
            <input type="checkbox" className="hidden peer" />
            {"select vehicles type"}
            <div className="w-[19%] absolute bg-white border transition-opacity opacity-0 pointer-events-none peer-checked:opacity-100 peer-checked:pointer-events-auto">
                <ul>
                    <ScrollArea className="h-auto rounded-md border p-4">
                        {options?.map((option, i) => {
                            return (
                                <li key={option.id}>
                                    <label className="flex whitespace-nowrap cursor-pointer px-2 py-1 transition-colors hover:bg-blue-100 [&:has(input:checked)]:bg-blue-200">
                                        <input
                                            type="radio"
                                            name={formFieldName}
                                            value={option.role}
                                            className="cursor-pointer"
                                            onChange={handleChange}
                                        />
                                        <span className="ml-1">{option.role}</span>
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