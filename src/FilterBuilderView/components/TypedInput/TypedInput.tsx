import React, { useEffect, useState, useRef, useImperativeHandle } from "react";
import { useDebouncedValue } from "../../hooks/useDebouncedValue.ts";
import { ColumnType } from "../../types.ts";

// the generics allow us to narrow the props on the sub input fields
type OnChangeProp<T> = (value: T) => void;

export interface TypedInputProps {
  type: ColumnType;
  onChange: OnChangeProp<Date | Number | string>;
  defaultValue?: Date | Number | string;
  inputRef?: React.RefObject<HTMLInputElement>;
}

export const TypedInput = ({
  type,
  onChange,
  defaultValue,
  inputRef,
}: TypedInputProps) => {
  switch (type) {
    case ColumnType.NUMBER: {
      return (
        <NumberInput
          inputRef={inputRef}
          onChange={onChange as OnChangeProp<Number>}
          defaultValue={defaultValue as Number}
        />
      );
    }
    case ColumnType.DATE: {
      return (
        <DateInput
          inputRef={inputRef}
          onChange={onChange as OnChangeProp<Date>}
          defaultValue={defaultValue as Date}
        />
      );
    }
    case ColumnType.STRING: {
      return (
        <StringInput
          inputRef={inputRef}
          onChange={onChange as OnChangeProp<string>}
          defaultValue={defaultValue as string}
        />
      );
    }
  }
};

interface StringInputProps {
  defaultValue?: string;
  onChange: (value: string) => void;
  inputRef?: React.RefObject<HTMLInputElement>;
}

const StringInput = ({
  defaultValue,
  onChange,
  inputRef,
}: StringInputProps) => {
  const [value, setValue] = useState(defaultValue);
  const debouncedValue = useDebouncedValue(value);

  useEffect(() => {
    debouncedValue && onChange(debouncedValue);
  }, [debouncedValue]);

  const onChangeHandler: React.ChangeEventHandler<HTMLInputElement> = (event) =>
    setValue(event.target.value);

  return (
    <input
      ref={inputRef}
      onChange={onChangeHandler}
      defaultValue={defaultValue || ""}
    />
  );
};

interface DateInputProps {
  defaultValue?: Date;
  onChange: (value: Date) => void;
  inputRef?: React.RefObject<HTMLInputElement>;
}

const isValidDate = (value: unknown): value is Date => {
  return (
    value !== undefined && value instanceof Date && !isNaN(value.getTime())
  );
};

const dateToString = (value: Date | undefined): string => {
  if (!isValidDate(value)) {
    return "";
  }
  return value?.toISOString().substring(0, 10) || "";
};

const DateInput = ({ defaultValue, onChange, inputRef }: DateInputProps) => {
  const [value, setValue] = useState(defaultValue);
  const debouncedValue = useDebouncedValue(value);
  const innerInputRef: React.RefObject<HTMLInputElement> = useRef(null);

  useEffect(() => {
    debouncedValue && onChange(debouncedValue);
  }, [debouncedValue]);

  const onChangeHandler: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    const newDate = new Date(event.target.value);
    if (isValidDate(newDate)) {
      setValue(newDate);
    }
  };

  useEffect(() => {
    // If user clicks or focuses away from the input reset the text
    const func = () => {
      if (innerInputRef.current) {
        innerInputRef.current.value = dateToString(value);
      }
    };
    innerInputRef.current?.addEventListener("focusout", func);
    return () => {
      innerInputRef.current?.removeEventListener("focusout", func);
    };
  }, [inputRef, value]);

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

  return (
    <input
      type="date"
      ref={innerInputRef}
      onChange={onChangeHandler}
      defaultValue={dateToString(defaultValue)}
    />
  );
};

interface NumberInputProps {
  defaultValue?: Number;
  onChange: (value: Number) => void;
  inputRef?: React.RefObject<HTMLInputElement>;
}

const NumberInput = ({
  defaultValue,
  onChange,
  inputRef,
}: NumberInputProps) => {
  const [value, setValue] = useState(defaultValue || 0);
  const debouncedValue = useDebouncedValue(value);

  useEffect(() => {
    onChange(debouncedValue);
  }, [debouncedValue]);

  const onChangeHandler: React.ChangeEventHandler<HTMLInputElement> = (event) =>
    setValue(Number(event.target.value));

  return (
    <input
      type="number"
      ref={inputRef}
      value={value?.toString() || ""} // we use a controlled input specifically here in order to inforce the number formatting and validation
      onChange={onChangeHandler}
    />
  );
};
