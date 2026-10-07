"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { Icon, type IconName } from "./icon";

type Choice<T extends string> = {
  value: T;
  description: string;
  icon: IconName;
};

export function PreferenceSelect<T extends string>({
  label,
  value,
  choices,
  disabled,
  onChange,
}: {
  label: string;
  value: T;
  choices: readonly Choice<T>[];
  disabled: boolean;
  onChange: (value: T) => void;
}) {
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [active, setActive] = useState(0);
  const selected = choices.findIndex((choice) => choice.value === value);
  const open = expanded && !disabled;

  useEffect(() => {
    if (!open) return;
    function dismiss(event: Event) {
      if (
        event.target instanceof Node &&
        !root.current?.contains(event.target)
      ) {
        setExpanded(false);
      }
    }
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("focusin", dismiss);
    return () => {
      document.removeEventListener("pointerdown", dismiss);
      document.removeEventListener("focusin", dismiss);
    };
  }, [open]);

  function choose(index: number) {
    setExpanded(false);
    if (choices[index].value !== value) onChange(choices[index].value);
    trigger.current?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "Escape") {
      if (open) event.preventDefault();
      setExpanded(false);
    } else if (event.key === "Tab") {
      setExpanded(false);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (open) choose(active);
      else {
        setActive(selected);
        setExpanded(true);
      }
    } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) {
        setActive(selected);
        setExpanded(true);
      } else {
        const direction = event.key === "ArrowDown" ? 1 : -1;
        setActive(
          (index) => (index + direction + choices.length) % choices.length,
        );
      }
    } else if (open && (event.key === "Home" || event.key === "End")) {
      event.preventDefault();
      setActive(event.key === "Home" ? 0 : choices.length - 1);
    } else if (
      event.key.length === 1 &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.altKey
    ) {
      const match = choices.findIndex((choice) =>
        choice.value.toLowerCase().startsWith(event.key.toLowerCase()),
      );
      if (match >= 0) {
        event.preventDefault();
        setActive(match);
        setExpanded(true);
      }
    }
  }

  return (
    <div className="preference-field" ref={root}>
      <label id={`${id}-label`} htmlFor={`${id}-trigger`}>
        {label}
      </label>
      <button
        id={`${id}-trigger`}
        ref={trigger}
        className={`preference-trigger ${open ? "is-open" : ""}`}
        type="button"
        role="combobox"
        aria-labelledby={`${id}-label`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-listbox`}
        aria-activedescendant={open ? `${id}-option-${active}` : undefined}
        disabled={disabled}
        onKeyDown={onKeyDown}
        onClick={() => {
          setActive(selected);
          setExpanded(!open);
        }}
      >
        <span className="preference-selected">
          <Icon name={choices[selected].icon} size={17} />
          <span>{value}</span>
        </span>
        <Icon name="chevron" size={15} />
      </button>
      {open && (
        <div
          id={`${id}-listbox`}
          className="preference-menu"
          role="listbox"
          aria-labelledby={`${id}-label`}
        >
          {choices.map((choice, index) => (
            <div
              key={choice.value}
              id={`${id}-option-${index}`}
              role="option"
              aria-selected={choice.value === value}
              className={`preference-choice ${active === index ? "is-active" : ""}`}
              onPointerMove={() => setActive(index)}
              onPointerDown={(event) => event.preventDefault()}
              onClick={() => choose(index)}
            >
              <Icon name={choice.icon} size={17} />
              <span className="preference-choice-text">
                <span>{choice.value}</span>
                <small>{choice.description}</small>
              </span>
              {choice.value === value && <Icon name="check" size={15} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
