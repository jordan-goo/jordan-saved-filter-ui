import React, { useRef, useState, useEffect, useImperativeHandle } from "react";

// generic type on Option.value lets us have type safety on the `onSelect` function param
interface Option<T> {
  key: string;
  label: string;
  value: T;
}

export interface AutocompleteInputProps<T> {
  options: Option<T>[];
  onSelect: (value: T) => void;
  defaultValue?: T;
  inputRef?: React.RefObject<HTMLInputElement>;
}

export const AutocompleteInput = <T extends unknown>({
  options,
  onSelect,
  defaultValue,
  inputRef,
}: AutocompleteInputProps<T>) => {
  const containerRef: React.RefObject<HTMLDivElement> = useRef(null);
  const innerInputRef: React.RefObject<HTMLInputElement> = useRef(null);
  const [active, setActive] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Option<T> | undefined>(
    options.find((option) => option.value === defaultValue)
  );
  const [availableOptions, setAvailableOptions] = useState<Option<T>[]>([]);
  const [searchInput, setSearchInput] = useState(selectedOption?.label || "");

  const setInputValue = (value: string) => {
    // when user clicks a dropdown option set search text to match
    setSearchInput(value);
    if (innerInputRef.current) innerInputRef.current.value = value;
  };

  const onChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setSearchInput(event.target.value);
  };

  useEffect(() => {
    // if user is typing and has not just selected an option then show options as active
    if (searchInput.length > 0 && selectedOption?.label !== searchInput) {
      setActive(true);
    }
    // if search text is empty then show all options
    if (searchInput.length === 0) {
      setAvailableOptions([...options]);
    } else {
      // otherwise filter by search text
      setAvailableOptions(
        options.filter((option) =>
          option.label.toLowerCase().includes(searchInput.toLowerCase())
        )
      );
    }
  }, [searchInput]);

  useEffect(() => {
    // If user clicks or focuses away from the autocomplete input / options we want to hide the options and reset the text
    const func = (event) => {
      if (!containerRef.current?.contains(event.relatedTarget)) {
        setActive(false);
        setInputValue(selectedOption ? selectedOption.label : "");
      }
    };
    containerRef.current?.addEventListener("focusout", func);
    return () => {
      containerRef.current?.removeEventListener("focusout", func);
    };
  }, [containerRef, selectedOption]);

  // ImperativeHandle lets parent component set focus on input element, while allowing this component to also control it when needed.
  useImperativeHandle(
    inputRef,
    () => {
      return {
        focus() {
          innerInputRef.current?.focus();
        },
      } as HTMLInputElement;
    },
    []
  );

  // curried function so we can easily call outside of click handler
  const onClick = (option) => () => {
    innerInputRef.current?.focus();
    setSelectedOption(option);
    onSelect(option.value);
    setActive(false);
    setInputValue(option.label);
  };

  const onKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    // gives autocomplete behaviour, if user is typing an hits ENTER key then we want to select first entry in the list
    if (event.key === "Enter" && availableOptions.length > 0) {
      onClick(availableOptions[0])();
    }
  };

  const onFocus = () => {
    // when user focuses on the input we want to pre select all text and show autocomplete options,
    // this makes for quick keyboard navigation and better experience
    if (searchInput.length > 0) {
      setActive(true);
      innerInputRef.current?.select();
    }
  };

  return (
    <div ref={containerRef} className="autocomplete">
      <input
        type="text"
        ref={innerInputRef}
        className="autocomplete-input"
        onChange={onChange}
        defaultValue={selectedOption?.label}
        onFocus={onFocus}
        onKeyDown={onKeyPress}
      />
      {active && (
        <ul className="options-container">
          {/* Limit options in drop down to 15 entries */}
          {availableOptions.slice(0, 15).map((option) => (
            <li key={option.key}>
              <button className="option" tabIndex={0} onClick={onClick(option)}>
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
