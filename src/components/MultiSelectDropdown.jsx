import { ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandGroup,
    CommandItem,
    CommandList
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

export default function MultiSelectDropdown({ open, setOpen, value, setValue, data, selectName, landfillName = false }) {

    const handleChange = (e) => {
        const isChecked = e.target.checked;
        const option = e.target.value;
        const selectedOptionSet = new Set(value);
        if (isChecked) {
            selectedOptionSet.add(option);
        } else {
            selectedOptionSet.delete(option);
        }
        const newSelectedOptions = Array.from(selectedOptionSet);
        setValue(newSelectedOptions)
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    size={"sm"}
                    role="combobox"
                    aria-expanded={open}
                    aria-label={selectName}
                    className="w-full h-auto p-2 justify-between dark:text-white">
                    <div className="flex flex-wrap gap-1 overflow-y-auto max-h-[60px]">
                        {value.length != 0 ?
                            value.map((item) => (
                                data.map((item1) => {
                                    return (item === item1.value) ? <span key={item1.value} className=" bg-blue-300 rounded-sm px-2 text-white">{item1.label}</span> : ""
                                })
                            ))
                            : selectName}
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50 hidden lg:block" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandList className='w-full max-h-[250px]'>
                        <CommandGroup>
                            {data.map((item) => (
                                <CommandItem key={item.value}>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id={item.value}
                                            value={item.value}
                                            checked={value.find((val) => item.value === val)}
                                            onChange={handleChange} />
                                        <label
                                            htmlFor={item.value}
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            {item.label}
                                        </label>
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
};